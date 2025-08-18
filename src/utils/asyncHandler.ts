import { Request, Response, NextFunction } from 'express';

export interface AsyncHandlerFunction {
    (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export interface MiddlewareFunction {
    (req: Request, res: Response, next: NextFunction): void;
}

export function asyncHandler(fn: AsyncHandlerFunction): MiddlewareFunction {
    return function (req: Request, res: Response, next: NextFunction): void {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}