import axios from "axios";

// Base URL of the FastAPI ETL backend
// Adjust the URL/port if your ETL runs elsewhere
const etlApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ETL_BASE_URL || "http://localhost:8000",
});

export type TopGenresResponse = {
  top_genres: Record<string, number>;
  total_tracks_analyzed: number;
};

export type TopDecadesResponse = {
  top_decades: Record<number, number>;
  total_tracks_analyzed: number;
};

export type DurationPopularityCorrelationResponse = {
  correlation: number;
  total_tracks_analyzed: number;
};

export async function getTopGenres(dataset: "high" | "low" = "high", top_n = 5): Promise<TopGenresResponse> {
  const res = await etlApi.get("/spotify/top-genres", { params: { dataset, top_n } });
  return res.data;
}

export async function getTopDecades(dataset: "high" | "low" = "high", top_n = 5): Promise<TopDecadesResponse> {
  const res = await etlApi.get("/spotify/top-decades", { params: { dataset, top_n } });
  return res.data;
}

export async function getDurationPopularityCorrelation(dataset: "high" | "low" = "high"): Promise<DurationPopularityCorrelationResponse> {
  const res = await etlApi.get("/spotify/duration-popularity-correlation", { params: { dataset } });
  return res.data;
}
