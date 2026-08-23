import { useAuthStore } from "@/store/use-auth-store";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const { login, loading, error } = useAuthStore();
	const navigate = useNavigate();

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
			<div className="w-full max-w-md relative z-10">
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
							<h1 className="text-2xl font-bold text-text-primary">
								Smart Agriculture
							</h1>
							<p className="text-md text-text-muted">
								Sign in to your account
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
							placeholder="admin@farm.com"
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
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
								{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
							</Button>
						</div>
					</div>

					<Button
						type="submit"
						disabled={loading}
						className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed">
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
