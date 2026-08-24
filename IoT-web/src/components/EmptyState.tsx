import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

interface EmptyStateProps {
	icon?: ReactNode;
	title: string;
	description?: string;
	action?: ReactNode;
}

export default function EmptyState({
	icon,
	title,
	description,
	action,
}: EmptyStateProps) {
	return (
		<Card className="text-center py-12">
			<CardContent>
				{icon && (
					<div className="w-12 h-12 text-border mx-auto mb-3">
						{icon}
					</div>
				)}
				<p className="text-text-muted font-medium">{title}</p>
				{description && (
					<p className="text-text-muted/70 text-sm mt-1">{description}</p>
				)}
				{action && <div className="mt-4">{action}</div>}
			</CardContent>
		</Card>
	);
}
