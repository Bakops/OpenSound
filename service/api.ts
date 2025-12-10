import axios from "axios";
import { Calendrier } from "../models/Calendrier";
import { Region } from "../models/Region";
import { Genre } from "../models/Genre";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1",
});

export const getGenres = async () => {
  try {
    const response = await api.get("/genre");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des genres :", error);
    return [];
  }
};

export const getCalendars = async () => {
  try {
    const response = await api.get("/calendar");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des calendriers :", error);
    return [];
  }
};

export const getAllRegions = async () => {
  try {
    const response = await api.get("/region");
    let data = response.data;

    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error("Impossible de parser les données de région:", e);
        return [];
      }
    }

    if (!Array.isArray(data)) {
      console.error(
        "Les données de région ne sont pas un tableau:",
        data
      );

      if (data && typeof data === "object") {
        if (Array.isArray(data.content)) return data.content;
        if (Array.isArray(data.regions)) return data.regions;
        if (Array.isArray(data.items)) return data.items;

        return Object.values(data).filter(
          (item) => item && typeof item === "object"
        );
      }

      return [];
    }

    return data.map((region) => ({
      id: region.id,
      name: region.name || region.nom,
      continent: region.continent,
      country: region.country,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des régions :", error);
    return [];
  }
};

export const getAllData = async () => {
  try {
    const response = await api.get("/music-data");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return [];
  }
};

export const getGlobalMusicData = async (genreId: string) => {
  try {
    const [dataResponse, calendarResponse] = await Promise.all([
      api.get("/music-data"),
      api.get("/calendar"),
    ]);

    const allData = Array.isArray(dataResponse.data) ? dataResponse.data : [];
    const calendars = Array.isArray(calendarResponse.data)
      ? calendarResponse.data
      : [];

    // Convertir les calendriers en Map pour accès rapide par id_calendar
    const calendarMap = new Map(
      calendars.map((cal) => [cal.id, cal.date_value ?? ""])
    );
    console.log("Calendars Map :", calendarMap);

    const mappedData = allData.map((item) => ({
      ...item,
      totalStreams: item.totalStreams ?? item.total_streams ?? 0,
      totalArtists: item.totalArtists ?? item.total_artists ?? 0,
      avgPopularity: item.avgPopularity ?? item.avg_popularity ?? 0,
      newReleases: item.newReleases ?? item.new_releases ?? 0,
      idGenre: item.idGenre ?? item.id_genre ?? 0,
      idRegion: item.idRegion ?? item.id_region ?? 0,
      idCalendar: item.idCalendar ?? item.id_calendar ?? 0,
      dateValue: calendarMap.get(item.idCalendar ?? item.id_calendar) ?? "",
    }));

    const genreData = mappedData.filter(
      (item) => item && item.idGenre === Number(genreId)
    );

    const totalStreams = genreData.reduce(
      (sum, item) => sum + (item.totalStreams || 0),
      0
    );
    console.log("TotalStreams :", totalStreams);
    
    const totalArtists = genreData.reduce(
      (sum, item) => sum + (item.totalArtists || 0),
      0
    );
    console.log("TotalArtists :", totalArtists);

    const avgPopularity = genreData.reduce(
      (sum, item) => sum + (item.avgPopularity || 0),
      0
    );
    console.log("AvgPopularity :", avgPopularity);
    
    const newReleases = genreData.reduce(
      (sum, item) => sum + (item.newReleases || 0),
      0
    );
    console.log("NewReleases :", newReleases);

    const timelineMap = new Map();
    genreData.forEach((item) => {
      if (!item || !item.dateValue) return;
      const date = item.dateValue;
      if (!timelineMap.has(date)) {
        timelineMap.set(date, {
          dateValue: date,
          totalStreams: 0,
          totalArtists: 0,
          avgPopularity: 0,
          newReleases: 0,
          idCalendar: item.idCalendar,
        });
      }

      const dayData = timelineMap.get(date);

      dayData.totalStreams += item.totalStreams || 0;
      dayData.totalArtists += item.totalArtists || 0;
      dayData.avgPopularity += item.avgPopularity || 0;
      dayData.newReleases += item.newReleases || 0;
      dayData.idCalendar = item.idCalendar || 0;
    });
    console.log("TimelineMap :", timelineMap);

    const timeline = Array.from(timelineMap.values());

    return {
      total_streams: totalStreams,
      total_artists: totalArtists,
      avg_popularity: avgPopularity,
      new_releases: newReleases,
      timeline,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données globales :",
      error
    );
    return {
      total_streams: 0,
      total_artists: 0,
      avg_popularity: 0,
      new_releases: 0,
      timeline: [],
    };
  }
};

export const getRegionMusicData = async (
  regionId?: string,
  genreId?: string
) => {
  if (!regionId || !genreId) {
    return {
      total_streams: 0,
      total_artists: 0,
      avg_popularity: 0,
      new_releases: 0,
      timeline: [],
    };
  }

  try {
    const [dataResponse, calendarResponse] = await Promise.all([
      api.get("/music-data", {
        params: { id_region: regionId, id_genre: genreId },
      }),
      api.get("/calendar"),
    ]);

    const allData = Array.isArray(dataResponse.data) ? dataResponse.data : [];
    const calendars = Array.isArray(calendarResponse.data)
      ? calendarResponse.data
      : [];

    const calendarMap = new Map(
      calendars.map((cal) => [cal.id, cal.date_value ?? ""])
    );

    const mappedData = allData.map((item) => ({
      ...item,
      totalStreams: item.totalStreams ?? item.total_streams ?? 0,
      totalArtists: item.totalArtists ?? item.total_artists ?? 0,
      avgPopularity: item.avgPopularity ?? item.avg_popularity ?? 0,
      newReleases: item.newReleases ?? item.new_releases ?? 0,
      idGenre: item.idGenre ?? item.id_genre ?? 0,
      idRegion: item.idRegion ?? item.id_region ?? 0,
      idCalendar: item.idCalendar ?? item.id_calendar ?? 0,
      dateValue: calendarMap.get(item.idCalendar ?? item.id_calendar) ?? "",
    }));

    const filteredData = mappedData.filter(
      (item) =>
        (!regionId || item.idRegion === Number(regionId)) &&
        (!genreId || item.idGenre === Number(genreId))
    );

    const timelineMap = new Map<
      string,
      {
        dateValue: string;
        totalStreams: number;
        totalArtists: number;
        avgPopularity: number;
        newReleases: number;
        idCalendar: number;
      }
    >();

    filteredData.forEach((item) => {
      if (!item.dateValue) return;

      if (!timelineMap.has(item.dateValue)) {
        timelineMap.set(item.dateValue, {
          dateValue: item.dateValue,
          totalStreams: 0,
          totalArtists: 0,
          avgPopularity: 0,
          newReleases: 0,
          idCalendar: item.idCalendar,
        });
      }

      const dayData = timelineMap.get(item.dateValue)!;
      dayData.totalStreams += item.totalStreams;
      dayData.totalArtists += item.totalArtists;
      dayData.avgPopularity += item.avgPopularity;
      dayData.newReleases += item.newReleases;
    });

    const timeline = Array.from(timelineMap.values());

    const total_streams = filteredData.reduce(
      (max, item) => Math.max(max, item.totalStreams),
      0
    );
    const total_artists = filteredData.reduce(
      (max, item) => Math.max(max, item.totalArtists),
      0
    );
    const avg_popularity = filteredData.reduce(
      (sum, item) => sum + item.avgPopularity,
      0
    );
    const new_releases = filteredData.reduce(
      (sum, item) => sum + item.newReleases,
      0
    );

    return {
      total_streams,
      total_artists,
      avg_popularity,
      new_releases,
      timeline,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de région :",
      error
    );
    return {
      total_streams: 0,
      total_artists: 0,
      avg_popularity: 0,
      new_releases: 0,
      timeline: [],
    };
  }
};

export const createMusicData = async (data: Record<string, unknown>) => {
  try {
    const response = await api.post("/music-data", data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création des données :", error);
    throw error;
  }
};

export const exportGenreData = async (genreId: number) => {
  try {
    const response = await api.get(`/genre/${genreId}/export`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'exportation des données :", error);
    throw error;
  }
};

export const createRegion = async (region: Region) => {
  const response = await fetch("http://localhost:8081/api/v1/region", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(region),
  });
  return response.json();
};

export const createGenre = async (genre: Genre) => {
  const response = await fetch("http://localhost:8081/api/v1/genre", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(genre),
  });
  return response.json();
};

export const createCalendrier = async (calendrier: Calendrier) => {
  const response = await fetch("http://localhost:8081/api/v1/calendrier", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(calendrier),
  });
  return response.json();
};

export const deleteMusicData = async (id: number) => {
  try {
    await api.delete(`/api/v1/music-data/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateMusicData = async (id: number, data: unknown) => {
  try {
    const response = await api.put(`/api/v1/music-data/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRegion = async (id: number) => {
  try {
    await api.delete(`/api/v1/region/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateRegion = async (id: number, data: unknown) => {
  try {
    const response = await api.put(`/api/v1/region/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGenre = async (id: number) => {
  try {
    await api.delete(`/api/v1/genre/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateGenre = async (id: number, data: unknown) => {
  try {
    const response = await api.put(`/api/v1/genre/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};