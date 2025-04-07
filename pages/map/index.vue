<template>
  <div>
    <!-- App Header -->
    <AppHeader />

    <!-- Search -->
    <div class="search-box">
      <select 
        v-model="selectedGreenSpace" 
        class="search-select"
        @change="handleSelectChange"
      >
        <option value="">All Green Spaces</option>
        <option 
          v-for="(space, index) in greenSpaceData" 
          :key="index" 
          :value="space"
        >
          {{ space.name }}
        </option>
      </select>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for green spaces..."
        @input="handleSearchInput"
      />
      <button @click="performSearch">Search</button>
      <div class="search-suggestions">
        <div
          v-for="(suggestion, index) in searchSuggestions"
          :key="index"
          class="suggestion-item"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion.name }}
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="filter-action-box">
      <button
        v-for="activity in activities"
        :key="activity.id"
        class="filter-button"
        :class="{ active: activityType === activity.id }"
        @click="filterByActivity(activity.id)"
      >
        {{ activity.name }}
      </button>
    </div>

    <!-- Map -->
    <div  v-if="apiKey" class="map-box">
      <div class="map-card">
        <ScriptGoogleMaps
          ref="maps"
          :center="center"
          :markers="markers"
          :api-key="apiKey"
          class="group"
          above-the-fold
          style="height: 500px; width: 100%"
          @ready="handleReady"
        />
      </div>
    </div>

    <!-- Location Detail -->
    <div v-if="selectedLocation" class="location-detail-box">
      <div class="location-header">
        <h2 class="location-title">{{ selectedLocation.name }}</h2>
      </div>

      <div class="location-images">
        <div class="image-container">
          <img 
            v-for="(image, index) in selectedLocation.images" 
            :key="index" 
            :src="image" 
            class="location-image"
          />
        </div>
      </div>
      <div class="other-info">
        <div class="location-about">
          <h3 class="about-title">About</h3>
          <p class="about-text">{{ selectedLocation.about }}</p>
          <h3 class="about-title">Location</h3>
          <p class="about-text">{{ selectedLocation.location }}</p>
          <h3 class="about-title">Opening Hours</h3>
          <p class="about-text">{{ selectedLocation.opening_hours }}</p>
        </div>

        <div class="travel-options">
        <div class="activities-box">
          <h3 class="activites-title">Activites</h3>
          <div v-if="selectedLocation.activities.length > 0" class="location-activities" >
            <span
              v-for="(activity, index) in selectedLocation.activities"
              :key="index"
              class="activity-tag"
            >
              {{ activity }}
            </span>
          </div>
        </div>
        <div class="to-travel-link-box">
          <i class="fas fa-bicycle travel-icon" style="margin-right: 5px;"/>
          <a class="travel-link" @click="goToLowCarbonTravel">View Low-carbon Travel Options</a>
        </div>
        </div>
      </div>
    </div>

    <AppBottom />
  </div>
</template>

<script setup>
import AppHeader from "~/components/AppHeader.vue";
import AppBottom from "~/components/AppBottom.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFetch } from "nuxt/app";

const router = useRouter();
const apiKey = ref(useRuntimeConfig().public.googleMapsApiKey)

// Load green space data from the backend
const { data: greenSpaceData } = await useFetch("/api/greenspace");
const selectGreenSpace = ref(greenSpaceData.value);

// Center
const center = computed(() => {
  if (selectGreenSpace.value.length > 0) {
    const lat = selectGreenSpace.value[0].latitude;
    const lng = selectGreenSpace.value[0].longitude;
    return { lat, lng };
  } else {
    return { lat: 3.1490658, lng: 101.6910842 };
  }
})
// init markers
const markers = ref([]);

// Search
const searchQuery = ref("");
const searchSuggestions = ref([]);
const selectedGreenSpace = ref(null);
let searchTimeout = null;

const handleSelectChange = () => {
  if (selectedGreenSpace.value) {
    searchQuery.value = selectedGreenSpace.value.name;
    selectGreenSpace.value = [selectedGreenSpace.value];
    updateSelect();
  } else {
    searchQuery.value = "";
    selectGreenSpace.value = greenSpaceData.value;
    updateSelect();
  }
};

// Handle search input
const handleSearchInput = () => {
  clearTimeout(searchTimeout);
  if (searchQuery.value.length < 2) {
    searchSuggestions.value = [];
    return;
  }

  searchTimeout = setTimeout(() => {
    const query = searchQuery.value.toLowerCase();
    searchSuggestions.value = greenSpaceData.value
      .filter((gs) => {
        if (gs.name && gs.name.toLowerCase().includes(query)) {
          return true;
        }
        if (gs.address && gs.address.toLowerCase().includes(query)) {
          return true;
        }
        return false;
      })
      .slice(0, 5);
  }, 300);
};

// Handle search button click
const performSearch = () => {
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    selectGreenSpace.value = greenSpaceData.value.filter(
      (gs) =>
      {
        if (gs.name && gs.name.toLowerCase().includes(query)) {
          return true;
        }
        if (gs.address && gs.address.toLowerCase().includes(query)) {
          return true;
        }
        return false;
      }
    );
    updateSelect();
  } else {
    selectGreenSpace.value = greenSpaceData.value;
    updateSelect();
  }
  searchSuggestions.value = [];
};

