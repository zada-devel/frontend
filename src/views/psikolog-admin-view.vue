<template>
  <LandingComponent>
    <HeaderComponent />
    <div class="container my-4">
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else-if="error" class="text-danger text-center">{{ error }}</div>
      <div v-else>
        <div class="d-flex justify-content-between mb-3">
          <h5>Daftar Psikolog</h5>
          <button @click="openAddModal" class="btn btn-primary">Add Psikolog</button>
        </div>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Nama Psikolog</th>
              <th>Spesialisasi</th>
              <th>Jadwal Online</th>
              <th>Jadwal Offline</th>
              <th>Ulasan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="psikolog in psikologs" :key="psikolog.id">
              <td>{{ psikolog.name }}</td>
              <td>{{ psikolog.specialization || 'Tidak ada' }}</td>
              <td>
                <ul>
                  <li v-for="slot in getOnlineSlots(psikolog)" :key="slot.date">
                    <p>{{ slot.date }} | {{ slot.times.join(' - ') }}</p>
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li v-for="slot in getOfflineSlots(psikolog)" :key="slot.date">
                    <p>{{ slot.date }} | {{ slot.times.join(' - ') }}</p>
                  </li>
                </ul>
              </td>
              <!-- <td>
                <ul>
                  <li v-for="slot in psikolog.availableSlots" :key="slot.date" v-if="slot.online">
                    <strong>{{ slot.date }}</strong>
                    <ul>
                      <li v-for="time in slot.times" :key="time">{{ time }}</li>
                    </ul>
                  </li>
                </ul>
              </td> -->
              <!-- <td>
                <ul>
                  <li v-for="slot in psikolog.availableSlots" :key="slot.date" v-if="slot.offline">
                    <strong>{{ slot.date }}</strong>
                    <ul>
                      <li v-for="time in slot.times" :key="time">{{ time }}</li>
                    </ul>
                  </li>
                </ul>
              </td> -->
              <td>
                <ul>
                  <li v-for="review in psikolog.reviews" :key="review.dateCreated">
                    <p><strong>Rating:</strong> {{ review.rating }} / 5</p>
                  </li>
                </ul>
              </td>
              <td>
                <button @click="openEditModal(psikolog)" class="btn btn-warning">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal Add Psikolog -->
        <div v-if="isAddModalOpen" class="modal fade show" tabindex="-1" style="display: block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add Psikolog</h5>
                <button type="button" class="btn-close" @click="closeAddModal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="text-start">
                  <label for="name" class="text-start">Nama Psikolog:</label>
                  <input v-model="addForm.name" id="name" type="text" class="form-control" />
                </div>
                <div class="text-start">
                  <label for="specialization">Spesialisasi:</label>
                  <input v-model="addForm.specialization" id="specialization" type="text" class="form-control" />
                </div>
                <div class="text-start">
                  <label for="online_day">Jadwal Online Hari:</label>
                  <!-- <input v-model="addForm.online_day" id="online_day" type="text" class="form-control" /> -->
                  <div class="checkbox-grid">
                    <label v-for="day in days" :key="day.value" class="d-block">
                      <input type="checkbox" v-model="selectedDaysOn" :value="day.value" />
                      {{ day.label }}
                    </label>
                  </div>
                </div>
                <div class="text-start">
                  <label for="online_hour">Jadwal Online Jam:</label>
                  <!-- <input v-model="addForm.online_hour" id="online_hour" type="text" class="form-control" /> -->
                  <div class="d-flex gap-3">
                  <div class="w-50">
                    <label for="online_start_hour">Start:</label>
                    <select v-model="startHourOn" id="online_start_hour" class="form-control">
                      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>
                  </div>

                  <div class="w-50">
                    <label for="online_end_hour">End:</label>
                    <select v-model="endHourOn" id="online_end_hour" class="form-control">
                      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>
                  </div>
                </div>
                </div>

                <div class="text-start">
                  <label for="offline_day">Jadwal Offline Hari:</label>
                  <!-- <input v-model="addForm.offline_day" id="offline_day" type="text" class="form-control" /> -->
                  <div class="checkbox-grid">
                    <label v-for="day in days" :key="day.value" class="d-block">
                      <input type="checkbox" v-model="selectedDaysOff" :value="day.value" />
                      {{ day.label }}
                    </label>
                  </div>
                </div>
                <div class="text-start">
                  <label for="offline_hour">Jadwal Offline Jam:</label>
                  <!-- <input v-model="addForm.offline_hour" id="offline_hour" type="text" class="form-control" /> -->
                  <div class="d-flex gap-3">
                  <div class="w-50">
                    <label for="online_start_hour">Start:</label>
                    <select v-model="startHourOff" id="online_start_hour" class="form-control">
                      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>
                  </div>

                  <div class="w-50">
                    <label for="online_end_hour">End:</label>
                    <select v-model="endHourOff" id="online_end_hour" class="form-control">
                      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>
                  </div>
                </div>
                </div>
                <div class="text-start">
                  <label for="profilepicture">Profile Picture:</label>
                  <input id="profilepicture" type="file" class="form-control" accept="image/*" @change="handleFileChange" />
                </div>

                <div class="text-start">
                  <label for="experience">Pengalaman:</label>
                  <input v-model="addForm.experience" id="experience" type="text" class="form-control" />
                </div>
                <div class="text-start">
                  <label for="rating">Price:</label>
                  <input v-model="addForm.price" id="price" type="number" min="0" max="5" class="form-control" />
                </div>
                <div class="text-start">
                  <label for="rating">Rating:</label>
                  <input v-model="addForm.rating" id="rating" type="number" min="0" max="5" class="form-control" />
                </div>
                <div class="text-start">
                  <label for="description">Deskripsi:</label>
                  <textarea v-model="addForm.description" id="description" class="form-control"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeAddModal">Close</button>
                <button type="button" class="btn btn-primary" @click="saveNewPsikolog">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Edit Psikolog -->
        <div v-if="isModalOpen" class="modal fade show" tabindex="-1" style="display: block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Psikolog</h5>
                <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="text-start">
                  <label for="name">Nama Psikolog:</label>
                  <input v-model="editForm.name" id="name" type="text" class="form-control" />
                </div>
                <div class="text-start">
                  <label for="specialization">Spesialisasi:</label>
                  <input v-model="editForm.specialization" id="specialization" type="text" class="form-control" />
                </div>
                <div class="text-start">
                  <label for="slots">Jadwal Online:</label>
                  <textarea v-model="editForm.onlineSlots" id="slots" class="form-control"
                    placeholder="e.g., 9:00, 15:00"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                <button type="button" class="btn btn-primary" @click="saveChanges">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LandingComponent>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import HeaderComponent from '../components/header-component.vue';
