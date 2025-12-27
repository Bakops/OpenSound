"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDurationPopularityCorrelation, getTopDecades, getTopGenres } from "@/service/etl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SpotifyETLCharts() {
  const [dataset, setDataset] = useState<"high" | "low">("high");
  const [topN, setTopN] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topGenres, setTopGenres] = useState<Record<string, number>>({});
  const [topDecades, setTopDecades] = useState<Record<number, number>>({});
  const [correlation, setCorrelation] = useState<number | null>(null);
  const [totalTracks, setTotalTracks] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [genresRes, decadesRes, corrRes] = await Promise.all([
          getTopGenres(dataset, topN),
          getTopDecades(dataset, topN),
          getDurationPopularityCorrelation(dataset),
        ]);
        setTopGenres(genresRes.top_genres);
        setTopDecades(decadesRes.top_decades);
        setCorrelation(corrRes.correlation);
        setTotalTracks(corrRes.total_tracks_analyzed);
      } catch (e: unknown) {
        setError("Erreur lors du chargement des données ETL");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [dataset, topN]);

  const genresChartData = useMemo(() => {
    const labels = Object.keys(topGenres);
    const values = labels.map((k) => topGenres[k]);
    return {
      labels,
      datasets: [
        {
          label: "Popularité moyenne par genre",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [topGenres]);

  const decadesChartData = useMemo(() => {
    const labels = Object.keys(topDecades);
    const values = labels.map((k) => topDecades[Number(k)]);
    return {
      labels,
      datasets: [
        {
          label: "Popularité moyenne par décennie",
          data: values,
          backgroundColor: "rgba(255, 159, 64, 0.5)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [topDecades]);

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <label className="text-sm">Jeu de données :</label>
        <select
          className="border rounded px-2 py-1"
          value={dataset}
          onChange={(e) => setDataset(e.target.value as "high" | "low")}
        >
          <option value="high">Haute popularité</option>
          <option value="low">Faible popularité</option>
        </select>
        <label className="text-sm ml-4">Top N :</label>
        <select
          className="border rounded px-2 py-1"
          value={topN}
          onChange={(e) => setTopN(Number(e.target.value))}
        >
          {[3, 5, 10].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top genres (ETL)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">Chargement…</div>
            ) : (
              <Bar data={genresChartData} options={commonOptions} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top décennies (ETL)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">Chargement…</div>
            ) : (
              <Bar data={decadesChartData} options={commonOptions} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Corrélation durée vs popularité</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[60px] flex items-center">Chargement…</div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-black">Coefficient :</span> {correlation?.toFixed(3) ?? "N/A"}
              {typeof totalTracks === "number" && (
                <span className="ml-3">(Échantillons : {totalTracks.toLocaleString()})</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
