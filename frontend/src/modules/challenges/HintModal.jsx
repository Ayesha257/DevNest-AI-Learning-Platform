import React, { useEffect, useState } from "react";
import { getHint } from "./api";

export default function HintModal({ challengeId, onClose }) {
  const [hintData, setHintData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getHint(challengeId);
        setHintData(data);
      } catch (err) {
        console.error("Error getting hint", err);
      }
    }
    load();
  }, [challengeId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-5 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-3">Hint</h2>
        {!hintData ? (
          <p>Loading hint...</p>
        ) : (
          <>
            <p>{hintData.hint}</p>
            <p className="mt-2 text-sm text-gray-500">
              Difficulty: {hintData.difficulty}
            </p>
          </>
        )}
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
