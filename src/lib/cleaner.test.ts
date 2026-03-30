import { describe, it, expect } from 'vitest'
import { scrub, stripAnsi, stripBoxDrawing, stripIndent, collapseNewlines } from './cleaner'

describe('scrub', () => {
  it('strips 2-space indent from plain text', () => {
    const input = '  Hello world\n  This is indented'
    expect(scrub(input)).toBe('Hello world\nThis is indented')
  })

  it('preserves indentation inside code fences after stripping outer indent', () => {
    const input = '  ```js\n    const x = 1\n  ```'
    const result = scrub(input)
    expect(result).toBe('```js\n  const x = 1\n```')
  })

  it('removes box-drawing characters', () => {
    const input = '  │ some output │'
    const result = scrub(input)
    expect(result).toContain('some output')
    expect(result).not.toContain('│')
  })

  it('collapses 3+ newlines to 2', () => {
    const input = 'line1\n\n\n\nline2'
    expect(scrub(input)).toBe('line1\n\nline2')
  })

  it('strips ANSI escape codes', () => {
    const input = '  \x1b[1mBold text\x1b[0m'
    expect(scrub(input)).toBe('Bold text')
  })

  it('handles empty input', () => {
    expect(scrub('')).toBe('')
  })

  it('handles input with no issues', () => {
    const input = 'clean text'
    expect(scrub(input)).toBe('clean text')
  })
})

describe('stripAnsi', () => {
  it('removes color codes', () => {
    expect(stripAnsi('\x1b[31mred\x1b[0m')).toBe('red')
  })

  it('removes multiple escape sequences', () => {
    expect(stripAnsi('\x1b[1m\x1b[32mgreen bold\x1b[0m')).toBe('green bold')
  })
})

describe('stripBoxDrawing', () => {
  it('removes box-drawing border lines', () => {
    expect(stripBoxDrawing('╭─────────╮')).toBe('')
  })

  it('removes inline box chars but keeps text', () => {
    expect(stripBoxDrawing('│ hello │')).toBe(' hello')
  })
})

describe('stripIndent', () => {
  it('removes 2-space prefix', () => {
    expect(stripIndent('  line1\n  line2')).toBe('line1\nline2')
  })

  it('leaves lines without 2-space prefix unchanged', () => {
    expect(stripIndent('no indent')).toBe('no indent')
  })
})

describe('collapseNewlines', () => {
  it('collapses 4 newlines to 2', () => {
    expect(collapseNewlines('a\n\n\n\nb')).toBe('a\n\nb')
  })

  it('leaves 2 newlines alone', () => {
    expect(collapseNewlines('a\n\nb')).toBe('a\n\nb')
  })
})
