import React, { useState } from "react";
import { getReview } from "./api";

export default function AIReviewPanel({ challengeId, onClose }) {
  const [answer, setAnswer] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleReview() {
    try {
      setLoading(true);
      const data = await getReview(challengeId, answer);
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      setReview(parsed);
    } catch (err) {
      console.error("Error getting review", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-5 max-w-xl w-full">
        <h2 className="text-xl font-semibold mb-3">AI Review</h2>

        <textarea
          className="w-full border rounded p-2"
          rows={5}
          placeholder="Paste your solution here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <button
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleReview}
          disabled={loading || !answer.trim()}
        >
          {loading ? "Reviewing..." : "Get Review"}
        </button>

        {review && (
          <div className="mt-4 bg-gray-50 border rounded p-3">
            <h3 className="font-semibold mb-2">Issues</h3>
            <ul className="list-disc ml-6">
              {review.issues?.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>

            <p className="mt-3">
              <b>Suggested Fix:</b> {review.suggested_fix}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Confidence: {review.confidence}%
            </p>
          </div>
        )}

        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
