import { memo, useState, useMemo } from "react";
import { getImageUrl } from "../service/api";
import { highlightText } from "../utils/highlightText";
import { getIMDBUrl } from "../utils/imdb";
import { StarFavoriteIcon } from "../ui/icons";
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

    const getMovieGenres = (genreIds: readonly number[]) => {
      return genreIds
        .map((genreId) => {
          const genre = genres.find((g) => g.id === genreId);
          return genre ? genre.name : "";
        })
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");
    };

    const handleClick = async () => {
      try {
        const imdbUrl = await getIMDBUrl(movie);
        window.open(imdbUrl, "_blank", "noopener,noreferrer");
      } catch (error) {
        console.warn("Error opening IMDB:", error);
      }
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(movie);
    };

    const shouldShowFavoriteButton =
      showFavoriteButton || isSelected || isFavorite;

    const highlightedTitle = useMemo(
      () => highlightText(movie.title, searchTerm),
      [movie.title, searchTerm]
    );

    const fullTitle = `${movie.title} (${getMovieYear(movie.release_date)})`;

    return (
      <div
        onClick={handleClick}
        onMouseEnter={() => setShowFavoriteButton(true)}
        onMouseLeave={() => setShowFavoriteButton(false)}
        className={`${
          isFirstItem
            ? "flex items-start p-4 cursor-pointer transition-colors border-b border-gray-200"
            : "flex items-center p-3 cursor-pointer transition-colors"
        } ${isSelected ? "bg-blue-50" : "hover:bg-gray-100"} relative`}
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

        <div className="flex-grow min-w-0 pr-8">
          <h3
            className={`font-medium text-gray-900 ${
              isFirstItem ? "text-lg mb-2" : "text-sm"
            }`}
            title={fullTitle}
          >
            <span className="truncate block">
              {highlightedTitle}{" "}
              {getMovieYear(movie.release_date) && (
                <span className="text-gray-400 font-normal">
                  ({getMovieYear(movie.release_date)})
                </span>
              )}
            </span>
          </h3>

          {getMovieGenres(movie.genre_ids) && (
            <div className="flex flex-wrap gap-1 mt-1">
              {getMovieGenres(movie.genre_ids)
                .split(", ")
                .map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-900 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          )}

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
            className={`p-2 rounded-full transition-all duration-200 ${
              isFavorite
                ? "text-yellow-500 hover:text-yellow-600 scale-100"
                : "text-gray-400 hover:text-yellow-500 scale-100"
            } absolute top-2 right-2 z-10`}
            title={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            aria-label={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <StarFavoriteIcon isFilled={isFavorite} />
          </button>
        )}
      </div>
    );
  }
);

MovieItem.displayName = "MovieItem";

export default MovieItem;
