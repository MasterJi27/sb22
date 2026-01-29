# Deployment Guide

## ✅ Automated Deployment (Recommended)

This repository is configured with GitHub Actions for automatic deployment to GitHub Pages.

### Setup Steps:

1. **Enable GitHub Pages in Repository Settings:**
   - Go to your repository on GitHub
   - Navigate to **Settings** > **Pages**
   - Under "Build and deployment", select:
     - **Source**: GitHub Actions

2. **Trigger Deployment:**
   - The workflow automatically runs on every push to the `main` branch
   - Or manually trigger it from the **Actions** tab using "Deploy to GitHub Pages" workflow

3. **Access Your Site:**
   - After successful deployment, your portfolio will be live at:
   - **https://MasterJi27.github.io/Portfolio/**

### Workflow Status:
Check the deployment status in the **Actions** tab of your repository.

---

## 🔧 Manual Deployment

If you prefer to deploy manually:

### Prerequisites:
```bash
npm install
```

### Option 1: Using gh-pages package (Already configured)

```bash
# Build and deploy in one command
npm run deploy
```

This will:
1. Run `npm run build` (via predeploy script)
2. Push the `dist` folder to `gh-pages` branch

### Option 2: Manual build and deploy

```bash
# 1. Build the production bundle
npm run build

# 2. Deploy dist folder to gh-pages branch
npx gh-pages -d dist
```

---

## 🐛 Troubleshooting

### Issue: Blank white screen on GitHub Pages

**Solution:** This issue has been fixed in this PR by:
1. ✅ Adding the missing React plugin to `vite.config.ts`
2. ✅ Ensuring `base: '/Portfolio/'` is correctly set in vite config
3. ✅ Setting up automated GitHub Actions deployment

### Issue: Authentication failed during manual deploy

If you encounter authentication errors with `npm run deploy`:

1. **Use GitHub Actions** (recommended) - no authentication needed
2. **Or configure Git credentials:**
   ```bash
   # Set up Git to use your GitHub credentials
   git config --global credential.helper store
   # Then run deploy - you'll be prompted for credentials once
   npm run deploy
   ```
3. **Or use the token flag:**
   ```bash
   npx gh-pages -d dist -t your_personal_access_token
   ```

### Issue: 404 errors for assets

Ensure that:
- ✅ `base: '/Portfolio/'` is set in `vite.config.ts`
- ✅ Repository name matches the base path
- ✅ GitHub Pages is enabled in repository settings

---

## 📋 Configuration Files

### vite.config.ts
```typescript
export default defineConfig({
  base: '/Portfolio/',  // Must match repository name
  // ... other config
})
```

### package.json
```json
{
  "homepage": "https://MasterJi27.github.io/Portfolio",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

## ✨ What was Fixed

1. **Missing React Plugin**: Added `@vitejs/plugin-react` to vite config
2. **Base Path**: Already correctly configured as `/Portfolio/`
3. **Build Scripts**: Already set up correctly in package.json
4. **CI/CD**: Added GitHub Actions workflow for automated deployment

---

## 📝 Next Steps After Merging This PR

1. Merge this PR to main branch
2. GitHub Actions will automatically:
   - Install dependencies
   - Build the project
   - Deploy to gh-pages branch
3. Your site will be live at https://MasterJi27.github.io/Portfolio/

No manual deployment needed! 🎉
