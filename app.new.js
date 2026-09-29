const tools = [
  { id: "json", name: "JSON Formatter", description: "Format, validate, and minify JSON in a couple of clicks.", category: "Data", icon: "{ }", tone: "violet" },
  { id: "base64", name: "Base64 Encoder", description: "Encode text to Base64 or decode it back to plain text.", category: "Encoding", icon: "64", tone: "blue" },
  { id: "jwt", name: "JWT Decoder", description: "Inspect a token's header and payload. No verification is performed.", category: "Encoding", icon: "⌑", tone: "orange" },
  { id: "regex", name: "Regex Tester", description: "Try a regular expression and inspect every match.", category: "Web", icon: ".*", tone: "pink" },
  { id: "timestamp", name: "Timestamp Converter", description: "Convert Unix timestamps and readable dates instantly.", category: "Data", icon: "◷", tone: "green" },
  { id: "url", name: "URL Encoder", description: "Encode or decode URL components safely.", category: "Encoding", icon: "%", tone: "teal" },
  { id: "uuid", name: "UUID Generator", description: "Generate random UUID v4 identifiers for your projects.", category: "Web", icon: "◇", tone: "violet" },
  { id: "hash", name: "Hash Generator", description: "Create a SHA-256 hash from text using your browser.", category: "Data", icon: "#", tone: "blue" },
  { id: "csv-json", name: "CSV to JSON", description: "Turn spreadsheet rows into structured JSON objects.", category: "Data", icon: "⇄", tone: "green" },
  { id: "json-csv", name: "JSON to CSV", description: "Flatten arrays of objects into comma-separated data.", category: "Data", icon: "▤", tone: "green" },
  { id: "text-case", name: "Text Case", description: "Uppercase, lowercase, title case, or sentence case your text.", category: "Data", icon: "Aa", tone: "blue" },
  { id: "word-counter", name: "Word Counter", description: "Measure words, characters, and line counts in one pass.", category: "Data", icon: "W", tone: "violet" },
  { id: "char-counter", name: "Character Counter", description: "Count characters, spaces, and letters in any snippet.", category: "Data", icon: "C", tone: "teal" },
  { id: "slugify", name: "Slug Generator", description: "Create clean URL-friendly slugs from titles or names.", category: "Web", icon: "-", tone: "pink" },
  { id: "sort-lines", name: "Sort Lines", description: "Alphabetize each line or reverse the order instantly.", category: "Data", icon: "⇅", tone: "green" },
  { id: "dedupe", name: "Deduplicator", description: "Remove repeated lines and keep only the unique entries.", category: "Data", icon: "✓", tone: "orange" },
  { id: "markdown-preview", name: "Markdown Preview", description: "Render a lightweight markdown sample without leaving the page.", category: "Web", icon: "M", tone: "blue" },
  { id: "diff", name: "Diff Checker", description: "Compare two text blocks and highlight the differences.", category: "Web", icon: "≠", tone: "violet" },
  { id: "color-converter", name: "Color Converter", description: "Flip between hex and RGB color values in a click.", category: "Web", icon: "◉", tone: "orange" },
  { id: "lorem-ipsum", name: "Lorem Ipsum", description: "Generate placeholder text for mockups and prototypes.", category: "Web", icon: "L", tone: "pink" },
  { id: "password-generator", name: "Password Generator", description: "Create secure passwords with a custom length and complexity.", category: "Web", icon: "✦", tone: "teal" },
  { id: "morse-code", name: "Morse Code", description: "Translate text to and from Morse code quickly.", category: "Encoding", icon: "•—", tone: "blue" },
  { id: "html-entities", name: "HTML Entities", description: "Escape or unescape HTML so your markup stays valid.", category: "Encoding", icon: "&", tone: "violet" },
  { id: "binary-converter", name: "Binary Converter", description: "Convert plain text to binary or decode binary back to text.", category: "Encoding", icon: "01", tone: "green" },
  { id: "hex-converter", name: "Hex Converter", description: "Convert text to hexadecimal and back again.", category: "Encoding", icon: "0x", tone: "teal" },
  { id: "url-parser", name: "URL Parser", description: "Break down a URL into its hostname, path, and query parts.", category: "Web", icon: "◎", tone: "orange" },
  { id: "json-compare", name: "JSON Compare", description: "Compare two JSON payloads and flag structural differences.", category: "Data", icon: "⇔", tone: "violet" },
  { id: "line-numbering", name: "Line Numbering", description: "Add numbering to blocks of text without modifying the content.", category: "Data", icon: "1", tone: "blue" },
  { id: "checksum", name: "Checksum Tool", description: "Generate SHA-1 and SHA-256 checksums from text.", category: "Data", icon: "Σ", tone: "green" },
  { id: "emoji-formatter", name: "Emoji Formatter", description: "Normalize emoji aliases into readable Unicode characters.", category: "Web", icon: "☺", tone: "pink" }
];

const grid = document.querySelector("#tool-grid");
const searchInput = document.querySelector("#tool-search");
const homeView = document.querySelector("#home-view");
const toolView = document.querySelector("#tool-view");
const toast = document.querySelector("#toast");
let selectedCategory = "All";
let toastTimeout;

function renderTools() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = tools.filter((tool) => {
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    const matchesQuery = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  grid.innerHTML = filtered.map((tool) => `
    <button class="tool-card" type="button" data-tool="${tool.id}" aria-label="Open ${tool.name}">
      <div class="card-top"><span class="tool-icon icon-${tool.tone}">${tool.icon}</span><span class="card-arrow">↗</span></div>
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <div class="card-category">${tool.category} utility</div>
    </button>
  `).join("");

  document.querySelector("#empty-state").hidden = filtered.length > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2100);
}

async function copyText(text) {
  if (!text) {
    showToast("Nothing to copy yet");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  } catch {
    showToast("Clipboard access is unavailable in this browser");
  }
}

