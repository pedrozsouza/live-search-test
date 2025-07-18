import { useState, useEffect, useCallback } from "react";
import type { FavoriteMovie, Movie } from "../types/movie";

const FAVORITES_KEY = "movie-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    }

    const handleFavoritesChange = () => {
      const updatedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (updatedFavorites) {
        try {
          setFavorites(JSON.parse(updatedFavorites));
        } catch (error) {
          console.error("Erro ao carregar favoritos atualizados:", error);
        }
      }
    };

    window.addEventListener("favoritesChanged", handleFavoritesChange);
    return () =>
      window.removeEventListener("favoritesChanged", handleFavoritesChange);
  }, []);

  const saveFavorites = (newFavorites: FavoriteMovie[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));

    window.dispatchEvent(new CustomEvent("favoritesChanged"));
  };

  const addToFavorites = useCallback(
    (movie: Movie, genres: readonly { id: number; name: string }[]) => {
      const movieGenres = movie.genre_ids
        .map((genreId) => {
          const genre = genres.find((g) => g.id === genreId);
          return genre ? genre.name : "";
        })
        .filter(Boolean);

      const favoriteMovie: FavoriteMovie = {
        id: movie.id,
        title: movie.title,
        year: movie.release_date
          ? new Date(movie.release_date).getFullYear().toString()
          : "",
        genres: movieGenres,
        poster_path: movie.poster_path,
      };

      const newFavorites = [...favorites, favoriteMovie];
      saveFavorites(newFavorites);
    },
    [favorites]
  );

  const removeFromFavorites = useCallback(
    (movieId: number) => {
      const newFavorites = favorites.filter((movie) => movie.id !== movieId);
      saveFavorites(newFavorites);
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (movieId: number) => {
      return favorites.some((movie) => movie.id === movieId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (movie: Movie, genres: readonly { id: number; name: string }[]) => {
      if (isFavorite(movie.id)) {
        removeFromFavorites(movie.id);
      } else {
        addToFavorites(movie, genres);
      }
    },
    [isFavorite, removeFromFavorites, addToFavorites]
  );

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}
