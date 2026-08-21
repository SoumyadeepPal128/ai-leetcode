import Editor from "@monaco-editor/react";

function CodeEditor({ code, onChange, language = "cpp" }) {
  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={(value) => onChange(value ?? "")}
      theme="vs-dark"
      options={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}

export default CodeEditor;