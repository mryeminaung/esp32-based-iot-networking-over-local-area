import { backendClient } from "@/api/auth";
import { Eye, EyeOff, Loader2, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "./types";
import { ROLES } from "./types";
import { generatePassword } from "./userUtils";

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
	const [formError, setFormError] = useState<string | null>(null);

	useEffect(() => {
		if (user) {
			setEditName(user.name || "");
			setEditEmail(user.email);
			setEditRole(user.role);
			setNewPassword("");
			setShowNewPassword(false);
			setFormError(null);
		}
	}, [user]);

	const handleClose = () => {
		setFormError(null);
		onClose();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;
		setFormError(null);
		setSubmitting(true);

		try {
			// Update user fields
			const payload: Record<string, string> = {};
			if (editName) payload.name = editName;
			if (editEmail) payload.email = editEmail;
			if (user.role !== "farm_manager") payload.role = editRole;
			await backendClient.patch(`/users/${user.id}`, payload);

			// Reset password if provided (non-manager only)
			if (user.role !== "farm_manager" && newPassword) {
				await backendClient.patch(`/users/${user.id}/password`, {
					newPassword,
				});
			}

			onUpdated();
		} catch (err: unknown) {
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message || "Failed to update user";
			setFormError(msg);
		} finally {
			setSubmitting(false);
		}
	};

	if (!open || !user) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
			onClick={(e) => {
				if (e.target === e.currentTarget) handleClose();
			}}>
			<div className="card w-full max-w-md relative">
				<button
					onClick={handleClose}
					className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
					<X size={16} />
				</button>

				<h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
					Edit User
				</h2>

				{formError && (
					<div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
						{formError}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
							Name
						</label>
						<input
							type="text"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							placeholder="John Doe"
							className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
							Email <span className="text-red-500">*</span>
						</label>
						<input
							type="email"
							required
							value={editEmail}
							onChange={(e) => setEditEmail(e.target.value)}
							placeholder="user@farm.com"
							className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
						/>
					</div>

					{user.role !== "farm_manager" && (
						<>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
									Role <span className="text-red-500">*</span>
								</label>
								<select
									value={editRole}
									onChange={(e) => setEditRole(e.target.value)}
									className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
									{ROLES.map((r) => (
										<option
											key={r.value}
											value={r.value}>
											{r.label}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
									Reset Password
								</label>
								<div className="flex gap-2">
									<div className="relative flex-1">
										<input
											type={showNewPassword ? "text" : "password"}
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="Leave blank to keep current"
											minLength={newPassword ? 8 : undefined}
											className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-10"
										/>
										{newPassword && (
											<button
												type="button"
												onClick={() => setShowNewPassword(!showNewPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
												{showNewPassword ? (
													<EyeOff size={14} />
												) : (
													<Eye size={14} />
												)}
											</button>
										)}
									</div>
									<button
										type="button"
										onClick={() => {
											setNewPassword(generatePassword());
											setShowNewPassword(true);
										}}
										className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shrink-0"
										title="Generate random password">
										<RefreshCw size={14} />
										Generate
									</button>
								</div>
								{showNewPassword && newPassword && (
									<p className="mt-1.5 text-xs text-gray-400">
										Password:{" "}
										<span className="font-mono text-gray-600 dark:text-gray-300">
											{newPassword}
										</span>
									</p>
								)}
							</div>
						</>
					)}

					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={handleClose}
							className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed">
							{submitting ? (
								<>
									<Loader2
										size={14}
										className="animate-spin"
									/>
									Saving...
								</>
							) : (
								"Save Changes"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