import LandingComponent from '../components/landing-component.vue';
import axios from 'axios';

// Refs to hold state
interface DayOption {
  label: string;
  value: number;
}

const hours = ref<string[]>([]);
for (let i = 0; i < 24; i++) {
  hours.value.push(i.toString().padStart(2, '0'));
}

interface OnlineSlot {
  date: string;  // Tanggal jadwal
  times: string[];  // Array waktu yang tersedia
}

interface AvailableSlot {
  online?: OnlineSlot[];  // Menyimpan jadwal online
  offline?: OnlineSlot[];  // Menyimpan jadwal offline
}

interface Psikolog {
  id: number;
  name: string;
  specialization: string;
  availableSlots: AvailableSlot[];
  reviews: { dateCreated: string; rating: number }[];
}

// Daftar hari dengan nilai unik
const days = ref<DayOption[]>([
  { label: 'Senin', value: 1 },
  { label: 'Selasa', value: 2 },
  { label: 'Rabu', value: 3 },
  { label: 'Kamis', value: 4 },
  { label: 'Jumat', value: 5 },
  { label: 'Sabtu', value: 6 },
  { label: 'Minggu', value: 7 },
]);

// Array untuk menyimpan pilihan yang dipilih

const loading = ref(true);
const error = ref('');
const psikologs = ref<any[]>([]);
const isModalOpen = ref(false);
const isAddModalOpen = ref(false);
const selectedDaysOn = ref<number[]>([]);
const selectedDaysOff = ref<number[]>([]);
const selectedDaysStringOn = computed(() => selectedDaysOn.value.join('#'));
const selectedDaysStringOff = computed(() => selectedDaysOff.value.join('#'));
const startHourOn = ref('');
const endHourOn = ref('');
const onlineHourOn = computed(() => {
  return startHourOn.value && endHourOn.value ? `${startHourOn.value}#${endHourOn.value}` : '';
});
const startHourOff = ref('');
const endHourOff = ref('');
const offlineHourOff = computed(() => {
  return startHourOff.value && endHourOff.value ? `${startHourOff.value}#${endHourOff.value}` : '';
});

