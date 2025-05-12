<template>
    <LandingComponent>
      <HeaderComponent />
      <div v-if="urlPayment">
        <h3 class="text-center mb-4">Pembayaran</h3>
        <iframe
          :src="urlPayment"
          width="100%"
          height="600"
          style="border: none"
        ></iframe>
        <p class="text-center mt-4">
          Status Pembayaran: <strong>{{ status || 'Memeriksa...' }}</strong>
        </p>
      </div>
      <div v-else>
        <h3 class="text-center mb-4">Pembayaran</h3>
        <!-- Konten lain di sini -->
      </div>
    </LandingComponent>
  </template>
  
  <script setup lang="ts">
  import HeaderComponent from '../components/header-component.vue';
  import LandingComponent from '../components/landing-component.vue';
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const urlPayment = ref<string | null>(null);
  const status = ref<string>('');
  const tokenId = localStorage.getItem('tokenId');
  const appointmentId = localStorage.getItem('appointmentId');

  let intervalId: ReturnType<typeof setInterval> | undefined;
  
  onMounted(() => {
    const storedUrl = localStorage.getItem('urlPayment');
    if (storedUrl) {
      urlPayment.value = storedUrl;
    }
  
    if (!tokenId) {
      console.warn('Token ID tidak ditemukan.');
      return;
    }
  
    const checkStatus = async () => {
  try {
    const response = await fetch('https://sandbox.doku.com/checkout/v1/payment/'+tokenId+'/check-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token_id: tokenId }),
    });

    const result = await response.json();
    console.log('Status pembayaran:', result);
    status.value = result.status;

    if (result.status === 'SUCCESS') {
      clearInterval(intervalId);
      await fetch('https://bidu.my.id/api/payment_update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: appointmentId,
          status: 'paid',
        }),
      });
    }

    if (result.status === 'FAILED') {
      clearInterval(intervalId);
      alert('Pembayaran GAGAL');
    }

  } catch (error) {
    console.error('Gagal memeriksa status pembayaran:', error);
  }
};

  
    checkStatus(); // jalankan sekali langsung
    intervalId = setInterval(checkStatus, 2000); // polling tiap 5 detik
  });
  
  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
  </script>
  