// Handle suggestion selection
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.name;
  searchSuggestions.value = [];
  selectGreenSpace.value = [suggestion];
  markOnMap();
};

// Location Detail
const selectedLocation = ref({
  id: 1,
  name: "Taman Rimba Kiara",
  images: ["/MapDefault1.jpeg", "/MapDefault2.jpeg", "/MapDefault3.jpeg"],
  about:
    "Photography, picnics & walks are popular in this serene jungle park, home to 40+ bird species.",
  activities: ["walking", "biking", "hiking", 'running'],
  pos: { lat: 3.127616, lng: 101.63831 },
  placeId: "ChIJ198R_0FJzDER7cvc1BcRMxo",
});


const activitiesTypes =  ["walking", "biking", "hiking", "climbing", "running"];
const updateSelect = async () => {
  if (selectGreenSpace.value.length > 0) {
    selectedLocation.value.name = selectGreenSpace.value[0].name;
    selectedLocation.value.about = selectGreenSpace.value[0].about;
    selectedLocation.value.opening_hours = selectGreenSpace.value[0].opening_hours;
    selectedLocation.value.location = selectGreenSpace.value[0].address;

    // Get activities
    selectedLocation.value.activities = [];
    for (let i in activitiesTypes){
      let key = activitiesTypes[i];
      if (selectGreenSpace.value[0][key] == 1) {
        selectedLocation.value.activities.push(key);
      }
    }
  
    // Get pos
    selectedLocation.value.pos = {
      lat: selectGreenSpace.value[0].latitude,
      lng: selectGreenSpace.value[0].longitude,
    };

    // Get photo
    const { data: photos } = await useFetch(`/api/placephoto/${selectGreenSpace.value[0].place_id}`);
    selectedLocation.value.images  = photos
  }
  markOnMap();
};

updateSelect();

// Handle to low carbon travel
const goToLowCarbonTravel = () => {
router.push({
  path: '/travel',
  query: {
    greenspace: JSON.stringify(selectGreenSpace.value[0])
  }
});
};

// 0 for all
let activityType = ref(0);
const activities = ref([
  { id: 1, name: "Walking", field: "walking"},
  { id: 2, name: "Biking", field: "biking"},
  { id: 3, name: "Hiking", field: "hiking"},
  { id: 4, name: "Climbing", field: "climbing"},
  { id: 5, name: "Running", field: "running"},
]);
// Filter by Activity
const filterByActivity = (activityId) => {
  if (activityType.value === activityId) {
    activityType.value = 0;
    selectGreenSpace.value = Array.isArray(greenSpaceData)
      ? greenSpaceData
      : [];
  } else {
    activityType.value = activityId;
    const activityField = activities.value.find((a) => a.id === activityId).field;
    selectGreenSpace.value = greenSpaceData.value.filter(
      (gs) => gs[activityField] == 1
    );
  }
  updateSelect();
};

// Mark on Map
const markOnMap = () => {
  markers.value = [];
  selectGreenSpace.value.forEach((gs) => {
    markers.value.push(`${gs.latitude},${gs.longitude}`);
  });
};
</script>

<style scoped>
.search-box {
  max-width: 98%;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-select {
  width: 200px;
  padding: 12px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px 0 0 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  background-color: white;
}

.search-box input {
  width: 100%;
  max-width: 300px;
  padding: 12px 15px;
  border: 1px solid #e5e7eb;
  border-left: none;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-box input:focus {
  border-color: #059669;
  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2);
}

.search-box button {
  background-color: #059669;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 0 8px 8px 0;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-box button:hover {
  background-color: #047857;
}

.search-suggestions {
  position: absolute;
  width: 500px;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 280px;
  margin-right: 120px;
}

.suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f3f4f6;
}

.filter-action-box {
  max-width: 98%;
  margin: 15px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.filter-button {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-button:hover {
  background-color: #e5e7eb;
}

.filter-button.active {
  background-color: #059669;
  color: white;
  border-color: #059669;
}

.map-card {
  margin: 0 auto;
  max-width: 98%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Location Detail Box Styles */
.location-detail-box {
  max-width: 98%;
  margin: 20px auto;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
}

.location-header {
  margin-bottom: 15px;
}

.location-title {
  font-size: 24px;
  color: #1f2937;
  margin: 0;
}

.location-images {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.image-container {
  display: flex;
  gap: 30px;
}

.location-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  object-fit: cover;
  transition: opacity 0.3s;
}

.image-nav {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  z-index: 2;
  transition: background-color 0.3s;
}

.image-nav:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.image-nav.prev {
  left: 10px;
}

.image-nav.next {
  right: 10px;
}

.image-indicators {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s;
}

.indicator.active {
  background-color: white;
}

.other-info {
  display: flex;
  gap: 20px;
}
.location-about {
  flex: 1;
  margin-right: 20px;
  width: 40%;
}
.travel-options {
  width: 45%;
}

.location-about {
  flex: 1;
  margin-right: 20px;
  width: 40%;
}

.about-title {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 10px 0;
}

.about-text {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

.location-activities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.activity-tag {
  background-color: #D5FAE5;
  color: #059669;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.travel-options {
  width: 45%;
}

.travel-link {
  color: #059669;
}

.travel-icon {
  font-size: 15px;
  color: #059669;
}

.to-travel-link-box {
  margin-top:30px;
}
</style>
