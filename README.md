# Svelte Passkey Demo with Astro

This is a demo of using the [svelte-passkey-component](https://github.com/i-was-a/svelte-passkey-component) with Astro.

This project demonstrates how to integrate the svelte-passkey-component library into an Astro application for passkey-based authentication.

## 🚀 Project Structure

Inside of this Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── PasskeyAuth/
│   │       └── lib/
│   │           ├── components/
│   │           ├── i18n/
│   │           ├── server/
│   │           └── PasskeyAuth.svelte
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── adapters/
│   └── pages/
│       ├── api/
│       │   └── auth/
│       └── index.astro
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [Astro documentation](https://docs.astro.build) or join their [Discord server](https://astro.build/chat).
