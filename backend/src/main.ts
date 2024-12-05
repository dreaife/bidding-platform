import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // 创建一个全局 logger 实例
  const logger = new Logger('App');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'], // 开启所有级别的日志
  });

  // 添加全局路由前缀
  app.setGlobalPrefix('api');

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
      'https://bidding-platform.server.digocean.dreaife.tokyo',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // 使用 LoggingInterceptor
  // app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
