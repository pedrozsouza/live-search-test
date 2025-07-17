import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_TMDB_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_LANGUAGE = import.meta.env.VITE_TMDB_API_LANGUAGE;
const API_REGION = import.meta.env.VITE_TMDB_API_REGION;

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

export const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
