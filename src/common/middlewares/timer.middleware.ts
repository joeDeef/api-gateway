import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[LOG] Petición entrante: ${req.method} ${req.url}`);
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[LOG] ${req.method} ${req.url} terminó en ${duration}ms`);
    });

    next();
  }
}