// src/Components/CoditorPlayground/Playground.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Play, Download, RotateCcw, Terminal, Trash2 } from "lucide-react";

import { Dropdown } from "primereact/dropdown";
// import useToastStore from "../../Services/Stores/toastMessageStore";
import GoBackBtn from "../../Layout/GoBackBtn";

type Language = "html" | "react" | "vue";

interface ConsoleLog {
  type: "log" | "error" | "warn";
  message: string;
}

/*
 * Cache the Babel transform function after the first load.
 * Original code did `import("@babel/standalone")` inside executeReact() on
 * every run — this triggers a fresh dynamic import each time, is slow,
 * and can fail in restricted environments. Caching it in a module-level
 * ref means it's loaded once and reused for all subsequent runs.
 */
let cachedBabelTransform:
  | ((code: string, opts: object) => { code: string | null })
  | null = null;

const LANGUAGE_OPTIONS = [
  { value: "html", label: "HTML / CSS / JS" },
  { value: "react", label: "React (JSX)" },
  { value: "vue", label: "Vue 3" },
];

const PlaygroundComponent = () => {
  // const showToast = useToastStore((state) => state.showToast);

  const [language, setLanguage] = useState<Language>("html");
  const [code, setCode] = useState<string>("");
  const [mobileTab, setMobileTab] = useState<"editor" | "output">("editor");
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);

  /*
   * FIX: Replace the fragile `setShowOutput(false) + setTimeout(100)` pattern.
   * The original toggled showOutput to false to unmount+remount the iframe,
   * then used a 100ms timeout hoping React had re-rendered by then.
   * On slow machines this race condition would cause the iframe to be
   * written before it was back in the DOM, silently failing.
   *
   * New approach: keep the iframe always mounted (avoids the remount cost),
   * use a `pendingRun` flag that a useEffect watches. When pendingRun is set,
   * the effect fires after the DOM is committed and safe to write into.
   */
  const [pendingRun, setPendingRun] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  // ── Default code templates ──────────────────────────────────────────────────

  const getDefaultCode = useCallback((lang: Language): string => {
    switch (lang) {
      case "html":
        return `<!DOCTYPE html>
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
  </script>
</body>
</html>`;

      case "react":
        return `function App() {
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

      case "vue":
        return `<template>
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

      default:
        return "";
    }
  }, []);

  // ── Init ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    const initial = getDefaultCode("html");
    setCode(initial);
    // Auto-run on mount so the output panel isn't blank on first load.
    // Real playgrounds (CodePen, StackBlitz) always show a live preview immediately.
    setPendingRun(true);
  }, []);

  // ── Console capture ────────────────────────────────────────────────────────

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "console") {
        setConsoleLogs((prev) => [
          ...prev,
          { type: event.data.method, message: event.data.message },
        ]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ── Keyboard shortcut: Ctrl/Cmd + Enter to run ─────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        triggerRun();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, language]);

  // ── Console injection snippet ───────────────────────────────────────────────

  const getConsoleCapture = () => `
  <script>
    ['log','error','warn'].forEach(method => {
      const orig = console[method];
      console[method] = function(...args) {
        orig.apply(console, args);
        window.parent.postMessage({
          type: 'console', method,
          message: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')
        }, '*');
      };
    });
  <\/script>`;

  // ── Execution engines ──────────────────────────────────────────────────────

  const executeHTML = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    const modified = code.replace("</head>", getConsoleCapture() + "</head>");
    doc.open();
    doc.write(modified);
    doc.close();
  }, [code]);

  const executeReact = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Load and cache Babel only once
    if (!cachedBabelTransform) {
      try {
        const Babel = await import("@babel/standalone");
        cachedBabelTransform = (src, opts) => Babel.transform(src, opts) as any;
      } catch {
        setConsoleLogs((prev) => [
          ...prev,
          { type: "error", message: "Failed to load Babel transformer" },
        ]);
        return;
      }
    }

    let transformed = "";
    try {
      const withoutImports = code.replace(
        /import\s+.*from\s+['"]react['"];?/g,
        "",
      );
      transformed =
        cachedBabelTransform(withoutImports, { presets: ["react"] }).code || "";
    } catch (err) {
      setConsoleLogs((prev) => [
        ...prev,
        {
          type: "error",
          message: `Babel: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
      ]);
      return;
    }

    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <style>* { box-sizing: border-box; } body { margin: 0; }<\/style>
  ${getConsoleCapture()}
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
</html>`);
    doc.close();
  }, [code]);

  const executeVue = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = code.match(/<script>([\s\S]*?)<\/script>/);

    const template = templateMatch
      ? templateMatch[1].trim()
      : "<div>No template found</div>";
    // FIX: Use JSON.stringify for the template string to safely escape backticks
    // and other special chars that would break the template literal injection.
    const templateJson = JSON.stringify(template);
    const script = scriptMatch
      ? scriptMatch[1].trim().replace(/export\s+default\s+/, "")
      : "{}";

    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>
  <style>* { box-sizing: border-box; } body { margin: 0; }<\/style>
  ${getConsoleCapture()}
</head>
<body>
  <div id="app"></div>
  <script>
    try {
      const { createApp } = Vue;
      const component = ${script};
      component.template = ${templateJson};
      createApp(component).mount('#app');
    } catch(e) {
      console.error('Runtime: ' + e.message);
      document.body.innerHTML = '<pre style="padding:16px;color:red;background:#fff1f0;margin:0;">' + e.message + '<\\/pre>';
    }
  <\/script>
</body>
</html>`);
    doc.close();
  }, [code]);

  // ── Run orchestration ──────────────────────────────────────────────────────

  const triggerRun = useCallback(() => {
    setConsoleLogs([]);
    setHasRun(true);
    setMobileTab("output");
    setPendingRun(true);
  }, []);

  /*
   * FIX: Watch pendingRun in a useEffect instead of using setTimeout.
   * useEffect fires after the DOM commit, so the iframe is guaranteed to be
   * in the document and ready to write into — no timing race.
   */
  useEffect(() => {
    if (!pendingRun) return;
    setPendingRun(false);
    if (language === "html") executeHTML();
    else if (language === "react") executeReact();
    else if (language === "vue") executeVue();
  }, [pendingRun, language, executeHTML, executeReact, executeVue]);

  // ── Language switch ─────────────────────────────────────────────────────────

  const handleLanguageChange = (newLang: Language) => {
    const newCode = getDefaultCode(newLang);
    setLanguage(newLang);
    setCode(newCode);
    setConsoleLogs([]);
    setHasRun(false);
    // Update Monaco editor model directly — avoids a redundant onChange cycle
    if (editorRef.current) {
      editorRef.current.getModel()?.setValue(newCode);
    }
  };

  // ── Download ───────────────────────────────────────────────────────────────

  const handleDownload = () => {
    const ext: Record<Language, string> = {
      html: "html",
      react: "jsx",
      vue: "vue",
    };
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Reset ──────────────────────────────────────────────────────────────────

  const handleReset = () => {
    const fresh = getDefaultCode(language);
    setCode(fresh);
    setConsoleLogs([]);
    setHasRun(false);
    editorRef.current?.getModel()?.setValue(fresh);
  };

  const getEditorLanguage = () =>
    language === "react" ? "javascript" : "html";

  const consoleColor = (type: ConsoleLog["type"]) => {
    if (type === "error") return "text-rose-400 bg-rose-950/40";
    if (type === "warn") return "text-amber-400 bg-amber-950/40";
    return "text-emerald-400 bg-emerald-950/40";
  };

  // ── Shared toolbar button style ─────────────────────────────────────────────
  const toolBtn =
    "h-9 px-3 flex items-center gap-1.5 text-sm text-base-content bg-base-200 border border-neutral rounded-lg font-content active:scale-95 transition-transform duration-100";
  const toolBtnPrimary =
    "h-9 px-4 flex items-center gap-1.5 text-sm text-primary-content bg-primary rounded-lg font-semibold font-content active:scale-95 transition-transform duration-100";

  return (
    <main className="w-full h-full flex flex-col bg-base-100">
      {/*
       * ── UNIFIED TOOLBAR ──
       *
       * Before: language dropdown in top-right of header row, Editor label
       * and Run/Download/Maximise in a separate second row — scattered and
       * hard to scan. Dead "Orientation" and "Maximise" buttons wasted space.
       *
       * Now: single compact toolbar with a clear left→right reading order:
       *   [← back] [title]   [language] [Run ▶] [Download] [Reset]
       *
       * Dead buttons removed. Run is primary (bg-primary), rest are ghost.
       * All utility actions in one place — no hunting across two rows.
       */}
      <div className="shrink-0 flex items-center gap-2 px-3 pt-3 pb-2 md:px-4 md:pt-4 flex-wrap">
        {/* Left: nav */}
        <div className="flex items-center gap-x-1 mr-1">
          <GoBackBtn />
          <h1 className="text-xl xs:text-2xl mdl:text-3xl text-primary font-heading select-none">
            Coditor
          </h1>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Language selector */}
        <Dropdown
          value={language}
          options={LANGUAGE_OPTIONS}
          onChange={(e) => handleLanguageChange(e.value as Language)}
          className="h-9 w-36 bg-base-200! border! border-neutral! rounded-lg! text-base-content text-sm"
          panelClassName="bg-base-200 border border-neutral rounded-lg shadow-lg"
        />

        {/* Run — primary CTA, always visible, Ctrl+Enter shortcut hinted in title */}
        <button
          onClick={triggerRun}
          title="Run code (Ctrl+Enter)"
          className={toolBtnPrimary}
        >
          <Play size={14} />
          <span>Run</span>
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          title="Download file"
          className={toolBtn}
        >
          <Download size={14} />
          <span className="hidden sm:inline">Download</span>
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          title="Reset to default code"
          className={toolBtn}
        >
          <RotateCcw size={14} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/*
       * ── MOBILE TAB SWITCHER ──
       * Same pattern as Strings/Numbers pages.
       * On mobile, editor and output each get the full remaining height.
       * A dot indicator on the Output tab shows when there's a live result.
       */}
      <div className="md:hidden shrink-0 px-3 pb-2">
        <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setMobileTab("editor")}
            className={`flex-1 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
              ${mobileTab === "editor" ? "bg-base-100 text-base-content shadow-sm" : "text-neutral-content"}`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("output")}
            className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
              ${mobileTab === "output" ? "bg-base-100 text-base-content shadow-sm" : "text-neutral-content"}`}
          >
            Output
            {hasRun && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/*
       * ── PANELS ──
       *
       * Desktop: side-by-side (md:grid-cols-2).
       * Mobile:  one panel at a time via mobileTab state.
       * flex-1 + min-h-0 ensures panels fill remaining height without overflow.
       */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3 px-3 pb-3 md:px-4 md:pb-4">
        {/* ── Editor panel ── */}
        <div
          className={`flex-col min-h-0 gap-2 md:flex ${mobileTab === "editor" ? "flex" : "hidden"}`}
        >
          {/* Editor toolbar — panel-level, not page-level */}
          <div className="shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/*
               * Language badge — shows active language inside the editor panel
               * so the user always knows what mode they're in without looking
               * at the top toolbar.
               */}
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
                {LANGUAGE_OPTIONS.find((o) => o.value === language)?.label}
              </span>
            </div>
            {/* Ctrl+Enter hint — subtle, disappears on tiny screens */}
            <span className="hidden lg:block text-[11px] text-neutral-content opacity-50 font-content">
              Ctrl + Enter to run
            </span>
          </div>

          {/* Monaco editor */}
          <div className="flex-1 min-h-0 overflow-hidden bg-base-200 rounded-2xl border border-neutral">
            <Editor
              height="100%"
              language={getEditorLanguage()}
              value={code}
              onChange={(v) => setCode(v || "")}
              onMount={(editor) => {
                editorRef.current = editor;
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

        {/* ── Output panel ── */}
        <div
          className={`flex-col min-h-0 gap-2 md:flex ${mobileTab === "output" ? "flex" : "hidden"}`}
        >
          {/* Output toolbar */}
          <div className="shrink-0 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-content font-content">
              Preview
            </span>
            {consoleLogs.length > 0 && (
              <button
                onClick={() => setConsoleLogs([])}
                className="flex items-center gap-1.5 text-xs text-neutral-content font-content active:scale-95 transition-transform"
              >
                <Trash2 size={12} />
                Clear console ({consoleLogs.length})
              </button>
            )}
          </div>

          {/*
           * Output area: iframe + console in a single rounded container.
           * The iframe is always in the DOM (never unmounted) — avoids the
           * remount cost and the timing race from the original setTimeout.
           * It's just blank until the first run, then gets written into.
           */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-base-200 rounded-2xl border border-neutral">
            {/* Preview iframe — always mounted */}
            <div className="flex-1 min-h-0 relative">
              <iframe
                ref={iframeRef}
                className={`w-full h-full bg-white transition-opacity duration-200 ${hasRun ? "opacity-100" : "opacity-0"}`}
                title="preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />

              {/* Empty state — overlays the iframe until first run */}
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

            {/*
             * ── Console panel ──
             * Fixed at the bottom of the output panel.
             * max-h-40 with overflow-y-auto so it doesn't consume too much space
             * but can show many logs. Scrolls independently from the preview.
             * Only shown when there are logs — doesn't take space otherwise.
             */}
            {consoleLogs.length > 0 && (
              <div className="shrink-0 max-h-40 overflow-y-auto border-t border-neutral bg-base-100">
                <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-neutral sticky top-0 bg-base-100 z-10">
                  <Terminal size={11} className="text-neutral-content" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-content font-content">
                    Console · {consoleLogs.length}
                  </span>
                </div>
                <div className="p-2 space-y-1">
                  {consoleLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`text-xs font-mono px-2 py-1 rounded flex items-start gap-2 ${consoleColor(log.type)}`}
                    >
                      <span className="opacity-50 shrink-0 select-none">
                        {i + 1}
                      </span>
                      <span className="break-all whitespace-pre-wrap">
                        {log.message}
                      </span>
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
