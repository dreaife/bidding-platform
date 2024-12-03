import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // 配置 Swagger
    const config = new DocumentBuilder()
        .setTitle('Bidding Platform API') // 网站标题
        .setDescription('API documentation for the Bidding Platform') // 描述
        .setVersion(process.env.npm_package_version ?? '1.0') // 版本号
        .addBearerAuth() // 添加 Bearer Token 支持（可选）
        .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document); // 将 Swagger 页面挂载到 /swagger 路径


  app.enableCors({
    origin: [
      'https://dreaife.github.io/',
      'http://localhost:4200',
      'https://bidding-platform.server.digocean.dreaife.tokyo'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
