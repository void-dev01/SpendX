import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { ApiResponse } from '../types/index.js';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    logger.warn({ path: req.path, issues: err.issues }, 'Validation error');
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
    });
    return;
  }

  if (err instanceof AppError) {
    logger.warn({ path: req.path, statusCode: err.statusCode, message: err.message }, 'Application operational error');
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  logger.error({ err, path: req.path }, 'Unhandled server error');

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
