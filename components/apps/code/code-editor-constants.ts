import type { ProjectData, TabConfig } from "./code-editor-types"

export const STORAGE_KEY = "code-editor-project"

export const DEFAULT_HTML = `<div class="container">
  <h1>Hello World</h1>
  <p>Start coding your project!</p>
  <button id="btn">Click me</button>
  <div id="output"></div>
</div>`

export const DEFAULT_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
}

h1 {
  color: #1a202c;
  margin-bottom: 0.5rem;
}

p {
  color: #718096;
  margin-bottom: 1rem;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.5);
}

button:active {
  transform: translateY(0);
}

#output {
  margin-top: 1rem;
  padding: 0.5rem;
  font-family: monospace;
  color: #667eea;
}`

export const DEFAULT_JS = `const btn = document.getElementById('btn');
const output = document.getElementById('output');
let count = 0;

btn.addEventListener('click', () => {
  count++;
  btn.textContent = \`Clicked \${count} time\${count === 1 ? '' : 's'}\`;
  console.log('Button clicked!', count);
});

// Try console methods:
console.log('Hello from the editor!');
console.info('This is an info message');
console.warn('This is a warning');`

export const BLANK_PROJECT: ProjectData = {
    html: DEFAULT_HTML,
    css: DEFAULT_CSS,
    javascript: DEFAULT_JS,
    lastModified: Date.now(),
}

export const TAB_CONFIG: TabConfig[] = [
    {
        id: "html",
        label: "HTML",
        language: "html",
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
    },
    {
        id: "css",
        label: "CSS",
        language: "css",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
    },
    {
        id: "javascript",
        label: "JS",
        language: "javascript",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
    },
]

export const MONACO_OPTIONS = {
    fontSize: 13,
    fontFamily: "'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', monospace",
    fontLigatures: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on" as const,
    lineNumbers: "on" as const,
    renderLineHighlight: "line" as const,
    bracketPairColorization: { enabled: true },
    autoClosingBrackets: "always" as const,
    autoClosingQuotes: "always" as const,
    formatOnPaste: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on" as const,
    folding: true,
    lineDecorationsWidth: 10,
    padding: { top: 12, bottom: 12 },
    smoothScrolling: true,
    cursorBlinking: "smooth" as const,
    cursorSmoothCaretAnimation: "on" as const,
}
