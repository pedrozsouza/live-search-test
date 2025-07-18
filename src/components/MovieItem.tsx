import { memo, useState, useCallback, useMemo } from "react";
import { getImageUrl } from "../service/api";
import { highlightText } from "../utils/highlightText";
import { getIMDBUrl } from "../utils/imdb";
import type { Movie } from "../types/movie";

interface MovieItemProps {
  movie: Movie;
  searchTerm: string;
  isSelected: boolean;
  isFavorite: boolean;
  genres: readonly { id: number; name: string }[];
  onToggleFavorite: (movie: Movie) => void;
  isFirstItem?: boolean;
}

const MovieItem = memo(
  ({
    movie,
    searchTerm,
    isSelected,
    isFavorite,
    genres,
    onToggleFavorite,
    isFirstItem = false,
  }: MovieItemProps) => {
    const [showFavoriteButton, setShowFavoriteButton] = useState(false);

    const getMovieYear = (releaseDate: string) => {
      return releaseDate ? new Date(releaseDate).getFullYear() : "";
    };

    const getMovieGenres = useCallback(
      (genreIds: readonly number[]) => {
        return genreIds
          .map((genreId) => {
            const genre = genres.find((g) => g.id === genreId);
            return genre ? genre.name : "";
          })
          .filter(Boolean)
          .slice(0, 3)
          .join(", ");
      },
      [genres]
    );

    const handleClick = useCallback(async () => {
      try {
        const imdbUrl = await getIMDBUrl(movie);
        window.open(imdbUrl, "_blank", "noopener,noreferrer");
      } catch (error) {
        console.warn("Error opening IMDB:", error);
      }
    }, [movie]);

    const handleToggleFavorite = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(movie);
      },
      [movie, onToggleFavorite]
    );

    const shouldShowFavoriteButton =
      showFavoriteButton || isSelected || isFavorite;

    const highlightedTitle = useMemo(
      () => highlightText(movie.title, searchTerm),
      [movie.title, searchTerm]
    );

    return (
      <div
        onClick={handleClick}
        onMouseEnter={() => setShowFavoriteButton(true)}
        onMouseLeave={() => setShowFavoriteButton(false)}
        className={`${
          isFirstItem
            ? "flex items-start p-4 cursor-pointer transition-colors border-b border-gray-200"
            : "flex items-center p-3 cursor-pointer transition-colors"
        } ${isSelected ? "bg-blue-50" : "hover:bg-gray-100"}`}
      >
        <div
          className={`flex-shrink-0 mr-3 ${
            isFirstItem ? "w-20 h-28" : "w-12 h-16"
          }`}
        >
          {movie.poster_path ? (
            <img
              src={
                getImageUrl(movie.poster_path, isFirstItem ? "w154" : "w92") ||
                ""
              }
              alt={movie.title}
              className="w-full h-full object-cover rounded"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">Sem imagem</span>
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0">
          <h3
            className={`font-medium text-gray-900 ${
              isFirstItem ? "text-lg mb-2" : "truncate"
            }`}
          >
            {highlightedTitle}{" "}
            {getMovieYear(movie.release_date) && (
              <span className="text-gray-400 font-normal">
                ({getMovieYear(movie.release_date)})
              </span>
            )}
          </h3>

          <div className="flex flex-wrap gap-1 mt-1">
            {getMovieGenres(movie.genre_ids)
              .split(", ")
              .map((genre, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-900 rounded-full"
                >
                  {genre}
                </span>
              ))}
          </div>

          {isFirstItem && (
            <div className="mt-3">
              {movie.overview && (
                <p
                  className="text-sm text-gray-600 line-clamp-3"
                  title={movie.overview}
                >
                  {movie.overview}
                </p>
              )}
            </div>
          )}
        </div>

        {shouldShowFavoriteButton && (
          <button
            onClick={handleToggleFavorite}
            className={`flex-shrink-0 ml-3 p-2 rounded-full transition-all duration-200 ${
              isFavorite
                ? "text-yellow-500 hover:text-yellow-600 scale-100"
                : "text-gray-400 hover:text-yellow-500 scale-100"
            }`}
            title={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            aria-label={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <svg
              className="w-5 h-5"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

MovieItem.displayName = "MovieItem";

export default MovieItem;
