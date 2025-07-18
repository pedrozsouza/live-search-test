import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MovieSearch } from "../MovieSearch";
import { useMovieSearch, useGenres } from "../../service/useMovies";
import { useFavorites } from "../../hooks/useFavorites";

jest.mock("../../service/useMovies");
jest.mock("../../hooks/useFavorites");
jest.mock("../../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));
jest.mock("../../hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: () => ({ current: null }),
}));
jest.mock("../../service/api", () => ({
  getImageUrl: jest.fn(() => "mock-image-url"),
}));

const mockUseMovieSearch = useMovieSearch as jest.MockedFunction<
  typeof useMovieSearch
>;
const mockUseGenres = useGenres as jest.MockedFunction<typeof useGenres>;
const mockUseFavorites = useFavorites as jest.MockedFunction<
  typeof useFavorites
>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("MovieSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseMovieSearch.mockReturnValue({
      movies: [],
      totalResults: 0,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    });

    mockUseGenres.mockReturnValue({
      genres: [],
      isLoading: false,
      error: undefined,
    });

    mockUseFavorites.mockReturnValue({
      favorites: [],
      isFavorite: jest.fn(() => false),
      toggleFavorite: jest.fn(),
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });
  });

  it("should render search input", () => {
    render(<MovieSearch />, { wrapper: createWrapper() });

    expect(
      screen.getByPlaceholderText("Ex: Batman, Star Wars, Vingadores...")
    ).toBeInTheDocument();
  });

  it("should update input value when typing", () => {
    render(<MovieSearch />, { wrapper: createWrapper() });

    const input = screen.getByPlaceholderText(
      "Ex: Batman, Star Wars, Vingadores..."
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "batman" } });

    expect(input.value).toBe("batman");
  });

  it("should show loading when loading", () => {
    mockUseMovieSearch.mockReturnValue({
      movies: [],
      totalResults: 0,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: true,
      error: undefined,
      refetch: jest.fn(),
    });

    render(<MovieSearch />, { wrapper: createWrapper() });

    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
