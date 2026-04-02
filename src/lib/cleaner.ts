export interface CleanOptions {
  stripIndent: boolean
  stripBoxDrawing: boolean
  collapseNewlines: boolean
  stripAnsi: boolean
}

export const defaultOptions: CleanOptions = {
  stripIndent: true,
  stripBoxDrawing: true,
  collapseNewlines: true,
  stripAnsi: true,
}

export function scrub(input: string, options: CleanOptions = defaultOptions): string {
  let text = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  if (options.stripAnsi) text = stripAnsi(text)
  if (options.stripBoxDrawing) text = stripBoxDrawing(text)
  if (options.stripIndent) text = stripIndent(text)
  if (options.collapseNewlines) text = collapseNewlines(text)
  return text
}

export function stripAnsi(text: string): string {
  return text
    .replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '')           // CSI sequences (colors, cursor, private modes)
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, '') // OSC sequences (hyperlinks, window title)
    .replace(/\x1b[@-_][0-~]*/g, '')                    // other two-byte escape sequences
}

export function stripBoxDrawing(text: string): string {
  const boxChars = /[│┃╏╎▌─┬┴┤├┼╭╮╰╯┌┐└┘━┏┓┗┛╔╗╚╝╠╣╦╩╬║═]/g
  return text
    .split('\n')
    .map(line => {
      const stripped = line.replace(boxChars, '').trimEnd()
      return stripped
    })
    .join('\n')
}

export function stripIndent(text: string): string {
  const lines = text.split('\n')
  const result: string[] = []
  let inCodeFence = false

  for (const line of lines) {
    const trimmed = line.trimStart()
    if (/^(`{3,}|~{3,})/.test(trimmed)) {
      inCodeFence = !inCodeFence
    }

    if (inCodeFence) {
      result.push(line)
    } else {
      result.push(line.startsWith('  ') ? line.slice(2) : line)
    }
  }

  return result.join('\n')
}

export function collapseNewlines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n')
}
