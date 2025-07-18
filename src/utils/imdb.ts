import type { Movie } from "../types/movie";
import { api } from "../service/api";

const imdbCache = new Map<number, string>();

export const getIMDBUrl = async (movie: Movie): Promise<string> => {
  const cachedUrl = imdbCache.get(movie.id);
  if (cachedUrl) {
    return cachedUrl;
  }

  try {
    const response = await api.get(`/movie/${movie.id}/external_ids`);
    const imdbId = response.data?.imdb_id;

    if (imdbId) {
      const url = `https://www.imdb.com/title/${imdbId}/`;
      imdbCache.set(movie.id, url);
      return url;
    }
  } catch (error) {
    console.error("Error fetching IMDB ID", error);
  }

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const searchQuery = `${movie.title}${year ? ` ${year}` : ""}`;
  const fallbackUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
    searchQuery
  )}&s=tt&ttype=ft`;

  imdbCache.set(movie.id, fallbackUrl);
  return fallbackUrl;
};