# GitHub Secrets Setup Guide

This guide explains how to set up GitHub repository secrets for CI/CD workflows.

## Overview

GitHub Secrets are encrypted environment variables that you can use in your GitHub Actions workflows. They're essential for storing sensitive information like API keys, tokens, and credentials that your CI/CD pipeline needs but shouldn't be exposed in your code.

## Why Use Secrets?

- **Security**: Keep sensitive data out of your codebase
- **Flexibility**: Change values without modifying code
- **Access Control**: Only authorized workflows can access secrets
- **Compliance**: Meet security requirements for production deployments

---

## Required Secrets for This Project

### 1. CODECOV_TOKEN (Optional but Recommended)

**Purpose**: Allows uploading test coverage reports to Codecov for tracking code coverage over time.

**How to set it up:**

1. Sign up for a free account at [codecov.io](https://codecov.io)
2. Link your GitHub account
3. Add your repository to Codecov
4. Copy the repository upload token from Codecov dashboard
5. Add it to GitHub (see steps below)

**Note**: The CI workflow is configured with `fail_ci_if_error: false`, so the build won't fail if this token is missing. Coverage upload will simply be skipped.

---

## How to Add Secrets to GitHub

### Step-by-Step Instructions

1. **Navigate to Your Repository Settings**
   - Go to your repository on GitHub
   - Click the "Settings" tab (you need admin access)

2. **Access Secrets and Variables**
   - In the left sidebar, click "Secrets and variables"
   - Click "Actions"

3. **Add a New Secret**
   - Click the "New repository secret" button
   - Enter the secret name (e.g., `CODECOV_TOKEN`)
   - Paste the secret value
   - Click "Add secret"

4. **Verify Secret Was Added**
   - The secret should now appear in the list
   - The value will be hidden (shown as `***`)

### Screenshot Reference

```
Repository Settings
├── Secrets and variables
│   └── Actions
│       ├── Repository secrets
│       │   ├── CODECOV_TOKEN ••••••••
│       │   └── [Add new secret button]
│       └── Environment secrets
```

---

## Using Secrets in Workflows

Secrets are accessed in workflow files using the `secrets` context:

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
```

**Important**: Never echo or print secret values in your workflow logs, as this could expose them.

---

## Security Best Practices

### Do's ✅

- **Rotate secrets regularly**: Update tokens and keys periodically
- **Use least privilege**: Only grant necessary permissions
- **Limit secret scope**: Use environment secrets when possible
- **Delete unused secrets**: Clean up old/unused secrets
- **Use separate secrets for different environments**: Don't reuse production secrets in development

### Don'ts ❌

- **Never commit secrets to code**: Use `.gitignore` and `.env.example` patterns
- **Don't log secret values**: Avoid `echo ${{ secrets.SECRET_NAME }}`
- **Don't share secrets via insecure channels**: Use secret management tools
- **Don't hardcode secrets in workflows**: Always use the secrets context
- **Don't use secrets in pull requests from forks**: GitHub automatically protects against this

---

## Common Secrets for Web Applications

Here are examples of secrets you might need as the project grows:

### API Keys and Tokens

- `OPENAI_API_KEY`: For LLM-generated flashcards
- `ANTHROPIC_API_KEY`: For Claude API integration
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Database Credentials

- `DATABASE_URL`: PostgreSQL connection string for production
- `DATABASE_PASSWORD`: Database password

### Deployment Keys

- `VERCEL_TOKEN`: For deploying to Vercel
- `AWS_ACCESS_KEY_ID`: For AWS deployments
- `AWS_SECRET_ACCESS_KEY`: AWS secret key

### Monitoring and Analytics

- `SENTRY_DSN`: Error tracking with Sentry
- `DATADOG_API_KEY`: Application monitoring

---

## Environment-Specific Secrets

For larger projects, you can create environment-specific secrets:

1. Go to Settings → Environments
2. Create environments (e.g., `staging`, `production`)
3. Add secrets specific to each environment

This allows using different values for development, staging, and production.

---

## Troubleshooting

### Secret Not Working in Workflow

**Symptoms**: Workflow fails with authentication errors

**Solutions**:
1. Verify the secret name matches exactly (case-sensitive)
2. Check the secret value is correct (no extra spaces)
3. Ensure the workflow has permission to access secrets
4. For forked repos, secrets are not available for security reasons

### Token Expired

**Symptoms**: API calls fail with 401/403 errors

**Solutions**:
1. Generate a new token from the service provider
2. Update the secret in GitHub Settings
3. Re-run the failed workflow

### Cannot Add Secrets (Permission Denied)

**Symptoms**: "Settings" tab is missing or grayed out

**Solutions**:
1. You need admin access to the repository
2. Ask the repository owner to add you as an admin or add the secret for you
3. For organization repos, check organization-level permissions

---

## Testing Without Secrets

For local development and testing, you can:

1. **Create a `.env.local` file** (add to `.gitignore`):
   ```bash
   CODECOV_TOKEN=your-token-here
   ```

2. **Use environment variables**:
   ```bash
   export CODECOV_TOKEN=your-token-here
   npm test
   ```

3. **Skip optional features**: Many CI checks are configured to continue even if secrets are missing

---

## Auditing Secret Usage

To see which workflows use which secrets:

1. Go to Settings → Secrets and variables → Actions
2. Click on a secret name
3. View "Used by workflows" section

This helps track secret usage and identify secrets that can be safely deleted.

---

## For Students: Learning Exercise

### Exercise 1: Set Up Codecov

1. Create a free Codecov account
2. Add this repository to Codecov
3. Get the upload token
4. Add `CODECOV_TOKEN` secret to GitHub
5. Push a commit and watch coverage report upload

**What you'll learn**: How to integrate third-party services using secrets

### Exercise 2: Simulate Secret Rotation

1. Create a test secret (e.g., `TEST_SECRET`)
2. Use it in a custom workflow
3. Update the secret value
4. Verify the workflow uses the new value

**What you'll learn**: Secret rotation practices

### Exercise 3: Environment Secrets

1. Create two environments: `staging` and `production`
2. Add different values for `DATABASE_URL` in each
3. Create a deployment workflow that uses environment-specific secrets

**What you'll learn**: Managing multi-environment configurations

---

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Codecov Documentation](https://docs.codecov.com/)
- [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## Summary

Secrets are a critical part of CI/CD security. Key takeaways:

1. **Always use secrets** for sensitive data, never hardcode
2. **Limit access** to secrets using environments and permissions
3. **Rotate regularly** to maintain security
4. **Test locally** using `.env` files (don't commit them!)
5. **Monitor usage** and clean up unused secrets

By following these practices, you'll build secure, maintainable CI/CD pipelines that protect sensitive information while enabling powerful automation.
