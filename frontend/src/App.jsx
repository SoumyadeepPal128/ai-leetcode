import { useState } from "react";
import GeneratePage from "./pages/GeneratePage.jsx";
import SolvePage from "./pages/SolvePage.jsx";

function App() {
  const [currentProblem, setCurrentProblem] = useState(null);

  return (
    <div className="min-h-screen bg-bg text-text font-mono">
      {!currentProblem ? (
        <GeneratePage onProblemGenerated={setCurrentProblem} />
      ) : (
        <pre className="p-8 text-sm whitespace-pre-wrap">
          <SolvePage problem={currentProblem}/>
        </pre>
      )}
    </div>
  );
}

export default App;