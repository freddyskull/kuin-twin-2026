import { Module, Global } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Global() // Lo hacemos global para que otros módulos lo usen fácilmente
@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
