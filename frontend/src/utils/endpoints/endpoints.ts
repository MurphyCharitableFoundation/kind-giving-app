import { api, apiWithoutAuth } from "../axios";
import Cookies from "js-cookie";

// Types of Responses
interface RegisterResponse {
  detail: "";
}

interface LoginResponse {
  key: string;
}

interface LogoutResponse {
  detail: string;
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

interface ConfirmEmailResponse {
  detail: string;
}

interface PasswordResetRequestResponse {
  detail: string;
}

interface PasswordVerificationCodeResponse {
  resetToken: string;
}

interface PasswordResetConfirmResponse {
  detail: string;
}

interface AuthenticateWithGoogleResponse {
  key: string;
}

// user auth.
export const registerUser = async (
  first_name: string,
  last_name: string,
  email: string,
  password1: string,
  password2: string
): Promise<RegisterResponse> => {
  try {
    const response = await apiWithoutAuth.post<RegisterResponse>(
      "/auth/register/",
      { first_name, last_name, email, password1, password2 }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const confirmEmail = async (
  key: string
): Promise<ConfirmEmailResponse> => {
  try {
    console.log("key: ", key);
    const response = await apiWithoutAuth.post<ConfirmEmailResponse>(
      "/auth/register/verify-email/",
      { key }
    );

    console.log("confirmEmail successful, setting authToken.");
    Cookies.set("authToken", key, { expires: 7 }); // Expires in 7 days
    return response.data;
  } catch (error: any) {
    console.error(
      "confirmEmail failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await apiWithoutAuth.post<LoginResponse>("/auth/login/", {
      email,
      password,
    });

    // Extract the token from the response
    const { key } = response.data;
    Cookies.set("authToken", key, { expires: 7 });

    console.log("Login successful!");
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    Cookies.remove("authToken");
    const response = await apiWithoutAuth.post<LogoutResponse>("/auth/logout/");
    console.log("Logout successful! - data", response.data);
  } catch (error: any) {
    console.error("Logout failed:", error.response?.data || error.message);
    throw error;
  }
};

export const resetPasswordRequest = async (
  email: string
): Promise<PasswordResetRequestResponse> => {
  try {
    const response = await apiWithoutAuth.post<RegisterResponse>(
      "/auth/password/reset/",
      { email }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed - reset password request.",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const resetPasswordVerifyCode = async (
  email: string,
  code: string
): Promise<PasswordVerificationCodeResponse> => {
  try {
    const response = await apiWithoutAuth.post<PasswordVerificationCodeResponse>(
      "/auth/password/reset/verify/",
      { email, code }
    );
    return response.data
  } catch (error: any) {
    console.error(
      "Failed - code verification.",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const resetPasswordConfirm = async (
  token: string,
  new_password1: string,
  new_password2: string
): Promise<PasswordResetConfirmResponse> => {
  try {
    const response = await apiWithoutAuth.post<RegisterResponse>(
      "/auth/password/reset/confirm/",
      { token, new_password1, new_password2 }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed - reset password confirmation.",
      error.response?.data || error.message
    );
    throw error;
  }
};

// social auth.

export const AuthenticateWithGoogle = async (
  access_token: string
): Promise<AuthenticateWithGoogleResponse> => {
  try {
    const response = await apiWithoutAuth.post<AuthenticateWithGoogleResponse>(
      "/auth/google/",
      { access_token }
    );
    const { key } = response.data;
    Cookies.set("authToken", key, { expires: 7 });

    console.log("authenticate with google - data: ", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to authenticate with Google.",
      error.response?.data || error.message
    );
    throw error;
  }
};

// user info.
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>("/auth/user/");
    console.log("fetch user profile - data", response.data);
    return response.data; // Return the user data
  } catch (error: any) {
    console.error(
      "Failed to fetch user profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};
