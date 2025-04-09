<template>
  <div>
    <AppHeader />
    <div class="travel-planner-box">
      
      <div class="travel-planner">
        <div class="travel-planner-intro">
          <h1>Travel Smart, Live Green</h1>
          <p>Discover eco-friendly ways to explore Kuala Lumpur while reducing your carbon footprint.</p>
        </div>

        <div class="travel-planner-form-box">
          <div class="travel-planner-form-card">
            <div class="input-group">
              <div class="travel-planner-form-group">
                <input type="text" v-model="startingPoint" @blur="checkActive" @focus="isFocused = true" @input="onStartingPointInput" :class="{ 'current-location-text': isUsingCurrentLocation }" required/> 
                <label :class="{ active: isFocused || startingPoint.trim() !== '' }">Enter your starting point (A)</label>
                <p v-if="!startingPoint" class="error">Please enter your starting point</p>
              </div>
              
              <span class="arrow">➜</span>
              
              <div class="travel-planner-form-group">
                <input type="text" v-model="destinationPoint" @blur="checkDestActive" @focus="isDestFocused = true" required/> 
                <label :class="{ active: isDestFocused || destinationPoint.trim() !== '' }">Enter your destination (B)</label>
                <p v-if="!destinationPoint" class="error">Please enter your destination</p>
              </div>
              
              <div class="find-routes-button">
                <button @click="findRoutes">Find Routes</button>
              </div>
              
            </div>

            <div class="current-location" @click="useCurrentLocation">
              <img src="/public/Location-Pin.png" alt="Pin" class="pin-image">
              <span>Use my current location</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="map-section">
        <div id="map" ref="mapContainer"></div>
      </div>

      <div class="available-routes-box">
        <div class="available-routes-card">
          <h1>Available Routes</h1>
          <p>Carbon emission factors used for calculations are from 
            <a href="https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting" target="_blank">DEFRA</a>'s 2024 publication.
          </p>
          <div class="routes-container" v-if="showRoutes">
            <div v-for="route in availableRoutes" :key="route.id" class="route-card" :class="{ 'selected-route': selectedRouteId === route.id }">
              <div class="route-card-header">
                <div class="route-icon">
                  <img :src="route.icon" :alt="route.type" class="transport-icon">
                  <h3>{{ route.type }}</h3>   
                </div>
              </div>

              <div class="route-details">
                <div class="route-info">
                  <p>Time: <b>{{ route.duration }}</b></p>
                  <p>Distance: <b>{{ route.distanceKm }} km </b></p>
                  <p>CO<sub>2</sub> Emitted: <b class="co2-emitted">{{ route.co2Saved }} kg</b></p>
                </div>
                <button class="choose-route-btn" @click="selectRoute(route)">{{ selectedRouteId === route.id ? 'Selected' : 'Choose Route' }} </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  <AppBottom />

  </div>
</template>

