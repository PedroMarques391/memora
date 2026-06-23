# Memora

![Memora App Preview](./assets/memora.png)

![TypeScript](https://img.shields.io/badge/TypeScript-5.x_|_6.x-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-latest-black?style=for-the-badge&logo=bun&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-5.56.1-ff3e00?style=for-the-badge&logo=svelte&logoColor=white)
![Elysia](https://img.shields.io/badge/Elysia-latest-white?style=for-the-badge&logo=bun&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI-1.4.15-85EA2D?style=for-the-badge&logo=openapi&logoColor=black)

## Overview

Memora is a modern web application built using a robust monorepo architecture. This repository contains both the frontend and backend applications, along with shared core packages to ensure type safety and code reusability across the stack.

## Project Structure

The project is structured as a monorepo workspace to easily manage dependencies and scripts across both the frontend client and backend API.

```text
memora/
├── back-end/       # Elysia API backend
├── front-end/      # SvelteKit frontend application
├── packages/
│   └── core/       # Shared business logic & types
└── package.json    # Monorepo root
```
