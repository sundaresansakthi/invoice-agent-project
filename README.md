# invoice_agent Cloudflare Worker Project

This project contains a static UI and a Cloudflare Worker backend exposing two API endpoints:

- `POST /reconcile` - performs simple reconciliation logic (overdue detection, duplicate detection)
- `POST /draft_email` - returns a plain text email draft

## Local files included

- `public/index.html` - static UI which lists invoices and payments and can call `/reconcile`
- `public/invoices.json` - sample invoice data
- `public/payments.json` - sample payment data
- `src/index.ts` - Cloudflare Worker TypeScript source
- `wrangler.toml` - Cloudflare configuration
- `openapi.yaml` - OpenAPI description (update servers.url with your worker domain)

## Node installer (you previously uploaded this file on this machine)
The Windows Node.js installer you downloaded is available locally at:

`/mnt/data/node-v24.11.1-x64.msi`

Use that MSI to install Node.js on your Windows machine if you haven't already.

## Quick start

1. Install Node.js (use the local MSI above or download from https://nodejs.org)
2. Install Wrangler:
   ```
   npm install -g wrangler
   ```
3. Login:
   ```
   wrangler login
   ```
4. From this project folder, deploy:
   ```
   wrangler publish
   ```

Update `openapi.yaml` servers.url to your deployed worker domain (example: `https://invoice_agent.yourname.workers.dev`) and then import into Orchestrate.

