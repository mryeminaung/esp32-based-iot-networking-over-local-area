import { Beaker } from "lucide-react"
import { useState } from "react"
import { useHeader } from "@/hooks/useHeader"
import { experiments } from "./experiments"
import type { Experiment } from "./experiments"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ExperimentCard from "./components/ExperimentCard"
import ExperimentDetail from "./components/ExperimentDetail"

export default function ExperimentsPage() {
	useHeader("Experiments")
	const [selected, setSelected] = useState<Experiment | null>(null)

	const regular = experiments.filter((e) => !e.featured)
	const featured = experiments.find((e) => e.featured)
	const completed = experiments.filter((e) => e.status === "completed").length
	const total = experiments.length
	const progress = total > 0 ? Math.round((completed / total) * 100) : 0

	return (
		<div className="max-w-[1100px] mx-auto space-y-5 py-8 px-4 sm:px-6">
			{/* Header */}
			<Card>
				<CardContent>
					<div className="flex items-center gap-4 mb-3">
						<div className="w-11 h-11 rounded-xl bg-green-light text-green flex items-center justify-center shrink-0">
							<Beaker size={22} />
						</div>
						<div>
							<h1 className="text-[1.3rem] sm:text-[1.5rem] font-bold">
								ESP32 Experiments
							</h1>
							<p className="text-[0.8125rem] text-text-muted mt-0.5">
								Track IoT networking experiments and implementation status
							</p>
						</div>
					</div>

					{/* Progress bar */}
					<div className="mt-4">
						<div className="flex items-center justify-between text-sm mb-2">
							<span className="text-text-secondary font-medium">
								Progress
							</span>
							<span className="text-text-secondary font-medium">
								{completed}/{total} Completed
							</span>
						</div>
						<Progress value={progress} className="h-2" />
					</div>
				</CardContent>
			</Card>

			{/* Regular experiment cards — 2-column grid */}
			<div className="grid gap-4 sm:gap-5 md:grid-cols-2 mb-5">
				{regular.map((exp) => (
					<ExperimentCard
						key={exp.id}
						experiment={exp}
						onClick={() => setSelected(exp)}
					/>
				))}
			</div>

			{/* Featured "Final Project" card — full width */}
			{featured && (
				<Card
					onClick={() => setSelected(featured)}
					className="w-full cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
					<CardContent className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
						<div
							className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${featured.iconBg} ${featured.iconColor}`}>
							<featured.icon size={26} />
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-4 mb-2">
								<h3 className="text-[1.1rem] font-bold">{featured.title}</h3>
								<Badge
									variant="outline"
									className={`shrink-0 text-[0.7rem] font-semibold px-2.5 py-1 flex items-center gap-1.5 ${
										featured.status === "completed"
											? "bg-success/10 text-success border-success/20"
											: featured.status === "in-progress"
												? "bg-warning/10 text-warning border-warning/20"
												: "bg-bg-muted text-text-muted border-border"
									}`}>
									<span
										className={`w-1.5 h-1.5 rounded-full ${
											featured.status === "completed"
												? "bg-green-500"
												: featured.status === "in-progress"
													? "bg-yellow-500"
													: "bg-border-strong"
										}`}
									/>
									{featured.status === "completed"
										? "Completed"
										: featured.status === "in-progress"
											? "In Progress"
											: "Planned"}
								</Badge>
							</div>

							<p className="text-[0.85rem] text-text-secondary leading-relaxed mb-3">
								{featured.description}
							</p>

							<div className="flex items-center justify-between gap-3">
								<div className="flex flex-wrap gap-1.5">
									{featured.tags.map((tag) => (
										<Badge key={tag} variant="secondary" className="text-[0.7rem] font-semibold px-2.5 py-1">
											{tag}
										</Badge>
									))}
								</div>

								<span className="shrink-0 text-[0.8rem] font-semibold text-green flex items-center gap-1">
									View Details
									<span className="text-[0.85rem]">&rarr;</span>
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Detail dialog */}
			{selected && (
				<ExperimentDetail
					experiment={selected}
					onClose={() => setSelected(null)}
				/>
			)}
		</div>
	)
}
