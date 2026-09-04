import { Check, AlertTriangle, Droplets } from "lucide-react";
import type { SoilMoistureStatus } from "../types";

const styles: Record<SoilMoistureStatus, string> = {
  Dry: "bg-orange-100 text-orange-700 border-orange-200",
  Normal: "bg-green-100 text-green-700 border-green-200",
  Wet: "bg-blue-100 text-blue-700 border-blue-200",
};

const icons: Record<SoilMoistureStatus, React.ReactNode> = {
  Dry: <AlertTriangle className="w-3 h-3" />,
  Normal: <Check className="w-3 h-3" />,
  Wet: <Droplets className="w-3 h-3" />,
};

export default function SoilMoistureStatusBadge({
  status,
}: { status: SoilMoistureStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
}
