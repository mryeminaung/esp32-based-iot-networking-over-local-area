import { Switch } from "@/components/ui/switch";
import { type LucideIcon } from "lucide-react";

const colorMap: Record<string, { bg: string; text: string; cssColor: string }> =
	{
		blue: { bg: "bg-water-light", text: "text-water", cssColor: "#0284C7" },
		yellow: { bg: "bg-amber-100", text: "text-amber-600", cssColor: "#D97706" },
		green: { bg: "bg-success/10", text: "text-success", cssColor: "#10B981" },
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
	disabled?: boolean;
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
	last = false,
	hideGpio = false,
}: ControlItemProps) {
	const c = colorMap[color] ?? colorMap.blue;

	return (
		<div
			className={`flex items-center py-[14px] border-b border-border first-of-type:pt-0 gap-2 sm:gap-3 ${
				last ? "border-b-0 pb-0" : ""
			}`}>
			<div
				className={`w-9 h-9 sm:w-[42px] sm:h-[42px] md:w-[52px] md:h-[52px] rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}>
				<Icon
					size={16}
					className="sm:size-5"
				/>
			</div>

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

			<Switch
				checked={checked}
				onCheckedChange={onToggle}
				disabled={disabled}
				style={{ "--primary": c.cssColor } as React.CSSProperties}
				className="shrink-0"
			/>
		</div>
	);
}
