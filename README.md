# Developer Toolbox

A lightweight, browser-based collection of everyday developer utilities. No build step or dependencies are required; your inputs stay in the browser.

## Run

Open `index.html` in a modern browser, or serve this directory locally:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Tools

- JSON formatter, validator, and minifier
- Base64 encoder and decoder
- JWT header and payload decoder (does not verify signatures)
- Regular expression tester
- Unix timestamp and date converter
- URL component encoder and decoder
- UUID v4 generator
- SHA-256, SHA-384, and SHA-512 hash generator

The hash generator uses the browser Web Crypto API, which requires HTTPS or localhost.