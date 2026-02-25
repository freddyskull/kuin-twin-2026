import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
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
import { CompaniesModule } from './companies/companies.module';
import { BranchesModule } from './branches/branches.module';
import { ReviewModule } from './review/review.module';
import { FavoriteModule } from './favorite/favorite.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        try {
          const store = await redisStore({
            url: configService.get('REDIS_URL') || 'redis://localhost:6379',
            ttl: 600 * 1000, 
            socket: {
              reconnectStrategy: (retries) => {
                const delay = Math.min(retries * 500, 5000);
                console.warn(`[Redis] 🔄 Reintentando conexión... Intento: ${retries} (esperando ${delay}ms)`);
                return delay;
              },
            },
          });

          // Capturar errores del cliente para evitar que la app crashee en caliente
          // @ts-ignore
          store.client.on('error', (err) => {
            console.error('[Redis] ❌ Error en el cliente:', err.message);
          });

          return { store };
        } catch (error) {
          console.error('[Redis] 💥 Falló la conexión inicial. Usando almacenamiento en memoria como respaldo.');
          return { store: 'memory' };
        }
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
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
    CompaniesModule,
    BranchesModule,
    ReviewModule,
    FavoriteModule,

    // Servir archivos estáticos
    ServeStaticModule.forRoot(
      {
        rootPath: join(process.cwd(), 'uploads'),
        serveRoot: '/uploads',
        serveStaticOptions: {
          index: false,
        },
      },
      {
        rootPath: join(process.cwd(), 'apps/admin-panel/dist'),
        serveRoot: '/admin',
        serveStaticOptions: {
          index: ['index.html'],
        },
      },
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
