import { MovieSearch } from "./components/MovieSearch";

function App() {
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
        <MovieSearch />
      </div>
    </div>
  );
}

export default App;
