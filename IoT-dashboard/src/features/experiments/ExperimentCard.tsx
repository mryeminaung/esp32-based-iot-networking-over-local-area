import type { Experiment } from "./experiments"
import { statusConfig } from "./experiments"

type ExperimentCardProps = {
	experiment: Experiment
	onClick: () => void
}

export default function ExperimentCard({ experiment, onClick }: ExperimentCardProps) {
	const Icon = experiment.icon
	const cfg = statusConfig[experiment.status]

	return (
		<button
			onClick={onClick}
			className="card w-full text-left cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex flex-col">
			{/* Icon */}
			<div
				className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-4 ${experiment.iconBg} ${experiment.iconColor}`}>
				<Icon size={22} />
			</div>

			{/* Title + description */}
			<h3 className="text-[1.05rem] font-bold mb-1.5">{experiment.title}</h3>
			<p className="text-[0.85rem] text-text-secondary leading-relaxed mb-4 flex-1">
				{experiment.description}
			</p>

			{/* Tags + status — pushed to bottom */}
			<div className="flex items-center justify-between gap-3 mt-auto">
				<div className="flex flex-wrap gap-1.5">
					{experiment.tags.map((tag) => (
						<span
							key={tag}
							className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full bg-bg-muted text-text-muted">
							{tag}
						</span>
					))}
				</div>

				{/* Status badge */}
				<span
					className={`shrink-0 text-[0.7rem] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${cfg.badge}`}>
					<span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
					{cfg.label}
				</span>
			</div>
		</button>
	)
}
