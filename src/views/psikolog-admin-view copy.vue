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

        <EasyDataTable
          
          :headers="headers"
          :items="formattedPsikologs"
          :rows-per-page="25"
          :rows-items="[10, 25, 50, 100]"
          table-class-name="customize-table"
          buttons-pagination
          show-index
          theme-color="#1d90ff"
          header-text-direction="center"
          body-text-direction="center"
        >
          <template #item-jadwalOnline="{ jadwalOnline }">
            <div class="schedule-cell">{{ jadwalOnline }}</div>
          </template>
          <template #item-jadwalOffline="{ jadwalOffline }">
            <div class="schedule-cell">{{ jadwalOffline }}</div>
          </template>
          <template #item-actions="item">
            <button 
              class="btn btn-sm btn-primary"
              @click="openEditModal(item.id)"
            >
              Edit
            </button>
        </template>
        </EasyDataTable>

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
                  <input id="profilepicture" type="file" class="form-control" accept="image/*" />
                </div>

                <div class="text-start">
                  <label for="experience">Pengalaman:</label>
                  <input v-model="addForm.experience" id="experience" type="text" class="form-control" />
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
                  <label for="specialization">Deskripsi:</label>
                  <input v-model="editForm.description" id="description" type="text" class="form-control" />
                </div>
                <div class="text-start">
                  <label for="online_day">Jadwal Online Hari:</label>
                  <!-- <input v-model="addForm.online_day" id="online_day" type="text" class="form-control" /> -->
                  <div class="checkbox-grid">
                    <label v-for="day in days" :key="day.value" class="d-block">
                      <input type="checkbox" v-model="selectedDaysOnedit" :value="day.value" />
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
                    <select v-model="startHourOnedit" id="online_start_hour" class="form-control">
                      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>
                  </div>

                  <div class="w-50">
                    <label for="online_end_hour">End:</label>
                    <select v-model="endHourOnedit" id="online_end_hour" class="form-control">
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
                      <input type="checkbox" v-model="selectedDaysOffedit" :value="day.value" />
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
                    <select v-model="startHourOffedit" id="online_start_hour" class="form-control">
                      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>
                  </div>

                  <div class="w-50">
                    <label for="online_end_hour">End:</label>
                    <select v-model="endHourOffedit" id="online_end_hour" class="form-control">
                      <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                    </select>
                  </div>
                </div>
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
import { ref, onMounted, computed, watch} from 'vue';
import HeaderComponent from '../components/header-component.vue';
import LandingComponent from '../components/landing-component.vue';
import axios from 'axios';
import EasyDataTable from "vue3-easy-data-table";
import 'vue3-easy-data-table/dist/style.css';


const headers = [
  { text: "Nama Psikolog", value: "name" },
  { text: "Spesialisasi", value: "specialization" },
  { text: "Jadwal Online", value: "onlineSchedule" },
  { text: "Jadwal Jam Online", value: "onlineHour" },
  { text: "Jadwal Offline", value: "offlineSchedule" },
  { text: "Jadwal Jam Offline", value: "offlineHour" },
  { text: "aksi", value: "actions" }
];



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


// Daftar hari dengan nilai unik
const days = ref<DayOption[]>([
  { label: 'Senin', value: 0 },
  { label: 'Selasa', value: 1 },
  { label: 'Rabu', value: 2 },
  { label: 'Kamis', value: 3 },
  { label: 'Jumat', value: 4 },
  { label: 'Sabtu', value: 5 },
  { label: 'Minggu', value: 6 },
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

const getStartHour = (hourString: string | undefined) => {
  const hours = hourString?.split(",") || [];
  return hours.length > 0 ? hours[0].split(":")[0].padStart(2, "0") : "";
};

const getEndHour = (hourString: string | undefined) => {
  const hours = hourString?.split(",") || [];
  return hours.length > 0 ? hours[hours.length - 1].split(":")[0].padStart(2, "0") : "";
};



const selectedDaysOnedit = ref<number[]>([]);
  const parseOnlineDays = () => {
  const onlineDaysArray = editForm.value.online_day.split(', ').map(day => day.trim());
  selectedDaysOnedit.value = days.value
    .filter(day => onlineDaysArray.includes(day.label))
    .map(day => day.value);
};

const selectedDaysOffedit = ref<number[]>([]);
const parseOfflineDays = () => {
  const offlineDaysArray = editForm.value.offline_day.split(', ').map(day => day.trim());
  selectedDaysOffedit.value = days.value
    .filter(day => offlineDaysArray.includes(day.label))
    .map(day => day.value);
};


// Menggabungkan hasil parsing
// const formattedOfflineHour = computed(() => {
//   return `${startHourOff.value}#${endHourOff.value}`;
// });

const editForm = ref({
  id: '',
  name: '',
  specialization: '',
  online_day: '',
  online_hour: '',
  offline_day: '',
  offline_hour: '',
  description: '',
  reviews: [],
  imgSrc: ''
  // onlineSlots: ''
});

// const startHourOnedit = computed(() => getStartHour(editForm.value.online_hour));
// const endHourOnedit = computed(() => getEndHour(editForm.value.online_hour));
// const startHourOffedit = computed(() => getStartHour(editForm.value.offline_hour));
// const endHourOffedit = computed(() => getEndHour(editForm.value.offline_hour));



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
  specialization: ''
});





// const getOfflineSlots = (psikolog: Psikolog): { date: string; times: string[] }[] => {
//   const slots = psikolog.availableSlots || [];
//   const offlineSlots = slots.flatMap((slot: AvailableSlot) => {
//     if (slot.offline) {
//       return slot.offline.map((o: OnlineSlot) => ({
//         date: o.date,
//         times: o.times
//       }));
//     }
//     return [];
//   });
//   return offlineSlots;
// };