function setActiveNav(category) {
  document.querySelectorAll(".nav-link").forEach((button) => {
    const isSelected = (button.hasAttribute("data-home") && category === "All") || button.dataset.category === category;
    button.classList.toggle("active", isSelected);
  });

  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.classList.toggle("selected", button.dataset.filter === category);
  });
}

function goHome(category = "All") {
  selectedCategory = category;
  homeView.hidden = false;
  toolView.hidden = true;

  document.querySelector("#breadcrumb-current").textContent = category === "All" ? "All tools" : category;
  document.querySelector("#listing-title").textContent = category === "All" ? "Your toolkit" : `${category} tools`;
  document.querySelector("#listing-subtitle").textContent = category === "All" ? "30 utilities, ready when you are." : `Explore ${category.toLowerCase()} utilities.`;

  setActiveNav(category);
  renderTools();
  window.scrollTo(0, 0);
}

const actionBar = (actions = "") => `
  <div class="tool-controls">
    <div class="control-group">${actions}</div>
    <button class="subtle-action" type="button" data-clear>Clear all</button>
  </div>
`;

const textArea = (id, placeholder, label) => `
  <label class="field-label" for="${id}">${label}</label>
  <textarea class="editor" id="${id}" placeholder="${placeholder}"></textarea>
`;

const copyButton = (target) => `<button class="btn" type="button" data-copy="${target}">Copy</button>`;

