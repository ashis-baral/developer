const tools = [
  { id: "json", name: "JSON Formatter", description: "Format, validate, and minify JSON in a couple of clicks.", category: "Data", icon: "{ }", tone: "violet" },
  { id: "base64", name: "Base64 Encoder", description: "Encode text to Base64 or decode it back to plain text.", category: "Encoding", icon: "64", tone: "blue" },
  { id: "jwt", name: "JWT Decoder", description: "Inspect a token's header and payload. No verification is performed.", category: "Encoding", icon: "⌑", tone: "orange" },
  { id: "regex", name: "Regex Tester", description: "Try a regular expression and inspect every match.", category: "Web", icon: ".*", tone: "pink" },
  { id: "timestamp", name: "Timestamp Converter", description: "Convert Unix timestamps and readable dates instantly.", category: "Data", icon: "◷", tone: "green" },
  { id: "url", name: "URL Encoder", description: "Encode or decode URL components safely.", category: "Encoding", icon: "%", tone: "teal" },
  { id: "uuid", name: "UUID Generator", description: "Generate random UUID v4 identifiers for your projects.", category: "Web", icon: "◇", tone: "violet" },
  { id: "hash", name: "Hash Generator", description: "Create a SHA-256 hash from text using your browser.", category: "Data", icon: "#", tone: "blue" }
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
      <h3>${tool.name}</h3><p>${tool.description}</p><div class="card-category">${tool.category} utility</div>
    </button>`).join("");
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
    button.classList.toggle("active", button.hasAttribute("data-home") && category === "All" ||
      button.dataset.category === category);
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
  document.querySelector("#listing-subtitle").textContent = category === "All" ? "8 utilities, ready when you are." : `Explore ${category.toLowerCase()} utilities.`;
  setActiveNav(category);
  renderTools();
  window.scrollTo(0, 0);
}

const actionBar = (actions = "") => `<div class="tool-controls"><div class="control-group">${actions}</div><button class="subtle-action" type="button" data-clear>Clear all</button></div>`;
const textArea = (id, placeholder, label) => `<label class="field-label" for="${id}">${label}</label><textarea class="editor" id="${id}" placeholder="${placeholder}"></textarea>`;
const copyButton = (target) => `<button class="btn" type="button" data-copy="${target}">Copy</button>`;

function toolMarkup(id) {
  switch (id) {
    case "json":
      return `${actionBar(`<button class="btn btn-primary" type="button" data-json="format">Format JSON</button><button class="btn" type="button" data-json="minify">Minify</button><button class="btn" type="button" data-json="validate">Validate</button>`)}
        <div class="editor-grid"><div class="editor-wrap">${textArea("json-input", '{"hello":"world","items":[1,2,3]}', "INPUT JSON")}</div><div class="editor-wrap"><div class="result-heading"><strong>OUTPUT</strong>${copyButton("json-output")}</div><pre class="output-box" id="json-output" aria-live="polite">Formatted output will appear here.</pre></div></div><div class="status-message" id="json-status" role="status"></div>`;
    case "base64":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="encode">Encode</button><button type="button" data-mode="decode">Decode</button></div><button class="btn btn-primary" type="button" data-run="base64">Convert</button>`)}
        <div class="editor-grid"><div class="editor-wrap">${textArea("base64-input", "Type or paste your text here...", "INPUT")}</div><div class="editor-wrap"><div class="result-heading"><strong>OUTPUT</strong>${copyButton("base64-output")}</div><pre class="output-box" id="base64-output" aria-live="polite">Your result will appear here.</pre></div></div><div class="status-message" id="base64-status" role="status"></div>`;
    case "jwt":
      return `${actionBar(`<span class="control-label">Decode header and payload (signature is not verified)</span>`)}
        ${textArea("jwt-input", "Paste a JWT token here (xxxxx.yyyyy.zzzzz)", "JWT TOKEN")}
        <div class="tool-controls" style="justify-content:flex-start;margin:12px 0"><button class="btn btn-primary" type="button" data-run="jwt">Decode token</button></div>
        <div class="status-message" id="jwt-status" role="status"></div><div id="jwt-output" aria-live="polite"></div>`;
    case "regex":
      return `${actionBar(`<label class="control-label" for="regex-pattern">Pattern</label><input class="input" id="regex-pattern" placeholder="e.g. \\\\d+" style="width:150px"><label class="control-label" for="regex-flags">Flags</label><input class="input" id="regex-flags" value="g" maxlength="6" style="width:62px"><button class="btn btn-primary" type="button" data-run="regex">Test regex</button>`)}
        ${textArea("regex-text", "Paste the text you want to test...", "TEST STRING")}<div class="result-heading"><strong>MATCHES</strong><span id="regex-count">No matches yet</span></div><div class="regex-list" id="regex-output" aria-live="polite"></div><div class="status-message" id="regex-status" role="status"></div>`;
    case "timestamp":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="to-date">Timestamp → date</button><button type="button" data-mode="to-timestamp">Date → timestamp</button></div>`)}
        <label class="field-label" id="timestamp-label" for="timestamp-input">UNIX TIMESTAMP</label><div class="control-group"><input class="input" id="timestamp-input" placeholder="e.g. 1700000000" style="flex:1;min-width:180px"><select class="select" id="timestamp-unit" aria-label="Timestamp unit"><option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option></select><button class="btn btn-primary" type="button" data-run="timestamp">Convert</button><button class="btn" type="button" data-now>Use current time</button></div>
        <div class="status-message" id="timestamp-status" role="status"></div><div class="timestamp-result" id="timestamp-output"></div>`;
    case "url":
      return `${actionBar(`<div class="segment"><button type="button" class="active" data-mode="encode">Encode</button><button type="button" data-mode="decode">Decode</button></div><button class="btn btn-primary" type="button" data-run="url">Convert</button>`)}
        <div class="editor-grid"><div class="editor-wrap">${textArea("url-input", "Type or paste text or a URL here...", "INPUT")}</div><div class="editor-wrap"><div class="result-heading"><strong>OUTPUT</strong>${copyButton("url-output")}</div><pre class="output-box" id="url-output" aria-live="polite">Your result will appear here.</pre></div></div><div class="status-message" id="url-status" role="status"></div>`;
    case "uuid":
      return `${actionBar(`<label class="control-label" for="uuid-count">How many?</label><select class="select" id="uuid-count"><option>1</option><option>5</option><option>10</option><option>25</option></select><button class="btn btn-primary" type="button" data-run="uuid">Generate UUIDs</button>`)}
        <div class="result-heading"><strong>GENERATED UUIDS</strong>${copyButton("uuid-output")}</div><pre class="output-box" id="uuid-output" aria-live="polite">Your UUIDs will appear here.</pre><div class="helper-text">Generated locally using the browser's cryptographically secure random number generator.</div>`;
    case "hash":
      return `${actionBar(`<select class="select" id="hash-algorithm" aria-label="Hash algorithm"><option value="SHA-256">SHA-256</option><option value="SHA-384">SHA-384</option><option value="SHA-512">SHA-512</option></select><button class="btn btn-primary" type="button" data-run="hash">Generate hash</button>`)}
        ${textArea("hash-input", "Enter text to hash...", "INPUT TEXT")}<div class="result-heading"><strong>HASH</strong>${copyButton("hash-output")}</div><pre class="output-box" id="hash-output" aria-live="polite">Your hash will appear here.</pre><div class="status-message" id="hash-status" role="status"></div><div class="helper-text">Uses the Web Crypto API. This is a one-way digest, not password storage.</div>`;
    default: return "";
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
      document.querySelector("#json-output").textContent = mode === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      setStatus("json-status", "Valid JSON", false);
    } catch (error) {
      output.textContent = "";
      setStatus("json-status", error.message);
    }
    return;
  }
  if (id === "base64") {
    document.querySelector("#base64-output").textContent = "";
    try {
      const input = document.querySelector("#base64-input").value;
      const mode = document.querySelector("#tool-workspace").dataset.mode || "encode";
      const output = mode === "encode" ? btoa(Array.from(new TextEncoder().encode(input), (byte) => String.fromCharCode(byte)).join("")) : new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(atob(input.trim()), (char) => char.charCodeAt(0)));
      document.querySelector("#base64-output").textContent = output;
      setStatus("base64-status", "Conversion complete", false);
    } catch { setStatus("base64-status", `Could not ${document.querySelector("#tool-workspace").dataset.mode || "encode"} input. Check the value and try again.`); }
    return;
  }
  if (id === "jwt") {
    const token = document.querySelector("#jwt-input").value.trim();
    const target = document.querySelector("#jwt-output");
    target.replaceChildren();
    const parts = token.split(".");
    if (parts.length !== 3 || parts.some((part) => !part)) return setStatus("jwt-status", "A JWT must contain three non-empty dot-separated parts.");
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
    } catch { setStatus("jwt-status", "Could not decode token. Check that its header and payload are valid Base64URL-encoded JSON."); }
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
    } catch (error) { document.querySelector("#regex-count").textContent = "Invalid expression"; setStatus("regex-status", error.message); }
    return;
  }
  if (id === "timestamp") {
    const raw = document.querySelector("#timestamp-input").value.trim();
    const mode = document.querySelector("#tool-workspace").dataset.mode || "to-date";
    const unit = document.querySelector("#timestamp-unit").value;
    const output = document.querySelector("#timestamp-output");
    output.replaceChildren();
    let date;
    if (!raw) return setStatus("timestamp-status", "Enter a date or timestamp to convert.");
    if (mode === "to-date") {
      const timestamp = Number(raw);
      if (!Number.isFinite(timestamp)) return setStatus("timestamp-status", "Timestamp must be a valid number.");
      date = new Date(unit === "seconds" ? timestamp * 1000 : timestamp);
    } else {
      date = new Date(raw);
    }
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
    document.querySelector("#url-output").textContent = "";
    try {
      const input = document.querySelector("#url-input").value;
      const mode = document.querySelector("#tool-workspace").dataset.mode || "encode";
      document.querySelector("#url-output").textContent = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
      setStatus("url-status", "Conversion complete", false);
    } catch { setStatus("url-status", "Could not decode this URL component. Check percent-encoded characters."); }
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
  }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;
  if (target.hasAttribute("data-home")) { event.preventDefault(); goHome(); return; }
  if (target.dataset.category) { goHome(target.dataset.category); return; }
  if (target.dataset.filter) { goHome(target.dataset.filter); return; }
  if (target.dataset.tool) { openTool(target.dataset.tool); return; }
  if (target.dataset.copy) {
    const source = document.querySelector(`#${target.dataset.copy}`);
    copyText(source?.value ?? source?.textContent);
    return;
  }
  const active = document.querySelector("#tool-workspace").dataset.activeTool;
  if (target.dataset.json) {
    document.querySelector("#tool-workspace").dataset.jsonMode = target.dataset.json;
    runTool("json");
    return;
  }
  if (target.dataset.mode) {
    const group = target.closest(".segment");
    group.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button === target));
    if (active === "timestamp") {
      document.querySelector("#tool-workspace").dataset.mode = target.dataset.mode;
      const label = document.querySelector("#timestamp-label");
      const input = document.querySelector("#timestamp-input");
      label.textContent = target.dataset.mode === "to-date" ? "UNIX TIMESTAMP" : "DATE / TIME";
      input.placeholder = target.dataset.mode === "to-date" ? "e.g. 1700000000" : "e.g. 2024-01-15T12:30:00";
      document.querySelector("#timestamp-unit").hidden = target.dataset.mode !== "to-date";
    } else {
      document.querySelector("#tool-workspace").dataset.mode = target.dataset.mode;
    }
    return;
  }
  if (target.dataset.run) { runTool(target.dataset.run); return; }
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
