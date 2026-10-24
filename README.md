# Avaya Chat Engine Test App

A lightweight test application to verify the Avaya Omni Chat Engine integration. This project is built with React, TypeScript, and Vite, utilizing a locally compiled Chat Engine package.

## Local Development Setup

**1. Initialize the Vite Project**
Create a new React project using Vite's TypeScript template and install the base dependencies:
```bash
npm create vite@latest chat-test -- --template react-ts
cd chat-test
npm install
```

**2. Install the Chat Engine Package**
Because the engine requires baked-in environment variables, install it directly from your locally generated tarball rather than the public npm registry. Replace the path below with the actual location of your file:
```bash
npm install /path/to/chat-engine-1.0.0.tgz
```

**3. Fetch the Application Source**
Download the configured `App.tsx` boilerplate directly from the Git repository, overwriting the default Vite template:
```bash
# Update this URL to point to the raw App.tsx file in your Git repository
curl -o src/App.tsx [https://raw.githubusercontent.com/njfoad/chat-test-repo/main/src/App.tsx](https://raw.githubusercontent.com/njfoad/chat-test-repo/main/src/App.tsx)
```
*(Alternatively, copy and paste the `App.tsx` boilerplate code directly into your local `src/App.tsx` file.)*

**4. Start the Development Server**
Launch the Vite development server to test the integration locally:
```bash
npm run dev
```

## Production Build

When you are ready to deploy the application, generate the optimized static assets:

```bash
npm run build
```

This command bundles the application into the `dist/` directory. You can then copy the contents of `dist/` to your web server's public hosting directory.