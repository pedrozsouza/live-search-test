export interface Movie {
  readonly id: number;
  readonly title: string;
  readonly poster_path: string | null;
  readonly release_date: string;
  readonly genre_ids: readonly number[];
  readonly overview: string;
  readonly vote_average: number;
  readonly backdrop_path: string | null;
}

export interface MovieResponse {
  readonly page: number;
  readonly results: readonly Movie[];
  readonly total_pages: number;
  readonly total_results: number;
}

export interface Genre {
  readonly id: number;
  readonly name: string;
}

export interface GenresResponse {
  readonly genres: readonly Genre[];
}

export interface FavoriteMovie {
  readonly id: number;
  readonly title: string;
  readonly year: string;
  readonly genres: readonly string[];
  readonly poster_path: string | null;
}