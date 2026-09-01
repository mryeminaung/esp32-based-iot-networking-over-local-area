import { backendClient } from "@/api/auth";
import { useToastManager } from "@/components/ui/toast";
import { Plus, Search, Users, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useHeader } from "@/hooks/useHeader";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import CreateUserModal from "./components/CreateUserModal";
import DeleteUserDialog from "./components/DeleteUserDialog";
import EditUserModal from "./components/EditUserModal";
import type { User } from "./types";
import UserTable, { type ViewMode } from "./components/UserTable";
import UserToolbar from "./components/UserToolbar";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

export default function UserManagementPage() {
	useHeader("Farm User Management");
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const toastManager = useToastManager();

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

	const handleCreated = () => {
		setShowCreateModal(false);
		fetchUsers();
	};

	const handleUpdated = () => {
		setEditingUser(null);
		fetchUsers();
	};

	const handleDeleteConfirm = async () => {
		if (!deletingUser) return;
		try {
			await backendClient.delete(`/users/${deletingUser.id}`);
			toastManager.add({ title: `User "${deletingUser.email}" deleted`, type: "success" });
			setDeletingUser(null);
			fetchUsers();
		} catch (err: unknown) {
			const msg =
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message || "Failed to delete user";
			toastManager.add({ title: msg, type: "error" });
			setDeletingUser(null);
		}
	};

	return (
		<div className="max-w-[1100px] mx-auto space-y-5">
			{/* Header */}
			<PageHeader
				title="Farm User Management"
				description="Manage farm users and roles"
			>
				<Button size="lg" onClick={() => setShowCreateModal(true)}>
					<Plus size={16} />
					Add User
				</Button>
			</PageHeader>

			{/* Content */}
			{loading ? (
				<LoadingState message="Loading users..." />
			) : error ? (
				<ErrorState
					message={error}
					action={
						<button onClick={fetchUsers} className="mt-2 inline-flex items-center gap-1.5 text-sm text-green hover:text-green/80">
							<RefreshCw className="w-3.5 h-3.5" /> Retry
						</button>
					}
				/>
			) : users.length === 0 ? (
				<EmptyState
					icon={<Users className="w-12 h-12" />}
					title="No users found"
				/>
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
							<EmptyState
								icon={<Search className="w-10 h-10" />}
								title="No users match your search"
							/>
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
