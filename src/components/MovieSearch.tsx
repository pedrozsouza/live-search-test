import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { useMovieSearch, useGenres } from "../service/useMovies";
import { useFavorites } from "../hooks/useFavorites";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import MovieItem from "./MovieItem";
import { LoadingSpinner, SearchIcon, LinkIcon } from "../ui/icons";
import type { Movie } from "../types/movie";

interface MovieSearchProps {
  onError?: (error: string | null) => void;
}

const MovieSearch = memo(({ onError }: MovieSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [originalQuery, setOriginalQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isAutoCompleteActive, setIsAutoCompleteActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  
  const debouncedQuery = useDebounce(searchQuery, 300);
  const {
    movies,
    totalResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useMovieSearch(debouncedQuery);
  const { genres, error: genresError } = useGenres();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const infiniteScrollTriggerRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isEnabled: movies.length > 0,
    rootElement: dropdownRef.current,
  });
  
  const formatMovieCount = (count: number): string => {
    if (count === 1) {
      return "1 filme encontrado";
    }
    return `${count} filmes encontrados`;
  };
  const handleMovieSelect = (movie: Movie) => {
    setSearchQuery(movie.title);
    setOriginalQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    setIsAutoCompleteActive(false);
  };
  const showMovies = movies.length > 0;
  const showErrorLinks =
    debouncedQuery.trim().length > 0 && !isLoading && totalResults === 0;

  const shouldShowDropdown = useMemo(
    () => searchQuery.trim().length > 0 && (showMovies || showErrorLinks),
    [searchQuery, showMovies, showErrorLinks]
  );

  const autoComplete = useCallback(() => {
    if (movies.length > 0 && searchQuery.trim()) {
        setOriginalQuery(searchQuery);
        setSearchQuery(movies[0].title);
        setIsAutoCompleteActive(true);
      }
  }, [movies, searchQuery]);

  const revertComplete = useCallback(() => {
    if (originalQuery) {
      setSearchQuery(originalQuery);
      setOriginalQuery("");
      setIsAutoCompleteActive(false);
    }
  }, [originalQuery]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const totalItems = showMovies ? movies.length : showErrorLinks ? 2 : 0;

      switch (e.key) {
        case "ArrowDown":
          if (isOpen && totalItems > 0) {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
          }
          break;
        case "ArrowUp":
          if (isOpen && totalItems > 0) {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          autoComplete();
          break;
        case "ArrowLeft":
          if (isAutoCompleteActive) {
            e.preventDefault();
            revertComplete();
          }
          break;
        case "Enter":
          if (isOpen) {
            e.preventDefault();
            if (
              showMovies &&
              selectedIndex >= 0 &&
              selectedIndex < movies.length
            ) {
              handleMovieSelect(movies[selectedIndex]);
            } else if (showErrorLinks && selectedIndex >= 0) {
              const query = encodeURIComponent(debouncedQuery);
              if (selectedIndex === 0) {
                window.open(`https://www.imdb.com/find?q=${query}`, "_blank");
              } else if (selectedIndex === 1) {
                window.open(
                  `https://www.google.com/search?q=${query} filme`,
                  "_blank"
                );
              }
            }
          }
          break;
        case " ":
          if (
            isOpen &&
            showMovies &&
            selectedIndex !== -1 &&
            selectedIndex < movies.length
          ) {
            e.preventDefault();
            toggleFavorite(movies[selectedIndex], genres);
          }
          break;
        case "Escape":
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
            setSelectedIndex(-1);
            setIsAutoCompleteActive(false);
          }
          break;
      }
    },
    [showMovies, movies, showErrorLinks, isOpen, autoComplete, revertComplete, selectedIndex, debouncedQuery, toggleFavorite, genres, isAutoCompleteActive]
  );

  const handleToggleFavorite = useCallback(
    (movie: Movie) => {
      toggleFavorite(movie, genres);
    },
    [toggleFavorite, genres]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight * 1.5;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    setIsOpen(shouldShowDropdown);
    setSelectedIndex(-1);
    setIsAutoCompleteActive(false);
  }, [shouldShowDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsAutoCompleteActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedIndex >= 0) {
      if (showMovies && selectedItemRef.current) {
        selectedItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      } else if (showErrorLinks && linkRef.current) {
        linkRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex, showMovies, showErrorLinks]);

  useEffect(() => {
    const currentError = error || genresError;
    onError?.(currentError || null);
  }, [error, genresError, onError]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <label
          htmlFor="movie-search"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Pesquise um filme
        </label>
        <div className="relative">
          <input
            id="movie-search"
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchQuery.trim().length > 0 && movies.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder="Ex: Batman, Star Wars, Vingadores..."
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />

          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Utilize as teclas ↓ ↑ para navegar • → para autocompletar • ← para
        reverter • Espaço para favoritar
      </p>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          onScroll={handleScroll}
        >
          {showMovies &&
            movies.map((movie, index) => (
              <div
                key={movie.id}
                ref={index === selectedIndex ? selectedItemRef : null}
              >
                <MovieItem
                  movie={movie}
                  searchTerm={debouncedQuery}
                  isSelected={index === selectedIndex}
                  isFavorite={isFavorite(movie.id)}
                  genres={genres}
                  onToggleFavorite={handleToggleFavorite}
                  isFirstItem={index === 0}
                />
              </div>
            ))}

          {isFetchingNextPage && (
            <div className="flex justify-center items-center p-4">
              <LoadingSpinner />
              <span className="ml-2 text-gray-500">
                Carregando mais filmes...
              </span>
            </div>
          )}

          {showMovies && hasNextPage && !isFetchingNextPage && (
            <div ref={infiniteScrollTriggerRef} className="h-4" />
          )}

          {showMovies && !hasNextPage && movies.length > 0 && (
            <div className="text-center p-4 text-gray-500 text-sm">
              {totalResults > 0
                ? `${movies.length} de ${formatMovieCount(totalResults)}`
                : "Todos os resultados carregados"}
            </div>
          )}

          {showErrorLinks && (
            <div className="p-4">
              <p className="text-gray-600 mb-3">
                Nenhum resultado encontrado para "{debouncedQuery}"
              </p>
              <div className="space-y-2">
                <a
                  ref={selectedIndex === 0 ? linkRef : null}
                  href={`https://www.imdb.com/find?q=${encodeURIComponent(
                    debouncedQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-2 rounded transition-colors ${
                    selectedIndex === 0
                      ? "bg-blue-50 text-blue-700"
                      : "text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    <span>Buscar '{debouncedQuery}' no IMDB</span>
                  </div>
                </a>
                <a
                  ref={selectedIndex === 1 ? linkRef : null}
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    debouncedQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-2 rounded transition-colors ${
                    selectedIndex === 1
                      ? "bg-blue-50 text-blue-700"
                      : "text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <SearchIcon className="w-4 h-4 mr-2" />
                    <span>Buscar '{debouncedQuery}' no Google</span>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

MovieSearch.displayName = "MovieSearch";

export { MovieSearch };
