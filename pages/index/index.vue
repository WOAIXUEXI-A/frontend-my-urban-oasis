<template>
  <div>
    <!-- AppHeader -->
    <AppHeader />

    <!-- Banner -->
    <div class="banner">
      <img src="/Homepage-Banner.jpg" alt="Banner" class="banner-image">
      <div class="banner-content">
        <h1>Welcome to <br>Urban Oasis</h1>
        <p>Your Guide to Green Living in Kuala Lumpur</p>
        <button class="cta-button" @click="goToMap">Explore Your Oasis</button>
      </div>
    </div>

    <!-- Declare -->
    <div class="declare-box">
      <div class="declare">
        <h2>Our Mission</h2>
        <p>Urban Oasis is dedicated to transforming Kuala Lumpur into a greener, more sustainable city by empowering
          young adults to make eco-conscious choices. We believe that small changes in our daily lives can create a
          significant impact on our environment and community.</p>
      </div>
    </div>

    <!-- Weather Info -->
    <div class="weather-info-box">
      <div class="weather-cards-container">
        <div class="weather-info-card">
          <div class="city-date-section">
            <h2 class="city-name">{{ weatherData.cityName }}</h2>
            <p class="date-time">{{ weatherData.dateTime }}</p>
          </div>
          <div class="weather-details-section">
            <div class="weather-icon">
              <i :class="weatherData.weatherIcon" />
            </div>
            <div class="weather-info">
              <h3 class="temperature">{{ weatherData.temperature }}°C</h3>
              <p class="weather-description">{{ weatherData.weatherDescription }}</p>
            </div>
          </div>
        </div>
        
        <div class="eco-tips-card">
          <div class="eco-tips-content">
            <div class="eco-tips-text">
              <h3>Perfect for Today</h3>
              <p>Visit KLCC Park for morning yoga or Lake Gardens for evening walks!</p>
              <a class="see-more-link"  @click="ToMoreSuggesstion" >See More Suggesstion →</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Green Space Map-->
    <div class="green-space-box">
      <div class="green-space-card">
        <h1 class="green-space-card-title">Discover Green Spaces</h1>
        <div class="green-space-card-content">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.793667637107!2d101.69108427550924!3d3.149065853152048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49cd98881539%3A0x340bf906bc763359!2sIndependence%20Square!5e0!3m2!1sen!2sus!4v1743866743847!5m2!1sen!2sus"
            width="100%" height="450" style="border:0; border-radius: 15px;" allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade" />
          <button class="green-space-button" @click="goToMap">Open Full Maps</button>
        </div>
      </div>
    </div>

    <!-- Weekly Challenge -->
    <div class="weekly-challenge-box">
      <div class="weekly-challenge-title-box">
        <h1 class="weekly-challenge-title">Weekly Challenge</h1>
      </div>
      <div class="weekly-challenge-card">
        <div class="weekly-challenge-card-content">
          <div class="challenge-left">
            <p class="challenge-description">
            Complete at least one green action every day for 5 consecutive days to build your sustainable habit!
            </p>
            <li>Visit a green space</li>
            <li>Choose a low-carbon travel mode (bike, walk, public transport)</li>
            <li>Reduce plastic usage</li>
            <li>Participate in a recommended activity from Urban Oasis</li>
            <button class="join-challenge-button" @click="goToChallenge">Join Challenge</button>
          </div>
          <div class="challenge-right">
            <div class="challenge-card">
              <div class="challenge-card-content">
                <div class="challenge-info">
                  <h1 class="challenge-title">5 Green Days Challenge</h1>
                  <p class="challenge-subtitle">Complete 5 days of green actions and earn the Urban Explorer Badge.</p>
                  <div class="leaf-icons">
                  <div v-for="i in leafNum" :key="i">
                    <i class="fas fa-leaf"/>
                  </div>
                  </div>
                </div>
                <div class="progress-ring-container">
                  <div class="progress-ring">
                    <div class="progress-circle" style="--progress: 60%;" />
                    <div class="progress-text">60%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Popular Green Spaces -->
    <div class="papular-green-spaces-box">
      <div class="papular-green-spaces-title-box">
        <h1 class="papular-green-spaces-title">Popular Green Spaces</h1>
      </div>
      <div class="papular-green-spaces-card">
        <div class="popular-spaces-container">
          <div v-for="space in greenSpaces.slice(0, 3)" :key="space.id" class="space-card">
            <div class="space-card-image">
              <img :src="space.image" :alt="space.name">
            </div>
            <div class="space-card-content">
              <h3>{{ space.name }}</h3>
              <p>{{ space.description }}</p>
              <div class="space-rating">
                <i class="fas fa-star" style="color: #059669;"/>
                <span>{{ space.rating }} ({{ space.reviews }} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AppBottom -->
    <AppBottom />
  </div>
</template>

<script setup>
import AppHeader from '~/components/AppHeader.vue';
import AppBottom from '~/components/AppBottom.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const goToMap = () => {
  router.push('/map');
};

