import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { MovieResponse, GenresResponse } from "../types/movie";
import { api } from "./api";

export function useMovieSearch(query: string) {
  const trimmedQuery = query.trim();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery<MovieResponse, Error>({
    queryKey: ["movies", trimmedQuery],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      if (!trimmedQuery) {
        return { results: [], page: 1, total_pages: 0, total_results: 0 };
      }

      const response = await api.get<MovieResponse>("/search/movie", {
        params: {
          query: trimmedQuery,
          page: pageParam as number,
          include_adult: false,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage: MovieResponse) => {
      if (
        lastPage.page < lastPage.total_pages &&
        lastPage.page < 500 &&
        lastPage.results.length > 0
      ) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!trimmedQuery,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const movies = useMemo(
    () => data?.pages.flatMap((page: MovieResponse) => page.results) || [],
    [data?.pages]
  );

  const totalResults = data?.pages[0]?.total_results || 0;

  return {
    movies,
    totalResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: error?.message,
    refetch,
  };
}

export function useGenres() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await api.get<GenresResponse>("/genre/movie/list");
      return response.data.genres;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });

  return {
    genres: data || [],
    isLoading,
    error: error?.message,
  };
}
