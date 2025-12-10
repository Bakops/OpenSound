import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Pandemic {
  id: string;
  type: string;
}

interface Localisation {
  id: string;
  country?: string;
  nom?: string;
}

type Props = {
  pandemics: Pandemic[];
  localisations: Localisation[];
  selectedPandemic: string | null;
  setSelectedPandemic: (id: string) => void;
  selectedLocalisation: string | null;
  handleLocalisationChange: (id: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (tf: string) => void;
  handleExportData: () => void;
  timeline: Record<string, unknown>;
};

export default function DashboardSelectors({
  pandemics,
  localisations,
  selectedPandemic,
  setSelectedPandemic,
  selectedLocalisation,
  handleLocalisationChange,
  selectedTimeframe,
  setSelectedTimeframe,
  handleExportData,
  timeline,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedPandemic || ""}
        onValueChange={setSelectedPandemic}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sélectionner une pandémie" />
        </SelectTrigger>
        <SelectContent>
          {pandemics.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectedLocalisation || "global"}
        onValueChange={handleLocalisationChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sélectionner une localisation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="global">Global</SelectItem>
          {(Array.isArray(localisations) ? localisations : []).map((l, index) => (
            <SelectItem key={l.id || index} value={l.id}>
              {l.country || l.nom || "Sans nom"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Période" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toute la durée</SelectItem>
          <SelectItem value="early">Phase initiale</SelectItem>
          <SelectItem value="peak">Pic</SelectItem>
          <SelectItem value="decline">Phase de déclin</SelectItem>
        </SelectContent>
      </Select>
      <div className="ml-auto">
        <Button
          variant="outline"
          disabled={!selectedPandemic || !timeline}
          onClick={handleExportData}
          className="flex items-center gap-2 cursor-pointer"
        >
          {/* SVG export icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter les données
        </Button>
      </div>
    </div>
  );
}