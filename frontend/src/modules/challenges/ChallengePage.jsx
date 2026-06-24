// src/modules/challenges/ChallengePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";
import { getChallengeById, getReview, runCode } from "./api";
import AceEditor from "react-ace";
import "../../components/CustomEditorTheme.css";

// ACE modes & theme
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow_night";

export default function ChallengePage() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");

  const [showHints, setShowHints] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  /* ============================================================
      LANGUAGE DEFAULT TEMPLATES
  ============================================================ */
  const getDefaultCode = (lang) => {
    switch (lang) {
      case "python":
        return `# Type your Python solution here

def solution(nums, target):
    # Write your code here
    pass
`;

      case "c":
        return `#include <stdio.h>
#include <stdlib.h>

// Type your C solution here
int* solution(int* nums, int numsSize, int target) {
    // Write your code here
    
}
`;

      case "cpp":
        return `#include <iostream>
#include <vector>
using namespace std;

// Type your C++ solution here
vector<int> solution(vector<int>& nums, int target) {
    // Write your code here
    
}
`;

      case "java":
        return `import java.util.*;

// Type your Java solution here
class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your code here
        
    }
}
`;

      case "javascript":
        return `// Type your JavaScript solution here
function solution(nums, target) {
    // Write your code here
    
}
`;

      default:
        return "# Type your solution here\n";
    }
  };

  /* ============================================================
      ACE MODE SELECTOR
  ============================================================ */
  const getAceMode = (language) => {
    switch (language) {
      case "cpp":
      case "c":
        return "c_cpp";
      case "java":
        return "java";
      case "javascript":
      case "js":
        return "javascript";
      default:
        return "python";
    }
  };

  /* ============================================================
      TEST CASE PARSER
  ============================================================ */
  const parseTestCase = (testCase, lang) => {
    const [callPart, expectedPart] = testCase.split("->");
    const call = (callPart || "").trim();
    const expected = (expectedPart || "").trim();

    const match = call.match(/(\w+)\(([^)]+)\)/);

    if (!match) return { call, expected, stdin: "", functionName: "" };

    const functionName = match[1];
    const args = match[2];

    switch (lang) {
      case "python":
        return { call: `${functionName}(${args})`, expected, stdin: "", functionName };

      case "cpp":
        const cppArgs = args.replace(/\[([^\]]+)\]/g, (match, arrayContent) => {
          return `{${arrayContent}}`;
        });
        return { call: `${functionName}(${cppArgs})`, expected, stdin: "", functionName };

      case "c":
        const cArgs = args.replace(/\[([^\]]+)\],\s*(\d+)/g, (match, arrayContent, target) => {
          const numbers = arrayContent.split(',').map(n => n.trim());
          return `(int[]){${arrayContent}}, ${numbers.length}, ${target}`;
        });
        return { call: `${functionName}(${cArgs})`, expected, stdin: "", functionName };

      case "java":
        const javaArgs = args.replace(/\[([^\]]+)\],\s*(\d+)/g, (match, arrayContent, target) => {
          return `new int[]{${arrayContent}}, ${target}`;
        });
        return { call: `new Solution().${functionName}(${javaArgs})`, expected, stdin: "", functionName };

      case "javascript":
        return { call: `${functionName}(${args})`, expected, stdin: "", functionName };

      default:
        return { call, expected, stdin: "", functionName };
    }
  };

  /* ============================================================
      LOAD CHALLENGE
  ============================================================ */
  useEffect(() => {
    (async () => {
      try {
        const data = await getChallengeById(id);
        setChallenge(data);
        setCode(getDefaultCode("python"));
      } catch (err) {
        console.error("Failed to load challenge:", err);
      } finally {
        setLoading(false);
        setShowHints(false);
        setRunResult(null);
        setReviewText("");
        setSubmitMessage("");
      }
    })();
  }, [id]);

  useEffect(() => {
    setCode(getDefaultCode(language));
  }, [language]);

  /* ============================================================
      AUTO AI REVIEW (Debounced)
  ============================================================ */
  useEffect(() => {
    if (!challenge || !code.trim()) return;

    const debouncedReview = debounce(async () => {
      try {
        setReviewLoading(true);

        const res = await getReview({
          userId: "guest-user",
          code,
          language,
          question: challenge.description || challenge.title,
        });

        if (res.error) setReviewText(`Error: ${res.error}`);
        else {
          const text =
            typeof res === "string"
              ? res
              : res.review || res.feedback || JSON.stringify(res, null, 2);
          setReviewText(text);
        }
      } catch (err) {
        console.error("Auto review error:", err);
        setReviewText("Error getting AI review");
      } finally {
        setReviewLoading(false);
      }
    }, 1200);

    debouncedReview();
    return () => debouncedReview.cancel();
  }, [code, challenge, language]);

  const buildHarness = (language, testCase) => {
    const { call, functionName } = testCase;

    // ==================== PYTHON ====================
    if (language === "python") {
      if (functionName === "binary_search" || functionName === "fib") {
        return `
if __name__ == "__main__":
    result = ${call}
    print(result)
`;
      }
      if (functionName === "two_sum") {
        return `
if __name__ == "__main__":
    result = ${call}
    print('[' + ','.join(map(str, result)) + ']')
`;
      }
      
      // DEFAULT CASE FOR PYTHON
      return `
if __name__ == "__main__":
    result = ${call}
    if isinstance(result, list):
        print('[' + ','.join(map(str, result)) + ']')
    else:
        print(result)
`;
    }

    // ==================== C++ ====================
    if (language === "cpp") {
      if (functionName === "binary_search" || functionName === "fib") {
        return `
#include <iostream>
using namespace std;

int main() {
    int result = ${call};
    cout << result << endl;
    return 0;
}
`;
      }
      if (functionName === "two_sum") {
    // Extract the array and target from the call
    const argsMatch = call.match(/two_sum\(\{([^}]+)\},\s*(\d+)\)/);
    if (argsMatch) {
      const arrayContent = argsMatch[1];
      const target = argsMatch[2];
      
      return `
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {${arrayContent}};
    vector<int> result = twoSum(nums, ${target});
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}
`;
    }
  }
      
      // DEFAULT CASE FOR C++
      return `
#include <iostream>
using namespace std;

int main() {
    auto result = ${call};
    cout << result << endl;
    return 0;
}
`;
    }

    // ==================== C ====================
    if (language === "c") {
      if (functionName === "binary_search" || functionName === "fib") {
        return `
#include <stdio.h>

int main() {
    int result = ${call};
    printf("%d\\n", result);
    return 0;
}
`;
      }
      if (functionName === "two_sum") {
        return `
#include <stdio.h>
#include <stdlib.h>

int main() {
    int* result = ${call};
    printf("[%d,%d]\\n", result[0], result[1]);
    free(result);
    return 0;
}
`;
      }
      
      // DEFAULT CASE FOR C
      return `
#include <stdio.h>

int main() {
    int result = ${call};
    printf("%d\\n", result);
    return 0;
}
`;
    }

    // ==================== JAVA ====================
    if (language === "java") {
      // Extract the actual function call from the test case
      let javaCall = call;
      
      // Remove 'new Solution().' if present
      if (call.includes('new Solution().')) {
        javaCall = call.replace('new Solution().', '');
      }
      
      if (functionName === "binary_search") {
        // Extract arguments from the call for binary_search
        const argsMatch = call.match(/binary_search\(([^)]+)\)/);
        const args = argsMatch ? argsMatch[1] : '';
        
        // Use camelCase version for Java
        return `
public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int result = solution.binarySearch(${args});
        System.out.println(result);
    }
}
`;
      }
      
      if (functionName === "fib") {
        // Extract the argument
        const argMatch = javaCall.match(/fib\(([^)]+)\)/);
        const arg = argMatch ? argMatch[1] : '';
        
        return `
public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int result = solution.fib(${arg});
        System.out.println(result);
    }
}
`;
      }
      
      if (functionName === "two_sum") {
        // Extract arguments
        const argsMatch = javaCall.match(/two_sum\(([^)]+)\)/);
        const args = argsMatch ? argsMatch[1] : '';
        
        // Use camelCase version for Java
        return `
public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] result = solution.twoSum(${args});
        System.out.println("[" + result[0] + "," + result[1] + "]");
    }
}
`;
      }
      
      // DEFAULT CASE FOR JAVA
      return `
public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        Object result = solution.${javaCall};
        System.out.println(result.toString());
    }
}
`;
    }

    // ==================== JAVASCRIPT ====================
    if (language === "javascript") {
      // Convert snake_case to camelCase for JavaScript convention
      let jsCall = call;
      
      if (functionName === "binary_search") {
        // Replace binary_search with binarySearch in the call
        jsCall = call.replace('binary_search', 'binarySearch');
        
        return `
${code}

const result = ${jsCall};
console.log(result);
`;
      }
      
      if (functionName === "fib") {
        return `
${code}

const result = ${call};
console.log(result);
`;
      }
      
      if (functionName === "two_sum") {
        // Replace two_sum with twoSum in the call
        jsCall = call.replace('two_sum', 'twoSum');
        
        return `
${code}

const result = ${jsCall};
console.log(JSON.stringify(result));
`;
      }
      
      // DEFAULT CASE FOR JAVASCRIPT
      return `
${code}

const result = ${call};
if (Array.isArray(result)) {
    console.log(JSON.stringify(result));
} else {
    console.log(result);
}
`;
    }

    return "";
  };

  /* ============================================================
      RUN CODE
  ============================================================ */
  const handleRun = async () => {
    if (!challenge) return;

    setIsRunning(true);
    setRunResult(null);

    try {
      const examples = challenge.publicTests || [];
      const parsedTests = examples.map((line) => parseTestCase(line, language));

      let results = [];

      for (const testCase of parsedTests) {
        const harness = buildHarness(language, testCase);
        const fullCode = language === "javascript" ? harness : code + harness;

        const result = await runCode({
          code: fullCode,
          language,
          stdin: testCase.stdin,
        });

        results.push({
          input: testCase.call,
          expected: testCase.expected,
          stdout: (result.stdout || "").trim(),
          stderr: result.stderr || "",
          compile_output: result.compile_output || "",
          status: result.status || (result.status_id === 3 ? "Accepted" : "Error"),
          status_id: result.status_id,
          time: result.time,
          memory: result.memory,
        });
      }

      setRunResult(results);
    } catch (err) {
      console.error("Run error:", err);
      setRunResult([
        {
          stderr: String(err),
          status: "Error",
          input: "",
          expected: "",
          stdout: "",
          compile_output: "",
          status_id: -1,
          time: null,
          memory: null,
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  /* ============================================================
      SUBMIT SOLUTION
  ============================================================ */
  const handleSubmit = async () => {
    if (!challenge || !code.trim()) {
      setSubmitMessage("❌ Please write some code before submitting!");
      return setTimeout(() => setSubmitMessage(""), 3000);
    }

    if (!runResult || runResult.length === 0) {
      setSubmitMessage("⚠️ Please run your code first!");
      return setTimeout(() => setSubmitMessage(""), 3000);
    }

    const allTestsPassed = runResult.every(
      (r) => r.stdout && r.expected && r.stdout.trim() === r.expected.trim()
    );

    if (!allTestsPassed) {
      setSubmitMessage("❌ All tests must pass before submission. Fix code and try again.");
      return setTimeout(() => setSubmitMessage(""), 4000);
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        user_name: "Mohsin",
        challenge_id: challenge._id || id,
        challenge_title: challenge.title,
        difficulty: challenge.difficulty,
        topics: challenge.topics || [],
        code,
        language,
        test_results: runResult,
        all_tests_passed: true,
        submitted_at: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:8000/api/user-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Submission failed");
      }

      setSubmitMessage("🎉 Submission successful!");
      setTimeout(() => setSubmitMessage(""), 3000);
    } catch (err) {
      setSubmitMessage(`❌ Submission failed: ${err.message}`);
      setTimeout(() => setSubmitMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================================
      RENDER UI
  ============================================================ */
  if (loading || !challenge) {
    return (
      <div className="p-10 bg-slate-900 text-white min-h-screen">
        Loading…
      </div>
    );
  }

  /* ============================================================
      MAIN PAGE LAYOUT - EVERYTHING ON LEFT SIDE
  ============================================================ */
  return (
    <div className="bg-slate-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        
       {/* Title Card */}
<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6 shadow-lg">
  <h1 className="text-4xl font-bold drop-shadow-sm mb-3">{challenge.title}</h1>
  <div className={`inline-block px-5 py-2 rounded-full font-bold text-lg backdrop-blur-sm ${
    challenge.difficulty === "easy" ? "bg-green-500/20" :
    challenge.difficulty === "medium" ? "bg-yellow-500/20" :
    "bg-red-500/20"
  }`}>
    {challenge.difficulty?.toUpperCase()}
  </div>
</div>

        {/* Problem Statement - NO BORDER */}
        <section className="bg-slate-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
            PROBLEM STATEMENT
          </h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
            {challenge.description.toUpperCase()}
          </p>
        </section>

        {/* Examples - NO BORDER */}
        <section className="bg-slate-800/50 rounded-xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
            EXAMPLES
          </h3>
          <pre className="text-base text-green-200 font-mono bg-slate-900 p-5 rounded-lg leading-relaxed">
            {challenge.publicTests.join("\n").toUpperCase()}
          </pre>
        </section>

        {/* Topics - NO BORDER */}
        <section className="bg-slate-800/50 rounded-xl p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
            TOPICS
          </h3>
          <div className="flex flex-col gap-3">
            {challenge.topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
                <span className="bg-slate-700 text-cyan-300 px-5 py-3 rounded-lg text-lg flex-1 font-medium">
                  {topic.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Hints - NO BORDER */}
        {showHints && (
          <section className="bg-slate-800/50 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
              Hints
            </h3>
            <ul className="list-disc ml-8 text-gray-300 space-y-3 text-lg">
              {challenge.hints.map((h, i) => (
                <li key={i} className="leading-relaxed">{h}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Language Selector */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-300">Language:</span>
          <select
            className="border border-slate-600 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500 text-lg"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        {/* Code Editor */}
        <div className="mb-6">
          <AceEditor
            mode={getAceMode(language)}
            theme="custom-theme"
            name="big-editor"
            width="100%"
            height="400px"
            value={code}
            onChange={setCode}
            fontSize={18}
            showPrintMargin={false}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 4,
            }}
            className="ace-custom-theme"
            style={{
              backgroundColor: "#4d91aeff",
              borderRadius: "8px",
              padding: "12px",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-600 flex items-center gap-2 text-lg font-semibold"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Running…
              </>
            ) : (
              <>
                <span className="text-xl">▶</span> Run
              </>
            )}
          </button>

          <button
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-lg font-semibold"
            onClick={() => setShowHints(!showHints)}
          >
            <span className="text-xl">💡</span>
            {showHints ? "Hide Hints" : "Show Hints"}
          </button>

          <button
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-600 flex items-center gap-2 text-lg font-semibold"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting…
              </>
            ) : (
              <>
                <span className="text-xl">🚀</span> Submit
              </>
            )}
          </button>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`mb-6 p-4 rounded-lg text-lg font-semibold ${
            submitMessage.includes("successful") || submitMessage.includes("🎉")
              ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
              : submitMessage.includes("⚠️")
              ? "bg-amber-900/50 text-amber-300 border border-amber-700"
              : "bg-red-900/50 text-red-300 border border-red-700"
          }`}>
            {submitMessage}
          </div>
        )}

        {/* AI Review - WITH BORDER (KEPT) */}
        <div className="mb-6 bg-slate-800 border border-slate-700 p-5 rounded-xl shadow">
          <h3 className="font-bold mb-3 text-white flex items-center gap-2 text-lg">
            <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
            AI Review
          </h3>

          {reviewLoading ? (
            <div className="flex items-center justify-center h-32 bg-slate-900/50 rounded-lg border border-slate-600">
              <p className="text-gray-400 flex items-center gap-2 text-lg">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Analyzing your code…
              </p>
            </div>
          ) : reviewText ? (
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-gray-200 whitespace-pre-wrap font-mono">
              {reviewText}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-slate-900/50 rounded-lg border border-slate-600">
              <p className="text-gray-400">No review available</p>
            </div>
          )}
        </div>

        {/* Run Output - WITH BORDER (KEPT) */}
        <div className="mb-6">
          <h3 className="font-bold mb-3 text-white flex items-center gap-2 text-lg">
            <span className="w-3 h-3 bg-green-400 rounded-full"></span>
            Run Output
          </h3>

          {!runResult ? (
            <p className="text-lg text-gray-400">Press Run to execute your code.</p>
          ) : (
            <div className="space-y-4">
              {runResult.map((r, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 text-green-200 p-5 rounded-xl text-lg">
                  <div className="text-amber-300 font-bold mb-3 text-xl">Test #{i + 1}</div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <b className="text-gray-300">Input:</b>
                      <span className="text-cyan-300"> {r.input}</span>
                    </div>
                    <div>
                      <b className="text-gray-300">Expected:</b>
                      <span className="text-emerald-300"> {r.expected}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <b className="text-gray-300">Status:</b>{" "}
                    <span className={
                      r.status_id === 3 ? "text-emerald-400" :
                      r.status_id === 6 ? "text-red-400" :
                      r.status_id === 5 ? "text-amber-400" :
                      r.status_id === 4 ? "text-purple-400" :
                      "text-red-400"
                    }>
                      {r.status}
                    </span>
                  </div>

                  {r.time && r.memory && (
                    <div className="grid grid-cols-2 gap-4 text-base text-gray-400 mb-4">
                      <div><b>Time:</b> {r.time}s</div>
                      <div><b>Memory:</b> {r.memory}KB</div>
                    </div>
                  )}

                  {r.stdout && (
                    <>
                      <div className="font-semibold text-gray-300 mt-3">stdout:</div>
                      <pre className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-green-300 mt-2">
                        {r.stdout}
                      </pre>
                    </>
                  )}

                  {r.stderr && (
                    <>
                      <div className="font-semibold text-red-300 mt-3">stderr:</div>
                      <pre className="bg-red-900/20 p-4 rounded-lg border border-red-800 text-red-300 mt-2">
                        {r.stderr}
                      </pre>
                    </>
                  )}

                  {r.compile_output && (
                    <>
                      <div className="font-semibold text-amber-300 mt-3">compile_output:</div>
                      <pre className="bg-amber-900/20 p-4 rounded-lg border border-amber-800 text-amber-300 mt-2">
                        {r.compile_output}
                      </pre>
                    </>
                  )}

                  {r.stdout && r.expected && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <span className={
                        r.stdout.trim() === r.expected.trim()
                          ? "text-emerald-400 font-bold text-xl"
                          : "text-red-400 font-bold text-xl"
                      }>
                        {r.stdout.trim() === r.expected.trim() ? "✅ PASS" : "❌ FAIL"}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Summary */}
              <div className="bg-slate-800 border border-slate-700 text-white p-5 rounded-xl text-lg">
                <div className="font-bold text-xl mb-3 text-cyan-300">Summary</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <b>Tests Passed:</b>{" "}
                    {runResult.filter((r) => r.stdout && r.expected && r.stdout.trim() === r.expected.trim()).length} / {runResult.length}
                  </div>
                  <div>
                    <b>Overall Status:</b>{" "}
                    {runResult.every((r) => r.stdout && r.expected && r.stdout.trim() === r.expected.trim()) ? (
                      <span className="text-emerald-400 text-xl">🎉 All Tests Passed!</span>
                    ) : (
                      <span className="text-red-400 text-xl">❌ Some Tests Failed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}