import { renderHook, act } from '@testing-library/react';
import { useFavorites } from "../useFavorites";

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

Object.defineProperty(window, "addEventListener", {
  value: jest.fn(),
});
Object.defineProperty(window, "removeEventListener", {
  value: jest.fn(),
});
Object.defineProperty(window, "dispatchEvent", {
  value: jest.fn(),
});

describe("useFavorites", () => {
  const mockMovie = {
    id: 1,
    title: "Filme Teste",
    poster_path: "/test.jpg",
    release_date: "2023-01-01",
    genre_ids: [28],
    overview: "Teste",
    vote_average: 8.0,
    backdrop_path: null,
  };

  const mockGenres = [{ id: 28, name: "Ação" }];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should initialize with empty list", () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
  });

  it("should add movie to favorites", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addToFavorites(mockMovie, mockGenres);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].title).toBe("Filme Teste");
  });

  it("should check if movie is favorite", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addToFavorites(mockMovie, mockGenres);
    });

    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.isFavorite(999)).toBe(false);
  });

  it("should remove movie from favorites", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addToFavorites(mockMovie, mockGenres);
    });

    expect(result.current.favorites).toHaveLength(1);

    act(() => {
      result.current.removeFromFavorites(1);
    });

    expect(result.current.favorites).toHaveLength(0);
  });
}); 