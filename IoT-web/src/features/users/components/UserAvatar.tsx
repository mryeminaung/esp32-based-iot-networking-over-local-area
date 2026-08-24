import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "../utils";

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
		<Avatar
			className={`${sizeClasses[size]} shrink-0 border-2 border-green-500 after:mix-blend-lighten bg-[#262626]`}>
			{fullUrl && (
				<AvatarImage
					src={fullUrl}
					alt={name || email}
					className="object-cover"
				/>
			)}
			<AvatarFallback className="text-white font-bold bg-[#262626]">
				{getInitials(name, email)}
			</AvatarFallback>
		</Avatar>
	);
}
