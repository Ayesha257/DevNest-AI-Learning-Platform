// src/modules/challenges/submissions/SubmissionsPage.jsx

import React, { useState, useEffect } from "react";
import { getAllSubmissions } from "./api";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await getAllSubmissions();   // backend returns { success, count, submissions }
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (passed) => {
    return passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = (passed) => {
    return passed ? "Accepted" : "Failed";
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        Loading submissions…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-900">My Submissions</h1>

        {/* No submissions */}
        {submissions.length === 0 && (
          <div className="text-gray-600 text-center py-10">
            No submissions found.
          </div>
        )}

        {/* Submission Cards */}
        <div className="space-y-4">
          {submissions.map((sub, index) => (
            <div
              key={index}
              className="bg-white shadow border rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">
                  {sub.challenge_title || "Unknown Challenge"}
                </h2>

                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                    sub.all_tests_passed
                  )}`}
                >
                  {getStatusText(sub.all_tests_passed)}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                <strong>User:</strong> {sub.user_name}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                <strong>Language:</strong> {sub.language}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                <strong>Submitted At:</strong>{" "}
                {new Date(sub.submitted_at || sub.created_at).toLocaleString()}
              </p>

              {/* Test Results */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-gray-800">
                  Test Results
                </h3>

                {sub.test_results?.length > 0 ? (
                  <div className="space-y-2">
                    {sub.test_results.map((t, i) => (
                      <div
                        key={i}
                        className="p-3 bg-gray-50 border rounded"
                      >
                        <p><strong>Input:</strong> {t.input}</p>
                        <p><strong>Expected:</strong> {t.expected}</p>
                        <p><strong>Output:</strong> {t.stdout}</p>
                        <p><strong>Status:</strong> {t.status}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No test results available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
