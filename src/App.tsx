import { useState } from "react";
import { FavoritesTable } from "./components/FavoritesTable";
import { MovieSearch } from "./components/MovieSearch";

function App() {
  const [apiError, setApiError] = useState<string | null>(null);

  const handleApiError = (error: string | null) => {
    setApiError(error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Planne Live Movies
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra, explore e organize sua coleção de filmes favoritos. Busca
            em tempo real com dados atualizados do TMDB.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="ml-3 flex gap-2">
                <p className="text-red-700">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        <MovieSearch onError={handleApiError} />
        <FavoritesTable />
      </div>
    </div>
  );
}

export default App;
