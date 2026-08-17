import axios from "axios";

const PISTON_URL = process.env.PISTON_API_URL || "http://localhost:2000/api/v2";

// Piston needs an exact language + version string per runtime.
// Confirm your local instance's exact versions with:
// curl.exe http://localhost:2000/api/v2/runtimes
const RUNTIMES = {
  python: { language: "python", version: "3.10.0" },
  javascript: { language: "node", version: "18.15.0" }, // also note: "node" not "javascript"
  cpp: { language: "c++", version: "10.2.0" },
};

/**
 * Runs one program with one stdin input via Piston's sandboxed execution API.
 * Handles both interpreted languages (python, javascript) and compiled
 * languages (c++) - compiled languages can fail at the COMPILE stage,
 * before ever reaching "run", so we check that first.
 *
 * @param {"python"|"javascript"|"cpp"} lang
 * @param {string} sourceCode
 * @param {string} stdin
 * @returns {Promise<{stdout: string, stderr: string, timedOut: boolean}>}
 */
const FILE_NAMES = {
  python: "main.py",
  javascript: "main.js",
  cpp: "main.cpp",
};

export async function runCode(lang, sourceCode, stdin = "") {
  const runtime = RUNTIMES[lang];
  if (!runtime) throw new Error(`Unsupported language: ${lang}`);

  const attempt = async () => {
    try {
      const { data } = await axios.post(`${PISTON_URL}/execute`, {
        language: runtime.language,
        version: runtime.version,
        files: [{ name: FILE_NAMES[lang], content: sourceCode }],
        stdin,
        run_timeout: 3000,
        compile_timeout: 10000,
      });

      if (data.compile && data.compile.code !== 0) {
        return { stdout: "", stderr: data.compile.stderr || "Compilation failed", timedOut: false };
      }

      const run = data.run || {};
      return {
        stdout: (run.stdout || "").trim(),
        stderr: (run.stderr || "").trim(),
        timedOut: run.signal === "SIGKILL",
      };
    } catch (err) {
      const pistonMessage = err.response?.data?.message;
      throw new Error(pistonMessage || err.message);
    }
  };

  let result = await attempt();

  // Retry once on an unexplained failure (empty stderr + not passed) -
  // likely transient resource contention on a local Piston instance,
  // not a real compile/logic error.
  if (result.timedOut || (result.stderr && !result.stdout)) {
    result = await attempt();
  }

  return result;
}

/**
 * Runs one program against many test cases, stopping at the first failure.
 * Used both to judge user submissions (execute controller) and to
 * validate a generated reference solution (generate controller).
 *
 * @param {"python"|"javascript"|"cpp"} lang
 * @param {string} sourceCode
 * @param {{input: string, expectedOutput: string}[]} testCases
 */
export async function runAgainstTestCases(lang, sourceCode, testCases) {
  const results = [];

  for (const tc of testCases) {
    const { stdout, stderr, timedOut } = await runCode(lang, sourceCode, tc.input);
    const passed = !timedOut && !stderr && stdout === tc.expectedOutput.trim();

    results.push({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: stdout,
      stderr,
      timedOut,
      passed,
    });

    if (!passed) break; // stop at first failure, like LeetCode does
  }

  const allPassed = results.length === testCases.length && results.every((r) => r.passed);
  return { allPassed, results };
}