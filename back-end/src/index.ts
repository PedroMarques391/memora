import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";
import { OpenAPI } from "./lib/auth";
import { betterAuth } from "./macros/auth-macro";
import { deckRoutes } from "./modules/deck/deck.router";

const elysiaSetup = new Elysia({ prefix: "/api/v1", name: "memora-api" })
  .use(betterAuth)
  .onStart(() => {
    console.log(
      `🦊 Elysia is running at ${elysiaSetup.server?.hostname}:${elysiaSetup.server?.port}`,
    );
  })
  .onStop(() => {
    console.log("🦊 Memora API is shutting down");
  });

export type ElysiaSetup = typeof elysiaSetup;

const app = elysiaSetup
  .group("/decks", (app) => app.use(deckRoutes))
  .use(
    openapi({
      documentation: {
        info: {
          title: "@memora/API",
          description:
            "Example of using Memora API with Elysia and Better Auth.",
          version: "1.0.0",
        },
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  )
  .get(
    "/",
    () =>
      "Hi, this is the Memora API. Please refer to the documentation at /openapi for more information.",
  )
  .get("/user", ({ user }) => user, {
    auth: true,
  });

app.listen(3000);
