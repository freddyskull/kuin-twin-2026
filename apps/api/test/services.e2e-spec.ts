import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ServicesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Cerramos la app para liberar la BD y las conexiones a Redis
    await app.close();
  });

  describe('GET /services', () => {
    it('debe devolver una lista paginada de servicios (items y total)', async () => {
      const response = await request(app.getHttpServer())
        .get('/services')
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.items)).toBeTruthy();
    });

    it('debe responder correctamente al buscar servicios cercanos (puede devolver vacío si no hay datos)', async () => {
      const response = await request(app.getHttpServer())
        .get('/services/nearby?lat=0&lng=0')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });
});
