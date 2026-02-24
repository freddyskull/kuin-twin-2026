import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.error('[JWT Guard] Error de autenticación:', info?.message || 'Usuario no encontrado');
      throw err || new UnauthorizedException('No autorizado: ' + (info?.message || 'Token inválido'));
    }
    return user;
  }
}