// const getOnlineSlots = (psikolog: Psikolog): { date: string; times: string[] }[] => {
//   const slots = psikolog.availableSlots || [];
//   const onlineSlots = slots.flatMap((slot: AvailableSlot) => {
//     if (slot.online) {
//       return slot.online.map((o: OnlineSlot) => ({
//         date: o.date,
//         times: o.times
//       }));
//     }
//     return [];
//   });
//   return onlineSlots;
// };

// const formatSchedule = (slots: any[]) => {
//   if (!slots || slots.length === 0) return '-';
  
//   const dates = slots.map(slot => {
//     const date = new Date(slot.date);
//     const formattedDate = date.toLocaleDateString('id-ID', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });

//     const formattedTimes = slot.times.map((time: any) => `${time}`).join('-');
//     return `${formattedDate} (${formattedTimes})\n`; // Added newline here
//   });
  
//   return dates.join('|| ');
// };

const formattedPsikologs = computed(() => {
  return psikologs.value.map(psikolog => {
    // const onlineSlots = getOnlineSlots(psikolog);
    // const offlineSlots = getOfflineSlots(psikolog);

    return {
      id: psikolog.id,
      name: psikolog.name,
      specialization: psikolog.specialization,
      onlineSchedule: psikolog.online_day,
      onlineHour: psikolog.online_hour,
      offlineSchedule: psikolog.offline_day,
      offlineHour: psikolog.offline_hour
      // onlineSchedule: formatSchedule(onlineSlots),
      // offlineSchedule: formatSchedule(offlineSlots)
      // actions: `<button class='btn btn-sm btn-primary' @click='editPsikolog("${psikolog.id}")'>Edit</button>`
    };
  });
});

// Open the modal for adding a psikolog
const openAddModal = () => {
  isAddModalOpen.value = true;
};

// Close the modal for adding a psikolog
const closeAddModal = () => {
  isAddModalOpen.value = false;
};

const startHourOnedit = ref(''); // Ganti computed dengan ref
const endHourOnedit = ref('');
const startHourOffedit = ref('');
const endHourOffedit = ref('');

const openEditModal = (id: any) => {
  const psikolog = psikologs.value.find((p: any) => p.id === id);
  editForm.value = { ...psikolog };

  const existingStartOn = getStartHour(editForm.value.online_hour);
  const existingEndOn = getEndHour(editForm.value.online_hour);

  startHourOnedit.value = existingStartOn;
  endHourOnedit.value = existingEndOn;
  
  const existingStartOff = getStartHour(editForm.value.offline_hour);
  const existingEndOff = getEndHour(editForm.value.offline_hour);

  startHourOffedit.value = existingStartOff;
  endHourOffedit.value = existingEndOff;
  isModalOpen.value = true;
  parseOfflineDays();
  parseOnlineDays();
};


const closeModal = () => {
  isModalOpen.value = false;
};

const saveChanges = async () => {
  
  
  const onlineDaysFormatted = selectedDaysOnedit.value.join("#");
  const offlineDaysFormatted = selectedDaysOffedit.value.join("#");
  const online_hour = `${startHourOnedit.value}#${endHourOnedit.value}`;
  const offline_hour = `${startHourOffedit.value}#${endHourOffedit.value}`

  editForm.value.online_day = onlineDaysFormatted;
  editForm.value.offline_day = offlineDaysFormatted;

  const { id, reviews, imgSrc, ...formData } = editForm.value;
  formData.online_day = onlineDaysFormatted;
  formData.offline_day = offlineDaysFormatted;
  formData.online_hour = online_hour;
  formData.offline_hour = offline_hour;
  formData.description = editForm.value.description;
  formData.specialization = editForm.value.specialization;
  formData.name = editForm.value.name;


  try {
    const token = localStorage.getItem('token');
    await axios.put(`psikolog/${editForm.value.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    closeModal(); // Tutup modal setelah update
    window.location.reload();
  } catch (e) {
    console.error('Error adding psikolog:', e);

    error.value = 'Failed to add psikolog.';
  }
};


const saveNewPsikolog = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('psikolog', addForm.value, {
      headers: {
        Authorization: `Bearer ${token}`, 
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
    await psikologStore.fetchlistPsikologs(); 
    psikologs.value = psikologStore.psikologs;
  } catch (err) {
    error.value = 'Failed to load data';
  } finally {
    loading.value = false;
  }
});

// onMounted(async () => {
//   try {
//     await psikologStore.fetchPsikologs(); 
//     psikologs.value = psikologStore.psikologs;
//   } catch (e) {
//     console.error("Failed to fetch psikolog data:", e);
//     error.value = "Failed to load psikolog data.";
//   } finally {
//     loading.value = false;
//   }
// });

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
  align-items: center;
  justify-content: center;
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

.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
  --easy-table-header-background-color: #2d3a4f;

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: #080a0e;
  --easy-table-body-row-background-color: #e0e2e6;
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: #0b0c0d;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: #2d3a4f;
  --easy-table-footer-font-color: #c0c7d2;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;


  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
}

.customize-table thead th {
  font-weight: 600;
  color: #374151;
}

.customize-table tbody tr {
  height: auto;
  min-height: 48px;
}

.schedule-cell {
  white-space: pre-wrap;
  padding: 8px 0;
  line-height: 1.4;
}

:deep(.ez-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

:deep(.ez-table td) {
  padding: 8px 16px;
  vertical-align: top;
}

.btn-sm {
  font-size: 14px;
  padding: 4px 8px;
}
</style>
