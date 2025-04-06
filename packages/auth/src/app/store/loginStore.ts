import { defineStore } from 'pinia';
import { AuthService } from '../../../../../src/api-client/services/AuthService'; 
import axios from 'axios';

export interface AuthUser {
  id: number;
  email: string;
  type: string; 
}

export interface BearerToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  date: number;
}

export interface LoginStoreState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  token: BearerToken | null;
}

export const useLoginStore = defineStore('login', {
  state: (): LoginStoreState => ({
    user: null,
    loading: false,
    error: null,
    token: null,
  }),
  actions: {
    async login(email: string, password: string): Promise<AuthUser | null> {
      this.loading = true;
      this.error = null;
      try {
        // Step 1: Generate the OAuth token first.
        const tokenResponse = await AuthService.issueToken({
          grant_type: 'password',
          client_id: '3',                // Replace with your actual client ID
          client_secret: '4uk0S1MW4Ael8v58TEpVFo2IE1yBFYtTIFmeJuqh', // Replace with the client_secret from the database 
          username: email,
          password: password,
        });
        
        // Save the token details.
        this.token = {
          access_token: tokenResponse.access_token!,
          refresh_token: tokenResponse.refresh_token!,
          expires_in: tokenResponse.expires_in!,
          token_type: tokenResponse.token_type!,
          date: new Date().getTime(),
        };
        localStorage.setItem('access_token', tokenResponse.access_token!); //attached the access token to the local storage


        // Step 2: Now call the login endpoint, including the token in the header.
        const loginResponse = await axios.post(
          'login',
          { email, password },
          { headers: { Authorization: `Bearer ${this.token.access_token}` } }
        );


            if (!loginResponse.data || !loginResponse.data.id) {
      this.error = loginResponse.data?.message || 'Login failed: no user data returned.';
      return null;
    }
    
        const userData = loginResponse.data;
        this.user = {
          id: userData.id,
          email: userData.email,
          type: userData.type,
        };
        return this.user;
      } catch (error: any) {
        console.error('Login error caught:', error.response?.data || error);
        this.error = error.response?.data?.message || 'Unauthorized. Invalid credentials.';
        return null;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
    },
  },
});
