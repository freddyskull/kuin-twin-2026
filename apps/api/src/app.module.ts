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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'apps/admin-panel/dist'),
      serveRoot: '/admin',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'apps/web-store/out'),
      exclude: ['/api/{*splat}'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
