import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoritesTable } from "../FavoritesTable";
import { useFavorites } from "../../hooks/useFavorites";

jest.mock("../../hooks/useFavorites");
jest.mock("../../service/api", () => ({
  getImageUrl: jest.fn(() => "mock-image-url"),
}));

const mockUseFavorites = useFavorites as jest.MockedFunction<
  typeof useFavorites
>;

describe("FavoritesTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render message when there are no favorites", () => {
    mockUseFavorites.mockReturnValue({
      favorites: [],
      removeFromFavorites: jest.fn(),
      addToFavorites: jest.fn(),
      isFavorite: jest.fn(),
      toggleFavorite: jest.fn(),
    });

    render(<FavoritesTable />);

    expect(screen.getByText("Filmes Favoritos")).toBeInTheDocument();
    expect(screen.getByText("Nenhum filme favorito")).toBeInTheDocument();
  });

  it("should render favorites list", () => {
    const mockFavorite = {
      id: 1,
      title: "Filme Teste",
      year: "2023",
      genres: ["Ação"],
      poster_path: "/test.jpg",
    };

    mockUseFavorites.mockReturnValue({
      favorites: [mockFavorite],
      removeFromFavorites: jest.fn(),
      addToFavorites: jest.fn(),
      isFavorite: jest.fn(),
      toggleFavorite: jest.fn(),
    });

    render(<FavoritesTable />);

    expect(screen.getByText("Filme Teste")).toBeInTheDocument();
    expect(screen.getAllByText("2023")).toHaveLength(2); // Mobile e desktop
    expect(screen.getByText("Ação")).toBeInTheDocument();
  });

  it("should call removeFromFavorites when clicking remove button", () => {
    const mockRemove = jest.fn();
    const mockFavorite = {
      id: 1,
      title: "Filme Teste",
      year: "2023",
      genres: ["Ação"],
      poster_path: "/test.jpg",
    };

    mockUseFavorites.mockReturnValue({
      favorites: [mockFavorite],
      removeFromFavorites: mockRemove,
      addToFavorites: jest.fn(),
      isFavorite: jest.fn(),
      toggleFavorite: jest.fn(),
    });

    render(<FavoritesTable />);

    const removeButton = screen.getByLabelText(
      "Remover Filme Teste dos favoritos"
    );
    fireEvent.click(removeButton);

    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});
