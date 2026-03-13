import { Elysia } from "elysia";

const HEADER_NAME = "x-request-id";

export const requestIdPlugin = new Elysia({ name: "request-id-plugin" }).derive(
  ({ request, set }) => {
    const requestId = request.headers.get(HEADER_NAME) ?? crypto.randomUUID();
    set.headers[HEADER_NAME] = requestId;
    return { requestId };
  },
);
