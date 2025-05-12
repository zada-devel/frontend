<template>
  <LandingComponent>
    <HeaderComponent />
    <div class="container my-4">
      <h3 class="text-center mb-4">Detail Psikolog</h3>

      <div v-if="!psikolog" class="text-danger text-center">Data tidak ditemukan!</div>

      <div v-else class="row g-4">
        <div class="col-md-4">
          <div class="card">
            <img 
              :src="psikolog.imgSrc || 'https://via.placeholder.com/400'" 
              class="card-img-top" 
              alt="Foto Psikolog"
            />
            <div class="card-body">
              <h5 class="card-title mb-1">{{ psikolog.name }}</h5>
            </div>
          </div>
        </div>

        <!-- Bagian Kanan: Detail Psikolog dan Form Pemesanan -->
        <div class="col-md-8">
          <div class="card p-4">

         
   <!-- Informasi Psikolog -->
    <div v-if="!sessionBooked">
   <h5 class="mb-3 text-start">Tentang {{ psikolog.name }}</h5>
            <p class="text-start"><strong>Pendidikan</strong></p>
            <p class="text-start"><strong>Nomor Izin Praktek</strong></p>
            </div>
            <!-- Pilih Sesi -->
            <h6 class="text-start" v-if="!sessionBooked">Pilih Berdasarkan Sesi</h6>
            <form v-if="!sessionBooked" @submit.prevent="bookSession">
              <div class="mb-1 text-start">
                <label for="session-type" class="form-label text-start">Tipe Sesi</label>
                <select id="session-type" class="form-select" v-model="selectedSession.type">
                  <!-- <option value="Online">Online</option> -->
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <!-- <div class="mb-2 text-start">
                <label for="session-date" class="form-label text-start">Tanggal</label>
                <input 
                  type="date" 
                  id="session-date" 
                  class="form-control" 
                  v-model="selectedSession.date"
                />
              </div> -->
              <div class="mb-2 text-start">
                <label for="session-date" class="form-label text-start">Tanggal</label>
                <select id="session-date" class="form-select" v-model="selectedSession.date">
                  <option v-for="date in availableDates" :key="date" :value="date">
                    {{ date }}
                  </option>
                </select>
              </div>

              <div class="mb-2 text-start">
                <label for="session-time" class="form-label text-start">Waktu</label>
                <select id="session-time" class="form-select" v-model="selectedSession.time">
                  <option v-for="time in availableTimes" :key="time" :value="time">
                    {{ time }}
                  </option>
                </select>
              </div>


              <button type="submit" class="btn btn-primary w-100">Pilih Sesi</button>
            </form>

            <!-- Bagian Biru untuk Informasi Konsultasi -->
            <div v-if="sessionBooked" class="card mb-3">
              <div class="card-body bg-light-blue text-start">
                <h5 class="card-title mb-3">Konsultasi Online</h5>
                <div class="row">
                  <div class="col-8">
                    <p class="mb-1">
                      <strong>Janji Konsultasi:</strong><br />
                      {{ selectedSession.date || 'Tanggal belum dipilih' }} | {{ selectedSession.time || 'Waktu belum dipilih' }}
                    </p>
                  </div>
                  <div class="col-4 text-end">
                    <p class="mb-1">
                      <strong>Total: 300.000</strong><br />
                      {{ new Date().toLocaleDateString('id-ID') }} | {{ new Date().toLocaleTimeString('id-ID') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="sessionBooked">
              <form @submit.prevent="uploadProof">
                <button type="submit" class="btn btn-primary w-100">Bayar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LandingComponent>
</template>

<script lang="ts">
import { computed, ref, reactive, onMounted } from 'vue';
import { usePsikologStore } from '../stores/psikolog-store';
import LandingComponent from '../components/landing-component.vue';
import HeaderComponent from '../components/header-component.vue';
import { useAuthentication } from '../stores/authetication-store';
// import { useAppointmentStore } from '../stores/appoinment-store';
import { useRouter } from 'vue-router';

const router = useRouter();


export default {
  name: 'PsikologDetailView',
  components: {
    LandingComponent,
    HeaderComponent,
  },
  setup() {
    const psikologStore = usePsikologStore();
    const psikolog = computed(() => psikologStore.selectedPsikolog); // Mengambil data psikolog dari Pinia store

    const selectedSession = reactive({
      type: 'Online',
      date: '',
      time: '',
    });

    

    const availableDates = computed(() => {
      const psikolog = psikologStore.selectedPsikolog;
      const selectedType = selectedSession.type;

      if (!psikolog) return [];

      let dateSet = new Set<string>();

      if (selectedType === "Online") {
        psikolog.availableSlots.forEach((slot) => {
          slot.online?.forEach((o) => dateSet.add(o.date));
        });
      } else if (selectedType === "Offline") {
        psikolog.availableSlots.forEach((slot) => {
          slot.offline?.forEach((o) => dateSet.add(o.date));
        });
      }

      return Array.from(dateSet).sort();
    });

    const generateTimeRange = (start: string, end: string, interval: number = 60) => {
      const timeList: string[] = [];
      let [startHour, startMinute] = start.split(":").map(Number);
      let [endHour, endMinute] = end.split(":").map(Number);

      while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
        timeList.push(`${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`);
        startMinute += interval;
        if (startMinute >= 60) {
          startMinute = 0;
          startHour += 1;
        }
      }

      return timeList;
    };

    const availableTimes = computed(() => {
      const psikolog = psikologStore.selectedPsikolog;
      const selectedType = selectedSession.type;
      

      if (!psikolog) return [];

      let timeSet = new Set<string>(); // Menggunakan Set untuk menghindari duplikat

        if (selectedType === 'Online') {
          psikolog.availableSlots.forEach(slot => {
            if (slot.online) {
              slot.online.forEach(o => {
                generateTimeRange(o.times[0], o.times[1]).forEach(time => timeSet.add(time));
              });
            }
          });
        } else if (selectedType === 'Offline') {
          psikolog.availableSlots.forEach(slot => {
            if (slot.offline) {
              slot.offline.forEach(o => {
                generateTimeRange(o.times[0], o.times[1]).forEach(time => timeSet.add(time));
              });
            }
          });
        }

        return Array.from(timeSet).sort(); // Kembalikan dalam bentuk array yang sudah diurutkan
      });

    // const availableTimes = ['09.00 WIB', '10.00 WIB', '11.00 WIB', '13.00 WIB'];
    const sessionBooked = ref(false);
    const paymentMethod = ref('Transfer');

    const form = reactive({
      accountNumber: '1222211212',
      date: '',
      psychologistId: '',
      time: '',
      transactionType: 'Transfer',
      userId: ''
      });
 
     
    onMounted(() => {
      if (psikolog?.value?.id !== undefined) {
        psikologStore.fetchPsikologsID(psikolog?.value?.id)
      }
    });

  const bookSession = async () => {
  form.date = selectedSession.date;
  form.time = selectedSession.time;
  form.psychologistId = psikolog.value?.id ? String(psikolog.value.id) : '';

  console.log("isi formnya nih", form);

  if (!selectedSession.date || !selectedSession.time) {
    alert('Harap pilih tanggal dan waktu sesi.');
    return;
  }

  // Ambil user dari localStorage
  const userId = localStorage.getItem('usr_id');

  // Payload untuk request
  const payload = {
    accountNumber: "1234567890", // Hardcoded atau nanti bisa dynamic
    date: form.date,
    psychologistId: form.psychologistId,
    time: form.time,
    transactionType: "transfer",
    userId: userId || null,
  };

  try {
    const response = await fetch('https://bidu.my.id/api/book_appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Response booking:', result);

    if (response.ok && result.appointment?.id) {
      localStorage.setItem('appointmentId', result.appointment.id);

      sessionBooked.value = true;
    } else {
      alert('Gagal memesan sesi. Silakan coba lagi.');
    }
  } catch (error) {
    console.error('Error saat booking:', error);
    alert('Terjadi kesalahan saat memesan sesi.');
  }
};



const uploadProof = async () => {
  try {
    // Ambil user info dari localStorage
    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('usr_id');
    // const name = localStorage.getItem('usr_name');
    const appointmentId = localStorage.getItem('appointmentId');

    // Validasi data
    if (!email || !userId || !appointmentId) {
      alert('Data user atau appointment tidak lengkap.');
      return;
    }

    // Siapkan payload checkout
    const payload = {
      customer: {
        email: email,
        id: `CUST-${userId}`,
        name: name
      },
      order: {
        amount: 100000, // Nominal bisa dibuat dinamis jika perlu
        invoice_number: `INV-${appointmentId}`
      },
      payment: {
        payment_due_date: 60
      }
    };

    const response = await fetch('https://bidu.my.id/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Checkout response:', result);

    // Cek jika berhasil dan ada URL
    const paymentUrl = result?.data?.response?.payment?.url;
    const tokenId = result?.data?.response?.payment?.token_id;

    if (response.ok && paymentUrl) {
      alert('Bukti pembayaran berhasil diupload! Mengarahkan ke halaman pembayaran...');
      localStorage.setItem('urlPayment' , paymentUrl)
      localStorage.setItem('tokenId' , tokenId)
      window.location.href = '/check-status';
      // window.location.href = paymentUrl;
    } else {
      alert('Gagal mendapatkan URL pembayaran.');
    }
  } catch (error) {
    console.error('Error saat mengirim data:', error);
    alert('Terjadi kesalahan saat mengirim data ke server.');
  }
};




    return {
      psikolog,
      selectedSession,
      availableDates,
      availableTimes,
      sessionBooked,
      paymentMethod,
      bookSession,
      uploadProof,
    };
  },
  
};
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  height: 300px;
  object-fit: cover;
}

.container {
  max-width: 960px;
  margin: auto;
}

.bg-light-blue {
  background-color: #e7f3ff;
}
</style>
