import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/use-auth-store";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { Eye, EyeOff, Loader2, Monitor, Moon, Sun, Tractor, UserCog, Wrench } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const THEME_ICONS = {
	light: Sun,
	dark: Moon,
	system: Monitor,
} as const;

const DEMO_USERS = [
	{
		label: "Manager",
		email: "admin@farm.com",
		password: "Admin@!23456",
		icon: UserCog,
	},
	{
		label: "Worker",
		email: "worker@farm.com",
		password: "Worker@!23456",
		icon: Tractor,
	},
	{
		label: "Technician",
		email: "technician@farm.com",
		password: "Tech@!23456",
		icon: Wrench,
	},
] as const;

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [activeDemo, setActiveDemo] = useState<number | null>(null);
	const { login, loading, error } = useAuthStore();
	const navigate = useNavigate();
	useTheme();
	const theme = useDashboardStore((s) => s.theme);
	const toggleTheme = useDashboardStore((s) => s.toggleTheme);
	const ThemeIcon = THEME_ICONS[theme];

	const handleDemoClick = (index: number) => {
		const user = DEMO_USERS[index];
		setEmail(user.email);
		setPassword(user.password);
		setActiveDemo(index);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(email, password);
			navigate("/");
		} catch {
			// error is set in store
		}
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-bg-page px-4 bg-cover bg-center bg-no-repeat relative"
			style={{ backgroundImage: "url('/main_bg.png')" }}>
			<div className="absolute inset-0 bg-black/20" />

			{/* Theme toggle */}
			<button
				onClick={toggleTheme}
				className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-bg-card/80 backdrop-blur-sm border border-border hover:border-green-400 transition-colors cursor-pointer"
				title={`Theme: ${theme}`}>
				<ThemeIcon className="w-5 h-5 text-text-secondary" />
			</button>

			<div className="w-full max-w-lg relative z-10">
				{/* Demo Users */}
				<div className="flex gap-2 mb-3">
					{DEMO_USERS.map((user, i) => {
						const Icon = user.icon;
						return (
							<button
								key={user.email}
								type="button"
								onClick={() => handleDemoClick(i)}
								className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
									activeDemo === i
										? "bg-green-600 text-white border-green-600"
										: "bg-bg-card text-text-secondary border-border hover:border-green-400 hover:text-green-700"
								}`}>
								<Icon className="w-4 h-4" />
								{user.label}
							</button>
						);
					})}
				</div>

				{/* Login Form */}
				<form
					onSubmit={handleSubmit}
					className="bg-bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
					{/* Logo / Brand */}
					<div className="flex items-center justify-center gap-6 mb-5">
						<img
							src="/logo.png"
							alt="Smart Agriculture"
							className="w-24 h-24 rounded-full border border-border bg-white shrink-0"
						/>
						<div className="leading-tight">
							<h1 className="text-xl font-bold text-text-primary">
								Smart Agriculture
							</h1>
							<p className="text-md text-text-muted">
								IoT Monitoring System
							</p>
						</div>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
							{error}
						</div>
					)}

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-text-secondary mb-1.5">
							Email
						</label>
						<Input
							id="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="user@farm.com"
							className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-text-secondary mb-1.5">
							Password
						</label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors pr-10"
							/>
							{showPassword ? (
								<EyeOff
									onClick={() => setShowPassword(false)}
									className="size-4 absolute right-3 top-3"
								/>
							) : (
								<Eye
									onClick={() => setShowPassword(true)}
									className="size-4 absolute right-3 top-3"
								/>
							)}
						</div>
					</div>

					<Button
						type="submit"
						disabled={loading}
						className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-5 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed">
						{loading ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Signing in...
							</>
						) : (
							"Sign in"
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
