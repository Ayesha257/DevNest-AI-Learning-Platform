// src/modules/challenges/submissions/api.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  withCredentials: true, // send session cookies for FastAPI auth
});


// --------------------------------------
// GET ALL SUBMISSIONS (GLOBAL)
// --------------------------------------
export async function getAllSubmissions() {
  try {
    const res = await api.get("/user-submissions?limit=100");

    // Backend returns:
    // { success: true, count: X, submissions: [ ... ] }
    return res.data.submissions || [];

  } catch (error) {
    console.error("Error fetching all submissions:", error);
    return [];
  }
}


// --------------------------------------
// GET SUBMISSIONS OF SPECIFIC USER
// --------------------------------------
export async function getUserSubmissions(userName) {
  try {
    const res = await api.get(`/user-submissions/${userName}`);
    return res.data.submissions || [];
  } catch (error) {
    console.error("Error fetching submissions for user:", error);
    return [];
  }
}


// --------------------------------------
// GET A SINGLE SUBMISSION BY ID
// --------------------------------------
export async function getSubmissionById(id) {
  try {
    const res = await api.get(`/user-submissions/id/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching submission detail:", error);
    return null;
  }
}


// --------------------------------------
// CREATE NEW SUBMISSION
// --------------------------------------
export async function createSubmission(data) {
  try {
    const res = await api.post("/user-submissions", data);
    return res.data;
  } catch (error) {
    console.error("Error submitting solution:", error);
    throw error;
  }
}
