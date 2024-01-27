// src/telegram/telegram.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { TELEGRAM_TOKEN, TEST_USER_ID } from './telegram.constants';
import { WeatherService } from '../weather/weather.service';

const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService {
  private readonly bot: any;
  private logger = new Logger(TelegramService.name);
  private userCityMap: { [key: string]: string } = {}; // Map to store user-selected cities

  constructor(private readonly weatherService: WeatherService) {
    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

    this.bot.on('message', this.onReceiveMessage);

    // Delay the message sending to ensure the chat is available
    setTimeout(() => {
      this.sendMessageToUser(TEST_USER_ID, `Server started at ${new Date()}`);
    }, 2000); // Adjust the delay as needed
  }

  onReceiveMessage = (msg: any) => {
    this.logger.debug(msg);

    // Check if the user sent the command to subscribe
    if (msg.text.toLowerCase() === '/subscribe') {
      this.subscribeUser(msg.chat.id.toString());
    }

    // Check if the user sent the command to set the city
    const setCityMatch = msg.text.match(/^\/setcity (.+)$/);
    if (setCityMatch) {
      const newCity = setCityMatch[1];
      this.setUserCity(msg.chat.id, newCity);
      this.sendMessageToUser(msg.chat.id, `Your preferred city is set to ${newCity}`);
      this.sendWeatherUpdate(msg.chat.id.toString());
    }
  };

  sendMessageToUser = async (userId: string, message: string) => {
    try {
      const chat = await this.bot.getChat(userId);
      this.bot.sendMessage(chat.id, message);
    } catch (error) {
      this.logger.error(`Error sending message to user ${userId}: ${error.message}`);
    }
  };

  private subscribeUser = (userId: string) => {
    // Implement logic to subscribe the user (e.g., store in a database)
    this.sendMessageToUser(userId, 'You are now subscribed to daily weather updates!');
    this.sendWeatherUpdate(userId);
  };

  private setUserCity(userId: number, city: string) {
    // Store the user's preferred city in the map
    this.userCityMap[userId.toString()] = city;
  }

  private getUserCity(userId: number): string | undefined {
    // Retrieve the user's preferred city from the map
    return this.userCityMap[userId.toString()];
  }

  private async sendWeatherUpdate(userId: string) {
    // Get the user's preferred city
    const userCity = this.getUserCity(Number(userId));

    if (userCity) {
      // Get weather update for the user's preferred city
      const weatherUpdate = await this.weatherService.getWeather(userCity);

      // Send weather update to the user
      this.sendMessageToUser(userId.toString(), weatherUpdate);
    } else {
      // Notify the user to set the city first
      this.sendMessageToUser(userId.toString(), 'Please set your preferred city using /setcity command');
    }
  }
}
