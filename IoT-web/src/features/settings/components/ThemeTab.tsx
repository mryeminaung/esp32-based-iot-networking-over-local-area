import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { Monitor, Moon, Sun } from "lucide-react";

const THEMES = [
	{ value: "light" as const, label: "Light", icon: Sun, bg: "bg-white border-gray-200", dot: "bg-gray-100 border-gray-200" },
	{ value: "dark" as const, label: "Dark", icon: Moon, bg: "bg-gray-900 border-gray-700", dot: "bg-gray-800 border-gray-700" },
	{ value: "system" as const, label: "System", icon: Monitor, bg: "bg-gradient-to-r from-white to-gray-900 border-gray-400", dot: "bg-gradient-to-r from-gray-100 to-gray-800 border-gray-400" },
];

export default function ThemeTab() {
	const theme = useDashboardStore((s) => s.theme);
	const setTheme = useDashboardStore((s) => s.setTheme);

	return (
		<Card className="space-y-5">
			<CardContent className="space-y-5">
				<div>
					<h2 className="text-base font-semibold text-text-primary">
						Theme Preference
					</h2>
					<p className="text-sm text-text-muted mt-0.5">
						Choose your preferred color theme for the dashboard.
					</p>
				</div>

				<div className="flex gap-4">
					{THEMES.map(({ value, label, icon: Icon, bg, dot }) => (
						<Button
							key={value}
							variant="outline"
							onClick={() => setTheme(value)}
							className={`flex-1 p-4 h-auto rounded-xl border-2 ${
								theme === value
									? "border-green-500 bg-green-50"
									: "border-border hover:border-border-strong"
							}`}>
							<div className="w-full">
								<div className={`w-full h-24 rounded-lg ${bg} border mb-3 flex items-center justify-center`}>
									<div className={`w-8 h-8 rounded-full ${dot} border flex items-center justify-center`}>
										<Icon className="w-4 h-4 text-text-muted" />
									</div>
								</div>
								<p className="text-sm font-medium text-text-primary">{label}</p>
								{theme === value && (
									<p className="text-xs text-green-600 mt-1">Active</p>
								)}
							</div>
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
