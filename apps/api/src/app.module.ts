import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    UserModule,
    PortfolioModule,
    MediaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'apps/admin-panel/dist'),
      serveRoot: '/admin',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'apps/web-store/out'),
      exclude: ['/api/{*splat}'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
