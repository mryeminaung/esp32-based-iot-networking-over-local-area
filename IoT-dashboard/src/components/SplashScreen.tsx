import { Sprout, Signal } from "lucide-react";
import { useEffect, useState } from "react";

type Phase = "show" | "fade" | "hidden";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
	const [phase, setPhase] = useState<Phase>("show");

	useEffect(() => {
		const fadeTimer = setTimeout(() => setPhase("fade"), 2500);
		const doneTimer = setTimeout(() => {
			setPhase("hidden");
			onDone();
		}, 3000);
		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(doneTimer);
		};
	}, [onDone]);

	if (phase === "hidden") return null;

	return (
		<div
			className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-500 ${
				phase === "fade" ? "opacity-0 scale-[1.05]" : "opacity-100 scale-100"
			} bg-bg-page text-text-primary`}>
			{/* Signal arcs */}
			<div className="relative flex items-center justify-center mb-8">
				<span
					className="absolute w-32 h-32 rounded-full border border-accent/20 animate-[splash-wave_2s_ease-out_infinite]"
				/>
				<span
					className="absolute w-24 h-24 rounded-full border border-accent/30 animate-[splash-wave_2s_ease-out_infinite_0.4s]"
				/>
				<span
					className="absolute w-16 h-16 rounded-full border border-accent/40 animate-[splash-wave_2s_ease-out_infinite_0.8s]"
				/>

				{/* Center icon */}
				<div
					className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center bg-accent-light border border-accent/20 animate-[splash-pulse_2s_ease-in-out_infinite]">
					<Sprout
						size={40}
						className="text-accent"
					/>
				</div>
			</div>

			{/* Title */}
			<h1 className="text-2xl font-bold tracking-tight mb-2">
				Smart Agriculture
			</h1>

			{/* Subtitle with loading dots */}
			<p className="text-sm flex items-center gap-1 text-text-muted">
				<Signal
					size={14}
					className="text-accent"
				/>
				Connecting to sensors
				<span className="inline-flex w-5 justify-start">
					<span className="animate-[splash-dot_1.4s_ease-in-out_infinite]">
						.
					</span>
					<span className="animate-[splash-dot_1.4s_ease-in-out_infinite_0.2s]">
						.
					</span>
					<span className="animate-[splash-dot_1.4s_ease-in-out_infinite_0.4s]">
						.
					</span>
				</span>
			</p>

			{/* Progress bar */}
			<div
				className="mt-8 w-48 h-1 rounded-full overflow-hidden bg-border">
				<div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover animate-[splash-progress_2.5s_ease-in-out_forwards]" />
			</div>
		</div>
	);
}
