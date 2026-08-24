import { backendClient } from "@/api/auth";
import { useToastManager } from "@/components/ui/toast";
import { Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "../types";
import { ROLES, roleLabels } from "../types";
import { generatePassword } from "../utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditUserModalProps {
	open: boolean;
	user: User | null;
	onClose: () => void;
	onUpdated: () => void;
}

export default function EditUserModal({
	open,
	user,
	onClose,
	onUpdated,
}: EditUserModalProps) {
	const [editName, setEditName] = useState("");
	const [editEmail, setEditEmail] = useState("");
	const [editRole, setEditRole] = useState("farm_worker");
	const [newPassword, setNewPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const toastManager = useToastManager();

	useEffect(() => {
		if (user) {
			setEditName(user.name || "");
			setEditEmail(user.email);
			setEditRole(user.role);
			setNewPassword("");
			setShowNewPassword(false);
		}
	}, [user]);

	const handleClose = () => {
		onClose();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;
		setSubmitting(true);

		try {
			const payload: Record<string, string> = {};
			if (editName) payload.name = editName;
			if (editEmail) payload.email = editEmail;
			if (user.role !== "farm_manager") payload.role = editRole;
			await backendClient.patch(`/users/${user.id}`, payload);

			if (user.role !== "farm_manager" && newPassword) {
				await backendClient.patch(`/users/${user.id}/password`, {
					newPassword,
				});
			}

			toastManager.add({ title: "User updated successfully", type: "success" });
			onUpdated();
		} catch (err: unknown) {
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message || "Failed to update user";
			toastManager.add({ title: msg, type: "error" });
		} finally {
			setSubmitting(false);
		}
	};

	if (!user) return null

	return (
		<Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-text-secondary mb-1.5">
							Name
						</label>
						<Input
							type="text"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
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
							value={editEmail}
							onChange={(e) => setEditEmail(e.target.value)}
							placeholder="user@farm.com"
							className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
						/>
					</div>

					{user?.role !== "farm_manager" && (
						<>
							<div>
								<label className="block text-sm font-medium text-text-secondary mb-1.5">
									Role <span className="text-red-500">*</span>
								</label>
								<Select value={editRole} onValueChange={(v) => v && setEditRole(v)}>
									<SelectTrigger className="w-full h-10">
										<SelectValue placeholder="Select role">{roleLabels[editRole] || "Select role"}</SelectValue>
									</SelectTrigger>
									<SelectContent alignItemWithTrigger={false}>
										{ROLES.map((r) => (
											<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<label className="block text-sm font-medium text-text-secondary mb-1.5">
									Reset Password
								</label>
								<div className="flex gap-2">
									<div className="relative flex-1">
										<Input
											type={showNewPassword ? "text" : "password"}
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="Leave blank to keep current"
											minLength={newPassword ? 8 : undefined}
											className="w-full px-4 rounded-lg border border-border bg-bg-card text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm pr-10"
										/>
										{newPassword && (
											showNewPassword ? (
												<EyeOff
													onClick={() => setShowNewPassword(false)}
													className="size-4 absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
												/>
											) : (
												<Eye
													onClick={() => setShowNewPassword(true)}
													className="size-4 absolute right-3 top-3 text-text-muted hover:text-text-primary cursor-pointer"
												/>
											)
										)}
									</div>
									<Button
										type="button"
										variant="outline"
										onClick={() => { setNewPassword(generatePassword()); setShowNewPassword(true); }}
										className="shrink-0"
										title="Generate random password">
										<RefreshCw size={14} />
										Generate
									</Button>
								</div>
								{showNewPassword && newPassword && (
									<p className="mt-1.5 text-xs text-gray-400">
										Password: <span className="font-mono text-text-secondary">{newPassword}</span>
									</p>
								)}
							</div>
						</>
					)}

					<div className="flex gap-3 pt-2">
						<Button type="button" variant="outline" onClick={handleClose} className="flex-1 flex items-center justify-center gap-2 px-4 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
							Cancel
						</Button>
						<Button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed">
							{submitting ? (
								<>
									<Loader2 size={14} className="animate-spin" />
									Saving...
								</>
							) : (
								"Save Changes"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
