# Mayur Paghdal — portfolio

A static, single-page portfolio (HTML + CSS + a little JavaScript). No build step.

```
index.html                     the page
assets/css/style.css           styles (light + dark theme)
assets/js/main.js              theme toggle, architecture diagram, nav highlight, copy buttons
assets/img/favicon.svg         tab icon
assets/resume/...pdf           the "Download résumé" file
.nojekyll                      tells GitHub Pages to serve files as-is
```

## View it locally

Double-click `index.html`, or open it in any browser.

## Publish on GitHub Pages (https://USERNAME.github.io)

1. Sign in to GitHub. Note your username (shown below as `USERNAME`).
2. Create a new repository: **New** → name it exactly `USERNAME.github.io` → **Public** → don't add a README → **Create repository**.
3. In a terminal, from this folder:

   ```bash
   git init -b main
   git add .
   git commit -m "Portfolio"
   git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
   git push -u origin main
   ```

4. On GitHub, open the repository → **Settings** → **Pages**. Under **Build and deployment** set
   **Source: Deploy from a branch**, **Branch: main**, folder **/(root)** → **Save**.
5. Wait 1–2 minutes and open `https://USERNAME.github.io`. The **Actions** tab shows the deploy progress.

### Updating later

Edit the files, then:

```bash
git add .
git commit -m "Update portfolio"
git push
```

The site redeploys automatically within a minute or two.

### Optional: your own domain

Settings → Pages → **Custom domain**, enter e.g. `mayurpaghdal.com`, then add the DNS records GitHub shows
at your domain registrar and tick **Enforce HTTPS** once the certificate is issued.
