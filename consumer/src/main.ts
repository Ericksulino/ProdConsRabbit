import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import RabbitmqServer from './rabbitmq-server';
import fetch from 'node-fetch';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log("aqui!S");
  const server = new RabbitmqServer('amqp://admin:admin@rabbitmq:5672');
  await server.start();
  await server.consume('list',async (message) =>
  {
    const buffer: Buffer = message.content;
    const bufferString: string = buffer.toString('utf-8');
    const objetoJson = JSON.parse(bufferString);
    const cep: string = objetoJson.cep;
    console.log(cep)
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.log('Erro na requisição:', response.status);
      }
    } catch (error) {
      console.log('Erro na requisição:', error);
    }
  });
}
bootstrap();
