import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { MediaModule } from './media/media.module';
import { CategoryModule } from './category/category.module';
import { ServiceUnitModule } from './service-unit/service-unit.module';
import { ServiceModule } from './service/service.module';
import { SlotModule } from './slot/slot.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { SocketModule } from './socket/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: configService.get('REDIS_URL') || 'redis://localhost:6379',
          ttl: 600 * 1000, // 10 minutes default
        }),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    UserModule,
    PortfolioModule,
    MediaModule,
    CategoryModule,
    ServiceUnitModule,
    ServiceModule,
    SlotModule,
    BookingModule,
    PaymentModule,
    SocketModule,
    ChatModule,
    // Servir archivos estáticos
    ServeStaticModule.forRoot(
      // 1. API uploads - prioridad alta
      {
        rootPath: join(process.cwd(), 'apps/api/uploads'),
        serveRoot: '/uploads',
        serveStaticOptions: {
          index: false,
        },
      },
      // 2. Admin Panel - prioridad media
      {
        rootPath: join(process.cwd(), 'apps/admin-panel/dist'),
        serveRoot: '/admin',
        serveStaticOptions: {
          index: ['index.html'],
        },
      },
      // 3. Web Store - prioridad baja (fallback)
      {
        rootPath: join(process.cwd(), 'apps/web-store/out'),
        exclude: ['/api/*path', '/admin/*path', '/uploads/*path'],
        serveStaticOptions: {
          index: ['index.html'],
          extensions: ['html'],
        },
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
