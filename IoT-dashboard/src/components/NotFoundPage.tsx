import { Home, ArrowLeft, MapPinOff } from "lucide-react"
import { useNavigate } from "react-router"

export default function NotFoundPage() {
	const navigate = useNavigate()

	return (
		<div className="flex-1 max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-6 flex items-center justify-center">
			<div className="card max-w-md w-full text-center">
				<div className="w-14 h-14 rounded-xl bg-bg-muted text-text-muted flex items-center justify-center mx-auto mb-4">
					<MapPinOff size={26} />
				</div>
				<h1 className="text-5xl font-bold text-border-strong mb-2">404</h1>
				<h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
				<p className="text-[0.85rem] text-text-muted mb-6">
					Oops! The page you're looking for doesn't exist or has been moved.
				</p>
				<div className="flex gap-3 justify-center">
					<button
						onClick={() => navigate(-1)}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-bg-muted text-text-secondary text-sm font-medium hover:bg-border transition-all cursor-pointer">
						<ArrowLeft className="w-4 h-4" />
						Go Back
					</button>
					<button
						onClick={() => navigate("/")}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-all cursor-pointer">
						<Home className="w-4 h-4" />
						Back to Home
					</button>
				</div>
			</div>
		</div>
	)
}
