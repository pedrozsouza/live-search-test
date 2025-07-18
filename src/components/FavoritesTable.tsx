import { memo, useCallback } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { getImageUrl } from "../service/api";
import { getIMDBUrl } from "../utils/imdb";
import { StarIcon, TrashIcon } from "../ui/icons";
import type { FavoriteMovie } from "../types/movie";

const FavoritesTable = memo(() => {
  const { favorites, removeFromFavorites } = useFavorites();

  const handleRemoveFavorite = useCallback(
    (e: React.MouseEvent, movieId: number) => {
      e.stopPropagation();
      e.preventDefault();
      removeFromFavorites(movieId);
    },
    [removeFromFavorites]
  );

  const handleMovieClick = useCallback(async (movie: FavoriteMovie) => {
    try {
      const movieForIMDB = {
        id: movie.id,
        title: movie.title,
        release_date: movie.year ? `${movie.year}-01-01` : "",
      };

      const imdbUrl = await getIMDBUrl(movieForIMDB);
      window.open(imdbUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.warn("Error opening IMDB:", error);
    }
  }, []);

  if (favorites.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Filmes Favoritos
        </h2>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <StarIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum filme favorito
          </h3>
          <p className="text-gray-500">
            Use a tecla espaço para favoritar filmes da lista de sugestões acima
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Filmes Favoritos
      </h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="hidden md:grid md:grid-cols-12 bg-gray-50 border-b border-gray-200 px-6 py-3 text-sm font-medium text-gray-700">
          <div className="col-span-5">Título</div>
          <div className="col-span-1">Ano</div>
          <div className="col-span-4">Gêneros</div>
          <div className="col-span-2">Imagem do pôster</div>
        </div>

        <div className="divide-y divide-gray-200">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-0 p-6 hover:bg-gray-50 transition-colors relative cursor-pointer"
            >
              <div className="md:hidden absolute top-4 right-4">
                <div className="flex-shrink-0 w-16 h-20">
                  {movie.poster_path ? (
                    <img
                      src={getImageUrl(movie.poster_path, "w154") || ""}
                      alt={`Pôster de ${movie.title || "filme"}`}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sem imagem</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-5 flex items-center pr-16 md:pr-0">
                <div>
                  <h3 className="font-medium text-gray-900 text-lg md:text-base">
                    {movie.title || "Título não disponível"}
                  </h3>
                  <div className="md:hidden text-sm text-gray-500 mt-1">
                    {movie.year || "Ano não disponível"}
                  </div>
                </div>
              </div>

              <div className="hidden md:flex md:col-span-1 md:items-center">
                <span className="text-gray-700">{movie.year || "N/A"}</span>
              </div>

              <div className="md:col-span-4 flex items-start md:items-center">
                <div>
                  <div className="md:hidden text-sm font-medium text-gray-700 mb-1">
                    Gêneros:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {movie.genres && movie.genres.length > 0 ? (
                      movie.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {genre}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Gêneros não disponíveis
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-between">
                <div className="hidden md:flex items-center">
                  <div className="flex-shrink-0 w-12 h-16">
                    {movie.poster_path ? (
                      <img
                        src={getImageUrl(movie.poster_path, "w92") || ""}
                        alt={`Pôster de ${movie.title || "filme"}`}
                        className="w-full h-full object-cover rounded"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                          Sem imagem
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleRemoveFavorite(e, movie.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  title="Remover dos favoritos"
                  aria-label={`Remover ${movie.title || "filme"} dos favoritos`}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

FavoritesTable.displayName = "FavoritesTable";

export { FavoritesTable };
