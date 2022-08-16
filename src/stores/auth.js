import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    authToken: undefined,
    userRole: undefined
  }),
  getters: {
    getRole(){
      return this.userRole
    },
    isAdmin() {
      return this.userRole === 'admin'
    },
    isAuthenticated(){
      return this.authenticated
    }
  },
  actions: {
    setAuthToken(token){
      if(token){
        this.authToken = token;
        localStorage.setItem('token', token);
        if(!this.authenticated){
          this.authenticated = true;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
    removeAuthToken(){
      this.authenticated = false;
      this.authToken = undefined;
      axios.defaults.headers.common['Authorization'] = '';
    },
    setUserRole(user){
      this.userRole = user.role;
      const userRoleObj = {role: user.role};
      localStorage.setItem('user', JSON.stringify(userRoleObj));
    },
    initFromLocal(){
      if(localStorage.getItem('token')){
        this.setAuthToken(localStorage.getItem('token'));
      }
      if(localStorage.getItem('user')){
        this.setUserRole(JSON.parse(localStorage.getItem('user')));
      }
    }
  }
})
