<template>
  <div class="order-history">
    <div class="history-item">
      <v-icon
        name="md-playlistaddcheck"
        scale="2"
      />
      <span>--</span>
      <strong>Order received</strong>
    </div>
    <div class="history-item">
      <v-icon
        name="md-payment"
        scale="2"
      />
      <span> -- </span>
      <strong>Payment accepted</strong>
    </div>
    <div class="history-item">
      <v-icon
        name="bi-cart-check"
        scale="2"
      />
      <span>--</span>
      <strong>Order accepted</strong>
    </div>
    <div class="history-item">
      <v-icon
        name="ri-loader-fill"
        scale="2"
      />
      <span>--</span>
      <strong>In progress</strong>
    </div>
    <div class="history-item">
      <v-icon
        name="ri-car-line"
        scale="2"
      />
      <span>--</span>
      <strong>Delivering</strong>
    </div>
    <div class="history-item">
      <v-icon
        name="io-checkmark-done-circle"
        scale="2"
      />
      <span>--</span>
      <strong>Delivered</strong>
    </div>
    <div class="order-timeline" />
  </div>
</template>

<script setup>
// TODO: dynamic
// TODO: current status
</script>

<style scoped>
.order-history{
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: #0ea5e9;
    position: relative;
    text-align: center;
    justify-items: center;
}

.history-item svg{
    margin-bottom: 20px;
    font-size: 2rem !important;
}

.history-item{
    display: flex;
    flex-direction: column;
    width: 100%;
}

.history-item:not(.history-item:first-of-type) svg{
    margin-left: auto;
    margin-right: auto;
}

.history-item:first-of-type{
    text-align: start;
}

.history-item:has(+ .order-timeline) svg{
    margin-left: auto !important;
    margin-right: 0 !important;
}

.history-item:has(+ .order-timeline){
    text-align: end;
}

.order-timeline{
    width: 100%;
    height: 10px;
    background-color: #0ea5e9;
    display: inline-block;
    position: absolute;
    top: 44px;
}

</style>