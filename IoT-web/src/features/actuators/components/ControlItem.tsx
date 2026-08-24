import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { type LucideIcon, Play } from "lucide-react";

// Map of color names → Tailwind classes for the icon circle + CSS color for switch
const colorMap: Record<string, { bg: string; text: string; cssColor: string }> =
	{
		blue: { bg: "bg-water-light", text: "text-water", cssColor: "#0284C7" },
		yellow: { bg: "bg-amber-100", text: "text-amber-600", cssColor: "#D97706" },
		green: { bg: "bg-success/10", text: "text-success", cssColor: "#10B981" },
		gray: { bg: "bg-bg-muted", text: "text-text-muted", cssColor: "#647067" },
		teal: { bg: "bg-teal-100", text: "text-teal-600", cssColor: "#0D9488" },
		purple: {
			bg: "bg-purple-100",
			text: "text-purple-600",
			cssColor: "#A855F7",
		},
		red: { bg: "bg-danger/10", text: "text-danger", cssColor: "#EF4444" },
	};

type ControlItemProps = {
	icon: LucideIcon;
	label: string;
	gpio: string;
	color?: string;
	checked?: boolean;
	onToggle?: () => void;
	onTest?: () => void;
	testing?: boolean;
	disabled?: boolean;
	sliderValue?: number;
	onSliderChange?: (val: number) => void;
	last?: boolean;
	hideGpio?: boolean;
};

export default function ControlItem({
	icon: Icon,
	label,
	gpio,
	color = "blue",
	checked = false,
	onToggle,
	onTest,
	testing = false,
	disabled = false,
	sliderValue,
	onSliderChange,
	last = false,
	hideGpio = false,
}: ControlItemProps) {
	const c = colorMap[color] ?? colorMap.blue;

	return (
		<div
			className={`flex items-center py-[14px] border-b border-border first-of-type:pt-0 gap-2 sm:gap-3 ${
				last ? "border-b-0 pb-0" : ""
			}`}>
			{/* Icon — smaller on mobile */}
			<div
				className={`w-9 h-9 sm:w-[42px] sm:h-[42px] md:w-[52px] md:h-[52px] rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}>
				<Icon
					size={16}
					className="sm:size-5"
				/>
			</div>

			{/* Label + GPIO — truncates on very small screens */}
			<div className="flex-1 min-w-0">
				<span className="block text-sm font-semibold truncate text-text-primary">
					{label}
				</span>
				{hideGpio && (
					<span className="block text-[0.6875rem] sm:text-[0.75rem] md:text-[0.8125rem] text-text-muted mt-[2px]">
						{gpio}
					</span>
				)}
			</div>

			{/* Slider or Toggle */}
			{sliderValue !== undefined ? (
				<div className="flex items-center gap-1.5 sm:gap-2 md:gap-[14px] min-w-0 shrink-0">
					<Slider
						min={0}
						max={100}
						value={[sliderValue]}
						onValueChange={(v) => onSliderChange?.(v[0])}
						className="w-[70px] sm:w-[90px] md:w-[130px]"
					/>
					<span className="text-[0.75rem] sm:text-[0.875rem] md:text-[0.9375rem] font-semibold text-green min-w-[28px] sm:min-w-[32px] md:min-w-[42px] text-right">
						{sliderValue}%
					</span>
				</div>
			) : (
				<Switch
					checked={checked}
					onCheckedChange={onToggle}
					disabled={disabled}
					style={{ "--primary": c.cssColor } as React.CSSProperties}
					className="shrink-0"
				/>
			)}

			{/* Test button */}
			{onTest && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onTest}
					disabled={testing}
					title={testing ? "Testing..." : "Test (5s pulse)"}
					className="h-8 w-8 text-text-muted hover:text-blue-600 hover:bg-blue-50 shrink-0">
					<Play size={14} className={testing ? "animate-pulse" : ""} />
				</Button>
			)}
		</div>
	);
}
