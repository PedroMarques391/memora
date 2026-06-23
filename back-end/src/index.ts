import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";
import { auth, OpenAPI } from "./lib/auth";
import { betterAuth } from "./macros/auth-macro";

const app = new Elysia()
  .use(betterAuth)
  .mount(auth.handler)
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
  .get("/", () => "Hello World!")
  .get("/user", ({ user }) => user, {
    auth: true,
  });

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
