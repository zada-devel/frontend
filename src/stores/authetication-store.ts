import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  passwd: string;
  dob: string;
  placeOfBirth: string;
  gender: string;
  ethnic: string;
  religion: string;
  lastEducation: string;
  occupation: string;
  maritalStatus: string;
  referredFrom?: string;
  role: string;
}

export const useAuthentication = defineStore('authentication', () => {
  const email = ref<string | null>(localStorage.getItem('email'));
  const token = ref<string | null>(localStorage.getItem('token'));
  const isLogged = ref<boolean>(!!token.value && !!email.value); // Gunakan ref

  // Computed property (jika masih dibutuhkan)
  const isAuthenticated = computed(() => !!token.value);

  // Login function
  const login = async (userEmail: string, userPassword: string) => {
    try {
      const response = await axios.post('login', {
        email: userEmail,
        password: userPassword,
      });

      const tokenData = response.data.access_token;
      if (!tokenData) throw new Error('Token is missing in the response');

      token.value = tokenData;
      email.value = userEmail;
      isLogged.value = true; // Set isLogged ke true setelah login

      localStorage.setItem('token', tokenData);
      localStorage.setItem('email', userEmail);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    token.value = null;
    email.value = null;
    isLogged.value = false; 
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  const register = async (userData: UserData) => {
    try {
      const response = await axios.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };


  return {
    email,
    token,
    isAuthenticated,
    isLogged,
    register,
    login,
    logout,
  };
});
