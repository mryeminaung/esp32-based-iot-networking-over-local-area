import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

interface ErrorStateProps {
	message: string;
	action?: ReactNode;
}

export default function ErrorState({ message, action }: ErrorStateProps) {
	return (
		<Card className="bg-danger/10 border-danger/30">
			<CardContent className="text-center py-6">
				<p className="text-danger font-medium">{message}</p>
				{action && <div className="mt-2">{action}</div>}
			</CardContent>
		</Card>
	);
}
