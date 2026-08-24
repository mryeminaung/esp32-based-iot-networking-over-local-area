import { backendClient } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToastManager } from "@/components/ui/toast";
import { Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { ROLES, roleLabels } from "../types";
import { generatePassword } from "../utils";

interface CreateUserModalProps {
	open: boolean;
	onClose: () => void;
	onCreated: () => void;
}

export default function CreateUserModal({
	open,
	onClose,
	onCreated,
}: CreateUserModalProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("farm_worker");
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const toastManager = useToastManager();

	const resetForm = () => {
		setName("");
		setEmail("");
		setPassword("");
		setRole("farm_worker");
		setShowPassword(false);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			await backendClient.post("/users", { name, email, password, role });
			resetForm();
			toastManager.add({ title: "User created successfully", type: "success" });
			onCreated();
		} catch (err: unknown) {
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message || "Failed to create user";
			toastManager.add({ title: msg, type: "error" });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => !v && handleClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New User</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-text-secondary mb-1.5">
							Name
						</label>
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="John Doe"
							className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-text-secondary mb-1.5">
							Email <span className="text-red-500">*</span>
						</label>
						<Input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="user@farm.com"
							pattern="^[a-zA-Z0-9._%+\-]+@farm\.com$"
							title="Email must be a @farm.com address"
							className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
						/>
						<p className="mt-1 text-xs text-gray-400">
							Must be a @farm.com address
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-text-secondary mb-1.5">
							Password <span className="text-red-500">*</span>
						</label>
						<div className="flex gap-2">
							<div className="relative flex-1">
								<Input
									type={showPassword ? "text" : "password"}
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Min. 8 characters"
									minLength={8}
									className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm pr-10"
								/>
								{showPassword ? (
									<EyeOff
										onClick={() => setShowPassword(false)}
										className="size-4 absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
									/>
								) : (
									<Eye
										onClick={() => setShowPassword(true)}
										className="size-4 absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
									/>
								)}
							</div>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setPassword(generatePassword());
									setShowPassword(true);
								}}
								className="shrink-0"
								title="Generate random password">
								<RefreshCw size={14} />
								Generate
							</Button>
						</div>
						{showPassword && password && (
							<p className="mt-1.5 text-xs text-gray-400">
								Password:{" "}
								<span className="font-mono text-text-secondary">
									{password}
								</span>
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-text-secondary mb-1.5">
							Role <span className="text-red-500">*</span>
						</label>
						<Select
							value={role}
							onValueChange={(v) => v && setRole(v)}>
							<SelectTrigger className="w-full h-10">
								<SelectValue placeholder="Select role">
									{roleLabels[role] || "Select role"}
								</SelectValue>
							</SelectTrigger>
							<SelectContent alignItemWithTrigger={false}>
								{ROLES.map((r) => (
									<SelectItem
										key={r.value}
										value={r.value}>
										{r.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							className="flex-1 py-5 flex items-center justify-center gap-2 px-4 rounded-full border border-border text-text-secondary text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={submitting}
							className="flex-1 py-5 flex items-center justify-center gap-2 px-4 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed">
							{submitting ? (
								<>
									<Loader2
										size={14}
										className="animate-spin"
									/>
									Creating...
								</>
							) : (
								"Create User"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