<script setup>
  import AppHeader from '~/components/AppHeader.vue';
  import AppBottom from '~/components/AppBottom.vue';
  import { ref, onMounted } from 'vue';
  import { loadGoogleMapsApi } from '~/utils/loadGoogleMapsApi';

  const startingPoint = ref('');
  const destinationPoint = ref('');
  const startLatitude = ref('');  
  const startLongitude = ref('');
  const isFocused = ref(false);
  const isDestFocused = ref(false);
  const isUsingCurrentLocation = ref(false);
  const mapContainer = ref(null);
  const showRoutes = ref(false);
  const availableRoutes = ref([]);
  const selectedRouteRenderer = ref(null);
  const selectedRouteId = ref(null);
  let map = null;
  let markerA = null;
  let markerB = null;

  // function to select the route and draw it on the map
  async function selectRoute(route) {
    // exit function if the route or map is not found
    if (!route || !map || !route.directionsResult) {
      return;
    }

    const google = await loadGoogleMapsApi();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      polylineOptions: {
        strokeColor: '#0718b3',
        strokeOpacity: 0.9,
        strokeWeight: 10
      }
    });

    if (selectedRouteRenderer.value) {
      selectedRouteRenderer.value.setMap(null);
    }

    directionsRenderer.setDirections(route.directionsResult);

    selectedRouteRenderer.value = directionsRenderer;
    selectedRouteId.value = route.id;
  }

  // function to initialise the map
  onMounted(async () => {
    try {
      console.log('Initialise map');
      
      // clear existing markers 
      if (markerA) markerA.setMap(null);
      if (markerB) markerB.setMap(null);

      // load google maps api
      const google = await loadGoogleMapsApi();
      console.log('Google Maps API loaded');
      
      // initialise the map
      map = new google.maps.Map(mapContainer.value, {
        center: { lat: 3.1319, lng: 101.6841 }, // Kuala Lumpur
        zoom: 15 // street view
      });
      
      console.log('Map initialised successfully');
    } catch (error) {
      console.error('Error initialising map:', error);
    }
  });

  // function to geocode the locations entered by the user
  async function geocodeLocation(location) {
    const encodedLocation = encodeURIComponent(location);
    const apiKey = process.env.NUXT_GOOGLE_MAPS_API_KEY;
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].geometry.location; // { lat, lng }
    } else {
      throw new Error('Geocoding failed for location: ' + location);
    }
  }

  // function for what happens when the find routes button is clicked
  async function findRoutes() {
    showRoutes.value = false;
    availableRoutes.value = [];

    try {
      if (!map) {
        console.error('Map not initialized');
        return;
      }

      let startPosition;
      let endPosition;

      // get start position
      if (startingPoint.value === 'Your Location' && startLatitude.value && startLongitude.value) {
        startPosition = { lat: parseFloat(startLatitude.value), lng: parseFloat(startLongitude.value) };
      } else if (startingPoint.value) {
        startPosition = await geocodeLocation(startingPoint.value);
      }

      // get end position 
      if (destinationPoint.value) {
        endPosition = await geocodeLocation(destinationPoint.value);
      }

      console.log('Start position:', startPosition);
      console.log('End position:', endPosition);

      // map
      const google = await loadGoogleMapsApi();
      
      // clear existing markers
      if (markerA) markerA.setMap(null);
      if (markerB) markerB.setMap(null);
      
      // create markers
      markerA = new google.maps.Marker({
        position: startPosition,
        map: map,
        label: 'A',
        title: startingPoint.value,
      });

      markerB = new google.maps.Marker({
        position: endPosition,
        map: map,
        label: 'B',
        title: destinationPoint.value,
      });

      console.log('Map object:', map);

      // update the map view
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(startPosition);
      bounds.extend(endPosition);

      // show the map to have both markers and center the map in between both markers
      map.fitBounds(bounds);

      // information about the travel modes 
      const travelModes = [
        { type: 'Walking', option: google.maps.TravelMode.WALKING, co2Factor: 0, icon: '/Walking.png' }, // walking has negligible carbon emission
        { type: 'Cycling', option: google.maps.TravelMode.BICYCLING, co2Factor: 0, icon: '/Cycling.png' }, // cycling has negligible carbon emission
        { type: 'Public Transport', option: google.maps.TravelMode.TRANSIT, co2Factor: 0.0286, icon: '/Public-Transport.png' }, // the carbon emission for light rails and trams (similar to mrt and lrt) according to DEFRA 2024 
        { type: 'Driving', option: google.maps.TravelMode.DRIVING, co2Factor: 0.167, icon: '/Driving.png' }, // the carbon emission for a medium car using petrol according to DEFRA 2024 
      ]
      
      const routePromises = travelModes.map(mode => getRoute({
        origin: startPosition,
        destination: endPosition,
        travelMode: mode.option,
        type: mode.type,
        co2Factor: mode.co2Factor,
        icon: mode.icon,
        google
      }));

      const routes = await Promise.all(routePromises);
      availableRoutes.value = routes.filter(route => route !== null);

      if (availableRoutes.value.length > 0) {
        showRoutes.value = true;
      } else {
        alert('No routes found.');
      }
      
    } catch (error) {
      console.error('Error in findRoutes:', error);
      alert('Error finding routes. Please try again.');
    }
  }
  
  // function to get the routes for the two locations using the api
  function getRoute({ origin, destination, travelMode, type, co2Factor, icon, google }) {
    const directionsService = new google.maps.DirectionsService();

    return new Promise((resolve) => {
      directionsService.route({ origin, destination, travelMode }
      , (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const route = response.routes[0];
          const co2Saved = (route.legs[0].distance.value / 1000 * co2Factor).toFixed(2); // calculate the co2 saved using distance in km x co2 factor

          resolve({
            id: Math.random().toString(36).substring(2, 5),
            type,
            duration: route.legs[0].duration.text,
            distanceKm: route.legs[0].distance.value / 1000,
            co2Saved: `${co2Saved}`,
            icon: icon, 
            directionsResult: response
          });
        } else {
          console.warn(`No route available for ${type}`, status);
          resolve(null);
        }
      });
    });
  }
  
  // function to get the user's current location when the current location button is clicked
  function useCurrentLocation() {
    const isSupported = 'navigator' in window && 'geolocation' in navigator;

    if (isSupported) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          startLatitude.value = position.coords.latitude;
          startLongitude.value = position.coords.longitude;
          startingPoint.value = 'Your Location';
          isUsingCurrentLocation.value = true;
        },
        (error) => {
          console.error('Error getting location:', error);
          if (error.code === 1) { 
            alert('Location permission denied. Allow location permission to use your current location.');
          } else {
            alert('Unable to get your location. Please type your starting point manually.');
          }
          isUsingCurrentLocation.value = false;
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please type your starting point manually.');
    }
  }

  // function to check if the user is using the current location
  function onStartingPointInput() {
    // stop using current location if the user starts typing
    if (isUsingCurrentLocation.value) {
      isUsingCurrentLocation.value = false;
    }
  }

  // function to check if the user typed in the starting point text field
  function checkActive() {
    isFocused.value = false;
  }

  // function to check if the user typed in the destination text field
  function checkDestActive() {
    isDestFocused.value = false;
  }


