<template>
  <div class="header-box">
    <div class="header">
      <div class="header-left">
        
        <nuxt-link to="/" class="header-logo-link">
          <img src="/logo.png" alt="Logo" class="header-logo">
          <h1 class="header-title">My Urban Oasis</h1>
        </nuxt-link>
        
      </div>
      <div class="header-right">
        <nuxt-link to="/Map">Map</nuxt-link>
        <nuxt-link to="/Travel">Low-cargon Travel</nuxt-link>
        <nuxt-link to="/Activities">Activities</nuxt-link>
        <nuxt-link to="/Challenges">Challenges</nuxt-link>
        <nuxt-link to="/Insights">Insights</nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-box {
  height: 80px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 98%;
  margin: 0 auto;
  height: 100%;
}

.header-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-logo {
  height: 44px;
}

.header-title {
  color: #059669;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.header-right a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.header-right a:hover {
  color: #059669;
}
</style>