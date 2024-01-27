import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { WeatherModule } from '@weather/weather.module';
@Module({
  providers: [TelegramService],
  imports:[WeatherModule],
  exports:[TelegramService],
})
export class TelegramModule {}
