import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import {
  createAccountSchema,
  updateAccountSchema,
  transferFundsSchema,
} from '../validators/account.validator.js';
import { AccountService } from '../services/account.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAccounts = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const accounts = await AccountService.getAccounts(userId);
    res.status(200).json({
      success: true,
      data: accounts,
    });
  } catch (err) {
    next(err);
  }
};

export const getAccountById = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    const account = await AccountService.getAccountById(userId, id);
    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

export const createAccount = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const validated = createAccountSchema.parse(req.body);
    const account = await AccountService.createAccount(userId, validated);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAccount = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    const validated = updateAccountSchema.parse(req.body);
    const account = await AccountService.updateAccount(userId, id, validated);

    res.status(200).json({
      success: true,
      message: 'Account updated successfully',
      data: account,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const id = String(req.params.id);
    await AccountService.deleteAccount(userId, id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const transferFunds = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const validated = transferFundsSchema.parse(req.body);
    const result = await AccountService.transferFunds(userId, validated);

    res.status(200).json({
      success: true,
      message: 'Funds transferred successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
