import { defineStore } from 'pinia';
import axios from 'axios';

interface AvailableSlot {
  date: string;
  times: string[];
}

interface Psikolog {
  specialization: string;
  name: string;
  id: number;
  availableSlots: {
    online: AvailableSlot[];
    offline: AvailableSlot[];
  }[];
  reviews: [];
  imgSrc: string;
  price: number
}

export const usePsikologStore = defineStore('psikologStore', {
  state: () => ({
    psikologs: [] as Psikolog[],
    loading: false,
    error: '',
    selectedPsikolog: null as Psikolog | null,
  }),
  actions: {
    async fetchlistPsikologs() {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.get('get_psikolog_list', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('responsenya', response.data.status);
        if (response.data.status === 'success') {
          console.log('responsenya', response.data.status);
          const psikologList = response.data.psikologs.map((psychologist: any) => ({
            id: psychologist.id,
            name: psychologist.name,
            specialization: psychologist.specialization || '-',
            online_day: psychologist.online_day || '-',
            online_hour: psychologist.online_hour || '-',
            offline_day: psychologist.offline_day || '-',
            offline_hour: psychologist.offline_hour || '-',
            reviews: psychologist.reviews || [],
            imgSrc: psychologist.imgSrc || '',
            description: psychologist.description || '',
            price: psikologList.price
          }));
          this.psikologs = psikologList;
        } else {
          this.error = 'Gagal mengambil data psikolog.';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      } finally {
        this.loading = false;
      }
    },
    async fetchPsikologs() {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.get('get_psikolog_list_with_profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log("Responsee " + JSON.stringify(response))
        if (response.data.status === 'success') {
          const psikologList = response.data.psikologs.psychologists.map((psychologist: any) => ({
            id: psychologist.id,
            name: psychologist.name,
            specialization: psychologist.specialization || '-',
            availableSlots: psychologist.availableSlots,
            reviews: psychologist.reviews || [],
            imgSrc: psychologist.imgSrc || '',
            description: psychologist.description || '',
            price: psychologist.price
          }));
          this.psikologs = psikologList;
        } else {
          this.error = 'Gagal mengambil data psikolog.';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      } finally {
        this.loading = false;
      }
    },
    async fetchPsikologsID(id: number) {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.get(`https://bidu.my.id/api/get_psikolog_list_with_profile?psikologId=${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
    
        if (response.data.status === 'success') {
          const psychologist = response.data.psikologs; // Asumsikan ini format response-nya
          this.psikologs = [
            {
              id: psychologist.id,
              name: psychologist.name,
              specialization: psychologist.specialization || '-',
              availableSlots: psychologist.availableSlots,
              reviews: psychologist.reviews || [],
              imgSrc: psychologist.imgSrc || '', 
              price: psychologist.price
            },
          ];
        } else {
          this.error = 'Gagal mengambil data psikolog.';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      } finally {
        this.loading = false;
      }
    },    
    async savePsikolog(psikolog: {
      description: string;
      experience: string;
      name: string;
      offline_day: string;
      offline_hour: string;
      online_day: string;
      online_hour: string;
      profilepicture: string;
      rating: number;
      specialization: string;
      price: number
    }) {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.post('psikolog', psikolog, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
    
        if (response.data.status === 'success') {
          this.psikologs.push({
            id: response.data.id, // ID dari response API
            name: psikolog.name,
            specialization: psikolog.specialization,
            availableSlots: [], // Default value
            reviews: [],        // Default value
            imgSrc: psikolog.profilepicture || '', // Default value
            price: psikolog.price
          });
        } else {
          this.error = 'Gagal menyimpan data psikolog.';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      } finally {
        this.loading = false;
      }
    },    
    async updatePsikolog(
      id: number,
      updatedPsikolog: {
        description?: string;
        experience?: string;
        name?: string;
        offline_day?: string;
        offline_hour?: string;
        online_day?: string;
        online_hour?: string;
        profilepicture?: string;
        rating?: number;
        specialization?: string;
      }
    ) {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.put(`update_psikolog/${id}`, updatedPsikolog, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
    
        if (response.data.status === 'success') {
          const index = this.psikologs.findIndex((p) => p.id === id);
          if (index !== -1) {
            this.psikologs[index] = { ...this.psikologs[index], ...updatedPsikolog };
          }
        } else {
          this.error = 'Gagal memperbarui data psikolog.';
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      } finally {
        this.loading = false;
      }
    },    
    setSelectedPsikolog(psikolog :Psikolog) {
      this.selectedPsikolog = psikolog; 
    },
    resetSelectedPsikolog() {
      this.selectedPsikolog = null;
    },
  },
  getters: {
    getAllPsikologs: (state) => state.psikologs,
    getSelectedPsikolog: (state) => state.selectedPsikolog,  // Getter untuk selectedPsikolog
  },
});