</script>

<style scoped>
  .travel-planner {
    width: 100%;
    height: 100%;
    background-color: #f8f9fa;
    padding-bottom: 20px;
  }

  .travel-planner-intro {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Poppins', sans-serif;
    background-color: #f8f9fa;
  }
  
  .travel-planner-intro h1 {
    font-size: 3rem;
    font-weight: 900;
    color: #333;
    padding-bottom: 1rem;
  }

  .travel-planner-intro p {
    font-size: 1.1rem;
    color: #666;
    line-height: 1.6;
    font-weight: 400;
  }
  
  .travel-planner-form-box {
    margin: 0 auto;
    height: 75%;
    width: 45%;
    border-radius: 25px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    padding: 30px 30px 30px 30px;
    gap: 20px;
    margin-bottom: 20px;

  }

  .travel-planner-form-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .input-group {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
  }

  .travel-planner-form-group {
    position: relative;
    flex: 1;
    margin-bottom: 39px;
  }

  .travel-planner-form-group input {
    width: 100%;
    padding: 14px 12px 8px 10px;
    border-radius: 10px;
    font-size: 16px;
    border: 2px solid #ccc;
    box-sizing: border-box;
    min-height: 50px;
  }

  .travel-planner-form-group label {
    position: absolute;
    top: 14px;
    left: 10px;
    color: #999;
    transition: 0.2s ease all;
    pointer-events: none;
    font-family: 'Poppins', sans-serif;
  }

  .travel-planner-form-group input:focus + label, 
  label.active {
    top: 5px;
    left: 8px;
    color: #666;
    font-size: 10px;
    padding: 0 4px;
  }

  .error {
    color: red;
    font-size: 12px;
    position: absolute;
    left: 5px;
    top: 55px;
    font-family: 'Poppins', sans-serif;
  }
  
  .find-routes-button button {
    position: relative;
    margin-left: 20px;
    bottom: 20px;
    padding: 10px 20px;
    color: white;
    background-color: #10B981;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
  }

  .find-routes-button button:hover {
    background-color: #2d662f;
  }
  
  .arrow {
    margin: 0;
    font-size: 20px;
    color: #666;
    position: relative;
    bottom: 15px;
  }

  .current-location {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #10B981;
    cursor: pointer;
    font-size: 19px;
    margin-left: 10px;
    font-family: 'Poppins', sans-serif;
  }

  .current-location i {
    font-size: 16px;
    position: relative;
    bottom: 5px;
  }

  .current-location:hover {
    color: #2d662f;
  }

  .current-location-text {
    color: #0089fa;
    font-weight: 500;
  }

  .pin-image {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  .map-section {
    padding-top: 10px;
    width: 100%;
    height: 100%;
    background-color: #f8f9fa;
    padding-bottom: 10px;
  }

  #map {
    position: relative;
    width: 90%;
    height: 400px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    margin-bottom: 100px;
    padding-bottom: 20px;
  }

  .available-routes-box {
    width: 100%;
    height: 100%;
    background-color: #f8f9fa;
    padding-bottom: 50px;
  }

  .available-routes-card {
    text-align: center;
    margin: 0 auto;
    font-family: 'Poppins', sans-serif;
  }

  .available-routes-card h1 {
    color: #333;
    padding-bottom: 1rem;
  }

  .transport-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  .routes-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    padding: 20px;
  }

  .route-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    width: 280px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .route-details {
    text-align: left;
    margin-left: 20px;
  }

  .route-details h3 {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  .route-info {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .route-info p {
    margin: 5px 0;
  }

  .route-info h {
    color: #333;
    margin: 5px 0;
  }

  .co2-emitted {
    color: #10B981;
    margin: 5px 0;
  }

  .choose-route-btn {
    background-color: #10B981;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
  }

  .choose-route-btn:hover {
    background-color: #2d662f;
  }
  
  .selected-route {
    background-color: #d8faee;
  }

</style>