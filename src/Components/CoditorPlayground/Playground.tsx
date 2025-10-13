//v2
import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Download,
  RotateCcw,
  Terminal,
  Maximize2,
  Trash2,
  Columns2,
} from "lucide-react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

type Language = "html" | "react" | "vue";

interface ConsoleLog {
  type: "log" | "error" | "warn";
  message: string;
}

const PlaygroundComponent = () => {
  const [language, setLanguage] = useState<Language>("html");
  const [code, setCode] = useState<string>("");
  const [showOutput, setShowOutput] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setCode(getDefaultCode("html"));
  }, []);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "console") {
        setConsoleLogs((prev) => [
          ...prev,
          {
            type: event.data.method,
            message: event.data.message,
          },
        ]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getDefaultCode = (lang: Language): string => {
    switch (lang) {
      case "html":
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      margin: 0;
    }
    .card {
      background: rgba(255, 255, 255, 0.1);
      padding: 30px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }
    button {
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World!</h1>
    <button onclick="handleClick()">Click Me</button>
    <p id="output"></p>
  </div>
  
  <script>
    console.log('Page loaded!');
    
    function handleClick() {
      document.getElementById('output').textContent = 'Button clicked!';
      console.log('Button was clicked');
    }
  </script>
</body>
</html>`;

      case "react":
        return `function App() {
  const { useState, useEffect } = React;
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted!');
  }, []);

  const handleClick = () => {
    setCount(count + 1);
    console.log('Count:', count + 1);
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '40px',
      minHeight: '100vh',
      margin: 0
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1>React Counter</h1>
        <p style={{ fontSize: '24px' }}>Count: {count}</p>
        <button 
          onClick={handleClick}
          style={{
            background: 'white',
            color: '#667eea',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '15px'
          }}
        >
          Increment
        </button>
      </div>
    </div>
  );
}`;

      case "vue":
        return `<template>
  <div :style="containerStyle">
    <div :style="cardStyle">
      <h1>Vue Counter</h1>
      <p style="font-size: 24px;">Count: {{ count }}</p>
      <button @click="increment" :style="buttonStyle">
        Increment
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      containerStyle: {
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px',
        minHeight: '100vh',
        margin: 0
      },
      cardStyle: {
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      },
      buttonStyle: {
        background: 'white',
        color: '#667eea',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '15px'
      }
    }
  },
  mounted() {
    console.log('Component mounted!');
  },
  methods: {
    increment() {
      this.count++;
      console.log('Count:', this.count);
    }
  }
}
</script>`;

      default:
        return "";
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    const newCode = getDefaultCode(newLang);
    setLanguage(newLang);
    setCode(newCode);
    setShowOutput(false);
    setConsoleLogs([]);

    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        model.setValue(newCode);
      }
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const getConsoleCapture = () => {
    return `
    <script>
      ['log', 'error', 'warn'].forEach(method => {
        const original = console[method];
        console[method] = function(...args) {
          original.apply(console, args);
          window.parent.postMessage({
            type: 'console',
            method: method,
            message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
          }, '*');
        };
      });
    </script>`;
  };

  const executeHTML = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;

    if (doc) {
      const modifiedCode = code.replace(
        "</head>",
        getConsoleCapture() + "</head>"
      );
      doc.open();
      doc.write(modifiedCode);
      doc.close();
    }
  };

  const executeReact = async () => {
    if (!iframeRef.current) return;

    const Babel = await import("@babel/standalone");

    let transformedCode = "";
    try {
      // Remove import statements and transform JSX
      const codeWithoutImports = code.replace(
        /import\s+.*from\s+['"]react['"];?/g,
        ""
      );

      transformedCode =
        Babel.transform(codeWithoutImports, {
          presets: ["react"],
        }).code || "";
    } catch (err) {
      setConsoleLogs((prev) => [
        ...prev,
        {
          type: "error",
          message: `Babel Error: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        },
      ]);
      return;
    }

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;

    if (doc) {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <style>body { margin: 0; }</style>
  ${getConsoleCapture()}
</head>
<body>
  <div id="root"></div>
  <script>
    try {
      ${transformedCode}
      
      if (typeof App !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
      } else {
        console.error('App function not found');
      }
    } catch (err) {
      console.error('Runtime Error: ' + err.message);
      document.body.innerHTML = '<div style="padding: 20px; color: red; background: white;">' + err.message + '</div>';
    }
  </script>
</body>
</html>`;

      doc.open();
      doc.write(html);
      doc.close();
    }
  };

  const executeVue = () => {
    if (!iframeRef.current) return;

    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = code.match(/<script>([\s\S]*?)<\/script>/);

    const template = templateMatch
      ? templateMatch[1].trim()
      : "<div>No template</div>";
    const script = scriptMatch
      ? scriptMatch[1].trim().replace(/export\s+default\s+/, "")
      : "{}";

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;

    if (doc) {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <style>body { margin: 0; }</style>
  ${getConsoleCapture()}
</head>
<body>
  <div id="app"></div>
  <script>
    try {
      const { createApp } = Vue;
      const component = ${script};
      component.template = \`${template}\`;
      createApp(component).mount('#app');
    } catch (err) {
      console.error('Runtime Error: ' + err.message);
      document.body.innerHTML = '<div style="padding: 20px; color: red; background: white;">' + err.message + '</div>';
    }
  </script>
</body>
</html>`;

      doc.open();
      doc.write(html);
      doc.close();
    }
  };

  const handleRunCode = () => {
    setShowOutput(true);
    setConsoleLogs([]);

    setTimeout(() => {
      if (language === "html") {
        executeHTML();
      } else if (language === "react") {
        executeReact();
      } else if (language === "vue") {
        executeVue();
      }
    }, 100);
  };

  const handleDownload = () => {
    const extensions: Record<Language, string> = {
      html: "html",
      react: "jsx",
      vue: "vue",
    };

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    const newCode = getDefaultCode(language);
    setCode(newCode);
    setShowOutput(false);
    setConsoleLogs([]);

    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        model.setValue(newCode);
      }
    }
  };

  const getEditorLanguage = () => {
    if (language === "react") return "javascript";
    if (language === "vue") return "html";
    return "html";
  };

  return (
    <main className="w-full h-full flex flex-col  gap-y-3 md:gap-y-4 lg:gap-y-6 bg-color1  p-2 md:p-3 lg:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-2xl md:text-3xl text-color5 font-heading">
            Coditor Playground
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Dropdown
            value={language}
            options={[
              { value: "html", label: "HTML/CSS/JS" },
              { value: "react", label: "React (JSX)" },
              { value: "vue", label: "Vue" },
            ]}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="flex-1 md:flex-none h-9 sm:h-10 !rounded-lg !bg-color2 border sm:border-2 !border-color4 *:py-2 *:text-color1 *:text-sm"
            panelClassName="text-sm md:text-base font-content mt-2 rounded-lg"
          />
          <Button
            title="Change editor and output orientation"
            onClick={handleDownload}
            className="h-9 px-3 py-2 bg-transparent text-color5 rounded-lg border sm:border-2 border-color2 font-content transition-colors flex items-center gap-2"
          >
            <Columns2 size={16} />
            <span className="hidden 2xl:block">Orientation</span>
          </Button>
          <Button
            onClick={handleReset}
            className="h-9 px-4 py-2 bg-transparent text-color5 rounded-lg font-content border sm:border-2 border-color2 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:block">Reset</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 mdl:grid-cols-2 gap-4 min-h-0">
        {/* Editor */}
        <div className="flex flex-col gap-y-2 md:gap-y-3 overflow-hidden min-h-0">
          <div className="w-full flex flex-wrap items-center justify-between gap-x-10">
            <h2 className="text-lg xs:text-xl text-color4 font-subHeading select-none">
              Editor
            </h2>
            <div className="flex items-center gap-x-2">
              <Button
                onClick={handleRunCode}
                className="h-9 px-4 py-2 bg-color2 text-color5 text-sm sm:text-base rounded-lg font-content transition-colors flex items-center gap-2"
              >
                <Play size={16} />
                <span className="hidden sm:block">Run</span>
              </Button>
              <Button
                onClick={handleDownload}
                className="h-9 px-3 py-2 bg-transparent text-color4 rounded-lg border sm:border-2 border-color4 font-content transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                <span className="hidden 2xl:block">Download</span>
              </Button>
              <Button
                title="Maximise Editor View"
                onClick={handleDownload}
                className="h-9 px-3 py-2 bg-transparent text-color4 rounded-lg border sm:border-2 border-color4 font-content transition-colors flex items-center gap-2"
              >
                <Maximize2 size={16} />
                <span className="hidden 2xl:block">Maximise</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden min-h-0 bg-color2 rounded-2xl border border-color4">
            <Editor
              height="100%"
              language={getEditorLanguage()}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: "on",
                padding: { top: 16 },
              }}
              className="!rounded-2xl"
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col  gap-y-2 md:gap-y-3 overflow-hidden min-h-0">
          <div className="flex justify-between items-center">
            <h2 className="text-lg xs:text-xl text-color4 font-subHeading select-none">
              Output
            </h2>
            <div className="flex items-center gap-x-2">
              {consoleLogs.length > 0 && (
                <Button
                  onClick={() => setConsoleLogs([])}
                  className="h-9 px-4 py-2 bg-color2 text-color5 text-sm sm:text-base rounded-lg font-content transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:block">Clear Console</span>
                </Button>
              )}
              {showOutput && (
                <Button
                  title="Maximise Output View"
                  onClick={handleDownload}
                  className="h-9 px-3 py-2 bg-transparent text-color4 rounded-lg border sm:border-2 border-color4 font-content transition-colors flex items-center gap-2"
                >
                  <Maximize2 size={16} />
                  <span className="hidden 2xl:block">Maximise</span>
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-color2 rounded-2xl border border-color4">
            {/* Preview */}
            <div className="flex-1 min-h-0">
              {showOutput ? (
                <iframe
                  ref={iframeRef}
                  className="w-full h-full bg-white"
                  title="output"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
                  <p className="text-color4/60 font-content italic">
                    Click "Run" to see output
                  </p>
                  <Button
                    onClick={handleRunCode}
                    className="hidden mdl:flex h-9 px-4 py-2 bg-color4 text-color1 rounded-lg font-content transition-colors items-center gap-2"
                  >
                    <Play size={16} />
                    <span className="hidden sm:block">Run</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Console */}
            {consoleLogs.length > 0 && (
              <div className="h-32 border-t border-color2/30 bg-color1/50 overflow-y-auto flex-shrink-0">
                <div className="p-2 space-y-1">
                  {consoleLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`text-xs font-mono px-2 py-1 rounded flex items-start gap-2 ${
                        log.type === "error"
                          ? "text-red-400 bg-red-900/20"
                          : log.type === "warn"
                          ? "text-yellow-400 bg-yellow-900/20"
                          : "text-green-400 bg-green-900/20"
                      }`}
                    >
                      <Terminal className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlaygroundComponent;
