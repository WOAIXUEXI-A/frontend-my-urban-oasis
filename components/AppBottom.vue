<template>
  <div class="bottom-box">
    <div class="info-container">
      <div class="info-section">
        <h3>Urban Oasis</h3>
        <p class="info-text">Making Kuala Lumpur greener,</p>
        <p class="info-text">one step at a time.</p>
      </div>
      <div class="contact-section">
        <h3>Contact</h3>
        <p class="info-text">hello@urbanoasis.my</p>
        <p class="info-text">+60 3 1234 5678</p>
      </div>
    </div>
    <div class="copyright">
      © 2025 Urban Oasis. All rights reserved.
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.bottom-box {
  height: 230px;
  background-color: #111827;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.info-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
}

.info-section, .contact-section {
  text-align: left; 
  margin: 0 20px;
}

.info-section {
  margin-left: 200px;
}


.info-text {
  color: #666;
}

.copyright {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  width: 100%;
}
</style>
