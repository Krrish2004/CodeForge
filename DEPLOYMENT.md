# Deployment Guide for CodeForge

This guide explains how to set up continuous deployment with GitHub Actions for your CodeForge application.

## Vercel Deployment (Recommended)

The workflow is configured to deploy to Vercel by default, as it provides the best experience for Next.js applications.

### Setting up Vercel Deployment

1. If you don't have a Vercel account, sign up at [vercel.com](https://vercel.com)
2. Install the [Vercel CLI](https://vercel.com/cli) and log in:
   ```bash
   npm i -g vercel
   vercel login
   ```

3. Link your CodeForge project to Vercel:
   ```bash
   vercel link
   ```

4. Get your Vercel token, organization ID, and project ID:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) > Settings > Tokens
   - Create a new token and copy it
   - Run `vercel project ls` to get your project ID
   - Run `vercel org ls` to get your organization ID

5. Add these secrets to your GitHub repository:
   - Go to your GitHub repository > Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID

## Alternative Deployment Options

The workflow file includes commented sections for other deployment options:

### GitHub Pages

To deploy to GitHub Pages instead:

1. Modify your `next.config.js` to include:
   ```js
   module.exports = {
     output: 'export',
     // For GitHub Pages, add your repo name as the basePath if it's not using a custom domain
     basePath: '/CodeForge',
     images: {
       unoptimized: true,
     },
   };
   ```

2. Update your `package.json` scripts to include:
   ```json
   "scripts": {
     "build": "next build",
     "export": "next export"
   }
   ```

3. Uncomment the GitHub Pages deployment section in the workflow file
4. No additional secrets are needed for GitHub Pages deployment

### Netlify

To deploy to Netlify instead:

1. Create a Netlify account and site at [netlify.com](https://netlify.com)
2. Get your Netlify auth token and site ID:
   - Go to User Settings > Applications > Personal access tokens
   - Create a new token and copy it
   - Go to Site settings > General > Site details to find your Site ID

3. Add these secrets to your GitHub repository:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify auth token
   - `NETLIFY_SITE_ID`: Your Netlify site ID

4. Uncomment the Netlify deployment section in the workflow file

## Troubleshooting

If you encounter any issues with the deployment:

1. Check the GitHub Actions run logs for detailed error messages
2. Verify all required secrets are correctly set up
3. Ensure your application builds successfully locally
4. For Vercel-specific issues, check the Vercel dashboard for deployment logs

## Workflow Customization

You can customize the workflow by editing `.github/workflows/node.js.yml`:

- Change the Node.js versions used for testing
- Add environment variables needed for your build
- Modify the deployment configuration based on your needs

For more information, see the [GitHub Actions documentation](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs). 