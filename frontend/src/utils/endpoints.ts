import { api, apiWithoutAuth } from "./axios";
import Cookies from "js-cookie";


// Types of Responses
interface RegisterResponse {
  detail: "";
}

interface LoginResponse {
  key: string;
}

interface UserProfile {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  // is_group_leader: boolean;
  // phone_number: string;
  // last_login: boolean;
}

interface RegisterResponse {
  detail: string;
}

interface ConfirmEmailResponse {
  detail: string; 
}

interface PasswordResetResponse {
  detail: string; 
}

export const registerUser = async (email: string, password1: string, password2: string): Promise<RegisterResponse> => {
  try {
    const response = await apiWithoutAuth.post<RegisterResponse>("/auth/register/", { email, password1, password2 });
    return response.data;
  } catch (error: any) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
};


export const confirmEmail = async (
  key: string
): Promise<ConfirmEmailResponse> => {
  try {
    console.log("key: ", key)
    const response = await apiWithoutAuth.post<ConfirmEmailResponse>("/auth/register/verify-email/", { key });

    console.log("confirmEmail successful, setting authToken.")
    Cookies.set("authToken", key, { expires: 7 }); // Expires in 7 days
    return response.data
  } catch (error: any) {
    console.error("confirmEmail failed:", error.response?.data || error.message);
    throw error;
  }
};


export const login = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const response = await apiWithoutAuth.post<LoginResponse>("/auth/login/", {
      email,
      password,
    });

    // Extract the token from the response
    const { key } = response.data;
    Cookies.set("authToken", key, { expires: 7 }); // Expires in 7 days

    console.log("Login successful!");
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};


export const resetPassword = async (uid: string, token: string, new_password1: string, new_password2: string): Promise<PasswordResetResponse> => {
  try {
    const response = await apiWithoutAuth.post<RegisterResponse>("/auth/password/reset/confirm/", { uid, token, new_password1, new_password2 });
    return response.data;
  } catch (error: any) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>("/auth/user/");
    return response.data; // Return the user data
  } catch (error: any) {
    console.error("Failed to fetch user profile:", error.response?.data || error.message);
    throw error;
  }
};
