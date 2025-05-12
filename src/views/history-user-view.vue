<template>
  <LandingComponent>
    <HeaderComponent />
    <div class="container transaction-history">
      <h3 class="text-center mb-4">Riwayat Transaksi</h3>

      <!-- Tampilkan list transaksi jika ada -->
      <div v-if="transactionStore.transactions.length > 0" class="transaction-list">
  <div
    v-for="transaction in transactionStore.transactions"
    :key="transaction.id"
    class="transaction-card"
  >
          <h5>{{ transaction.psychologistName }}</h5>
          <p><strong>Status:</strong> <span :class="statusClass(transaction.status)">{{ transaction.status }}</span></p>
          <p><strong>Janji Konsultasi:</strong> {{ formatDateTime(transaction.date, transaction.time) }}</p>
          <div class="transaction-footer">
            <p><strong>Total:</strong> Rp300.000</p>
          </div>
        </div>
      </div>
      <p v-else class="text-center">Belum ada riwayat transaksi.</p>
    </div>
  </LandingComponent>
</template>

<script setup lang="ts">
import HeaderComponent from '../components/header-component.vue';
import LandingComponent from '../components/landing-component.vue';
import { useTransactionStore } from '../stores/transaction-store';
import { useAuthentication } from '../stores/authetication-store';
import { ref, onMounted } from 'vue';

const transactionStore = useTransactionStore();
const authStore = useAuthentication();

const handleid = async () => {
  try {
    if (authStore.email) {
      await transactionStore.fetchTransactions();
    }
  } catch (error) {
    console.error('Gagal mengambil transaksi:', error);
  }
};

onMounted(() => {
  handleid();
});

// Format tanggal dan waktu
function formatDateTime(date: string, time: string): string {
  return `${new Date(date).toLocaleDateString('id-ID')} | ${time}`;
}

// Jadwalkan ulang
function reschedule(id: string) {
  console.log(`Jadwalkan ulang transaksi dengan ID: ${id}`);
}

// CSS class untuk status
function statusClass(status: string) {
  return {
    paid: 'text-success',
    pending: 'text-warning'
  }[status] || 'text-muted';
}
</script>

<style scoped>
.transaction-history {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.transaction-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .transaction-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .transaction-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.transaction-card {
  padding: 24px;
  background-color: #f9fbff;
  border-radius: 16px;
  border: 1px solid #007bff;
  box-shadow: 0 6px 12px rgba(0, 123, 255, 0.1);
  transition: transform 0.2s ease;
}

.transaction-card:hover {
  transform: translateY(-5px);
}

.transaction-card h5 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
}

.transaction-card p {
  margin: 6px 0;
  font-size: 16px;
  color: #333;
}

.transaction-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  border-radius: 5px;
}

/* Status Styling */
.text-success {
  color: #28a745;
  font-weight: 600;
}

.text-warning {
  color: #ffc107;
  font-weight: 600;
}

.text-muted {
  color: #6c757d;
  font-weight: 600;
}

.transaction-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-card h5 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
}

.text-success {
  background-color: #e6f4ea;
  color: #28a745;
}

.text-warning {
  background-color: #fff3cd;
  color: #ffc107;
}

.text-muted {
  background-color: #e2e3e5;
  color: #6c757d;
}


</style>
