import api from "./axios";

export const getUserByUsername = (username, accessToken) =>
  api.get(`/auth/auth/users/${encodeURIComponent(username)}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

export const updateUserByUsername = (username, payload, accessToken) =>
  api.put(`/auth/auth/users/${encodeURIComponent(username)}`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
