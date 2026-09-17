import { Leaf } from "lucide-react";
import { useNavigate } from "react-router";

export default function Footer() {
	const navigate = useNavigate();
	const year = new Date().getFullYear();

	return (
		<footer className="py-16 px-6">
			<div className="max-w-5xl mx-auto border-t border-border pt-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
					{/* Brand */}
					<div className="md:col-span-2">
						<div className="flex items-center gap-2.5 mb-4">
							<div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center">
								<Leaf className="w-5 h-5 text-white" />
							</div>
							<span className="text-lg font-bold text-text-primary">
								Smart Agriculture
							</span>
						</div>
						<p className="text-sm text-text-muted leading-relaxed max-w-sm">
							ESP32-based IoT networking system for local-area farm monitoring
							and automation. Capstone project for Arduino Based IoT Networking
							Over Local Area.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
							Quick Links
						</h4>
						<ul className="space-y-2.5">
							{[
								{ label: "Dashboard", path: "/login" },
								{ label: "Login", path: "/login" },
							].map((link) => (
								<li key={link.label}>
									<button
										onClick={() => navigate(link.path)}
										className="text-sm text-text-muted hover:text-green-600 transition-colors cursor-pointer">
										{link.label}
									</button>
								</li>
							))}
						</ul>
					</div>

					{/* Tech Stack */}
					<div>
						<h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
							Tech Stack
						</h4>
						<ul className="space-y-2.5 text-sm text-text-muted">
							<li>ESP32 + Arduino</li>
							<li>React + TypeScript</li>
							<li>Express + Prisma</li>
							<li>PostgreSQL</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-text-muted">
						&copy; {year} Smart Agriculture IoT System. All rights reserved.
					</p>
					<p className="text-xs text-text-muted">
						Built with ESP32, React, Express &amp; PostgreSQL
					</p>
				</div>
			</div>
		</footer>
	);
}