const goToChallenge = () => {
  router.push('/challenges');
};

const ToMoreSuggesstion = () => {
  router.push('/more-suggesstion');
};

const { data: weatherDataFromAPI} = await useFetch("/api/weather");

function formatWeatherData(weatherData) {
  const weatherTypeMap = {
    
    'CLEAR': {
      icon: 'fas fa-sun',
      description: 'Sunny and clear skies'
    },
    'NO_CLOUDS': {
      icon: 'fas fa-sun',
      description: 'No clouds'
    },
    'MOSTLY_CLEAR': {
      icon: 'fas fa-sun',
      description: 'Mostly clear'
    },
    'PERIODIC_CLOUDS': {
      icon: 'fas fa-cloud-sun',
      description: 'Periodic clouds'
    },
    'PARTLY_CLOUDY': {
      icon: 'fas fa-cloud-sun',
      description: 'Partly cloudy (some clouds)'
    },
    'MOSTLY_CLOUDY': {
      icon: 'fas fa-cloud',
      description: 'Mostly cloudy (more clouds than sun)'
    },
    'CLOUDY': {
      icon: 'fas fa-cloud',
      description: 'Cloudy (all clouds, no sun)'
    },
    'WINDY': {
      icon: 'fas fa-wind',
      description: 'High wind'
    },
    'WIND_AND_RAIN': {
      icon: 'fas fa-wind',
      description: 'High wind with precipitation'
    },
    'LIGHT_RAIN_SHOWERS': {
      icon: 'fas fa-cloud-rain',
      description: 'Light intermittent rain'
    },
    'CHANCE_OF_SHOWERS': {
      icon: 'fas fa-cloud-rain',
      description: 'Chance of intermittent rain'
    },
    'SCATTERED_SHOWERS': {
      icon: 'fas fa-cloud-rain',
      description: 'Intermittent rain'
    },
    'RAIN_SHOWERS': {
      icon: 'fas fa-cloud-showers-heavy',
      description: 'Showers are considered to be rainfall that has a shorter duration than rain, and is characterized by suddenness in terms of start and stop times, and rapid changes in intensity'
    },
    'HEAVY_RAIN_SHOWERS': {
      icon: 'fas fa-cloud-showers-heavy',
      description: 'Intense showers'
    },
    'LIGHT_TO_MODERATE_RAIN': {
      icon: 'fas fa-cloud-rain',
      description: 'Rain (light to moderate in quantity)'
    },
    'MODERATE_TO_HEAVY_RAIN': {
      icon: 'fas fa-cloud-rain',
      description: 'Rain (moderate to heavy in quantity)'
    },
    'RAIN': {
      icon: 'fas fa-cloud-rain',
      description: 'Moderate rain'
    },
    'LIGHT_RAIN': {
      icon: 'fas fa-cloud-rain',
      description: 'Light rain'
    },
    'HEAVY_RAIN': {
      icon: 'fas fa-cloud-showers-heavy',
      description: 'Heavy rain'
    },
    'RAIN_PERIODICALLY_HEAVY': {
      icon: 'fas fa-cloud-showers-heavy',
      description: 'Rain periodically heavy'
    },
    'LIGHT_SNOW_SHOWERS': {
      icon: 'fas fa-snowflake',
      description: 'Light snow that is falling at varying intensities for brief periods of time'
    },
    'CHANCE_OF_SNOW_SHOWERS': {
      icon: 'fas fa-snowflake',
      description: 'Chance of snow showers'
    },
    'SCATTERED_SNOW_SHOWERS': {
      icon: 'fas fa-snowflake',
      description: 'Snow that is falling at varying intensities for brief periods of time'
    },
    'SNOW_SHOWERS': {
      icon: 'fas fa-snowflake',
      description: 'Snow showers'
    },
    'HEAVY_SNOW_SHOWERS': {
      icon: 'fas fa-snowflake',
      description: 'Heavy snow showers'
    },
    'LIGHT_TO_MODERATE_SNOW': {
      icon: 'fas fa-snowflake',
      description: 'Light to moderate snow'
    },
    'MODERATE_TO_HEAVY_SNOW': {
      icon: 'fas fa-snowflake',
      description: 'Moderate to heavy snow'
    },
    'SNOW': {
      icon: 'fas fa-snowflake',
      description: 'Moderate snow'
    },
    'LIGHT_SNOW': {
      icon: 'fas fa-snowflake',
      description: 'Light snow'
    },
    'HEAVY_SNOW': {
      icon: 'fas fa-snowflake',
      description: 'Heavy snow'
    },
    'SNOWSTORM': {
      icon: 'fas fa-snowflake',
      description: 'Snow with possible thunder and lightning'
    },
    'SNOW_PERIODICALLY_HEAVY': {
      icon: 'fas fa-snowflake',
      description: 'Snow, at times heavy'
    },
    'HEAVY_SNOW_STORM': {
      icon: 'fas fa-snowflake',
      description: 'Heavy snow with possible thunder and lightning'
    },
    'BLOWING_SNOW': {
      icon: 'fas fa-snowflake',
      description: 'Snow with intense wind'
    },
    'RAIN_AND_SNOW': {
      icon: 'fas fa-cloud-meatball',
      description: 'Rain and snow mix'
    },
    'HAIL': {
      icon: 'fas fa-cloud-meatball',
      description: 'Hail'
    },
    'HAIL_SHOWERS': {
      icon: 'fas fa-cloud-meatball',
      description: 'Hail that is falling at varying intensities for brief periods of time'
    },
    'THUNDERSTORM': {
      icon: 'fas fa-bolt',
      description: 'Thunderstorm'
    },
    'THUNDERSHOWER': {
      icon: 'fas fa-bolt',
      description: 'A shower of rain accompanied by thunder and lightning'
    },
    'LIGHT_THUNDERSTORM_RAIN': {
      icon: 'fas fa-bolt',
      description: 'Light thunderstorm rain'
    },
    'SCATTERED_THUNDERSTORMS': {
      icon: 'fas fa-bolt',
      description: 'Thunderstorms that has rain in various intensities for brief periods of time'
    },
    'HEAVY_THUNDERSTORM': {
      icon: 'fas fa-bolt',
      description: 'Heavy thunderstorm'
    },
    'FOG': {
      icon: 'fas fa-smog',
      description: 'Foggy'
    },
    'HAZE': {
      icon: 'fas fa-smog',
      description: 'Hazy'
    }
  };

  // Convert Unit
  const tempF = weatherData.weather_info.temperature.degrees;
  const tempC = ((tempF - 32) * 5 / 9).toFixed(1);

  const weatherType = weatherData.weather_info.weatherCondition.type;
  const weatherInfo = weatherTypeMap[weatherType] || {
    icon: 'fas fa-question',
    description: weatherData.weather_info.weatherCondition.description.text
  };

  return {
    weatherIcon: weatherInfo.icon,
    temperature: tempC,
    weatherDescription: weatherInfo.description,
  };
}


