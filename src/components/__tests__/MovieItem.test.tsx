import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieItem from "../MovieItem";


jest.mock("../../service/api", () => ({
  getImageUrl: jest.fn(() => "mock-image-url"),
}));


jest.mock("../../utils/imdb", () => ({
  getIMDBUrl: jest.fn(() => Promise.resolve("mock-imdb-url")),
}));


const mockWindowOpen = jest.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
});

describe("MovieItem", () => {
  const mockMovie = {
    id: 1,
    title: "Filme Teste",
    poster_path: "/test.jpg",
    release_date: "2023-10-10",
    genre_ids: [28, 35],
    overview: "Teste",
    vote_average: 8.0,
    backdrop_path: null,
  };

  const mockGenres = [
    { id: 28, name: "Ação" },
    { id: 35, name: "Comédia" },
  ];

  const defaultProps = {
    movie: mockMovie,
    searchTerm: "",
    isSelected: false,
    isFavorite: false,
    genres: mockGenres,
    onToggleFavorite: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render movie information", () => {
    render(<MovieItem {...defaultProps} />);

    expect(screen.getByText("Filme Teste")).toBeInTheDocument();
    expect(screen.getByText("(2023)")).toBeInTheDocument();
    expect(screen.getByText("Ação")).toBeInTheDocument();
    expect(screen.getByText("Comédia")).toBeInTheDocument();
  });

  it("should show favorite button when selected", () => {
    render(<MovieItem {...defaultProps} isSelected={true} />);

    expect(
      screen.getByLabelText("Adicionar aos favoritos")
    ).toBeInTheDocument();
  });

  it("should call onToggleFavorite when clicking button", () => {
    const mockToggle = jest.fn();

    render(
      <MovieItem
        {...defaultProps}
        isSelected={true}
        onToggleFavorite={mockToggle}
      />
    );

    const favoriteButton = screen.getByLabelText("Adicionar aos favoritos");
    fireEvent.click(favoriteButton);

    expect(mockToggle).toHaveBeenCalledWith(mockMovie);
  });
});
