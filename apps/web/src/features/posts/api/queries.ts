import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api/client.ts";

export const postsQueryOptions = (cursor?: string) =>
  queryOptions({
    queryKey: ["posts", { cursor }],
    queryFn: async () => {
      const { data, error } = await api.posts.get({
        query: { cursor, limit: 20 },
      });
      if (error) throw error;
      return data;
    },
  });

export const postQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["posts", id],
    queryFn: async () => {
      const { data, error } = await api.posts({ id }).get();
      if (error) throw error;
      return data;
    },
  });

export function usePosts(cursor?: string) {
  return useQuery(postsQueryOptions(cursor));
}

export function usePost(id: string) {
  return useQuery(postQueryOptions(id));
}
