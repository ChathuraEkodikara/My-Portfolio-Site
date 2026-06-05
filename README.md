# Portfolio Website

This is a static portfolio website built with `index.html`, `style.css`, and `app.js`.

## Deploy on GitHub

1. Initialize Git in the project folder:
   ```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a repository on GitHub and add the remote:
   ```bash
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

3. The included GitHub Actions workflow will publish the site automatically to GitHub Pages on every push to `main`.

4. After the first successful push, open your repository on GitHub and go to `Settings > Pages` to confirm the published site URL.

## GitHub Pages URL

Your site will typically be available at:

- `https://<username>.github.io/<repo>` for a repository site

If you want a custom domain, configure it in the Pages settings.
