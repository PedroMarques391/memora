import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";
import { auth, OpenAPI } from "./lib/auth";

const app = new Elysia()
  .mount(auth.handler)
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  )
  .get("/", () => "Hello World!");

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
