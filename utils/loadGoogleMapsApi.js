// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBbzovkS8i4FHP8f9sy8tlMptGFrcK9-3U';

// Function to load Google Maps API
export const loadGoogleMapsApi = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve(window.google);
    };

    script.onerror = (error) => {
      reject(error);
    };

    document.head.appendChild(script);
  });
}; 