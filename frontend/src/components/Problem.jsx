function Problem({ problem }) {
  return (
    <div className="p-6 font-sans text-text overflow-y-auto h-full">
      <h1 className="text-xl font-bold font-mono mb-4">{problem.title}</h1>

      {}
      <p className="whitespace-pre-wrap leading-relaxed text-text">
        {problem.description}
      </p>

      {problem.testCases?.length > 0 && (
        <div className="mt-6">
          <h2 className="font-mono text-muted text-sm mb-2">Sample</h2>
          <div className="bg-black/30 rounded-lg p-3 font-mono text-sm">
            <p className="text-muted mb-1">Input:</p>
            <pre className="whitespace-pre-wrap mb-3">{problem.testCases[0].input}</pre>
            <p className="text-muted mb-1">Output:</p>
            <pre className="whitespace-pre-wrap">{problem.testCases[0].expectedOutput}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Problem;