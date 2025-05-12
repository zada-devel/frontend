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
  weight: string;
  marriage: string;
}

interface LoggedInUser {
  role: string;
  usr_id: number;
}

export const useAuthentication = defineStore('authentication', () => {
  const email = ref<string | null>(localStorage.getItem('email'));
  const token = ref<string | null>(localStorage.getItem('token'));
  const isLogged = ref<boolean>(!!token.value && !!email.value);
  const user = ref<LoggedInUser | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const getUserByEmail = async (email: string) => {
    try {
      const response = await axios.post(`get_user_profile`, {
        email: email
      });
      console.log("Respon get_user_profile:", response.data);
      return response.data.user.id;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  const login = async (userEmail: string, userPassword: string) => {
    try {
      const response = await axios.post('login', {
        email: userEmail,
        password: userPassword,
      });

      const responseData = response.data;
      if (!responseData.access_token) throw new Error('Token is missing in the response');

      token.value = responseData.access_token;
      email.value = userEmail;
      isLogged.value = true;

      user.value = {
        role: responseData.role,
        usr_id: responseData.usr_id,
      };

      localStorage.setItem('token', responseData.access_token);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('role', responseData.role);
      localStorage.setItem('usr_id', String(responseData.usr_id));
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    token.value = null;
    email.value = null;
    user.value = null;
    isLogged.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('usr_id');
  };

  const register = async (userData: UserData) => {
    try {
      const response = await axios.post('/createuser', userData);
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
    getUserByEmail,
    user,
  };
});
