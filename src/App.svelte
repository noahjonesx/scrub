<script lang="ts">
  import { scrub, defaultOptions, type CleanOptions } from './lib/cleaner'

  let input = $state('')
  let options: CleanOptions = $state({ ...defaultOptions })
  let copied = $state(false)

  let output = $derived(input ? scrub(input, options) : '')
  let inputLines = $derived(input ? input.split('\n').length : 0)
  let outputLines = $derived(output ? output.split('\n').length : 0)
  let inputBytes = $derived(new TextEncoder().encode(input).length)
  let outputBytes = $derived(new TextEncoder().encode(output).length)
  let reduction = $derived(inputBytes > 0 ? Math.round((1 - outputBytes / inputBytes) * 100) : 0)

  async function copyOutput() {
    if (!output) return
    await navigator.clipboard.writeText(output)
    copied = true
    setTimeout(() => (copied = false), 2000)
  }

  function clear() {
    input = ''
  }

  const toggles = [
    { key: 'stripIndent' as keyof CleanOptions,     label: 'strip indent' },
    { key: 'stripBoxDrawing' as keyof CleanOptions,  label: 'remove box chars' },
    { key: 'collapseNewlines' as keyof CleanOptions, label: 'collapse newlines' },
    { key: 'stripAnsi' as keyof CleanOptions,        label: 'strip ansi' },
  ]
</script>

<div class="app">
  <header>
    <div class="brand">
      <span class="dot"></span>
      <h1>scrub</h1>
    </div>
    <div class="header-right">
      {#if reduction > 0}
        <span class="badge">{reduction}% cleaner</span>
      {/if}
    </div>
  </header>

  <div class="controls">
    {#each toggles as t}
      <label class="toggle" class:on={options[t.key]}>
        <input type="checkbox" bind:checked={options[t.key]} />
        <span class="track"><span class="thumb"></span></span>
        <span class="tlabel">{t.label}</span>
      </label>
    {/each}
  </div>

  <main>
    <div class="panel">
      <div class="panel-top">
        <span class="panel-name">input</span>
        <div class="panel-actions">
          {#if input}
            <span class="meta">{inputLines} lines · {inputBytes}b</span>
            <button class="btn ghost" onclick={clear}>clear</button>
          {/if}
        </div>
      </div>
      <textarea
        class="editor"
        placeholder="paste dirty output here"
        bind:value={input}
        spellcheck="false"
        autocomplete="off"
        autocorrect="off"
      ></textarea>
    </div>

    <div class="split"></div>

    <div class="panel">
      <div class="panel-top">
        <span class="panel-name">output</span>
        <div class="panel-actions">
          {#if output}
            <span class="meta">{outputLines} lines · {outputBytes}b</span>
          {/if}
          <button class="btn accent" onclick={copyOutput} disabled={!output}>
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
      </div>
      <textarea
        class="editor"
        readonly
        value={output}
        placeholder="clean output appears here"
      ></textarea>
    </div>
  </main>
</div>

<style>
  :root {
    --bg:         #0a0a0a;
    --surface:    #111111;
    --surface2:   #161616;
    --border:     #1e1e1e;
    --border-hi:  #2a2a2a;
    --green:      #22c55e;
    --green-dim:  #15803d;
    --green-glow: rgba(34, 197, 94, 0.18);
    --text:       #e2e2e2;
    --text-muted: #555;
    --text-faint: #2a2a2a;
    --mono: 'Cascadia Code', 'Fira Code', 'SF Mono', 'Consolas', monospace;
    --sans: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  }

  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg);
  }

  /* ── Header ──────────────────────────────── */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green-glow), 0 0 16px var(--green-glow);
    flex-shrink: 0;
  }

  h1 {
    font-family: var(--mono);
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: 0.04em;
    margin: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .badge {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--green);
    background: rgba(34, 197, 94, 0.08);
    border: 1px solid rgba(34, 197, 94, 0.2);
    padding: 3px 9px;
    border-radius: 20px;
    letter-spacing: 0.03em;
  }

  /* ── Controls ────────────────────────────── */
  .controls {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 8px 24px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    user-select: none;
  }

  .toggle input { display: none; }

  .track {
    width: 28px;
    height: 16px;
    border-radius: 8px;
    background: var(--surface2);
    border: 1px solid var(--border-hi);
    position: relative;
    flex-shrink: 0;
    transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  }

  .thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--text-muted);
    transition: transform 0.2s, background 0.2s;
  }

  .toggle.on .track {
    background: rgba(34, 197, 94, 0.12);
    border-color: var(--green-dim);
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.1);
  }

  .toggle.on .thumb {
    transform: translateX(12px);
    background: var(--green);
  }

  .tlabel {
    font-family: var(--sans);
    font-size: 12px;
    color: var(--text-muted);
    transition: color 0.15s;
  }

  .toggle.on .tlabel {
    color: #888;
  }

  .toggle:hover .tlabel {
    color: var(--text);
  }

  /* ── Panels ──────────────────────────────── */
  main {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    min-height: 0;
  }

  .split {
    background: var(--border);
  }

  .panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .panel-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .panel-name {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .panel-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .meta {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-faint);
    letter-spacing: 0.02em;
  }

  /* ── Buttons ─────────────────────────────── */
  .btn {
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    padding: 4px 12px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
    letter-spacing: 0.01em;
  }

  .btn:disabled {
    opacity: 0.25;
    cursor: default;
  }

  .btn.ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border-hi);
  }

  .btn.ghost:hover:not(:disabled) {
    background: var(--surface2);
    color: var(--text);
    border-color: #383838;
  }

  .btn.accent {
    background: rgba(34, 197, 94, 0.1);
    color: var(--green);
    border: 1px solid rgba(34, 197, 94, 0.2);
  }

  .btn.accent:hover:not(:disabled) {
    background: rgba(34, 197, 94, 0.18);
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.12);
  }

  /* ── Editor ──────────────────────────────── */
  .editor {
    flex: 1;
    width: 100%;
    padding: 18px 22px;
    background: transparent;
    border: none;
    color: var(--text);
    font-family: var(--mono);
    font-size: 13px;
    line-height: 1.65;
    resize: none;
    outline: none;
    min-height: 0;
    caret-color: var(--green);
  }

  .editor::placeholder {
    color: var(--text-faint);
  }

  /* ── Mobile ──────────────────────────────── */
  @media (max-width: 768px) {
    main {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1px 1fr;
    }
    .split {
      width: 100%;
      height: 1px;
    }
  }
</style>
