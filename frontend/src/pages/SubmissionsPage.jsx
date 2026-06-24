// src/pages/SubmissionsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubmissionsPage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/user-submissions/Mohsin"
      );
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === "all") return true;
    if (filter === "passed") return sub.all_tests_passed;
    if (filter === "failed") return !sub.all_tests_passed;
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "#f3f2f2ff" }}>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", color: "#000000" }}>
      {/* Header */}
      <button onClick={() => navigate("/")} style={{ marginBottom: "1rem", color: "#000000" }}>
        Back to Dashboard
      </button>

      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#faf7f7ff" }}>My Submissions</h1>
      <p style={{ marginBottom: "1rem", color: "#000000" }}>
        Total: {submissions.length} submissions
      </p>

      {/* Filters */}
      <div style={{ marginBottom: "1rem", color: "#000000" }}>
        <span>Filter: </span>
        <button onClick={() => setFilter("all")} style={{ marginRight: "0.5rem", color: "#000000" }}>
          All
        </button>
        <button onClick={() => setFilter("passed")} style={{ marginRight: "0.5rem", color: "#000000" }}>
          Passed
        </button>
        <button onClick={() => setFilter("failed")} style={{ color: "#000000" }}>Failed</button>
      </div>

      {/* No submissions */}
      {filteredSubmissions.length === 0 ? (
        <div style={{ color: "#000000" }}>
          <p>No submissions found.</p>
          <button onClick={() => navigate("/challenges")} style={{ color: "#000000" }}>
            Go to Challenges
          </button>
        </div>
      ) : (
        <div>
          {filteredSubmissions.map((submission, index) => (
            <div
              key={submission.id || index}
              style={{
                border: "1px solid #000",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#121224",
                color: "#fcfcfcff",
              }}
            >
              <p style={{ color: "#fbf9f9ff" }}>
                <strong>Challenge:</strong> {submission.challenge_title}
              </p>
              {submission.difficulty && (
                <p style={{ color: "#f8f5f5ff" }}>
                  <strong>Difficulty:</strong> {submission.difficulty}
                </p>
              )}
              <p style={{ color: "#fdfafaff" }}>
                <strong>Submitted at:</strong> {formatDate(submission.submitted_at)}
              </p>
              <p style={{ color: "#f9f5f5ff" }}>
                <strong>Language:</strong> {submission.language}
              </p>

              <p style={{ color: "#faf7f7ff" }}>
                <strong>Tests Passed:</strong>{" "}
                {
                  submission.test_results.filter(
                    (t) =>
                      t.stdout &&
                      t.expected &&
                      t.stdout.trim() === t.expected.trim()
                  ).length
                }{" "}
                / {submission.test_results.length}
              </p>

              <p style={{ color: "#f5f3f3ff" }}>
                <strong>Status:</strong>{" "}
                {submission.all_tests_passed ? "Accepted" : "Failed"}
              </p>

              <p style={{ marginTop: "0.5rem", color: "#000000" }}>
                <strong>Code:</strong>
              </p>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  backgroundColor: "#f5f5f5",
                  padding: "0.5rem",
                  color: "#000000",
                }}
              >
                {submission.code}
              </pre>

              <button
                style={{ marginTop: "0.5rem", color: "#000000" }}
                onClick={() =>
                  navigate(`/challenges/${submission.challenge_id}`)
                }
              >
                View Challenge
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}