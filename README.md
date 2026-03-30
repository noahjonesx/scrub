# scrub

Paste messy Claude Code CLI output on the left, get clean readable text on the right.

**[Try it →](https://noahjonesx.github.io/scrub/)**

## what it does

- strips ANSI escape codes (the `\x1b[31m` garbage)
- removes box-drawing characters (│, ┌, ─, etc.)
- strips 2-space indentation (while leaving code blocks alone)
- collapses excessive blank lines

## local dev

you'll need Node.js

```bash
git clone https://github.com/noahjonesx/scrub
cd scrub
yarn install
yarn dev
```

Open `http://localhost:5173`. Done.

```bash
yarn build   # production build → dist/
yarn test    # run tests
```

## deploy

Push to `main` and GitHub Actions builds + publishes the site automatically.
