# nevplay.music

## Environment variables

This project uses a server-side GitHub token for authenticated release fetching.

1. Copy `.env.example` to `.env.local`.
2. Set your token there:

```text
GITHUB_TOKEN=ghp_your_token_here
```

3. Do not commit `.env.local`.

The token is read on the server only via `process.env.GITHUB_TOKEN` in `lib/github.ts`. It is not exposed to the browser.