const weatherData = ref({
  cityName: 'Kuala Lumpur',
  dateTime: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  weatherIcon: 'fas fa-sun',
  temperature: 32,
  weatherDescription: 'Sunny and clear skies'
});

if (weatherDataFromAPI.value) {
  weatherData.value = {
    ...weatherData.value,
    ...formatWeatherData(weatherDataFromAPI.value)
  }
}

const leafNum = ref(5);

const greenSpaces = ref([
  {
    id: 1,
    name: 'KLCC Park',
    image: '/KLCC.jpg',
    description: 'A 50-acre urban park surrounding the iconic Petronas Twin Towers, featuring jogging tracks, walking paths, and a beautiful lake.',
    rating: 4.8,
    reviews: 256
  },
  {
    id: 2,
    name: 'Perdana Botanical Garden',
    image: '/Perdana.jpg',
    description: 'Kuala Lumpur\'s first large-scale recreational park with various gardens, including a hibiscus garden and an orchid garden.',
    rating: 4.6,
    reviews: 189
  },
  {
    id: 3,
    name: 'Desa Park City',
    image: '/Desa.jpg',
    description: 'Pet-friendly park with a variety of plants and trees, including a bamboo garden and a tropical garden.',
    rating: 4.7,
    reviews: 210
  }
]);


</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
}

.banner {
  position: relative;
  width: 100%;
  height: 550px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  text-align: left;
  color: white;
  z-index: 1;
  width: 50%;
  max-width: 600px;
}

.banner-content h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 1500;
  line-height: 1.2;
}

.banner-content p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 400;
}

.cta-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background-color: white;
  color: #4CAF50;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.cta-button:hover {
  background-color: #4CAF50;
  color: white;
}

.declare-box {
  width: 100%;
  background-color: #f8f9fa;
}

.declare {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.declare h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.declare p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  font-weight: 400;
}

