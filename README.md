# Developer Toolbox

A lightweight, browser-based collection of 50 everyday developer utilities. No build step is required. Inputs and files are processed in your browser and are not uploaded.

## Run

Serve this directory locally in a modern browser:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000`. PDF and image tools load PDF-Lib, PDF.js, and JSZip from cdnjs when needed, so those tools require an internet connection. The other tools work without these libraries.

## Tools

- JSON formatter, validator, and minifier
- Base64 encoder and decoder
- JWT header and payload decoder (does not verify signatures)
- Regular expression tester
- Unix timestamp and date converter
- URL component encoder and decoder
- UUID v4 generator
- SHA-256, SHA-384, and SHA-512 hash generator
- PDF compression, merge, split, JPG/PNG export, page count, page rotation, page deletion, page extraction, page reordering, page numbering, and text watermark
- JPG-to-PDF and image-to-PDF conversion
- Image compression, resizing, format conversion, rotation/flipping, cropping, and dimension inspection

PDF compression rasterizes pages to reduce file size; the output keeps their appearance but text is no longer selectable or searchable. Results vary and some PDFs may become larger; the tool reports the size change. PDF and image processing happens locally. Some operations need modern browser APIs and the PDF tools may use substantial memory for large documents.

The hash generator uses the browser Web Crypto API, which requires HTTPS or localhost.