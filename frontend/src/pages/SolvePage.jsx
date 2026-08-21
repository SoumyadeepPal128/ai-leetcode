import { useState } from "react";
import { executeCode } from "../api/execute.js";
import Problem from "../components/Problem.jsx";
import Verdict from "../components/Verdict.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import LANGUAGES from "../constants/languages.js";

function SolvePage({ problem }) {
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(LANGUAGES[0].boilerplate);
  const [verdict, setVerdict] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("problem");

  function handleLanguageChange(newLangId) {
    const lang = LANGUAGES.find((l) => l.id === newLangId);
    setLanguage(newLangId);
    setCode(lang.boilerplate);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await executeCode(problem._id, code, language);
      setVerdict(result);
      setTab("verdict");
    } catch (err) {
      setError(err.message);
      setTab("verdict");
    } finally {
      setLoading(false);
    }
  }

  const currentLang = LANGUAGES.find((l) => l.id === language);

  return (
    <div className="flex h-screen bg-bg text-text">
      {/* Left panel */}
      <div className="w-1/2 border-r border-muted flex flex-col">
        <div className="flex border-b border-muted font-mono text-sm">
          <button
            onClick={() => setTab("problem")}
            className={`px-4 py-2 ${tab === "problem" ? "text-accent border-b-2 border-accent" : "text-muted"}`}
          >
            Problem
          </button>
          <button
            onClick={() => setTab("verdict")}
            className={`px-4 py-2 ${tab === "verdict" ? "text-accent border-b-2 border-accent" : "text-muted"}`}
          >
            Result
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "problem" ? (
            <Problem problem={problem} />
          ) : (
            <Verdict verdict={verdict} error={error} />
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-1/2 flex flex-col">
        <div className="flex items-center justify-between border-b border-muted px-4 py-2">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-black/40 text-text font-mono text-sm px-2 py-1 rounded outline-none border border-muted"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-hidden">
          <CodeEditor code={code} onChange={setCode} language={currentLang.monacoLang} />
        </div>

        <div className="p-4 border-t border-muted">
          <button
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            className="bg-accent text-bg px-4 py-2 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? "Running..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SolvePage;