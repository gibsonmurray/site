import type { ProjectData } from "./code-editor-types"

export function generatePreviewHTML(project: ProjectData): string {
    const consoleOverride = `
    <script>
      (function() {
        const originalConsole = { ...console };
        ['log', 'warn', 'error', 'info'].forEach(type => {
          console[type] = function(...args) {
            originalConsole[type].apply(console, args);
            window.parent.postMessage({
              type: 'console',
              consoleType: type,
              content: args.map(arg => {
                try {
                  if (arg === null) return 'null';
                  if (arg === undefined) return 'undefined';
                  if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
                  return String(arg);
                } catch (e) { 
                  return String(arg); 
                }
              }).join(' '),
              timestamp: Date.now()
            }, '*');
          };
        });
        
        window.onerror = function(message, source, lineno, colno, error) {
          console.error(message + (lineno ? ' (line ' + lineno + ')' : ''));
          return true;
        };
        
        window.onunhandledrejection = function(event) {
          console.error('Unhandled Promise Rejection: ' + event.reason);
        };
      })();
    </script>`

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${consoleOverride}
  <style>
${project.css}
  </style>
</head>
<body>
${project.html}
  <script>
${project.javascript}
  </script>
</body>
</html>`
}

export function generateExportHTML(project: ProjectData): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <style>
${project.css}
  </style>
</head>
<body>
${project.html}
  <script>
${project.javascript}
  </script>
</body>
</html>`
}

export function downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 9)
}
