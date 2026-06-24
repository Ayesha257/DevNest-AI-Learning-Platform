// src/modules/challenges/ChallengePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getChallengeById,
  getHint,
  getReview,
  getExplanation,
  simpleRunCode, // <-- correct import
} from "./api";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-tomorrow_night";

export default function ChallengePage() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("# Type your Python solution here\n");

  const [showHints, setShowHints] = useState(false);

  const [aiHint, setAiHint] = useState(null);
  const [aiExplain, setAiExplain] = useState(null);

  const [runResult, setRunResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getChallengeById(id);
        setChallenge(data);
      } catch (err) {
        console.error("Failed to load challenge:", err);
      } finally {
        setLoading(false);
        setShowHints(false);
        setAiHint(null);
        setAiExplain(null);
        setRunResult(null);
        setReviewText("");
      }
    })();
  }, [id]);

  // ---------------- RUN HANDLER (simple-run) ----------------
  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);

    try {
      const examples = challenge.publicTests || [];

      const parsedTests = examples.map((line) => {
        const [call, expected] = line.split("->").map((s) => s.trim());
        const input = call.substring(call.indexOf("(") + 1, call.lastIndexOf(")"));
        return { input, expected };
      });

      let outputs = [];

      for (const test of parsedTests) {
        const result = await simpleRunCode({
          code,
          language: "python",
          stdin: test.input,
        });

        outputs.push({
          input: test.input,
          expected: test.expected,
          stdout: result.stdout || "",
          stderr: result.stderr || "",
          status: result.status || "Unknown",
        });
      }

      setRunResult(outputs);
      handleAIReview();
    } catch (err) {
      console.error("Run failed:", err);
      setRunResult([{ stderr: String(err), status: "Error" }]);
    } finally {
      setIsRunning(false);
    }
  };

  // ---------------- AI REVIEW ----------------
  const handleAIReview = async () => {
    setReviewLoading(true);
    setReviewText("");

    try {
      const res = await getReview(id, code);
      const text =
        typeof res === "string"
          ? res
          : res.review || res.feedback || JSON.stringify(res, null, 2);

      setReviewText(text);
    } catch (err) {
      console.error("Review error:", err);
      setReviewText("AI review failed.");
    } finally {
      setReviewLoading(false);
    }
  };

  // ---------------- AI HINT ----------------
  const handleAIHint = async () => {
    try {
      const res = await getHint(id);
      setAiHint(res);
    } catch (err) {
      console.error("AI Hint error:", err);
      setAiHint({ hint: "Could not fetch AI hint." });
    }
  };

  // ---------------- AI EXPLAIN ----------------
  const handleExplain = async () => {
    try {
      const res = await getExplanation(challenge.title);
      setAiExplain(res);
    } catch (err) {
      console.error("Explain error:", err);
      setAiExplain("Could not fetch explanation.");
    }
  };

  if (loading || !challenge) return <p className="p-10">Loading…</p>;

  return (
    <div className="w-full h-screen grid grid-cols-2">
      {/* LEFT SIDE — PROBLEM */}
      <div className="overflow-y-scroll p-6 border-r">
        <h1 className="text-4xl font-bold mb-2">{challenge.title}</h1>

        <p className="text-sm text-gray-700 mb-4">
          Difficulty: <b>{challenge.difficulty}</b>
        </p>

        <h2 className="text-lg font-semibold mb-1">Problem</h2>
        <p className="mb-4">{challenge.description}</p>

        {challenge.publicTests?.length > 0 && (
          <>
            <h3 className="text-md font-semibold mt-4 mb-1">Examples:</h3>
            <pre className="whitespace-pre-wrap text-sm">
              {challenge.publicTests.join("\n")}
            </pre>
          </>
        )}

        {challenge.topics?.length > 0 && (
          <>
            <h3 className="text-md font-semibold mt-4 mb-1">Topics:</h3>
            <ul className="list-disc ml-6 text-sm">
              {challenge.topics.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </>
        )}

        {showHints && challenge.hints?.length > 0 && (
          <>
            <h3 className="text-md font-semibold mt-4 mb-1">Hints:</h3>
            <ul className="list-disc ml-6 text-sm">
              {challenge.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </>
        )}

        {aiHint && (
          <div className="mt-4 p-3 bg-yellow-50 border rounded text-sm">
            <h3 className="font-semibold mb-1">AI Hint</h3>
            <p>{aiHint.hint}</p>
          </div>
        )}

        {aiExplain && (
          <div className="mt-4 p-3 bg-green-50 border rounded text-sm">
            <h3 className="font-semibold mb-1">AI Explanation</h3>
            <pre className="whitespace-pre-wrap">
              {typeof aiExplain === "string"
                ? aiExplain
                : JSON.stringify(aiExplain, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-3">Code (Python)</h2>

        <AceEditor
          mode="python"
          theme="tomorrow_night"
          name="big-code-console"
          width="100%"
          height="300px"
          value={code}
          onChange={setCode}
          fontSize={16}
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            useWorker: false,
            highlightActiveLine: true,
            showLineNumbers: true,
            tabSize: 4,
          }}
          style={{
            backgroundColor: "#000",
            borderRadius: "8px",
            padding: "10px",
          }}
        />

        {/* BUTTONS */}
        <div className="mt-4 flex gap-3 flex-wrap">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run"}
          </button>

          <button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed" disabled>
            Submit (coming soon)
          </button>

          <button
            className="px-4 py-2 bg-gray-700 text-white rounded"
            onClick={() => setShowHints((prev) => !prev)}
          >
            {showHints ? "Hide Hints" : "Show Hints"}
          </button>

          <button
            className="px-4 py-2 bg-orange-500 text-white rounded"
            onClick={handleAIHint}
          >
            AI Hint
          </button>

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded"
            onClick={handleAIReview}
            disabled={reviewLoading}
          >
            {reviewLoading ? "AI Reviewing..." : "AI Review"}
          </button>

          <button
            className="px-4 py-2 bg-teal-600 text-white rounded"
            onClick={handleExplain}
          >
            Explain
          </button>
        </div>

        {/* RUN OUTPUT */}
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Run Output</h3>

          {!runResult ? (
            <p className="text-sm text-gray-500">Press Run to execute.</p>
          ) : (
            <div className="space-y-4">
              {runResult.map((r, i) => (
                <div key={i} className="bg-black text-green-200 p-3 rounded text-sm">
                  <div className="text-yellow-300 font-bold">Test #{i + 1}</div>

                  <div><b>Input:</b> {r.input}</div>
                  <div><b>Expected:</b> {r.expected}</div>
                  <div><b>Status:</b> {r.status}</div>

                  {r.stdout && (
                    <>
                      <div className="mt-2 font-semibold">stdout:</div>
                      <pre>{r.stdout}</pre>
                    </>
                  )}

                  {r.stderr && (
                    <>
                      <div className="mt-2 font-semibold text-red-300">stderr:</div>
                      <pre>{r.stderr}</pre>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI REVIEW */}
        {reviewText && (
          <div className="mt-4">
            <h3 className="font-semibold mb-1">AI Review</h3>
            <div className="bg-white border p-3 rounded text-sm whitespace-pre-wrap">
              {reviewText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
