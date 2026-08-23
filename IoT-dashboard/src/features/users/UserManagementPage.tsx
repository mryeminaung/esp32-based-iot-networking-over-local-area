import { backendClient } from "@/api/auth";
import { Loader2, Plus, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useHeader } from "@/hooks/useHeader";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateUserModal from "./components/CreateUserModal";
import DeleteUserDialog from "./components/DeleteUserDialog";
import EditUserModal from "./components/EditUserModal";
import type { User } from "./types";
import UserTable, { type ViewMode } from "./components/UserTable";
import UserToolbar from "./components/UserToolbar";

export default function UserManagementPage() {
	useHeader("User Management");
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Filter/search
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>(
		() => (localStorage.getItem("users-view") as ViewMode) ?? "grid"
	);

	const handleViewChange = (v: ViewMode) => {
		setViewMode(v);
		localStorage.setItem("users-view", v);
	};

	// Modals
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [deletingUser, setDeletingUser] = useState<User | null>(null);

	const fetchUsers = async () => {
		try {
			const { data } = await backendClient.get("/users");
			setUsers(data.data.users);
			setError(null);
		} catch (err: unknown) {
			const status = (err as { response?: { status?: number } })?.response
				?.status;
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message || "Failed to load users";
			setError(
				status === 401 ? "Session expired. Please refresh the page." : msg,
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const filteredUsers = useMemo(() => {
		return users.filter((u) => {
			const matchesSearch =
				!search ||
				u.name?.toLowerCase().includes(search.toLowerCase()) ||
				u.email.toLowerCase().includes(search.toLowerCase());
			const matchesRole = !roleFilter || u.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	}, [users, search, roleFilter]);

	const flashSuccess = (msg: string) => {
		setSuccess(msg);
		setTimeout(() => setSuccess(null), 3000);
	};

	const handleCreated = () => {
		setShowCreateModal(false);
		fetchUsers();
		flashSuccess("User created successfully");
	};

	const handleUpdated = () => {
		setEditingUser(null);
		fetchUsers();
		flashSuccess("User updated successfully");
	};

	const handleDeleteConfirm = async () => {
		if (!deletingUser) return;
		try {
			await backendClient.delete(`/users/${deletingUser.id}`);
			setDeletingUser(null);
			fetchUsers();
			flashSuccess(`User "${deletingUser.email}" deleted`);
		} catch (err: unknown) {
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message || "Failed to delete user";
			setError(msg);
			setDeletingUser(null);
		}
	};

	return (
		<div className="max-w-[1100px] mx-auto space-y-5">
			{/* Header */}
			<PageHeader
				title="User Management"
				description="Manage farm users and roles"
			>
				<Button onClick={() => setShowCreateModal(true)}>
					<Plus size={16} />
					Add User
				</Button>
			</PageHeader>

			{/* Success */}
			{success && (
				<Card className="bg-success/10 border-success/30">
					<CardContent className="text-success text-sm py-3">
						{success}
					</CardContent>
				</Card>
			)}

			{/* Content */}
			{loading ? (
				<Card className="flex justify-center py-12">
					<Loader2 className="w-6 h-6 animate-spin text-green-600" />
				</Card>
			) : error ? (
				<Card className="bg-danger/10 border-danger/30">
					<CardContent className="text-danger text-sm py-3">
						{error}
					</CardContent>
				</Card>
			) : users.length === 0 ? (
				<Card className="text-center py-12">
					<CardContent>
						<Users className="w-12 h-12 text-border mx-auto mb-3" />
						<p className="text-text-muted">No users found</p>
					</CardContent>
				</Card>
			) : (
				<div className="border border-border rounded-xl bg-bg-card overflow-hidden">
					<UserToolbar
						search={search}
						onSearchChange={setSearch}
						roleFilter={roleFilter}
						onRoleFilterChange={setRoleFilter}
						view={viewMode}
						onViewChange={handleViewChange}
					/>

					<div className="p-0">
						{filteredUsers.length === 0 ? (
							<div className="text-center py-12">
								<Search className="w-10 h-10 text-border mx-auto mb-3" />
								<p className="text-text-muted">No users match your search</p>
							</div>
						) : (
							<UserTable
								users={filteredUsers}
								view={viewMode}
								onEdit={setEditingUser}
								onDelete={setDeletingUser}
							/>
						)}
					</div>
				</div>
			)}

			{/* Modals */}
			<CreateUserModal
				open={showCreateModal}
				onClose={() => setShowCreateModal(false)}
				onCreated={handleCreated}
			/>
			<EditUserModal
				open={editingUser !== null}
				user={editingUser}
				onClose={() => setEditingUser(null)}
				onUpdated={handleUpdated}
			/>
			<DeleteUserDialog
				user={deletingUser}
				onClose={() => setDeletingUser(null)}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}
