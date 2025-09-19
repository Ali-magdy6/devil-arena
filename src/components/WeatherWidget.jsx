import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

const WeatherWidget = ({ t, lang }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Cairo, Egypt if location access is denied
          setLocation({ lat: 30.0444, lon: 31.2357 });
        }
      );
    } else {
      // Default to Cairo, Egypt if geolocation is not supported
      setLocation({ lat: 30.0444, lon: 31.2357 });
    }
  }, []);

  // Fetch weather data
  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using OpenWeatherMap API (you'll need to get a free API key)
        const API_KEY = 'your_openweathermap_api_key'; // Replace with actual API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=${lang === 'ar' ? 'ar' : 'en'}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err.message);
        // Fallback weather data for demo
        setWeather({
          main: {
            temp: 25,
            feels_like: 27,
            humidity: 60,
            pressure: 1013
          },
          weather: [{
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }],
          wind: {
            speed: 3.5,
            deg: 180
          },
          name: 'Cairo',
          sys: {
            sunrise: Date.now() + 21600000, // 6 AM
            sunset: Date.now() + 64800000   // 6 PM
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, lang]);

  // Get weather icon
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  // Get weather recommendation
  const getWeatherRecommendation = (weatherData) => {
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].main.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('storm')) {
      return {
        icon: '🌧️',
        message: t.rainyWeather || 'الطقس ممطر - يفضل تأجيل المباراة',
        recommendation: t.rainyRecommendation || 'تأجيل الحجز أو استخدام الملعب المغطى'
      };
    }
    
    if (temp > 35) {
      return {
        icon: '🌡️',
        message: t.hotWeather || 'الطقس حار جداً - احرص على شرب الماء',
        recommendation: t.hotRecommendation || 'تجنب الأوقات الحارة واشرب الماء بكثرة'
      };
    }
    
    if (temp < 10) {
      return {
        icon: '🥶',
        message: t.coldWeather || 'الطقس بارد - ارتدي ملابس دافئة',
        recommendation: t.coldRecommendation || 'ارتدي ملابس دافئة ومارس الإحماء جيداً'
      };
    }
    
    if (condition.includes('clear') || condition.includes('sunny')) {
      return {
        icon: '☀️',
        message: t.perfectWeather || 'طقس مثالي للعب كرة القدم!',
        recommendation: t.perfectRecommendation || 'وقت مثالي للحجز والاستمتاع باللعبة'
      };
    }
    
    return {
      icon: '🌤️',
      message: t.goodWeather || 'طقس جيد للعب',
      recommendation: t.goodRecommendation || 'يمكنك الحجز بثقة'
    };
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get wind direction
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="loading-spinner"></div>
        <p>{t.loadingWeather || 'جاري تحميل بيانات الطقس...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget error">
        <div className="error-icon">⚠️</div>
        <p>{t.weatherError || 'خطأ في تحميل بيانات الطقس'}</p>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          {t.retry || 'إعادة المحاولة'}
        </button>
      </div>
    );
  }

  if (!weather) return null;

  const recommendation = getWeatherRecommendation(weather);

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <h3 className="weather-title">
          {t.weatherTitle || 'طقس اليوم'}
        </h3>
        <div className="location">
          📍 {weather.name}
        </div>
      </div>

      <div className="weather-main">
        <div className="current-weather">
          <div className="weather-icon">
            {getWeatherIcon(weather.weather[0].icon)}
          </div>
          <div className="weather-temp">
            <span className="temp-value">{Math.round(weather.main.temp)}°</span>
            <span className="temp-unit">C</span>
          </div>
          <div className="weather-description">
            {weather.weather[0].description}
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-icon">🌡️</span>
            <span className="detail-label">{t.feelsLike || 'يبدو'}</span>
            <span className="detail-value">{Math.round(weather.main.feels_like)}°C</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">💧</span>
            <span className="detail-label">{t.humidity || 'الرطوبة'}</span>
            <span className="detail-value">{weather.main.humidity}%</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">💨</span>
            <span className="detail-label">{t.wind || 'الرياح'}</span>
            <span className="detail-value">
              {weather.wind.speed} m/s {getWindDirection(weather.wind.deg)}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">📊</span>
            <span className="detail-label">{t.pressure || 'الضغط'}</span>
            <span className="detail-value">{weather.main.pressure} hPa</span>
          </div>
        </div>
      </div>

      <div className="weather-sun">
        <div className="sun-item">
          <span className="sun-icon">🌅</span>
          <span className="sun-label">{t.sunrise || 'الشروق'}</span>
          <span className="sun-time">{formatTime(weather.sys.sunrise)}</span>
        </div>
        <div className="sun-item">
          <span className="sun-icon">🌇</span>
          <span className="sun-label">{t.sunset || 'الغروب'}</span>
          <span className="sun-time">{formatTime(weather.sys.sunset)}</span>
        </div>
      </div>

      <div className="weather-recommendation">
        <div className="recommendation-header">
          <span className="recommendation-icon">{recommendation.icon}</span>
          <span className="recommendation-title">{t.recommendation || 'توصية الطقس'}</span>
        </div>
        <p className="recommendation-message">{recommendation.message}</p>
        <p className="recommendation-advice">{recommendation.recommendation}</p>
      </div>

      <div className="weather-footer">
        <div className="last-updated">
          {t.lastUpdated || 'آخر تحديث'}: {new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US')}
        </div>
        <button 
          className="refresh-btn"
          onClick={() => window.location.reload()}
          title={t.refresh || 'تحديث'}
        >
          🔄
        </button>
      </div>
    </div>
  );
};

export default WeatherWidget;