const editForm = ref({
  name: '',
  specialization: '',
  onlineSlots: ''
});
const addForm = ref({
  description: '',
  experience: '',
  name: '',
  offline_day: selectedDaysStringOff,
  offline_hour: offlineHourOff,
  online_day: selectedDaysStringOn,
  online_hour: onlineHourOn,
  profilepicture: '',
  rating: 0,
  specialization: '',
  price: 0
});

const getOfflineSlots = (psikolog: Psikolog): { date: string; times: string[] }[] => {
  const slots = psikolog.availableSlots || [];
  const offlineSlots = slots.flatMap((slot: AvailableSlot) => {
    if (slot.offline) {
      return slot.offline.map((o: OnlineSlot) => ({
        date: o.date,
        times: o.times
      }));
    }
    return [];
  });
  return offlineSlots;
};
const selectedFile = ref<File | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const getOnlineSlots = (psikolog: Psikolog): { date: string; times: string[] }[] => {
  const slots = psikolog.availableSlots || [];
  const onlineSlots = slots.flatMap((slot: AvailableSlot) => {
    if (slot.online) {
      return slot.online.map((o: OnlineSlot) => ({
        date: o.date,
        times: o.times
      }));
    }
    return [];
  });
  return onlineSlots;
};

// Open the modal for adding a psikolog
const openAddModal = () => {
  isAddModalOpen.value = true;
};

// Close the modal for adding a psikolog
const closeAddModal = () => {
  isAddModalOpen.value = false;
};

const openEditModal = (psikolog: any) => {
  editForm.value = { ...psikolog };
  console.log(editForm.value);
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveChanges = () => {
  closeModal();
};

const saveNewPsikolog = async () => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    // Append semua field dari addForm kecuali profilepicture
    Object.entries(addForm.value).forEach(([key, value]) => {
      if (key !== 'profilepicture') {
        formData.append(key, String(value));
      }
    });

    // Append file profilepicture yang berupa Blob/File
    if (selectedFile.value) {
      formData.append('profilepicture', selectedFile.value);
    }

    const response = await axios.post('psikolog', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Psikolog added:', response.data);
    psikologs.value.push(response.data);
    closeAddModal();
  } catch (e) {
    console.error('Error adding psikolog:', e);
    error.value = 'Failed to add psikolog.';
  }
};



import { usePsikologStore } from "../stores/psikolog-store";

const psikologStore = usePsikologStore();

onMounted(async () => {
  try {
    await psikologStore.fetchPsikologs(); 
    psikologs.value = psikologStore.psikologs;
  } catch (e) {
    console.error("Failed to fetch psikolog data:", e);
    error.value = "Failed to load psikolog data.";
  } finally {
    loading.value = false;
  }
});

</script>


<style scoped>
.table {
  margin-top: 20px;
  width: 100%;
}

table th,
table td {
  vertical-align: middle;
  text-align: center;
  padding: 10px;
}

table th {
  background-color: #f8f9fa;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  margin-bottom: 5px;
}

ul li strong {
  font-weight: bold;
}

/* Modal styling */
.modal.show {
  display: block;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 kolom */
  gap: 8px; /* Jarak antar checkbox */
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

div.text-start {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
