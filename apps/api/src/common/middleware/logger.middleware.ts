import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    console.log(`[Request] ${req.method} ${req.url}`);
    console.log(`[Auth Header] ${authHeader ? 'Presente' : 'AUSENTE'}`);
    if (authHeader) {
      console.log(`[Token] ${authHeader.substring(0, 20)}...`);
    }
    next();
  }
}
