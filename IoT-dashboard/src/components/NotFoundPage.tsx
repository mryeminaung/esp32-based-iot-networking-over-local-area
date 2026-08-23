import { Home, ArrowLeft, MapPinOff } from "lucide-react"
import { useNavigate } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
	const navigate = useNavigate()

	return (
		<div className="flex-1 max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-6 flex items-center justify-center">
			<Card className="max-w-md w-full text-center">
				<CardContent>
					<div className="w-14 h-14 rounded-xl bg-bg-muted text-text-muted flex items-center justify-center mx-auto mb-4">
						<MapPinOff size={26} />
					</div>
					<h1 className="text-5xl font-bold text-border-strong mb-2">404</h1>
					<h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
					<p className="text-[0.85rem] text-text-muted mb-6">
						Oops! The page you're looking for doesn't exist or has been moved.
					</p>
					<div className="flex gap-3 justify-center">
						<Button variant="outline" onClick={() => navigate(-1)}>
							<ArrowLeft className="w-4 h-4" />
							Go Back
						</Button>
						<Button onClick={() => navigate("/")}>
							<Home className="w-4 h-4" />
							Back to Home
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
