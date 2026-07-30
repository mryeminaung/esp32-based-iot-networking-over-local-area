import { type LucideIcon } from "lucide-react";

// Map of color names → Tailwind classes for the icon circle
const colorMap: Record<string, { bg: string; text: string; toggle: string }> = {
	blue: { bg: "bg-water-light", text: "text-water", toggle: "blue" },
	yellow: { bg: "bg-amber-100", text: "text-amber-600", toggle: "yellow" },
	green: { bg: "bg-success/10", text: "text-success", toggle: "green" },
	gray: { bg: "bg-bg-muted", text: "text-text-muted", toggle: "gray" },
	teal: { bg: "bg-teal-100", text: "text-teal-600", toggle: "teal" },
	purple: { bg: "bg-purple-100", text: "text-purple-600", toggle: "purple" },
	red: { bg: "bg-danger/10", text: "text-danger", toggle: "red" },
};

type ControlItemProps = {
	icon: LucideIcon;
	label: string;
	gpio: string;
	color?: string;
	checked?: boolean;
	onToggle?: () => void;
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
	disabled = false,
	sliderValue,
	onSliderChange,
	last = false,
	hideGpio = false,
}: ControlItemProps) {
	const c = colorMap[color] ?? colorMap.blue;
	const toggleColor = c.toggle;

	return (
		<div
			className={`flex items-center py-[14px] sm:py-[18px] border-b border-border first-of-type:pt-0 gap-2 sm:gap-3 ${
				last ? "border-b-0 pb-0" : ""
			}`}>
			{/* Icon — smaller on mobile */}
			<div
				className={`w-9 h-9 sm:w-[42px] sm:h-[42px] md:w-[52px] md:h-[52px] rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}>
				<Icon
					size={16}
					className="sm:size-5 md:size-6"
				/>
			</div>

			{/* Label + GPIO — truncates on very small screens */}
			<div className="flex-1 min-w-0">
				<span className="block text-[0.8125rem] sm:text-[0.9rem] md:text-[1rem] font-semibold truncate">
					{label}
				</span>
				{!hideGpio && (
					<span className="block text-[0.6875rem] sm:text-[0.75rem] md:text-[0.8125rem] text-text-muted mt-[2px]">
						{gpio}
					</span>
				)}
			</div>

			{/* Slider or Toggle */}
			{sliderValue !== undefined ? (
				<div className="flex items-center gap-1.5 sm:gap-2 md:gap-[14px] min-w-0 shrink-0">
					<input
						type="range"
						min={0}
						max={100}
						value={sliderValue}
						onChange={(e) => onSliderChange?.(Number(e.target.value))}
						className="device-slider w-[70px] sm:w-[90px] md:w-[130px]"
					/>
					<span className="text-[0.75rem] sm:text-[0.875rem] md:text-[0.9375rem] font-semibold text-accent min-w-[28px] sm:min-w-[32px] md:min-w-[42px] text-right">
						{sliderValue}%
					</span>
				</div>
			) : (
				<label
					className={`toggle-switch ${toggleColor} relative inline-block shrink-0`}>
					<input
						type="checkbox"
						checked={checked}
						onChange={onToggle}
						disabled={disabled}
						className="opacity-0 w-0 h-0 absolute"
					/>
					<span className="toggle-slider" />
				</label>
			)}
		</div>
	);
}
