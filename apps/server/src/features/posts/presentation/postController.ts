import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import type { IIdGenerator } from "@server/shared/application/idGenerator.port.ts";
import { createAuthGuard } from "@server/shared/plugin/authGuard.ts";
import type { TransactionPlugin } from "@server/shared/plugin/transactionPlugin.ts";
import { Elysia, t } from "elysia";
import { createPost } from "../application/useCases/createPost.ts";
import { deletePost } from "../application/useCases/deletePost.ts";
import { getPost } from "../application/useCases/getPost.ts";
import { listPosts } from "../application/useCases/listPosts.ts";
import { updatePost } from "../application/useCases/updatePost.ts";
import { TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from "../domain/valueObjects/title.ts";
import { createPostsDeps } from "../ioc.ts";

const CONTENT_MAX_LENGTH = 10000;

interface PostsControllerConfig {
  jwtSecret: string;
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
}

export function postController(txPlugin: TransactionPlugin, config: PostsControllerConfig) {
  const depsConfig = {
    idGenerator: config.idGenerator,
    dateProvider: config.dateProvider,
  };

  const publicRoutes = new Elysia({ prefix: "/posts" })
    .use(txPlugin)
    .resolve(({ tx }) => ({ deps: createPostsDeps(tx, depsConfig) }))
    .get("/", ({ query, deps }) => listPosts(query, deps), {
      query: t.Object({
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
      }),
    })
    .get("/:id", ({ params, deps }) => getPost(params.id, deps), {
      params: t.Object({ id: t.String() }),
    });

  const titleSchema = t.String({ minLength: TITLE_MIN_LENGTH, maxLength: TITLE_MAX_LENGTH });
  const contentSchema = t.String({ minLength: 1, maxLength: CONTENT_MAX_LENGTH });

  const protectedRoutes = new Elysia({ prefix: "/posts" })
    .use(txPlugin)
    .use(createAuthGuard(config.jwtSecret))
    .resolve(({ tx }) => ({ deps: createPostsDeps(tx, depsConfig) }))
    .post("/", ({ body, auth, deps }) => createPost(body, auth.userId, deps), {
      body: t.Object({
        title: titleSchema,
        content: contentSchema,
      }),
    })
    .put("/:id", ({ params, body, auth, deps }) => updatePost(params.id, body, auth.userId, deps), {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(titleSchema),
        content: t.Optional(contentSchema),
      }),
    })
    .delete("/:id", ({ params, auth, deps }) => deletePost(params.id, auth.userId, deps), {
      params: t.Object({ id: t.String() }),
    });

  return new Elysia().use(publicRoutes).use(protectedRoutes);
}
