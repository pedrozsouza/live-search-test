import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_LANGUAGE = import.meta.env.VITE_TMDB_API_LANGUAGE || "pt-BR";
const API_REGION = import.meta.env.VITE_TMDB_API_REGION || "BR";


export const api = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
    language: API_LANGUAGE,
    region: API_REGION,
  },
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (!API_KEY || !API_TOKEN) {
      throw new Error(
        "Chaves da API não configuradas. Verifique o arquivo .env"
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      throw new Error(
        "Erro de autenticação: Verifique se as chaves da API estão configuradas corretamente."
      );
    }
    if (error.response?.status === 403) {
      throw new Error(
        "Erro de autorização: Sua chave da API pode estar inválida ou expirada."
      );
    }
    if (error.code === "ERR_NETWORK") {
      throw new Error(
        "Erro de conexão: Verifique sua conexão com a internet e tente novamente."
      );
    }
    throw error;
  }
);

export const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
