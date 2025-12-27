import axios from "axios";


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

export const getAllRegions = async () => {
  try {
    const response = await api.get("/region");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des régions :", error);
    return [];
  }
};

// Conservé: récupérations agrégées pour le dashboard

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
