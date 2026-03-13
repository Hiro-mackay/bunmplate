import type { IDateProvider } from "@server/shared/application/dateProvider.port.ts";
import type { IIdGenerator } from "@server/shared/application/idGenerator.port.ts";
import { unwrapAsync } from "@server/shared/kernel/result.ts";
import type { AuthGuardPlugin } from "@server/shared/plugin/authGuard.ts";
import type { TransactionPlugin } from "@server/shared/plugin/transactionPlugin.ts";
import { Elysia, t } from "elysia";
import { createPost } from "../application/useCases/createPost.ts";
import { deletePost } from "../application/useCases/deletePost.ts";
import { getPost } from "../application/useCases/getPost.ts";
import { listPosts, MAX_LIMIT } from "../application/useCases/listPosts.ts";
import { updatePost } from "../application/useCases/updatePost.ts";
import { CONTENT_MAX_LENGTH, CONTENT_MIN_LENGTH } from "../domain/valueObjects/content.ts";
import { TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from "../domain/valueObjects/title.ts";
import { createPostsDeps } from "../ioc.ts";

interface PostsControllerConfig {
  idGenerator: IIdGenerator;
  dateProvider: IDateProvider;
}

export function postController(
  txPlugin: TransactionPlugin,
  authGuardPlugin: AuthGuardPlugin,
  config: PostsControllerConfig,
) {
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
        limit: t.Optional(t.Number({ minimum: 1, maximum: MAX_LIMIT })),
      }),
    })
    .get("/:id", ({ params, deps }) => unwrapAsync(getPost(params.id, deps)), {
      params: t.Object({ id: t.String() }),
    });

  const titleSchema = t.String({ minLength: TITLE_MIN_LENGTH, maxLength: TITLE_MAX_LENGTH });
  const contentSchema = t.String({ minLength: CONTENT_MIN_LENGTH, maxLength: CONTENT_MAX_LENGTH });

  const protectedRoutes = new Elysia({ prefix: "/posts" })
    .use(txPlugin)
    .use(authGuardPlugin)
    .resolve(({ tx }) => ({ deps: createPostsDeps(tx, depsConfig) }))
    .post(
      "/",
      ({ body, auth, deps, set }) => {
        set.status = 201;
        return unwrapAsync(createPost(body, auth.userId, deps));
      },
      {
        body: t.Object({
          title: titleSchema,
          content: contentSchema,
        }),
      },
    )
    .patch(
      "/:id",
      ({ params, body, auth, deps }) => unwrapAsync(updatePost(params.id, body, auth.userId, deps)),
      {
        params: t.Object({ id: t.String() }),
        body: t.Union([
          t.Object({ title: titleSchema, content: t.Optional(contentSchema) }),
          t.Object({ title: t.Optional(titleSchema), content: contentSchema }),
        ]),
      },
    )
    .delete(
      "/:id",
      ({ params, auth, deps }) => unwrapAsync(deletePost(params.id, auth.userId, deps)),
      {
        params: t.Object({ id: t.String() }),
      },
    );

  return new Elysia().use(publicRoutes).use(protectedRoutes);
}
