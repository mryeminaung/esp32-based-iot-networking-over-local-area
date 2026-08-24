import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import type { User } from "../types";
import { roleBadgeColors, roleLabels } from "../types";
import UserAvatar from "./UserAvatar";

export type ViewMode = "grid" | "table";

interface UserTableProps {
	users: User[];
	view: ViewMode;
	onEdit: (user: User) => void;
	onDelete: (user: User) => void;
}

function ActionButtons({
	user,
	onEdit,
	onDelete,
}: {
	user: User;
	onEdit: (u: User) => void;
	onDelete: (u: User) => void;
}) {
	if (user.role === "farm_manager") return null;
	return (
		<div className="flex items-center gap-1.5">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => onEdit(user)}
				title="Edit user"
				className="h-8 w-8 text-text-muted hover:text-green-600 hover:bg-green-50 ">
				<Pencil size={15} />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => onDelete(user)}
				title="Delete user"
				className="h-8 w-8 text-text-muted hover:text-red-600 hover:bg-red-50 ">
				<Trash2 size={15} />
			</Button>
		</div>
	);
}

function GridView({ users, onEdit, onDelete }: Omit<UserTableProps, "view">) {
	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 p-4">
			{users.map((user) => (
				<div
					key={user.id}
					className="flex flex-col gap-3 p-4 rounded-xl bg-bg-muted border border-border hover:border-border-strong transition-colors">
					<div className="flex items-start gap-3">
						<UserAvatar
							name={user.name}
							email={user.email}
							imageUrl={user.image}
							size="md"
						/>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-semibold text-text-primary truncate">
								{user.name || "—"}
							</p>
							<p className="text-xs text-text-muted truncate">{user.email}</p>
						</div>
					</div>

					<Badge
						variant="outline"
						className={`self-start text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full ${
							roleBadgeColors[user.role] || "bg-bg-card text-text-muted"
						}`}>
						{roleLabels[user.role] || user.role}
					</Badge>

					<div className="flex items-center justify-between mt-auto pt-1 border-t border-border">
						<div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted">
							<Calendar size={11} />
							{new Date(user.createdAt).toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</div>
						<ActionButtons
							user={user}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

function TableView({ users, onEdit, onDelete }: Omit<UserTableProps, "view">) {
	return (
		<div className="overflow-hidden">
			{/* Table header */}
			<div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-bg-muted border-b border-border text-xs font-medium text-text-muted uppercase tracking-wider">
				<div className="col-span-5">User</div>
				<div className="col-span-3">Role</div>
				<div className="col-span-2">Joined</div>
				<div className="col-span-2 text-right">Actions</div>
			</div>

			{/* Table rows */}
			<div className="divide-y divide-border">
				{users.map((user) => (
					<div
						key={user.id}
						className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-3 hover:bg-bg-muted transition-colors">
						{/* User */}
						<div className="col-span-5 flex items-center gap-3">
							<UserAvatar
								name={user.name}
								email={user.email}
								imageUrl={user.image}
								size="sm"
							/>
							<div className="min-w-0">
								<p className="text-sm font-medium text-text-primary truncate">
									{user.name || "—"}
								</p>
								<p className="text-xs text-text-muted truncate">
									{user.email}
								</p>
							</div>
						</div>

						{/* Role */}
						<div className="col-span-3 flex items-center">
							<Badge
								variant="outline"
								className={`text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full ${
									roleBadgeColors[user.role] || "bg-bg-card text-text-muted"
								}`}>
								{roleLabels[user.role] || user.role}
							</Badge>
						</div>

						{/* Joined */}
						<div className="col-span-2 flex items-center text-xs text-text-muted">
							{new Date(user.createdAt).toLocaleDateString(undefined, {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</div>

						{/* Actions */}
						<div className="col-span-2 flex items-center justify-end">
							<ActionButtons
								user={user}
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default function UserTable({
	users,
	view,
	onEdit,
	onDelete,
}: UserTableProps) {
	return view === "grid" ? (
		<GridView
			users={users}
			onEdit={onEdit}
			onDelete={onDelete}
		/>
	) : (
		<TableView
			users={users}
			onEdit={onEdit}
			onDelete={onDelete}
		/>
	);
}