.weather-info-box {
  margin-top: 30px;
  margin-bottom: 20px;
  height: 150px;
}

.weather-cards-container {
  display: flex;
  justify-content: space-between;
  width: 90%;
  height: 100%;
  margin: 0 auto;
  gap: 40px;
  border-radius: 15px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
}

.weather-info-card {
  flex: 1;
  display: flex;
  align-items: center;
  background: #D1EAFA;
  border-radius: 15px;
  padding: 20px;
  margin: 0 auto;
}

.eco-tips-card {
  flex: 1;
  align-items: center;
  display: flex;
  background: #E6F4EA;
  border-radius: 15px;
  padding: 20px;
}

.eco-tips-header {
  display: flex;
  flex-direction: column;
}

.eco-tips-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
}

.eco-tips-subtitle {
  font-size: 1rem;
  color: #666;
}

.eco-tips-content {
  display: flex;
  height: 100%;
  align-items: flex-start;
  border-radius: 15px;
  flex-grow: 1;
}

.eco-tips-text {
  display: flex;
  flex-direction: column;
}

.eco-tips-text p {
  margin: 15 0 10px 0;
  font-size: 15px;
  color: #333;
}

.city-date-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.city-name {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.date-time {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.weather-details-section {
  display: flex;
  align-items: center;
  border-radius: 15px;
  padding: 15px 25px;
}

.weather-icon {
  font-size: 40px;
  color: #F59E0B;
  margin-right: 15px;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.temperature {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.weather-description {
  margin: 5px 0 0;
  font-size: 16px;
  color: #666;
}

.see-more-link {
  padding-top: 20px;
  color: #059669;
}

.green-space-box {
  position: relative;
  width: 100%;
  height: 500px;
}

.green-space-card-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 1400;
}

.green-space-card {
  margin: 0 auto;
  width: 90%;
}

.green-space-card h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.green-space-card-content {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.green-space-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #2D966A;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  z-index: 10;
}

.weekly-challenge-box {
  margin-top: 30px;
  margin-bottom: 50px;
  height: 280px;
}

.weekly-challenge-title-box {
  margin: 0 auto;
  width: 90%;
  background-color: #059669;
  border-radius: 15px 15px 0 0;
}

.weekly-challenge-card {
  margin: 0 auto;
  width: 90%;
  background-color: #059669;
  color: white;
  height: 100%;
  border-radius: 0 0 15px 15px;
}

.weekly-challenge-title {
  color: #fff;
  padding: 20px;
}

.weekly-challenge-card-content {
  display: flex;
  justify-content: space-between;
  padding: 0 20px 20px;
  height: calc(100% - 60px);
}

.challenge-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 20px;
}

.challenge-description {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.join-challenge-button {
  margin-top: 20px;
  align-self: flex-start;
  padding: 10px 20px;
  background-color: white;
  color: #059669;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.join-challenge-button:hover {
  background-color: #e6e6e6;
}

.challenge-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.challenge-card {
  background-color: white;
  border-radius: 15px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
}

.challenge-card-content {
  display: flex;
  padding: 15px;
  width: 100%;
}

.challenge-info {
  flex: 1;
  padding-right: 15px;
}

.challenge-title {
  color: #059669;
  font-size: 1.4rem;
  margin-bottom: 5px;
}

.challenge-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.leaf-icons {
  display: flex;
  gap: 5px;
}

.leaf-icons i {
  color: #059669;
  font-size: 25px; /* 增加图标大小 */
}

.progress-ring-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.progress-ring-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.progress-ring {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#059669 var(--progress), #e6e6e6 0);
}

.progress-circle::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 10%;
  right: 10%;
  bottom: 10%;
  background: white;
  border-radius: 50%;
}

.progress-text {
  position: relative;

  font-weight: 600;
  font-size: 1.2rem;
  color: #059669;
}

.papular-green-spaces-box {
  margin-top: 120px;
  height: 400px;
}

.papular-green-spaces-title-box {
  margin: 0 auto;
  width: 90%;
  margin-bottom: 10px;
}

.papular-green-spaces-card {
  margin: 0 auto;
  width: 90%;
  height: 100%;
  border-radius: 15px;
}

.popular-spaces-container {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  height: calc(100% - 80px);
}

.space-card {
  flex: 1;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.space-card-image {
  height: 65%;
  overflow: hidden;
}

.space-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.space-card-content {
  padding: 15px;
  height: 50%;
  display: flex;
  flex-direction: column;
}

.space-card-content h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.space-card-content p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10px;
}

.space-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #666;
  margin-top: auto;
}

.space-rating i {
  font-size: 1rem;
}

.space-rating span {
  line-height: 1.4;
}
</style>