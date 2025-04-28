import { defineStore } from 'pinia';
import axios from 'axios';

interface Transaction {
  date: string;
  id: string;
  psychologistName: string;
  status: string;
  time: string;
}

interface State {
  transactions: Transaction[];
}

export const useTransactionStore = defineStore('transactionStore', {
  state: (): State => ({
    transactions: [],
  }),
  actions: {
    // 
    async fetchTransactions(id = null) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in localStorage');
        }
    
        // Tentukan endpoint berdasarkan ada/tidaknya ID
        const endpoint = id ? `get_transaction_history/${id}` : `get_transaction_history`;
    
        // Panggil API menggunakan axios
        const response = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log("ini respon api", response.data);
        const data = response.data;
    
        if (data.status === 'success' && Array.isArray(data.transactions)) {
          this.transactions = data.transactions;
          console.log('Transactions fetched successfully:', this.transactions);
        } else {
          console.error('Unexpected response structure:', data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.message);
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
          }
        } else if (error instanceof Error) {
          console.error('General error:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      }
    },
    async bookAppointment() {
      const url = "/book_appointment";
      
      // Data JSON untuk request body
      const jsonData = {
          accountNumber: "1234567890",
          date: "2024-11-20",
          psychologistId: 456,
          time: "10:00",
          transactionType: "transfer",
          userId: 123
      };
      
      // Membuat FormData untuk upload file
      const formData = new FormData();
      formData.append("file", (document.getElementById("fileInput") as HTMLInputElement).files![0]);
      formData.append("json", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
      
      try {
          const response = await fetch(url, {
              method: "POST",
              body: formData
          });
          
          const result = await response.json();
          console.log("Response:", result);
      } catch (error) {
          console.error("Error:", error);
      }
  }
  },
});
