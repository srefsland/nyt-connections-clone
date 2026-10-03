# Contributing to NYT Connections Clone

Thank you for considering contributing to this project! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

Be respectful, welcoming, and considerate of others. We're all here to learn and improve.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/nyt-connections-clone.git`
3. Add the upstream remote: `git remote add upstream https://github.com/srefsland/nyt-connections-clone.git`

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/srefsland/nyt-connections-clone/issues)
- If not, open a new issue with:
  - Clear, descriptive title
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Screenshots if applicable
  - Your environment (OS, browser, Node version)

### Suggesting Enhancements

- Open an issue with the "enhancement" label
- Describe the feature and why it would be useful
- Include examples or mockups if applicable

### Code Contributions

1. Find an issue to work on or create one
2. Comment on the issue to let others know you're working on it
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Development Setup

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Pull Request Process

1. **Update Documentation**: Update README.md if you change functionality
2. **Follow Coding Standards**: Ensure your code follows the project's style
3. **Test**: Make sure `npm run lint` passes
4. **Write Clear Commit Messages**: Use descriptive commit messages
   - Format: `type: brief description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   - Example: `feat: add dark mode toggle`
5. **Keep PRs Focused**: One feature/fix per PR
6. **Update Your Branch**: Rebase on upstream/master if needed
7. **Be Patient**: Wait for review and address feedback

### PR Title Format

- `feat: add new game mode`
- `fix: correct scoring logic`
- `docs: update deployment guide`
- `style: improve button styling`
- `refactor: reorganize components`
- `test: add unit tests for game logic`
- `chore: update dependencies`

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Prefer functional components and hooks
- Use meaningful variable and function names
- Keep functions small and focused
- Comment complex logic

### React Best Practices

- Use functional components
- Leverage React hooks appropriately
- Keep components small and reusable
- Avoid prop drilling - use context when needed
- Follow the existing component structure

### File Structure

```
app/
├── _components/      # Reusable components
├── _hooks/          # Custom hooks
├── _types.ts        # TypeScript types
├── _utils.ts        # Utility functions
└── page.tsx         # Main page component
```

### Styling

- Use Tailwind CSS classes
- Follow existing naming conventions
- Keep styles consistent with the design

## Testing

Currently, the project uses ESLint for code quality:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

Future: Unit tests with Jest and React Testing Library will be added.

## Questions?

Feel free to ask questions by:
- Opening a GitHub issue
- Commenting on existing issues
- Reaching out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
