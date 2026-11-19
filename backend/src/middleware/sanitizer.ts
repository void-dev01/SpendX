import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

// Dangerous HTML/JS patterns for XSS
const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const JS_PROTOCOL_REGEX = /javascript\s*:/gi;
const DANGEROUS_ATTRIBUTES_REGEX = /\s*(on\w+)\s*=\s*["'][^"']*["']/gi;
const DANGEROUS_TAGS_REGEX = /<(iframe|embed|object|applet)\b[^>]*>(?:.*?<\/\1>)?/gi;

// SQL injection heuristics
const SQL_INJECTION_REGEX = /(\b(SELECT|UNION|INSERT|DELETE|UPDATE|DROP|ALTER|CREATE|TRUNCATE)\b\s+.*\b(FROM|INTO|TABLE|DATABASE|WHERE)\b)|(\bOR\b\s+["']?1["']?\s*=\s*["']?1)|(--\s*$)|(\/\*.*\*\/)/i;

/**
 * Clean a string value by removing XSS payloads and null bytes
 */
export const sanitizeString = (value: string): string => {
  return value
    .replace(/\0/g, '') // Strip null bytes
    .replace(SCRIPT_REGEX, '')
    .replace(JS_PROTOCOL_REGEX, '')
    .replace(DANGEROUS_ATTRIBUTES_REGEX, '')
    .replace(DANGEROUS_TAGS_REGEX, '')
    .trim();
};

/**
 * Recursively sanitize an object or array, stripping NoSQL $-operators and XSS strings
 */
export const sanitizeData = (data: unknown): unknown => {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return sanitizeString(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  if (typeof data === 'object') {
    const sanitizedObj: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      // Defense against NoSQL operator injection: reject or strip keys starting with '$'
      if (key.startsWith('$')) {
        logger.warn({ key }, 'Blocked potential NoSQL injection operator key');
        continue;
      }
      sanitizedObj[key] = sanitizeData(value);
    }

    return sanitizedObj;
  }

  return data;
};

/**
 * Enterprise XSS and Injection Sanitization Middleware
 */
export const inputSanitizer = (req: Request, res: Response, next: NextFunction): void => {
  // Check URL query parameters for SQL injection attempts
  if (req.query) {
    for (const [key, val] of Object.entries(req.query)) {
      if (typeof val === 'string' && SQL_INJECTION_REGEX.test(val)) {
        logger.warn({ key, val, ip: req.ip }, 'Blocked malicious SQL injection signature in query');
        res.status(400).json({
          success: false,
          message: 'Invalid request: Malicious input pattern detected',
        });
        return;
      }
    }
  }

  // Sanitize body, query, and params
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeData(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeData(req.query) as Request['query'];
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeData(req.params) as Request['params'];
  }

  next();
};
