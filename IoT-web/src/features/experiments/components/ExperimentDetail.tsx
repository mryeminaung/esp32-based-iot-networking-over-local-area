import { ExternalLink } from "lucide-react"
import type { Experiment } from "../experiments"
import { statusConfig } from "../experiments"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

type Props = {
	experiment: Experiment
	onClose: () => void
}

export default function ExperimentDetail({ experiment, onClose }: Props) {
	const Icon = experiment.icon
	const cfg = statusConfig[experiment.status]
	const d = experiment.detail

	return (
		<Dialog open={true} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
				<DialogHeader>
					<div className="flex items-center gap-4 min-w-0">
						<div
							className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${experiment.iconBg} ${experiment.iconColor}`}>
							<Icon size={22} />
						</div>
						<div className="min-w-0">
							<DialogTitle className="truncate">
								{experiment.title}
							</DialogTitle>
							<Badge
								variant="outline"
								className={`inline-flex items-center gap-1.5 text-[0.65rem] font-semibold px-2.5 py-0.5 mt-1 ${cfg.badge}`}>
								<span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
								{cfg.label}
							</Badge>
						</div>
					</div>
				</DialogHeader>

				{/* ── Scrollable body ── */}
				<div className="mt-6 space-y-5 overflow-y-auto pr-1 -mr-1">
					{/* Overview */}
					<section>
						<h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text-muted mb-2">
							Overview
						</h3>
						<p className="text-[0.875rem] text-text-secondary leading-relaxed">
							{d.objective}
						</p>
					</section>

					<Separator />

					{/* Hardware */}
					<section>
						<h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text-muted mb-2">
							Hardware
						</h3>
						<ul className="space-y-1">
							{d.hardware.map((item) => (
								<li
									key={item}
									className="text-[0.875rem] text-text-secondary flex items-center gap-2">
									<span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
									{item}
								</li>
							))}
						</ul>
					</section>

					<Separator />

					{/* Technologies */}
					<section>
						<h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text-muted mb-2">
							Technologies
						</h3>
						<div className="flex flex-wrap gap-1.5">
							{d.technologies.map((t) => (
								<span
									key={t}
									className="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full bg-green-light text-green">
									{t}
								</span>
							))}
						</div>
					</section>

					{/* Circuit diagram placeholder */}
					{d.circuitImage && (
						<>
							<Separator />
							<section>
								<h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text-muted mb-2">
									Circuit
								</h3>
								<div className="w-full h-40 rounded-xl bg-bg-muted border-2 border-dashed border-border flex items-center justify-center text-text-muted text-[0.8rem]">
									Circuit diagram — image coming soon
								</div>
							</section>
						</>
					)}

					{/* Implementation steps */}
					<Separator />
					<section>
						<h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text-muted mb-2">
							Implementation
						</h3>
						<ol className="space-y-1.5 list-decimal list-inside">
							{d.steps.map((step, i) => (
								<li
									key={i}
									className="text-[0.875rem] text-text-secondary leading-relaxed">
									{step}
								</li>
							))}
						</ol>
					</section>

					{/* API Endpoints */}
					{d.endpoints && (
						<>
							<Separator />
							<section>
								<h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text-muted mb-2">
									API Endpoints
								</h3>
								<div className="space-y-1.5">
									{d.endpoints.map((ep) => (
										<div
											key={ep.path}
											className="flex items-center gap-3 font-mono text-[0.8125rem]">
											<span className="text-[0.65rem] font-bold px-2 py-0.5 rounded bg-green-light text-green uppercase">
												{ep.method}
											</span>
											<span className="text-text-secondary">
												{ep.path}
											</span>
										</div>
									))}
								</div>
							</section>
						</>
					)}

					{/* Result */}
					<Separator />
					<section>
						<h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text-muted mb-2">
							Result
						</h3>
						<div className="rounded-xl bg-success/10 border border-success/20 px-4 py-3">
							<p className="text-[0.875rem] text-success leading-relaxed">
								{d.result}
							</p>
						</div>
					</section>

					{/* Resources */}
					<Separator />
					<section className="pb-1">
						<h3 className="text-[0.75rem] font-bold uppercase tracking-wider text-text-muted mb-2">
							Resources
						</h3>
						<div className="flex flex-wrap gap-2">
							{d.resources.map((r) => (
								<span
									key={r.label}
									className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-lg bg-bg-muted text-text-muted">
									<ExternalLink size={12} />
									{r.label}
								</span>
							))}
						</div>
					</section>
				</div>
			</DialogContent>
		</Dialog>
	)
}
