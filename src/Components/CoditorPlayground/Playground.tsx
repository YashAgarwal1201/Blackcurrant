import { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Download,
  RotateCcw,
  Terminal,
  Trash2,
  Copy,
} from "lucide-react";
import { Dropdown } from "primereact/dropdown";
import GoBackBtn from "../../Layout/GoBackBtn";
import { Button } from "primereact/button";

type Language = "html" | "react" | "vue";
type ConsoleFilter = "all" | "log" | "warn" | "error";

interface ConsoleLog {
  type: "log" | "error" | "warn";
  message: string;
  timestamp: number;
  count: number;
}

let cachedBabelTransform:
  | ((code: string, opts: object) => { code: string | null })
  | null = null;

const LANGUAGE_OPTIONS = [
  { value: "html", label: "HTML / CSS / JS" },
  { value: "react", label: "React (JSX)" },
  { value: "vue", label: "Vue 3" },
];

const makeConsoleCapture = (runId: number) => `<script>
  (function(){
    var RUN_ID=${runId};
    ['log','error','warn'].forEach(function(m){
      var o=console[m];
      console[m]=function(){
        var args=Array.prototype.slice.call(arguments);
        o.apply(console,args);
        try{
          window.parent.postMessage({
            type:'console',method:m,runId:RUN_ID,
            message:args.map(function(a){
              return typeof a==='object'?JSON.stringify(a,null,2):String(a);
            }).join(' ')
          },'*');
        }catch(e){}
      };
    });
  })();
<\/script>`;

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(255,255,255,0.12);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 16px;
      padding: 32px;
      color: white;
      max-width: 400px;
      width: 100%;
    }
    h1 { font-size: 2rem; margin-bottom: 8px; }
    p  { opacity: 0.8; margin-bottom: 20px; }
    button {
      background: white;
      color: #667eea;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.85; }
    #output { margin-top: 16px; font-weight: 500; min-height: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World!</h1>
    <p>Edit this code and click Run to see changes.</p>
    <button onclick="handleClick()">Click Me</button>
    <p id="output"></p>
  </div>
  <script>
    console.log('Page loaded!');
    function handleClick() {
      document.getElementById('output').textContent = '✅ Button clicked!';
      console.log('Button was clicked');
    }
  <\/script>
</body>
</html>`;

const DEFAULT_REACT = `function App() {
  const { useState, useEffect } = React;
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    console.log('App mounted');
  }, []);

  const increment = () => {
    const next = count + 1;
    setCount(next);
    setHistory(h => [...h, next]);
    console.log('Count:', next);
  };

  const reset = () => {
    setCount(0);
    setHistory([]);
  };

  const styles = {
    body: {
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      margin: 0,
    },
    card: {
      background: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 16,
      padding: 32,
      color: 'white',
      maxWidth: 400,
      width: '100%',
    },
    btn: {
      background: 'white',
      color: '#667eea',
      border: 'none',
      padding: '10px 20px',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 15,
      fontWeight: 600,
      marginRight: 8,
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>React Counter</h1>
        <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '16px 0' }}>{count}</p>
        <div>
          <button style={styles.btn} onClick={increment}>+ Increment</button>
          <button style={{...styles.btn, background: 'rgba(255,255,255,0.2)', color: 'white'}} onClick={reset}>Reset</button>
        </div>
        {history.length > 0 && (
          <p style={{ marginTop: 16, opacity: 0.7, fontSize: 13 }}>
            History: {history.join(' → ')}
          </p>
        )}
      </div>
    </div>
  );
}`;

const DEFAULT_VUE = `<template>
  <div :style="styles.body">
    <div :style="styles.card">
      <h1 :style="{ fontSize: '2rem', marginBottom: '8px' }">Vue Counter</h1>
      <p :style="{ fontSize: '2.5rem', fontWeight: 700, margin: '16px 0' }">{{ count }}</p>
      <div>
        <button :style="styles.btn" @click="increment">+ Increment</button>
        <button :style="styles.btnGhost" @click="reset">Reset</button>
      </div>
      <p v-if="history.length" :style="{ marginTop: '16px', opacity: 0.7, fontSize: '13px' }">
        History: {{ history.join(' → ') }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      history: [],
      styles: {
        body: {
          fontFamily: 'system-ui, sans-serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          margin: 0,
        },
        card: {
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '16px',
          padding: '32px',
          color: 'white',
          maxWidth: '400px',
          width: '100%',
        },
        btn: {
          background: 'white',
          color: '#667eea',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: 600,
          marginRight: '8px',
        },
        btnGhost: {
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: 600,
        },
      },
    };
  },
  mounted() {
    console.log('Vue component mounted');
  },
  methods: {
    increment() {
      this.count++;
      this.history.push(this.count);
      console.log('Count:', this.count);
    },
    reset() {
      this.count = 0;
      this.history = [];
    },
  },
};
</script>`;

const PlaygroundComponent = () => {
  const [language, setLanguage] = useState<Language>("html");
  const [code, setCode] = useState<string>(DEFAULT_HTML);
  const [mobileTab, setMobileTab] = useState<"editor" | "output">("editor");
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [consoleFilter, setConsoleFilter] = useState<ConsoleFilter>("all");
  const [consoleHeight, setConsoleHeight] = useState<number>(180);
  const [pendingRun, setPendingRun] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);
  const codeRef = useRef<string>(DEFAULT_HTML);
  const languageRef = useRef<Language>("html");
  const runIdRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const getDefaultCode = useCallback((lang: Language): string => {
    if (lang === "html") return DEFAULT_HTML;
    if (lang === "react") return DEFAULT_REACT;
    return DEFAULT_VUE;
  }, []);

  // Build & run ────────

  const buildAndRun = useCallback(async (runId: number) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const capture = makeConsoleCapture(runId);
    const lang = languageRef.current;
    const src = codeRef.current;

    if (lang === "html") {
      iframe.srcdoc = src.replace("</head>", capture + "</head>");
      return;
    }

    if (lang === "vue") {
      const templateMatch = src.match(/<template>([\s\S]*?)<\/template>/);
      const scriptMatch = src.match(/<script>([\s\S]*?)<\/script>/);
      const template = templateMatch
        ? templateMatch[1].trim()
        : "<div>No template found</div>";
      const script = scriptMatch
        ? scriptMatch[1].trim().replace(/export\s+default\s+/, "")
        : "{}";

      iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"><\/script>
  <style>* { box-sizing: border-box; } body { margin: 0; }<\/style>
  ${capture}
</head>
<body>
  <div id="app"></div>
  <script>
    try {
      const { createApp } = Vue;
      const component = ${script};
      component.template = ${JSON.stringify(template)};
      createApp(component).mount('#app');
    } catch(e) {
      console.error('Runtime: ' + e.message);
      document.body.innerHTML = '<pre style="padding:16px;color:red;background:#fff1f0;margin:0;">' + e.message + '<\\/pre>';
    }
  <\/script>
</body>
</html>`;
      return;
    }

    if (lang === "react") {
      if (!cachedBabelTransform) {
        try {
          const Babel = await import("@babel/standalone");
          cachedBabelTransform = (s, opts) => Babel.transform(s, opts) as any;
        } catch {
          setConsoleLogs((prev) => [
            ...prev,
            {
              type: "error",
              message: "Failed to load Babel transformer",
              timestamp: Date.now(),
              count: 1,
            },
          ]);
          return;
        }
      }

      let transformed = "";
      try {
        const withoutImports = src
          .replace(/^import\s+.*from\s+['"][^'"]+['"];?\s*$/gm, "")
          .replace(/^import\s+['"][^'"]+['"];?\s*$/gm, "");
        transformed =
          cachedBabelTransform(withoutImports, { presets: ["react"] }).code ||
          "";
      } catch (err) {
        setConsoleLogs((prev) => [
          ...prev,
          {
            type: "error",
            message: `Babel: ${err instanceof Error ? err.message : "Unknown error"}`,
            timestamp: Date.now(),
            count: 1,
          },
        ]);
        return;
      }

      iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <style>* { box-sizing: border-box; } body { margin: 0; }<\/style>
  ${capture}
</head>
<body>
  <div id="root"></div>
  <script>
    try {
      ${transformed}
      if (typeof App !== 'undefined') {
        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
      } else {
        console.error('No App function found — define a function named App()');
      }
    } catch(e) {
      console.error('Runtime: ' + e.message);
      document.body.innerHTML = '<pre style="padding:16px;color:red;background:#fff1f0;margin:0;">' + e.message + '<\\/pre>';
    }
  <\/script>
</body>
</html>`;
    }
  }, []);

  // Actions

  const triggerRun = useCallback(() => {
    setConsoleLogs([]);
    setConsoleFilter("all");
    setHasRun(true);
    setMobileTab("output");
    setPendingRun(true);
  }, []);

  const handleLanguageChange = useCallback(
    (newLang: Language) => {
      const newCode = getDefaultCode(newLang);
      languageRef.current = newLang;
      codeRef.current = newCode;
      if (iframeRef.current) iframeRef.current.srcdoc = "";
      setLanguage(newLang);
      setCode(newCode);
      setConsoleLogs([]);
      setConsoleFilter("all");
      setHasRun(false);
      editorRef.current?.getModel()?.setValue(newCode);
    },
    [getDefaultCode],
  );

  const handleDownload = useCallback(() => {
    const ext: Record<Language, string> = {
      html: "html",
      react: "jsx",
      vue: "vue",
    };
    const blob = new Blob([codeRef.current], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext[languageRef.current]}`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleReset = useCallback(() => {
    const fresh = getDefaultCode(languageRef.current);
    codeRef.current = fresh;
    if (iframeRef.current) iframeRef.current.srcdoc = "";
    setCode(fresh);
    setConsoleLogs([]);
    setConsoleFilter("all");
    setHasRun(false);
    editorRef.current?.getModel()?.setValue(fresh);
  }, [getDefaultCode]);

  const handleCopy = useCallback((message: string, index: number) => {
    navigator.clipboard.writeText(message).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  }, []);

  // Drag-to-resize console ──

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      const startY = e.clientY;
      const startH = consoleHeight;

      const onMove = (ev: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const delta = startY - ev.clientY; // drag up → taller
        setConsoleHeight(Math.max(80, Math.min(520, startH + delta)));
      };
      const onUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener("mousemove", onMove);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp, { once: true });
    },
    [consoleHeight],
  );

  // Effects

  useEffect(() => {
    codeRef.current = DEFAULT_HTML;
    setCode(DEFAULT_HTML);
    setPendingRun(true);
  }, []);

  // Auto-scroll console to bottom on new logs
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLogs]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== "console") return;
      if (event.data.runId !== runIdRef.current) return;

      setConsoleLogs((prev) => {
        const last = prev[prev.length - 1];
        // Deduplicate consecutive identical messages
        if (
          last &&
          last.message === event.data.message &&
          last.type === event.data.method
        ) {
          return [...prev.slice(0, -1), { ...last, count: last.count + 1 }];
        }
        return [
          ...prev,
          {
            type: event.data.method as ConsoleLog["type"],
            message: event.data.message,
            timestamp: Date.now(),
            count: 1,
          },
        ];
      });
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // Window-level shortcut — fires when Monaco does NOT have focus
    const handleKeyDown = (e: KeyboardEvent) => {
      const inMonaco = (e.target as HTMLElement)?.closest?.(".monaco-editor");
      if (inMonaco) return; // Monaco handles its own shortcuts via addCommand
      if ((e.ctrlKey || e.metaKey) && (e.key === "Enter" || e.key === "s")) {
        e.preventDefault();
        triggerRun();
      }
      if (e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        triggerRun();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerRun]);

  // StrictMode-safe pendingRun effect
  useEffect(() => {
    if (!pendingRun) return;
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      const thisRunId = ++runIdRef.current;
      setPendingRun(false);
      await buildAndRun(thisRunId);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [pendingRun, buildAndRun]);

  // Derived

  const filteredLogs =
    consoleFilter === "all"
      ? consoleLogs
      : consoleLogs.filter((l) => l.type === consoleFilter);

  const logCounts = {
    log: consoleLogs.filter((l) => l.type === "log").length,
    warn: consoleLogs.filter((l) => l.type === "warn").length,
    error: consoleLogs.filter((l) => l.type === "error").length,
  };

  const getEditorLanguage = () =>
    language === "react" ? "javascript" : "html";

  const consoleRowStyle = (type: ConsoleLog["type"]) => {
    if (type === "error")
      return "text-rose-400 bg-rose-950/30 border-l-2 border-rose-500/50";
    if (type === "warn")
      return "text-amber-400 bg-amber-950/30 border-l-2 border-amber-500/50";
    return "text-emerald-400 border-l-2 border-transparent";
  };

  const consoleTypeIcon = (type: ConsoleLog["type"]) => {
    if (type === "error")
      return (
        <span className="text-rose-500 shrink-0 text-[10px] font-bold">
          ERR
        </span>
      );
    if (type === "warn")
      return (
        <span className="text-amber-500 shrink-0 text-[10px] font-bold">
          WRN
        </span>
      );
    return (
      <span className="text-emerald-600 shrink-0 text-[10px] font-bold">
        LOG
      </span>
    );
  };

  const formatTimestamp = (ts: number) =>
    new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const toolBtn =
    "px-3 flex items-center gap-1.5 text-sm text-base-content bg-base-200 border-transparent rounded-lg font-content";
  const toolBtnPrimary =
    "px-3 flex items-center gap-1.5 text-sm text-primary-content bg-primary border-transparent rounded-lg font-semibold font-content";

  return (
    <main className="w-full h-full flex flex-col bg-base-100">
      {/* Toolbar ─────*/}
      <div className="shrink-0 flex items-center gap-2 px-3 pt-3 pb-2 md:px-4 md:pt-4 flex-wrap">
        <div className="flex items-center gap-x-1 mr-1">
          <GoBackBtn />
          <h1 className="text-xl xs:text-2xl mdl:text-3xl text-primary font-heading select-none">
            Coditor
          </h1>
        </div>
        <div className="flex-1" />
        <Dropdown
          value={language}
          options={LANGUAGE_OPTIONS}
          onChange={(e) => handleLanguageChange(e.value as Language)}
          className="bg-base-200! border! border-neutral! rounded-lg! text-base-content text-sm"
          // panelClassName="bg-base-200 border border-neutral rounded-lg shadow-lg"

          // className="flex-1 h-10 bg-base-200! border! border-neutral! rounded-lg! text-base-content"
          panelClassName="bg-base-200 border border-neutral rounded-lg shadow-lg py-2 px-2 mt-2"
          itemTemplate={(value) => (
            <span className="text-base-content font-content">
              {value.label}
            </span>
          )}
          valueTemplate={(value) => {
            if (!value) {
              return (
                <span className="text-neutral-content font-content">
                  Select a string function
                </span>
              );
            }
            return (
              <span className="text-base-content font-content">
                {value.label}
              </span>
            );
          }}
        />
        <Button
          onClick={triggerRun}
          title="Run (Ctrl+Enter / Cmd+Enter)"
          className={toolBtnPrimary}
        >
          <Play size={16} />
          <span>Run</span>
        </Button>
        <Button
          onClick={handleDownload}
          title="Download file"
          className={toolBtn}
        >
          <Download size={16} />
          <span className="hidden sm:block">Download</span>
        </Button>
        <Button
          onClick={handleReset}
          title="Reset to default"
          className={toolBtn}
        >
          <RotateCcw size={16} />
          <span className="hidden sm:block">Reset</span>
        </Button>
      </div>

      {/* Mobile tab switcher ──*/}
      <div className="md:hidden shrink-0 px-3 pb-1">
        <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
          {(["editor", "output"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
                ${mobileTab === tab ? "bg-base-100 text-base-content shadow-sm" : "text-neutral-content"}`}
            >
              {tab === "output" ? "Output" : "Editor"}
              {tab === "output" && hasRun && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main panels ─*/}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 px-3 pb-0 md:px-4 md:pb-4">
        {/* Editor panel */}
        <div
          className={`flex-col min-h-0 gap-2 md:flex ${mobileTab === "editor" ? "flex" : "hidden"}`}
        >
          <div className="shrink-0 flex items-center justify-between">
            <span className="hidden md:block text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
              {/* {LANGUAGE_OPTIONS.find((o) => o.value === language)?.label} */}
              EDITOR
            </span>
            <span className="hidden lg:flex items-center gap-3 text-[11px] text-neutral-content/50 font-content select-none">
              <span>Ctrl+Enter · Run</span>
              <span>Ctrl+S · Run</span>
              <span>Shift+Enter · Run</span>
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden bg-base-200 rounded-xl md:rounded-2xl border border-neutral">
            <Editor
              height="100%"
              language={getEditorLanguage()}
              value={code}
              onChange={(v) => {
                const val = v || "";
                codeRef.current = val;
                setCode(val);
              }}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                // Register shortcuts directly in Monaco so they fire even when editor has focus
                editor.addCommand(
                  monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                  () => triggerRun(),
                );
                editor.addCommand(
                  monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                  () => triggerRun(),
                );
                editor.addCommand(
                  monaco.KeyMod.Shift | monaco.KeyCode.Enter,
                  () => triggerRun(),
                );
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineHeight: 20,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: "on",
                padding: { top: 12, bottom: 12 },
                wordWrap: "on",
                folding: true,
                bracketPairColorization: { enabled: true },
                renderLineHighlight: "gutter",
              }}
            />
          </div>
        </div>

        {/* Output panel */}
        <div
          className={`flex-col min-h-0 gap-2 md:flex ${mobileTab === "output" ? "flex" : "hidden"}`}
        >
          <div className="shrink-0 flex items-center justify-between">
            <span className="hidden md:block text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
              Preview
            </span>
          </div>

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-base-200 rounded-2xl border border-neutral">
            {/* Preview iframe */}
            <div className="flex-1 min-h-0 relative">
              <iframe
                ref={iframeRef}
                className={`w-full h-full bg-white transition-opacity duration-200 ${hasRun ? "opacity-100" : "opacity-0"}`}
                title="preview"
                sandbox="allow-scripts allow-forms"
              />
              {!hasRun && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <p className="text-neutral-content font-content italic text-sm">
                    Press Run to see your output
                  </p>
                  <button onClick={triggerRun} className={toolBtnPrimary}>
                    <Play size={14} />
                    Run
                  </button>
                </div>
              )}
            </div>

            {/* Console ────*/}
            {consoleLogs.length > 0 && (
              <>
                {/* Drag handle */}
                <div
                  onMouseDown={onDragStart}
                  title="Drag to resize console"
                  className="shrink-0 h-2 cursor-row-resize flex items-center justify-center group border-t border-neutral hover:border-primary/40 transition-colors"
                >
                  <div className="w-10 h-0.5 rounded-full bg-neutral-content/20 group-hover:bg-primary/50 transition-colors" />
                </div>

                {/* Console panel */}
                <div
                  style={{ height: consoleHeight }}
                  className="shrink-0 flex flex-col overflow-hidden bg-base-100"
                >
                  {/* Console header */}
                  <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 border-b border-neutral bg-base-200">
                    <Terminal
                      size={11}
                      className="text-neutral-content shrink-0"
                    />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-content font-content">
                      Console
                    </span>

                    {/* Filter tabs */}
                    <div className="flex items-center gap-0.5 ml-2">
                      {(["all", "log", "warn", "error"] as ConsoleFilter[]).map(
                        (f) => {
                          const count =
                            f === "all"
                              ? consoleLogs.length
                              : logCounts[f as keyof typeof logCounts];
                          const activeColor =
                            f === "error"
                              ? "bg-rose-500/20 text-rose-400"
                              : f === "warn"
                                ? "bg-amber-500/20 text-amber-400"
                                : f === "log"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-primary/20 text-primary";
                          return (
                            <button
                              key={f}
                              onClick={() => setConsoleFilter(f)}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide transition-colors flex items-center gap-1
                              ${consoleFilter === f ? activeColor : "text-neutral-content hover:text-base-content"}`}
                            >
                              {f}
                              {count > 0 && (
                                <span className="tabular-nums">{count}</span>
                              )}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <div className="flex-1" />

                    {/* Clear button */}
                    <button
                      onClick={() => {
                        setConsoleLogs([]);
                        setConsoleFilter("all");
                      }}
                      title="Clear console"
                      className="flex items-center gap-1 text-[10px] text-neutral-content hover:text-error transition-colors font-content"
                    >
                      <Trash2 size={11} />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  </div>

                  {/* Log entries */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredLogs.length === 0 ? (
                      <p className="text-[11px] text-neutral-content/50 italic text-center py-4 font-content">
                        No {consoleFilter} messages
                      </p>
                    ) : (
                      <div className="p-1.5 space-y-0.5">
                        {filteredLogs.map((log, i) => (
                          <div
                            key={i}
                            className={`group text-xs font-mono px-2 py-1.5 rounded flex items-start gap-2 ${consoleRowStyle(log.type)}`}
                          >
                            {/* Type badge */}
                            {consoleTypeIcon(log.type)}

                            {/* Timestamp */}
                            <span className="shrink-0 text-[10px] text-neutral-content/40 tabular-nums pt-px">
                              {formatTimestamp(log.timestamp)}
                            </span>

                            {/* Message */}
                            <span className="flex-1 break-all whitespace-pre-wrap leading-relaxed">
                              {log.message}
                            </span>

                            {/* Repeat count badge */}
                            {log.count > 1 && (
                              <span className="shrink-0 self-start mt-px text-[10px] bg-base-300 text-neutral-content px-1.5 py-0.5 rounded-full tabular-nums font-semibold">
                                ×{log.count}
                              </span>
                            )}

                            {/* Copy button — appears on row hover */}
                            <button
                              onClick={() => handleCopy(log.message, i)}
                              title="Copy to clipboard"
                              className="shrink-0 self-start mt-px opacity-0 group-hover:opacity-100 transition-opacity text-neutral-content hover:text-base-content"
                            >
                              {copiedIndex === i ? (
                                <span className="text-[10px] text-emerald-400 font-semibold">
                                  ✓
                                </span>
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>
                          </div>
                        ))}
                        <div ref={consoleEndRef} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlaygroundComponent;
