// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.NUXT_GOOGLE_MAPS_API_KEY
    }
  },

  css: ['@fortawesome/fontawesome-free/css/all.min.css'],
  
  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/eslint',
  ]
})