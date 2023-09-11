import { Elysia, t } from "elysia";

const app = new Elysia()
  .get('/hello',() =>'hello world')
  .post("/sign-in", ({ body }) => (body), {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  })
  .listen(8007);

export type App = typeof app;
