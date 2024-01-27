import { NestFactory } from '@nestjs/core';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramService } from './telegram/telegram.service';
import { TEST_USER_ID } from './telegram/telegram.constants';
//import { WeatherModule } from '@weather/weather.module'; // Change this import

async function bootstrap() {
  const app = await NestFactory.create(TelegramModule);
  const telegramService = app.get(TelegramService);

  await app.listen(3000, () => {
    console.log('Application is listening on port 3000');
    telegramService.sendMessageToUser(TEST_USER_ID, 'Server started!');
  });
}
bootstrap();
