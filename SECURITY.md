# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for
receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by
**opening a GitHub Security Advisory** instead of using public issues.

### How to Report

1. Go to the [Security tab](https://github.com/srefsland/nyt-connections-clone/security) of this repository
2. Click on "Report a vulnerability"
3. Fill out the security advisory form with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

Alternatively, you can email the maintainers directly if you prefer private disclosure.

### What to Include

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, CSRF, SQL Injection, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours of receiving the report
- **Status Update**: Within 7 days with an assessment and expected timeline
- **Fix Release**: Depends on severity and complexity, typically within 30 days

## Security Best Practices

When using this project:

### For Development

- Never commit secrets, API keys, or credentials to the repository
- Use environment variables for sensitive configuration
- Keep dependencies up to date (Dependabot is enabled)
- Run `npm audit` regularly to check for vulnerabilities
- Use the provided pre-commit hooks to catch issues early

### For Deployment

- Always use HTTPS in production
- Set secure headers (CSP, HSTS, X-Frame-Options, etc.)
- Keep Docker images updated
- Use secrets management for sensitive data
- Enable security scanning in your CI/CD pipeline
- Regularly update dependencies and base images
- Follow the principle of least privilege for container permissions

### Environment Variables

- Never expose sensitive environment variables to the client
- Use `NEXT_PUBLIC_` prefix only for non-sensitive client-side variables
- Rotate secrets regularly
- Use different credentials for development, staging, and production

## Known Security Considerations

### Client-Side Application

This is a client-side web application built with Next.js. Be aware:

- All client-side code is visible to users
- Don't store sensitive data in browser storage
- Be cautious with third-party dependencies
- Validate all user inputs

### Dependencies

We use automated tools to monitor dependencies:

- **Dependabot**: Automated dependency updates
- **npm audit**: Regular security audits
- **GitHub Security Advisories**: Automatic vulnerability alerts

Run security checks:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# View detailed security report
npm audit --json
```

## Security Updates

Security updates will be released as needed and announced:

- In the [CHANGELOG.md](CHANGELOG.md)
- As GitHub Security Advisories
- In release notes

## Disclosure Policy

- Security issues are treated with high priority
- We follow responsible disclosure practices
- Public disclosure only after a fix is available
- Credit will be given to reporters (if desired)

## Security Tools

This project uses:

- **ESLint**: Code quality and security linting
- **Dependabot**: Automated dependency updates
- **GitHub Actions**: Automated security checks in CI
- **Docker**: Container security with multi-stage builds

## Contact

For security-related questions or concerns that aren't vulnerabilities:

- Open a discussion in the [Discussions tab](https://github.com/srefsland/nyt-connections-clone/discussions)
- Contact the maintainers through GitHub

## Attribution

This security policy is based on best practices from:
- [GitHub Security Lab](https://securitylab.github.com/)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/pages/building-your-application/configuring/best-practices)

Thank you for helping keep this project and its users safe! 🔒