function toolMarkup(id) {
  switch (id) {
    case "json":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-json="format">Format JSON</button><button class="btn" type="button" data-json="minify">Minify</button><button class="btn" type="button" data-json="validate">Validate</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("json-input", '{"hello":"world","items":[1,2,3]}', "INPUT JSON")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>OUTPUT</strong>${copyButton("json-output")}</div>
            <pre class="output-box" id="json-output" aria-live="polite">Formatted output will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="json-status" role="status"></div>`;
    case "base64":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="encode">Encode</button><button type="button" data-mode="decode">Decode</button></div><button class="btn btn-primary" type="button" data-run="base64">Convert</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("base64-input", "Type or paste your text here...", "INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>OUTPUT</strong>${copyButton("base64-output")}</div>
            <pre class="output-box" id="base64-output" aria-live="polite">Your result will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="base64-status" role="status"></div>`;
    case "jwt":
      return `${actionBar(`<span class="control-label">Decode header and payload (signature is not verified)</span>`) }
        ${textArea("jwt-input", "Paste a JWT token here (xxxxx.yyyyy.zzzzz)", "JWT TOKEN")}
        <div class="tool-controls" style="justify-content:flex-start;margin:12px 0"><button class="btn btn-primary" type="button" data-run="jwt">Decode token</button></div>
        <div class="status-message" id="jwt-status" role="status"></div>
        <div id="jwt-output" aria-live="polite"></div>`;
    case "regex":
      return `${actionBar(`<label class="control-label" for="regex-pattern">Pattern</label><input class="input" id="regex-pattern" placeholder="e.g. \\d+" style="width:150px"><label class="control-label" for="regex-flags">Flags</label><input class="input" id="regex-flags" value="g" maxlength="6" style="width:62px"><button class="btn btn-primary" type="button" data-run="regex">Test regex</button>`) }
        ${textArea("regex-text", "Paste the text you want to test...", "TEST STRING")}
        <div class="result-heading"><strong>MATCHES</strong><span id="regex-count">No matches yet</span></div>
        <div class="regex-list" id="regex-output" aria-live="polite"></div>
        <div class="status-message" id="regex-status" role="status"></div>`;
    case "timestamp":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="to-date">Timestamp → date</button><button type="button" data-mode="to-timestamp">Date → timestamp</button></div>`) }
        <label class="field-label" id="timestamp-label" for="timestamp-input">UNIX TIMESTAMP</label>
        <div class="control-group">
          <input class="input" id="timestamp-input" placeholder="e.g. 1700000000" style="flex:1;min-width:180px">
          <select class="select" id="timestamp-unit" aria-label="Timestamp unit"><option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option></select>
          <button class="btn btn-primary" type="button" data-run="timestamp">Convert</button>
          <button class="btn" type="button" data-now>Use current time</button>
        </div>
        <div class="status-message" id="timestamp-status" role="status"></div>
        <div class="timestamp-result" id="timestamp-output"></div>`;
    case "url":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="encode">Encode</button><button type="button" data-mode="decode">Decode</button></div><button class="btn btn-primary" type="button" data-run="url">Convert</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("url-input", "Type or paste text or a URL here...", "INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>OUTPUT</strong>${copyButton("url-output")}</div>
            <pre class="output-box" id="url-output" aria-live="polite">Your result will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="url-status" role="status"></div>`;
    case "uuid":
      return `${actionBar(`<label class="control-label" for="uuid-count">How many?</label><select class="select" id="uuid-count"><option>1</option><option>5</option><option>10</option><option>25</option></select><button class="btn btn-primary" type="button" data-run="uuid">Generate UUIDs</button>`) }
        <div class="result-heading"><strong>GENERATED UUIDS</strong>${copyButton("uuid-output")}</div>
        <pre class="output-box" id="uuid-output" aria-live="polite">Your UUIDs will appear here.</pre>
        <div class="helper-text">Generated locally using the browser's cryptographically secure random number generator.</div>`;
    case "hash":
      return `${actionBar(`<select class="select" id="hash-algorithm" aria-label="Hash algorithm"><option value="SHA-256">SHA-256</option><option value="SHA-384">SHA-384</option><option value="SHA-512">SHA-512</option></select><button class="btn btn-primary" type="button" data-run="hash">Generate hash</button>`) }
        ${textArea("hash-input", "Enter text to hash...", "INPUT TEXT")}
        <div class="result-heading"><strong>HASH</strong>${copyButton("hash-output")}</div>
        <pre class="output-box" id="hash-output" aria-live="polite">Your hash will appear here.</pre>
        <div class="status-message" id="hash-status" role="status"></div>
        <div class="helper-text">Uses the Web Crypto API. This is a one-way digest, not password storage.</div>`;
    case "csv-json":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="csv-json">Convert CSV</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("csv-input", "name,role\nAda,Engineer\nLin,Designer", "CSV INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>JSON OUTPUT</strong>${copyButton("csv-output")}</div>
            <pre class="output-box" id="csv-output" aria-live="polite">Converted JSON will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="csv-json-status" role="status"></div>`;
    case "json-csv":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="json-csv">Convert JSON</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("json-csv-input", '[{"name":"Ada","role":"Engineer"},{"name":"Lin","role":"Designer"}]', "JSON INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>CSV OUTPUT</strong>${copyButton("json-csv-output")}</div>
            <pre class="output-box" id="json-csv-output" aria-live="polite">CSV output will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="json-csv-status" role="status"></div>`;
    case "text-case":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="upper">Uppercase</button><button type="button" data-mode="lower">Lowercase</button><button type="button" data-mode="title">Title Case</button><button type="button" data-mode="sentence">Sentence</button></div><button class="btn btn-primary" type="button" data-run="text-case">Apply</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("text-case-input", "The quick brown fox jumps over the lazy dog.", "INPUT TEXT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>OUTPUT</strong>${copyButton("text-case-output")}</div>
            <pre class="output-box" id="text-case-output" aria-live="polite">Converted text will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="text-case-status" role="status"></div>`;
    case "word-counter":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="word-counter">Count</button>`) }
        ${textArea("word-counter-input", "Add a paragraph or a few lines to count words and characters.", "TEXT INPUT")}
        <div class="result-heading"><strong>STATS</strong></div>
        <pre class="output-box" id="word-counter-output" aria-live="polite">Counts will appear here.</pre>
        <div class="status-message" id="word-counter-status" role="status"></div>`;
    case "char-counter":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="char-counter">Count</button>`) }
        ${textArea("char-counter-input", "Count letters, spaces, and characters in this text.", "TEXT INPUT")}
        <div class="result-heading"><strong>STATS</strong></div>
        <pre class="output-box" id="char-counter-output" aria-live="polite">Character counts will appear here.</pre>
        <div class="status-message" id="char-counter-status" role="status"></div>`;
    case "slugify":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="slugify">Generate slug</button>`) }
        ${textArea("slugify-input", "Build better product names for URLs", "TEXT INPUT")}
        <div class="result-heading"><strong>SLUG</strong>${copyButton("slugify-output")}</div>
        <pre class="output-box" id="slugify-output" aria-live="polite">Your slug will appear here.</pre>
        <div class="status-message" id="slugify-status" role="status"></div>`;
    case "sort-lines":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="asc">A → Z</button><button type="button" data-mode="desc">Z → A</button></div><button class="btn btn-primary" type="button" data-run="sort-lines">Sort</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("sort-lines-input", "banana\napple\norange\npear", "INPUT LINES")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>OUTPUT</strong>${copyButton("sort-lines-output")}</div>
            <pre class="output-box" id="sort-lines-output" aria-live="polite">Sorted lines will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="sort-lines-status" role="status"></div>`;
    case "dedupe":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="dedupe">Remove duplicates</button>`) }
        ${textArea("dedupe-input", "apple\napple\nbanana\nbanana\norange", "INPUT LINES")}
        <div class="result-heading"><strong>UNIQUE LINES</strong>${copyButton("dedupe-output")}</div>
        <pre class="output-box" id="dedupe-output" aria-live="polite">Unique entries will appear here.</pre>
        <div class="status-message" id="dedupe-status" role="status"></div>`;
    case "markdown-preview":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="markdown-preview">Preview</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("markdown-input", "# Demo\n\n**bold** and *italic* text\n\n- one\n- two", "MARKDOWN INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>HTML OUTPUT</strong>${copyButton("markdown-output")}</div>
            <div class="output-box" id="markdown-output" aria-live="polite">Rendered HTML will appear here.</div>
          </div>
        </div>
        <div class="status-message" id="markdown-status" role="status"></div>`;
    case "diff":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="diff">Compare</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("diff-left", "alpha\nbeta\ngamma", "LEFT SIDE")}</div>
          <div class="editor-wrap">${textArea("diff-right", "alpha\nbeta\ndelta", "RIGHT SIDE")}</div>
        </div>
        <div class="result-heading"><strong>DIFF</strong>${copyButton("diff-output")}</div>
        <pre class="output-box" id="diff-output" aria-live="polite">Differences will appear here.</pre>
        <div class="status-message" id="diff-status" role="status"></div>`;
    case "color-converter":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="hex-rgb">HEX → RGB</button><button type="button" data-mode="rgb-hex">RGB → HEX</button></div><button class="btn btn-primary" type="button" data-run="color-converter">Convert</button>`) }
        ${textArea("color-input", "#7c6ae6\n\nor\n124, 106, 230", "COLOR INPUT")}
        <div class="result-heading"><strong>RESULT</strong>${copyButton("color-output")}</div>
        <pre class="output-box" id="color-output" aria-live="polite">Converted color will appear here.</pre>
        <div class="status-message" id="color-status" role="status"></div>`;
    case "lorem-ipsum":
      return `${actionBar(`<label class="control-label" for="lorem-count">Paragraphs</label><select class="select" id="lorem-count"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="5">5</option></select><button class="btn btn-primary" type="button" data-run="lorem-ipsum">Generate</button>`) }
        <div class="result-heading"><strong>PLACEHOLDER TEXT</strong>${copyButton("lorem-output")}</div>
        <pre class="output-box" id="lorem-output" aria-live="polite">Lorem ipsum text will appear here.</pre>
        <div class="status-message" id="lorem-status" role="status"></div>`;
    case "password-generator":
      return `${actionBar(`<label class="control-label" for="password-length">Length</label><input class="input" id="password-length" type="number" min="8" max="64" value="16" style="width:70px"><button class="btn btn-primary" type="button" data-run="password-generator">Generate</button>`) }
        <div class="result-heading"><strong>PASSWORD</strong>${copyButton("password-output")}</div>
        <pre class="output-box" id="password-output" aria-live="polite">A secure password will appear here.</pre>
        <div class="status-message" id="password-status" role="status"></div>`;
    case "morse-code":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="encode">Text → Morse</button><button type="button" data-mode="decode">Morse → Text</button></div><button class="btn btn-primary" type="button" data-run="morse-code">Convert</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("morse-input", "HELLO WORLD", "INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>OUTPUT</strong>${copyButton("morse-output")}</div>
            <pre class="output-box" id="morse-output" aria-live="polite">Morse output will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="morse-status" role="status"></div>`;
    case "html-entities":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="escape">Escape</button><button type="button" data-mode="unescape">Unescape</button></div><button class="btn btn-primary" type="button" data-run="html-entities">Convert</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("html-input", "<div class=\"demo\">Hello & goodbye</div>", "HTML INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>OUTPUT</strong>${copyButton("html-output")}</div>
            <pre class="output-box" id="html-output" aria-live="polite">Escaped output will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="html-status" role="status"></div>`;
    case "binary-converter":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="text-binary">Text → Binary</button><button type="button" data-mode="binary-text">Binary → Text</button></div><button class="btn btn-primary" type="button" data-run="binary-converter">Convert</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("binary-input", "hello", "INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>OUTPUT</strong>${copyButton("binary-output")}</div>
            <pre class="output-box" id="binary-output" aria-live="polite">Binary output will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="binary-status" role="status"></div>`;
    case "hex-converter":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="text-hex">Text → Hex</button><button type="button" data-mode="hex-text">Hex → Text</button></div><button class="btn btn-primary" type="button" data-run="hex-converter">Convert</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("hex-input", "hello", "INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>OUTPUT</strong>${copyButton("hex-output")}</div>
            <pre class="output-box" id="hex-output" aria-live="polite">Hex output will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="hex-status" role="status"></div>`;
    case "url-parser":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="url-parser">Parse URL</button>`) }
        ${textArea("url-parser-input", "https://example.com/search?q=developer&lang=en#top", "URL INPUT")}
        <div class="result-heading"><strong>URL PARTS</strong></div>
        <pre class="output-box" id="url-parser-output" aria-live="polite">Parsed URL details will appear here.</pre>
        <div class="status-message" id="url-parser-status" role="status"></div>`;
    case "json-compare":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="json-compare">Compare</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("json-compare-left", '{"name":"Ada","skills":["JS","CSS"]}', "LEFT JSON")}</div>
          <div class="editor-wrap">${textArea("json-compare-right", '{"name":"Ada","skills":["JS","HTML"]}', "RIGHT JSON")}</div>
        </div>
        <div class="result-heading"><strong>DIFFERENCES</strong>${copyButton("json-compare-output")}</div>
        <pre class="output-box" id="json-compare-output" aria-live="polite">Comparison results will appear here.</pre>
        <div class="status-message" id="json-compare-status" role="status"></div>`;
    case "line-numbering":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="line-numbering">Number lines</button>`) }
        <div class="editor-grid">
          <div class="editor-wrap">${textArea("line-numbering-input", "first line\nsecond line\nthird line", "TEXT INPUT")}</div>
          <div class="editor-wrap">
            <div class="result-heading"><strong>NUMBERED OUTPUT</strong>${copyButton("line-numbering-output")}</div>
            <pre class="output-box" id="line-numbering-output" aria-live="polite">Numbered lines will appear here.</pre>
          </div>
        </div>
        <div class="status-message" id="line-numbering-status" role="status"></div>`;
    case "checksum":
      return `${actionBar(`<select class="select" id="checksum-algorithm" aria-label="Checksum algorithm"><option value="SHA-256">SHA-256</option><option value="SHA-1">SHA-1</option></select><button class="btn btn-primary" type="button" data-run="checksum">Generate</button>`) }
        ${textArea("checksum-input", "Check the integrity of this phrase.", "TEXT INPUT")}
        <div class="result-heading"><strong>CHECKSUM</strong>${copyButton("checksum-output")}</div>
        <pre class="output-box" id="checksum-output" aria-live="polite">Checksum will appear here.</pre>
        <div class="status-message" id="checksum-status" role="status"></div>`;
    case "emoji-formatter":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-run="emoji-formatter">Format</button>`) }
        ${textArea("emoji-input", ":smile: :heart: :rocket:", "INPUT TEXT")}
        <div class="result-heading"><strong>OUTPUT</strong>${copyButton("emoji-output")}</div>
        <pre class="output-box" id="emoji-output" aria-live="polite">Formatted emoji output will appear here.</pre>
        <div class="status-message" id="emoji-status" role="status"></div>`;
    default:
      return "";
  }
}

function openTool(id) {
  const tool = tools.find((entry) => entry.id === id);
  if (!tool) return;

  homeView.hidden = true;
  toolView.hidden = false;

  document.querySelector("#breadcrumb-current").textContent = tool.name;
  document.querySelector("#active-icon").className = `tool-heading-icon icon-${tool.tone}`;
  document.querySelector("#active-icon").textContent = tool.icon;
  document.querySelector("#active-category").textContent = `${tool.category} utility`;
  document.querySelector("#active-title").textContent = tool.name;
  document.querySelector("#active-description").textContent = tool.description;
  document.querySelector("#tool-workspace").innerHTML = toolMarkup(id);
  document.querySelector("#tool-workspace").dataset.activeTool = id;
  setActiveNav("All");
  window.scrollTo(0, 0);
}

function setStatus(id, message, isError = true) {
  const element = document.querySelector(`#${id}`);
  if (element) {
    element.textContent = message;
    element.style.color = isError ? "#d16e6e" : "#45a879";
  }
}

