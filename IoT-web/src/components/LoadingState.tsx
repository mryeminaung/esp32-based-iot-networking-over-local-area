import { Card, CardContent } from "./ui/card";

interface LoadingStateProps {
	message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
	return (
		<Card className="text-center py-12">
			<CardContent>
				<div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
				<p className="text-text-muted">{message}</p>
			</CardContent>
		</Card>
	);
}
