"use client";

import DashboardSelectors from "@/components/dashboard/DashboardSelectors";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import HeaderComponent from "@/components/layout/HeaderComponent";
import { getAllRegions, getGenres, getGlobalMusicData, getRegionMusicData } from "@/service/api";
import { getTopGenres, getTopDecades, getDurationPopularityCorrelation } from "@/service/etl";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState, useCallback } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartDataset = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
};

type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

export default function DashboardPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  type Region = {
    id: string;
    name: string;
  };

  type Genre = {
    id: string;
    name: string;
    type: string;
  };

  const [regions, setRegions] = useState<Region[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  
  type Stats = {
    total_streams: number;
    total_artists: number;
    avg_popularity: number;
    new_releases: number;
  };

  const [stats, setStats] = useState<Stats>({
    total_streams: 0,
    total_artists: 0,
    avg_popularity: 0,
    new_releases: 0,
  });
  
  type TimelineItem = {
    date?: string;
    dateValue?: string;
    totalStreams?: number;
    totalArtists?: number;
    avgPopularity?: number;
    newReleases?: number;
    [key: string]: unknown;
  };
  
  const [timeline, setTimeline] = useState<TimelineItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États pour les données ETL
  const [etlDataset, setEtlDataset] = useState<"high" | "low">("high");
  const [topGenresData, setTopGenresData] = useState<Record<string, number>>({});
  const [topDecadesData, setTopDecadesData] = useState<Record<number, number>>({});
  const [correlationData, setCorrelationData] = useState<number | null>(null);
  
  // Filtres ETL additionnels
  const [topNResults, setTopNResults] = useState<number>(5);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Streams totaux (millions)",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Artistes actifs",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Score de popularité",
        data: [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
      {
        label: "Nouvelles sorties",
        data: [],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Évolution des tendances musicales - OpenSound Label",
      },
    },
  };

  useEffect(() => {
    async function fetchRegions() {
      try {
        const data = await getAllRegions();
        setRegions(data || []);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des régions :",
          error
        );
        setError("Erreur lors du chargement des régions");
      }
    }
    fetchRegions();
  }, []);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await getGenres();
        setGenres(data || []);
        if (data && data.length > 0) {
          setSelectedGenre(data[0].id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des genres :", error);
        setError("Erreur lors du chargement des genres");
      }
    }
    fetchGenres();
  }, []);

  const filterTimelineByTimeframe = useCallback((data: TimelineItem[], timeframe: string) => {
    if (!data || data.length === 0) return [];

    const len = data.length;

    switch (timeframe) {
      case "early":
        return data.slice(0, Math.ceil(len * 0.25));
      case "peak":
        const start = Math.floor(len * 0.375);
        return data.slice(start, start + Math.ceil(len * 0.25));
      case "decline":
        return data.slice(Math.floor(len * 0.75));
      default:
        return data;
    }
  }, []);

  const normalizeData = useCallback((item: TimelineItem, property: string): number => {
    const value = item[property];
    if (value === null || value === undefined) return 0;
    const numberValue = Number(value);
    return isNaN(numberValue) ? 0 : numberValue;
  }, []);

  const updateChartData = useCallback((timelineData: TimelineItem[]) => {
    if (!timelineData || timelineData.length === 0) {
      console.warn("Aucune donnée de timeline disponible");
      setChartData((prev) => ({
        ...prev,
        labels: [],
        datasets: prev.datasets.map((ds) => ({ ...ds, data: [] })),
      }));
      return;
    }

    const labels = timelineData.map((item) => {
      try {
        if (!item.dateValue) {
          return "Date invalide";
        }
        return new Date(item.dateValue).toLocaleDateString();
      } catch {
        console.error("Date invalide:", item.date);
        return "Date invalide";
      }
    });

    const totalStreams = timelineData.map((item) =>
      normalizeData(item, "totalStreams")
    );
    const totalArtists = timelineData.map((item) =>
      normalizeData(item, "totalArtists")
    );

    // Intégrer les données ETL - popularité moyenne des top genres
    const genrePopularity = Object.values(topGenresData);
    const avgETLPopularity = genrePopularity.length > 0 
      ? genrePopularity.reduce((a, b) => a + b, 0) / genrePopularity.length
      : 0;
    
    // Utiliser aussi les décennies pour enrichir les données
    const decadePopularity = Object.values(topDecadesData);
    const avgDecadePopularity = decadePopularity.length > 0
      ? decadePopularity.reduce((a, b) => a + b, 0) / decadePopularity.length
      : 0;
    
    const avgPopularity = timelineData.map((item) => {
      const basePopularity = normalizeData(item, "avgPopularity");
      // Ajouter l'influence des données ETL (pondération 60/25/15)
      return basePopularity * 0.6 + avgETLPopularity * 0.25 + avgDecadePopularity * 0.15;
    });
    
    const newReleases = timelineData.map((item) =>
      normalizeData(item, "newReleases")
    );

    const getLastNonZeroValue = (values: number[]) => {
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i] !== null && values[i] !== 0) {
          return values[i];
        }
      }
      return 0;
    };

    const statsUpdate = {
      total_streams: getLastNonZeroValue(totalStreams),
      total_artists: getLastNonZeroValue(totalArtists),
      avg_popularity: getLastNonZeroValue(avgPopularity),
      new_releases: getLastNonZeroValue(newReleases),
    };

    setStats(statsUpdate);

    setChartData({
      labels,
      datasets: [
        { ...chartData.datasets[0], data: totalStreams },
        { ...chartData.datasets[1], data: totalArtists },
        { ...chartData.datasets[2], data: avgPopularity },
        { ...chartData.datasets[3], data: newReleases },
      ],
    });
  }, [topGenresData, topDecadesData, chartData.datasets, normalizeData]);

  const fetchGlobalData = useCallback(async (genreId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const globalData = await getGlobalMusicData(genreId);

      if (!globalData) {
        throw new Error("Aucune donnée reçue");
      }

      if (globalData.timeline && Array.isArray(globalData.timeline)) {
        setTimeline(globalData.timeline);
        const filtered = filterTimelineByTimeframe(
          globalData.timeline,
          selectedTimeframe
        );
        updateChartData(filtered);
      } else if (Array.isArray(globalData)) {
        setTimeline(globalData);
        const filtered = filterTimelineByTimeframe(
          globalData,
          selectedTimeframe
        );
        updateChartData(filtered);
      } else {
        console.error("Format de données invalide:", globalData);
        setError("Format de données invalide");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données globales:",
        error
      );
      setError("Erreur lors du chargement des données globales");
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimeframe, filterTimelineByTimeframe, updateChartData]);

  const fetchRegionData = useCallback(async (regionId: string, genreId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRegionMusicData(regionId, genreId);
      if (!data) {
        throw new Error("Aucune donnée reçue");
      }

      if (data.timeline && Array.isArray(data.timeline)) {
        setTimeline(data.timeline);
        const filtered = filterTimelineByTimeframe(
          data.timeline,
          selectedTimeframe
        );
        updateChartData(filtered);
      } else if (Array.isArray(data)) {
        setTimeline(data);
        const filtered = filterTimelineByTimeframe(data, selectedTimeframe);
        updateChartData(filtered);
      } else {
        console.error("Format de données invalide:", data);
        setError("Format de données invalide");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de région:",
        error
      );
      setError("Erreur lors du chargement des données de région");
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimeframe, filterTimelineByTimeframe, updateChartData]);

  // Charger les données ETL
  useEffect(() => {
    async function fetchETLData() {
      try {
        const [genresRes, decadesRes, corrRes] = await Promise.all([
          getTopGenres(etlDataset, topNResults),
          getTopDecades(etlDataset, topNResults),
          getDurationPopularityCorrelation(etlDataset),
        ]);
        
        // Appliquer le tri si nécessaire
        let sortedGenres = genresRes.top_genres;
        let sortedDecades = decadesRes.top_decades;
        
        if (sortOrder === "asc") {
          sortedGenres = Object.fromEntries(
            Object.entries(sortedGenres).sort(([, a], [, b]) => a - b)
          );
          sortedDecades = Object.fromEntries(
            Object.entries(sortedDecades).sort(([, a], [, b]) => a - b)
          );
        }
        
        setTopGenresData(sortedGenres);
        setTopDecadesData(sortedDecades);
        setCorrelationData(corrRes.correlation);
      } catch (error) {
        console.error("Erreur lors du chargement des données ETL:", error);
      }
    }
    fetchETLData();
  }, [etlDataset, topNResults, sortOrder]);

  useEffect(() => {
    if (selectedGenre) {
      if (selectedRegion) {
        fetchRegionData(selectedRegion, selectedGenre);
      } else {
        fetchGlobalData(selectedGenre);
      }
    }
  }, [selectedGenre, selectedRegion, fetchGlobalData, fetchRegionData]);

  useEffect(() => {
    if (timeline) {
      const filtered = filterTimelineByTimeframe(timeline, selectedTimeframe);
      updateChartData(filtered);
    }
  }, [selectedTimeframe, timeline, filterTimelineByTimeframe, updateChartData]);

  const handleRegionChange = (regionId: string) => {
    if (regionId === "global") {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(regionId);
    }
  };

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
    if (selectedGenre) {
      fetchRegionData(regionId, selectedGenre);
    }
  };

  const handleExportData = () => {
    if (!selectedGenre || !timeline) return;

    const exportData = {
      label: "OpenSound",
      genre_id: selectedGenre,
      region: selectedRegion ? selectedRegion : "global",
      timeframe: selectedTimeframe,
      export_date: new Date().toISOString(),
      statistics: {
        total_streams: stats.total_streams,
        total_artists: stats.total_artists,
        avg_popularity: stats.avg_popularity,
        new_releases: stats.new_releases,
      },
      timeline: timeline.map((item: TimelineItem) => ({
        date: item.date || item.dateValue,
        total_streams: item.totalStreams || 0,
        total_artists: item.totalArtists || 0,
        avg_popularity: item.avgPopularity || 0,
        new_releases: item.newReleases || 0,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `opensound-analytics-${selectedGenre}-${selectedTimeframe}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderComponent />
      <main className="mt-20 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Contrôles ETL - Filtres et Options de visualisation */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-purple-900 rounded-full"></div>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-900 font-poppins">
                Filtres et Visualisation ETL Spotify
              </h3>
            </div>
            
            {/* Ligne 1: Dataset et Nombre de résultats */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-[#6B6B6B] font-poppins">Dataset :</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-poppins shadow-sm"
                  value={etlDataset}
                  onChange={(e) => setEtlDataset(e.target.value as "high" | "low")}
                >
                  <option value="high">Haute popularité</option>
                  <option value="low">Faible popularité</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-[#6B6B6B] font-poppins">Top N résultats :</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-poppins shadow-sm"
                  value={topNResults}
                  onChange={(e) => setTopNResults(Number(e.target.value))}
                >
                  <option value={3}>Top 3</option>
                  <option value={5}>Top 5</option>
                  <option value={10}>Top 10</option>
                  <option value={15}>Top 15</option>
                  <option value={20}>Top 20</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-[#6B6B6B] font-poppins">Tri :</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-poppins shadow-sm"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
                >
                  <option value="desc">↓ Décroissant</option>
                  <option value="asc">↑ Croissant</option>
                </select>
              </div>

              {correlationData !== null && (
                <div className="ml-auto px-4 py-2.5 bg-gradient-to-r from-red-50 to-purple-50 rounded-lg border border-red-200 shadow-sm">
                  <span className="text-sm font-poppins">
                    <span className="text-gray-600">Corrélation durée/popularité : </span>
                    <strong className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-900">{correlationData.toFixed(3)}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DashboardStatsCards
          stats={stats}
          isLoading={isLoading}
          selectedLocalisation={selectedRegion}
          localisations={regions}
        />

        <DashboardTabs
          chartData={chartData}
          chartOptions={chartOptions}
          localisations={regions}
          selectedLocalisation={selectedRegion}
          handleLocationClick={handleRegionClick}
          timeline={timeline || []}
          isLoading={isLoading}
          etlDataset={etlDataset}
          topGenresData={topGenresData}
          topDecadesData={topDecadesData}
        />

      </main>
    </div>
  );
}