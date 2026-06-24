import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  withCredentials: false,
});

// ---------------------
// CHALLENGES
// ---------------------
export async function getAllChallenges() {
  const res = await api.get("/challenges/challenges/");
  return res.data;
}

export async function getChallengeById(id) {
  const res = await api.get(`/challenges/challenges/${id}`);
  return res.data;
}

// ---------------------
// RUN CODE (UPDATED WITH BETTER ERROR HANDLING)
// ---------------------
export async function runCode({
  code,
  language = "python",
  stdin = "",
  expected_output = null,
}) {
  try {
    const token = localStorage.getItem("token");
    const res = await api.post(
      "/judge/judge/run",
      {
        code,
        language,
        stdin,
        expected_output,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        timeout: 30000, // 30 seconds timeout
      }
    );
    return res.data;
  } catch (error) {
    console.error("Run Code Error:", error);
    
    // Return a structured error response
    if (error.response) {
      return {
        status: "API Error",
        status_id: -1,
        stdout: "",
        stderr: `Server Error: ${error.response.status} - ${error.response.data?.detail || error.response.statusText}`,
        compile_output: "",
        time: null,
        memory: null,
        exit_code: null,
        passed: false,
      };
    } else if (error.request) {
      return {
        status: "Network Error",
        status_id: -1,
        stdout: "",
        stderr: "Network error: Unable to reach the server",
        compile_output: "",
        time: null,
        memory: null,
        exit_code: null,
        passed: false,
      };
    } else {
      return {
        status: "Unknown Error",
        status_id: -1,
        stdout: "",
        stderr: `Error: ${error.message}`,
        compile_output: "",
        time: null,
        memory: null,
        exit_code: null,
        passed: false,
      };
    }
  }
}

// ---------------------
// AI HELPERS
// ---------------------
// 1. Get Hint
export async function getHint(challengeId) {
  try {
    const res = await api.post("/ai/ai/hint", { challenge_id: challengeId });
    return res.data;
  } catch (error) {
    console.error("Get Hint Error:", error);
    return { error: "Failed to get hint" };
  }
}

// 2. Get Explanation
export async function getExplanation(question) {
  try {
    const res = await api.post("/ai/ai/explain", { question });
    return res.data;
  } catch (error) {
    console.error("Get Explanation Error:", error);
    return { error: "Failed to get explanation" };
  }
}

// 3. Get Review (UPDATED — sends correct language)
export async function getReview({ userId, code, question, language }) {
  try {
    const payload = {
      userId: userId || "guest-user",
      code: code || "# No code submitted",
      language: language || "python",
      question: question || "No question provided",
      includeHints: false,
      includeExplain: false,
      includeStudyPlan: false,
    };
    
    console.log("Sending Review Payload:", payload);
    const res = await api.post("/ai/ai/review", payload);
    return res.data;
  } catch (error) {
    console.error("Get Review Error:", error);
    return { error: "Failed to get review" };
  }
}