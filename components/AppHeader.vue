<template>
  <div class="header-box">
    <div class="header">
      <div class="header-left">

        <div class="header-logo-box">
          <nuxt-link to="/" class="header-logo-link">
            <img src="/logo.png" alt="Logo" class="header-logo-img">
            <h1 class="header-logo-title">My Urban Oasis</h1>
          </nuxt-link>
        </div>

      </div>
      <div class="header-right">
        <nuxt-link to="/map">Map</nuxt-link>
        <nuxt-link to="/travel">Low-cargon Travel</nuxt-link>
        <nuxt-link to="/activities">Activities</nuxt-link>
        <nuxt-link to="/challenges">Challenges</nuxt-link>
        <nuxt-link to="/insights">Insights</nuxt-link>
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
  overflow: hidden;
}

.header-logo-link {
  display: flex;
  text-decoration: none;
}

.header-left {
  display: flex;
}

.header-logo-box {
  height: 44px;
}

.header-logo-img {
  height: 44px;
}

.header-logo-title {
  color: #059669;
  font-size: 18px;
  font-weight: bold;
  line-height: 60px;
  vertical-align: bottom;
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