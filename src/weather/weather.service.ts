import { Injectable } from "@nestjs/common";
import axios from "axios";
import { OPENWEATHERMAP_API_KEY, OPENWEATHERMAP_API_URL } from "./weather.constants";

@Injectable()
export class WeatherService {
  async getWeather(city: string): Promise<string> {
    const apiUrl = `${OPENWEATHERMAP_API_URL}?q=${city}&appid=${OPENWEATHERMAP_API_KEY}`;

    try {
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        const weatherDescription = response.data.weather[0].description;
        return `Current weather in ${city}: ${weatherDescription}`;
      } else {
        console.error(`Error fetching weather. Status: ${response.status}`);
        return 'Unable to fetch weather information at the moment.';
      }
    } catch (error) {
      console.error('Error fetching weather:', error.message);
      return 'Unable to fetch weather information at the moment.';
    }
  }
}
