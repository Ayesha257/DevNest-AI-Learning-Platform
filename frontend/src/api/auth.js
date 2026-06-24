import api from "./axios";

export const signup = (payload) => api.post("/auth/auth/signup", payload);
export const login = (payload) => api.post("/auth/auth/login", payload);
export const refreshToken = (refreshToken) =>
  // FastAPI endpoint expects a string param named refresh_token; send it as query param
  api.post(`/auth/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`);
export const me = (accessToken) =>
  api.get("/auth/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

export const sendVerificationEmail = (email) =>
  api.get(`/auth/auth/send_verification_email?email=${encodeURIComponent(email)}`);

// Send an object with key email
export const requestPasswordReset = (email) => {

  return api.post("/auth/auth/request_password_reset", {email});
};

export const confirmPasswordReset = ( payload ) => {
  return api.post("/auth/auth/confirm_password_reset", payload);
};

export const confirmEmail = (oob_code) =>
  api.post("/auth/auth/confirm_email", { oob_code });

export const updateProfile = (token, username, data) =>
  api.put(`/auth/auth/users/${username}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

