type MoistureCondition = {
	label: string;
	color: string;
	hex: string;
	bgClass: string;
	textClass: string;
};

export function getMoistureCondition(value: number): MoistureCondition {
	if (value <= 30)
		return { label: "DRY", color: "text-danger", hex: "#ef4444", bgClass: "bg-danger/10", textClass: "text-danger" };
	if (value < 50)
		return { label: "MOIST", color: "text-warning", hex: "#f59e0b", bgClass: "bg-warning/10", textClass: "text-warning" };
	return { label: "OPTIMAL", color: "text-success", hex: "#10b981", bgClass: "bg-success/10", textClass: "text-success" };
}
