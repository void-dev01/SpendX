import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AccountService } from '../services/account.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAccounts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const accounts = await AccountService.getAccounts(userId);
    res.json({ success: true, data: accounts });
  } catch (err) {
    next(err);
  }
};

export const getAccountById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const account = await AccountService.getAccountById(userId, req.params.id as string);
    res.json({ success: true, data: account });
  } catch (err) {
    next(err);
  }
};

export const createAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const account = await AccountService.createAccount(userId, req.body);
    res.status(201).json({ success: true, data: account, message: 'Account created successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const account = await AccountService.updateAccount(userId, req.params.id as string, req.body);
    res.json({ success: true, data: account, message: 'Account updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const result = await AccountService.deleteAccount(userId, req.params.id as string);
    res.json({ success: true, data: result, message: 'Account archived successfully' });
  } catch (err) {
    next(err);
  }
};

export const transferFunds = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const result = await AccountService.transferFunds(userId, req.body);
    res.json({ success: true, data: result, message: 'Transfer executed successfully' });
  } catch (err) {
    next(err);
  }
};
