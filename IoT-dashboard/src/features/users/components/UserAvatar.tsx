import { getAvatarColor, getInitials } from "./userUtils";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface UserAvatarProps {
	name: string | null;
	email: string;
	imageUrl?: string | null;
	size?: "sm" | "md" | "lg";
}

const sizeClasses = {
	xs: "w-7 h-7 text-[0.6rem]",
	sm: "w-8 h-8 text-xs",
	md: "w-10 h-10 text-sm",
	lg: "w-20 h-20 text-2xl",
};

export default function UserAvatar({
	name,
	email,
	imageUrl,
	size = "sm",
}: UserAvatarProps) {
	const fullUrl = imageUrl ? `${API_BASE}${imageUrl}` : null;

	return (
		<div
			className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden shrink-0 border-2 border-gray-200 dark:border-gray-700 ${
				fullUrl ? "" : `text-white font-bold ${getAvatarColor(name || email)}`
			}`}>
			{fullUrl ? (
				<img
					src={fullUrl}
					alt={name || email}
					className="w-full h-full object-cover"
				/>
			) : (
				getInitials(name, email)
			)}
		</div>
	);
}