function decodeBase64Url(part) {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function stringifyValue(value) {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function runTool(id) {
  if (id === "json") {
    const input = document.querySelector("#json-input").value;
    const output = document.querySelector("#json-output");
    if (!input.trim()) {
      output.textContent = "";
      return setStatus("json-status", "Enter JSON to get started.");
    }

    try {
      const parsed = JSON.parse(input);
      const mode = document.querySelector("#tool-workspace").dataset.jsonMode || "format";
      output.textContent = mode === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      setStatus("json-status", "Valid JSON", false);
    } catch (error) {
      output.textContent = "";
      setStatus("json-status", error.message);
    }
    return;
  }

  if (id === "base64") {
    const input = document.querySelector("#base64-input").value;
    const mode = document.querySelector("#tool-workspace").dataset.mode || "encode";
    try {
      const value = mode === "encode"
        ? btoa(Array.from(new TextEncoder().encode(input), (byte) => String.fromCharCode(byte)).join(""))
        : new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(input.trim()), (char) => char.charCodeAt(0)));
      document.querySelector("#base64-output").textContent = value;
      setStatus("base64-status", "Conversion complete", false);
    } catch {
      setStatus("base64-status", `Could not ${mode} input. Check the value and try again.`);
    }
    return;
  }

  if (id === "jwt") {
    const token = document.querySelector("#jwt-input").value.trim();
    const target = document.querySelector("#jwt-output");
    target.replaceChildren();
    const parts = token.split(".");

    if (parts.length !== 3 || parts.some((part) => !part)) {
      return setStatus("jwt-status", "A JWT must contain three non-empty dot-separated parts.");
    }

    try {
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));

      for (const [title, value] of [["HEADER", header], ["PAYLOAD", payload], ["SIGNATURE", parts[2]]]) {
        const section = document.createElement("section");
        section.className = "jwt-part";

        const heading = document.createElement("h3");
        heading.textContent = title;

        const content = document.createElement("pre");
        content.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);

        section.append(heading, content);
        target.append(section);
      }

      setStatus("jwt-status", "Decoded locally. The signature has not been verified.", false);
    } catch {
      setStatus("jwt-status", "Could not decode token. Check that its header and payload are valid Base64URL-encoded JSON.");
    }
    return;
  }

  if (id === "regex") {
    const pattern = document.querySelector("#regex-pattern").value;
    const flags = document.querySelector("#regex-flags").value;
    const text = document.querySelector("#regex-text").value;
    const output = document.querySelector("#regex-output");
    output.replaceChildren();

    try {
      const expression = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
      const matches = [...text.matchAll(expression)];
      document.querySelector("#regex-count").textContent = `${matches.length} ${matches.length === 1 ? "match" : "matches"}`;

      if (!matches.length) output.textContent = "No matches found.";

      matches.forEach((match, index) => {
        const row = document.createElement("div");
        row.className = "regex-match";
        row.textContent = match[0] || "(empty match)";

        const detail = document.createElement("small");
        detail.textContent = `#${index + 1} at index ${match.index}`;
        row.append(detail);
        output.append(row);
      });

      setStatus("regex-status", "", false);
    } catch (error) {
      document.querySelector("#regex-count").textContent = "Invalid expression";
      setStatus("regex-status", error.message);
    }
    return;
  }

  if (id === "timestamp") {
    const raw = document.querySelector("#timestamp-input").value.trim();
    const mode = document.querySelector("#tool-workspace").dataset.mode || "to-date";
    const unit = document.querySelector("#timestamp-unit").value;
    const output = document.querySelector("#timestamp-output");
    output.replaceChildren();

    if (!raw) return setStatus("timestamp-status", "Enter a date or timestamp to convert.");

    const date = mode === "to-date"
      ? new Date(Number(raw) * (unit === "seconds" ? 1000 : 1))
      : new Date(raw);

    if (Number.isNaN(date.getTime())) return setStatus("timestamp-status", "That is not a valid date or timestamp.");

    const values = mode === "to-date"
      ? [["ISO 8601", date.toISOString()], ["Local time", date.toLocaleString()], ["Unix seconds", Math.floor(date.getTime() / 1000)], ["Unix milliseconds", date.getTime()]]
      : [["ISO 8601", date.toISOString()], ["Unix seconds", Math.floor(date.getTime() / 1000)], ["Unix milliseconds", date.getTime()]];

    values.forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "timestamp-value";

      const small = document.createElement("small");
      small.textContent = label;

      const strong = document.createElement("strong");
      strong.textContent = value;

      item.append(small, strong);
      output.append(item);
    });

    setStatus("timestamp-status", "Conversion complete", false);
    return;
  }

  if (id === "url") {
    const input = document.querySelector("#url-input").value;
    const mode = document.querySelector("#tool-workspace").dataset.mode || "encode";
    try {
      document.querySelector("#url-output").textContent = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
      setStatus("url-status", "Conversion complete", false);
    } catch {
      setStatus("url-status", "Could not decode this URL component. Check percent-encoded characters.");
    }
    return;
  }

  if (id === "uuid") {
    if (!crypto.randomUUID) return showToast("UUID generation is not supported in this browser");
    const count = Number(document.querySelector("#uuid-count").value);
    document.querySelector("#uuid-output").textContent = Array.from({ length: count }, () => crypto.randomUUID()).join("\n");
    return;
  }

  if (id === "hash") {
    const input = document.querySelector("#hash-input").value;
    const algorithm = document.querySelector("#hash-algorithm").value;
    document.querySelector("#hash-output").textContent = "";

    if (!window.crypto?.subtle) return setStatus("hash-status", "Web Crypto requires a secure context (HTTPS or localhost).");

    crypto.subtle.digest(algorithm, new TextEncoder().encode(input))
      .then((buffer) => {
        document.querySelector("#hash-output").textContent = Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
        setStatus("hash-status", `${algorithm} digest generated`, false);
      })
      .catch(() => setStatus("hash-status", "Hash generation failed in this browser."));
    return;
  }

  if (id === "csv-json") {
    const input = document.querySelector("#csv-input").value.trim();
    if (!input) return setStatus("csv-json-status", "Paste CSV text to convert.");

    const rows = input.split(/\r?\n/).filter(Boolean);
    if (rows.length < 2) return setStatus("csv-json-status", "CSV needs at least a header row and one data row.");

    const headers = rows[0].split(",").map((item) => item.trim());
    const data = rows.slice(1).map((row) => {
      const values = row.split(",").map((item) => item.trim());
      return headers.reduce((acc, header, index) => {
        acc[header] = values[index] ?? "";
        return acc;
      }, {});
    });

    document.querySelector("#csv-output").textContent = JSON.stringify(data, null, 2);
    setStatus("csv-json-status", "CSV converted to JSON", false);
    return;
  }

  if (id === "json-csv") {
    const input = document.querySelector("#json-csv-input").value.trim();
    if (!input) return setStatus("json-csv-status", "Paste JSON to convert.");

    try {
      const parsed = JSON.parse(input);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      if (!rows.length || !rows.every((entry) => typeof entry === "object" && entry !== null)) {
        throw new Error("JSON must be an array of objects or a single object.");
      }

      const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
      const csv = [headers.join(",")]
        .concat(rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")))
        .join("\n");

      document.querySelector("#json-csv-output").textContent = csv;
      setStatus("json-csv-status", "JSON converted to CSV", false);
    } catch (error) {
      setStatus("json-csv-status", error.message);
    }
    return;
  }

  if (id === "text-case") {
    const input = document.querySelector("#text-case-input").value;
    const mode = document.querySelector("#tool-workspace").dataset.mode || "upper";

    let output = "";
    if (mode === "upper") output = input.toUpperCase();
    else if (mode === "lower") output = input.toLowerCase();
    else if (mode === "title") output = input.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    else output = input.toLowerCase().replace(/(^\s*[a-z])/, (char) => char.toUpperCase()).replace(/[.!?]\s+[a-z]/g, (match) => match.toUpperCase());

    document.querySelector("#text-case-output").textContent = output;
    setStatus("text-case-status", input ? "Text transformed" : "Add text to transform.", !input);
    return;
  }

  if (id === "word-counter") {
    const text = document.querySelector("#word-counter-input").value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = [...text].length;
    const charsNoSpaces = [...text.replace(/\s+/g, "")].length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const summary = `Words: ${words}\nCharacters: ${chars}\nCharacters without spaces: ${charsNoSpaces}\nLines: ${lines}`;
    document.querySelector("#word-counter-output").textContent = summary;
    setStatus("word-counter-status", "Count complete", false);
    return;
  }

  if (id === "char-counter") {
    const text = document.querySelector("#char-counter-input").value;
    const summary = `Total characters: ${[...text].length}\nLetters: ${[...text].filter((c) => /[A-Za-z]/.test(c)).length}\nSpaces: ${[...text].filter((c) => c === " ").length}\nWhitespace: ${[...text].filter((c) => /\s/.test(c)).length}`;
    document.querySelector("#char-counter-output").textContent = summary;
    setStatus("char-counter-status", "Count complete", false);
    return;
  }

  if (id === "slugify") {
    const text = document.querySelector("#slugify-input").value.trim();
    const slug = text.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
    document.querySelector("#slugify-output").textContent = slug || "your-slug-here";
    setStatus("slugify-status", text ? "Slug ready" : "Enter text to generate a slug.", !text);
    return;
  }

  if (id === "sort-lines") {
    const lines = document.querySelector("#sort-lines-input").value.split(/\r?\n/).filter((line) => line.trim() !== "");
    const mode = document.querySelector("#tool-workspace").dataset.mode || "asc";
    const sorted = [...lines].sort((a, b) => mode === "asc" ? a.localeCompare(b) : b.localeCompare(a));
    document.querySelector("#sort-lines-output").textContent = sorted.join("\n") || "No lines to sort.";
    setStatus("sort-lines-status", "Lines sorted", false);
    return;
  }

  if (id === "dedupe") {
    const lines = [...new Set(document.querySelector("#dedupe-input").value.split(/\r?\n/).filter(Boolean))];
    document.querySelector("#dedupe-output").textContent = lines.join("\n") || "No duplicates found.";
    setStatus("dedupe-status", "Duplicates removed", false);
    return;
  }

  if (id === "markdown-preview") {
    const input = document.querySelector("#markdown-input").value;
    const html = input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^### (.*)$/gm, "<h3>$1</h3>")
      .replace(/^## (.*)$/gm, "<h2>$1</h2>")
      .replace(/^# (.*)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^- (.*)$/gm, "<li>$1</li>")
      .replace(/(?:<li>.*<\/li>)/gs, "<ul>$1</ul>")
      .replace(/\n{2,}/g, "<br><br>");

    document.querySelector("#markdown-output").innerHTML = html || "Nothing to preview yet.";
    setStatus("markdown-status", "Preview ready", false);
    return;
  }

  if (id === "diff") {
    const left = document.querySelector("#diff-left").value.split(/\r?\n/);
    const right = document.querySelector("#diff-right").value.split(/\r?\n/);
    const max = Math.max(left.length, right.length);
    const lines = [];

    for (let i = 0; i < max; i += 1) {
      const l = left[i] ?? "";
      const r = right[i] ?? "";
      if (l !== r) {
        lines.push(`- ${l}`);
        lines.push(`+ ${r}`);
      } else {
        lines.push(`  ${l}`);
      }
    }

    document.querySelector("#diff-output").textContent = lines.join("\n") || "No differences found.";
    setStatus("diff-status", "Diff complete", false);
    return;
  }

  if (id === "color-converter") {
    const input = document.querySelector("#color-input").value.trim();
    const mode = document.querySelector("#tool-workspace").dataset.mode || "hex-rgb";
    let output = "";

    if (mode === "hex-rgb") {
      const match = input.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
      if (!match) return setStatus("color-status", "Use a hex color like #7c6ae6 or 7c6ae6.");
      const raw = match[1].length === 3 ? match[1].split("").map((ch) => ch + ch).join("") : match[1];
      const r = parseInt(raw.slice(0, 2), 16);
      const g = parseInt(raw.slice(2, 4), 16);
      const b = parseInt(raw.slice(4, 6), 16);
      output = `rgb(${r}, ${g}, ${b})`;
    } else {
      const match = input.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
      if (!match) return setStatus("color-status", "Use RGB like 124, 106, 230.");
      const [r, g, b] = match.slice(1).map(Number);
      if ([r, g, b].some((value) => value < 0 || value > 255)) return setStatus("color-status", "RGB values must be between 0 and 255.");
      output = `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
    }

    document.querySelector("#color-output").textContent = output;
    setStatus("color-status", "Color converted", false);
    return;
  }

  if (id === "lorem-ipsum") {
    const paragraphs = Number(document.querySelector("#lorem-count").value || 2);
    const filler = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat, tortor vitae ultrices viverra, turpis lacus volutpat velit, at mattis sapien justo vitae lacus.",
      "Praesent sollicitudin, nulla a facilisis posuere, mi purus tincidunt sem, et rhoncus sem lectus eu libero.",
      "Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
      "Sed efficitur turpis ut dui laoreet, vitae viverra dui scelerisque. Vivamus sit amet urna porttitor, mollis lacus at, posuere magna.",
      "Nam a leo non lorem varius elementum. Donec tempor, sem et feugiat placerat, ipsum augue luctus lacus, in pellentesque lorem eros nec elit."
    ];
    document.querySelector("#lorem-output").textContent = Array.from({ length: paragraphs }, (_, index) => `${index + 1}. ${filler[index % filler.length]}`).join("\n\n");
    setStatus("lorem-status", "Placeholder text generated", false);
    return;
  }

  if (id === "password-generator") {
    const length = Number(document.querySelector("#password-length").value || 16);
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";
    let password = "";
    const safeLength = Math.max(8, Math.min(length, 64));

    for (let i = 0; i < safeLength; i += 1) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    document.querySelector("#password-output").textContent = password;
    setStatus("password-status", "Password generated", false);
    return;
  }

  if (id === "morse-code") {
    const morse = {
      A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
      K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
      U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..", 0: "-----", 1: ".----", 2: "..---",
      3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.", " ": "/"
    };
    const reverse = Object.fromEntries(Object.entries(morse).map(([key, value]) => [value, key]));
    const input = document.querySelector("#morse-input").value;
    const mode = document.querySelector("#tool-workspace").dataset.mode || "encode";
    const output = mode === "encode"
      ? [...input.toUpperCase()].map((char) => morse[char] ?? char).join(" ")
      : input.split(" ").map((code) => reverse[code] || code).join("");

    document.querySelector("#morse-output").textContent = output;
    setStatus("morse-status", "Morse conversion complete", false);
    return;
  }

  if (id === "html-entities") {
    const input = document.querySelector("#html-input").value;
    const mode = document.querySelector("#tool-workspace").dataset.mode || "escape";
    const output = mode === "escape"
      ? input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;")
      : input.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&#39;/g, "'");

    document.querySelector("#html-output").textContent = output;
    setStatus("html-status", mode === "escape" ? "Escaped HTML" : "Unescaped HTML", false);
    return;
  }

  if (id === "binary-converter") {
    const input = document.querySelector("#binary-input").value;
    const mode = document.querySelector("#tool-workspace").dataset.mode || "text-binary";
    let output = "";

    if (mode === "text-binary") {
      output = [...input].map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    } else {
      output = input.trim().split(/\s+/).map((chunk) => String.fromCharCode(parseInt(chunk, 2))).join("");
    }

    document.querySelector("#binary-output").textContent = output || "Invalid binary input.";
    setStatus("binary-status", "Binary conversion complete", false);
    return;
  }

  if (id === "hex-converter") {
    const input = document.querySelector("#hex-input").value;
    const mode = document.querySelector("#tool-workspace").dataset.mode || "text-hex";
    let output = "";

    if (mode === "text-hex") {
      output = [...input].map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
    } else {
      output = input.trim().split(/\s+/).map((chunk) => String.fromCharCode(parseInt(chunk, 16))).join("");
    }

    document.querySelector("#hex-output").textContent = output;
    setStatus("hex-status", "Hex conversion complete", false);
    return;
  }

  if (id === "url-parser") {
    const input = document.querySelector("#url-parser-input").value.trim();
    if (!input) return setStatus("url-parser-status", "Paste a URL to inspect.");

    try {
      const parsed = new URL(input);
      const details = {
        href: parsed.href,
        protocol: parsed.protocol,
        host: parsed.host,
        hostname: parsed.hostname,
        port: parsed.port || "(default)",
        pathname: parsed.pathname,
        search: parsed.search || "(none)",
        hash: parsed.hash || "(none)"
      };
      document.querySelector("#url-parser-output").textContent = Object.entries(details).map(([key, value]) => `${key}: ${value}`).join("\n");
      setStatus("url-parser-status", "URL parsed", false);
    } catch {
      setStatus("url-parser-status", "That does not look like a valid URL.");
    }
    return;
  }

  if (id === "json-compare") {
    const left = document.querySelector("#json-compare-left").value.trim();
    const right = document.querySelector("#json-compare-right").value.trim();
    if (!left || !right) return setStatus("json-compare-status", "Add both JSON values to compare.");

    try {
      const leftJson = JSON.parse(left);
      const rightJson = JSON.parse(right);
      const differences = [];

      const walk = (a, b, path = "$") => {
        if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
          differences.push(`${path}: ${stringifyValue(a)} !== ${stringifyValue(b)}`);
          return;
        }

        if (Array.isArray(a)) {
          const max = Math.max(a.length, b.length);
          for (let i = 0; i < max; i += 1) {
            if (i >= a.length) differences.push(`${path}[${i}]: missing in left`);
            else if (i >= b.length) differences.push(`${path}[${i}]: missing in right`);
            else walk(a[i], b[i], `${path}[${i}]`);
          }
          return;
        }

        if (a && typeof a === "object") {
          const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
          keys.forEach((key) => {
            if (!(key in a)) differences.push(`${path}.${key}: missing in left`);
            else if (!(key in b)) differences.push(`${path}.${key}: missing in right`);
            else walk(a[key], b[key], `${path}.${key}`);
          });
          return;
        }

        if (a !== b) differences.push(`${path}: ${stringifyValue(a)} !== ${stringifyValue(b)}`);
      };

      walk(leftJson, rightJson);
      document.querySelector("#json-compare-output").textContent = differences.length ? differences.join("\n") : "No differences found.";
      setStatus("json-compare-status", differences.length ? "Differences found" : "JSON values match", false);
    } catch (error) {
      setStatus("json-compare-status", error.message);
    }
    return;
  }

  if (id === "line-numbering") {
    const input = document.querySelector("#line-numbering-input").value;
    const numbered = input.split(/\r?\n/).map((line, index) => `${index + 1}. ${line}`).join("\n");
    document.querySelector("#line-numbering-output").textContent = numbered || "No text to number.";
    setStatus("line-numbering-status", "Lines numbered", false);
    return;
  }

  if (id === "checksum") {
    const input = document.querySelector("#checksum-input").value;
    const algorithm = document.querySelector("#checksum-algorithm").value;
    if (!window.crypto?.subtle) return setStatus("checksum-status", "Web Crypto is required to generate checksums.");

    crypto.subtle.digest(algorithm, new TextEncoder().encode(input))
      .then((buffer) => {
        const hash = Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
        document.querySelector("#checksum-output").textContent = hash;
        setStatus("checksum-status", `${algorithm} checksum generated`, false);
      })
      .catch(() => setStatus("checksum-status", "Checksum generation failed."));
    return;
  }

  if (id === "emoji-formatter") {
    const map = {
      ":smile:": "😊",
      ":heart:": "❤",
      ":rocket:": "🚀",
      ":fire:": "🔥",
      ":sun:": "☀",
      ":star:": "⭐",
      ":check:": "✔",
      ":warning:": "⚠"
    };

    const input = document.querySelector("#emoji-input").value;
    const output = input.replace(/:[A-Za-z-]+:/g, (token) => map[token] || token);
    document.querySelector("#emoji-output").textContent = output;
    setStatus("emoji-status", "Emoji aliases formatted", false);
    return;
  }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.hasAttribute("data-home")) {
    event.preventDefault();
    goHome();
    return;
  }

  if (target.dataset.category) {
    goHome(target.dataset.category);
    return;
  }

  if (target.dataset.filter) {
    goHome(target.dataset.filter);
    return;
  }

  if (target.dataset.tool) {
    openTool(target.dataset.tool);
    return;
  }

  if (target.dataset.copy) {
    const source = document.querySelector(`#${target.dataset.copy}`);
    copyText(source?.value ?? source?.textContent);
    return;
  }

  const active = document.querySelector("#tool-workspace")?.dataset.activeTool;

  if (target.dataset.json) {
    document.querySelector("#tool-workspace").dataset.jsonMode = target.dataset.json;
    runTool("json");
    return;
  }

  if (target.dataset.mode) {
    const group = target.closest(".segment");
    if (group) {
      group.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button === target));
    }

    document.querySelector("#tool-workspace").dataset.mode = target.dataset.mode;

    if (active === "timestamp") {
      const label = document.querySelector("#timestamp-label");
      const input = document.querySelector("#timestamp-input");
      label.textContent = target.dataset.mode === "to-date" ? "UNIX TIMESTAMP" : "DATE / TIME";
      input.placeholder = target.dataset.mode === "to-date" ? "e.g. 1700000000" : "e.g. 2024-01-15T12:30:00";
      const unit = document.querySelector("#timestamp-unit");
      if (unit) unit.hidden = target.dataset.mode !== "to-date";
    }
    return;
  }

  if (target.dataset.run) {
    runTool(target.dataset.run);
    return;
  }

  if (target.hasAttribute("data-now")) {
    document.querySelector("#timestamp-input").value = String(Math.floor(Date.now() / 1000));
    document.querySelector("#timestamp-unit").value = "seconds";
    document.querySelector("#tool-workspace").dataset.mode = "to-date";
    document.querySelectorAll(".segment button").forEach((button) => button.classList.toggle("active", button.dataset.mode === "to-date"));
    document.querySelector("#timestamp-label").textContent = "UNIX TIMESTAMP";
    document.querySelector("#timestamp-input").placeholder = "e.g. 1700000000";
    document.querySelector("#timestamp-unit").hidden = false;
    runTool("timestamp");
  }

  if (target.hasAttribute("data-clear")) {
    document.querySelectorAll("#tool-workspace textarea, #tool-workspace input").forEach((element) => { element.value = ""; });
    document.querySelectorAll("#tool-workspace .output-box, #tool-workspace .regex-list, #tool-workspace #jwt-output, #tool-workspace #timestamp-output").forEach((element) => { element.textContent = ""; });
    document.querySelectorAll("#tool-workspace .status-message").forEach((element) => { element.textContent = ""; });

    const count = document.querySelector("#regex-count");
    if (count) count.textContent = "No matches yet";
  }
});

searchInput.addEventListener("input", renderTools);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    if (homeView.hidden) goHome();
    searchInput.focus();
  }

  if (event.key === "Escape" && !toolView.hidden) goHome();
});

renderTools();
