import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import { StorageService } from '../services/storage.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const uploadUrlSchema = z.object({
  fileName: z.string().min(1, { message: 'File name is required' }).max(255),
  mimeType: z.string().min(1, { message: 'MIME type is required' }),
  fileSizeBytes: z.number().positive().optional(),
});

const downloadUrlSchema = z.object({
  filePath: z.string().min(1, { message: 'File path is required' }),
});

const registerDocSchema = z.object({
  fileName: z.string().min(1),
  filePath: z.string().min(1),
  fileType: z.string().min(1),
  fileSizeBytes: z.number().positive(),
});

export const getUploadUrl = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const { fileName, mimeType, fileSizeBytes } = uploadUrlSchema.parse(req.body);
    const result = await StorageService.generateUploadUrl(userId, fileName, mimeType, fileSizeBytes);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getDownloadUrl = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const { filePath } = downloadUrlSchema.parse(req.body);
    const result = await StorageService.generateDownloadUrl(userId, filePath);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const registerUploadedDocument = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const { fileName, filePath, fileType, fileSizeBytes } = registerDocSchema.parse(req.body);
    const document = await StorageService.registerDocument(
      userId,
      fileName,
      filePath,
      fileType,
      fileSizeBytes
    );

    res.status(201).json({
      success: true,
      message: 'Document registered successfully',
      data: document,
    });
  } catch (err) {
    next(err);
  }
};

export const listDocuments = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const documents = await StorageService.listUserDocuments(userId);

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (err) {
    next(err);
  }
};
