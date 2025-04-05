<template>
  <div>
    <AppHeader />

    <div class="banner">
      <img src="/Homepage-Banner.jpg" alt="Banner" class="banner-image">
      <div class="banner-content">
        <h1>Welcome to <br>Urban Oasis</h1>
        <p>Your Guide to Green Living in Kuala Lumpur</p>
        <button class="cta-button" @click="goToMap">Explore Your Oasis</button>
      </div>
    </div>

    <div class="declare-box">
      <div class="declare">
        <h2>Our Mission</h2>
        <p>Urban Oasis is dedicated to transforming Kuala Lumpur into a greener, more sustainable city by empowering
          young adults to make eco-conscious choices. We believe that small changes in our daily lives can create a
          significant impact on our environment and community.</p>
      </div>
    </div>

    <div class="weather-info-box">
      <div class="weather-info-card">
        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-temperature-high"/>
          </div>
          <div class="info-content">
            <h3>Temperature</h3>
            <p>32°C</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-tint"/>
          </div>
          <div class="info-content">
            <h3>Humidity</h3>
            <p>65%</p>
          </div>
        </div>
      </div>
    </div>

    <div class="green-space-box">
      <div class="green-space-card">
        <h1 class="green-space-card-title">Discover Green Spaces</h1>
        <div class="green-space-card-content">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1018381.4755760997!2d101.68653!3d3.139003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1709798400000!5m2!1sen!2s"
            width="100%" height="800" style="border:0; border-radius: 15px;" allowfullscreen="true" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade" />
          <button class="green-space-button" @click="goToMap">Open Full Maps</button>
        </div>
      </div>
    </div>

    <AppBottom />
  </div>
</template>

<script setup>
import AppHeader from '~/components/AppHeader.vue';
import AppBottom from '~/components/AppBottom.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToMap = () => {
  router.push('/Map');
};
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
  font-family: 'Poppins', sans-serif;
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
  font-family: 'Poppins', sans-serif;
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
  font-family: 'Poppins', sans-serif;
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
  padding-top: 30px;
  height: 300px;
}

.weather-info-card {
  margin: 0 auto;
  height: 75%;
  width: 90%;
  border-radius: 25px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  padding: 20px;
}

.info-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #D1EAFA;
  border-radius: 15px;
  min-width: 40%;
  height: 50%;
}

.info-icon {
  font-size: 28px;
  color: #059669;
}

.info-content h3 {
  margin: 0;
  font-size: 16px;
  color: #666;
  font-family: 'Poppins', sans-serif;
}

.info-content p {
  margin: 5px 0 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  font-family: 'Poppins', sans-serif;
}

.green-space-box {
  position: relative;
  padding-top: 20px;
  width: 100%;
  height: 550px;
}

.green-space-card-title {
  font-family: 'Poppins', sans-serif;
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
  font-family: 'Poppins', sans-serif;
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
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  z-index: 10;
}

.green-space-button:hover {
  background-color: #45a049;
}
</style>