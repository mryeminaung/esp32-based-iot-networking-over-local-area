import { backendClient } from "@/api/auth";
import { Loader2, Plus, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CreateUserModal from "./components/CreateUserModal";
import DeleteUserDialog from "./components/DeleteUserDialog";
import EditUserModal from "./components/EditUserModal";
import type { User } from "./components/types";
import UserTable from "./components/UserTable";
import UserToolbar from "./components/UserToolbar";

export default function UserManagementPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Filter/search
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState<string | null>(null);

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
			<div className="card flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
						<Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
					</div>
					<div>
						<h1 className="text-xl font-bold text-gray-900 dark:text-white">
							User Management
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Manage farm users and roles
						</p>
					</div>
				</div>
				<button
					onClick={() => setShowCreateModal(true)}
					className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
					<Plus size={16} />
					Add User
				</button>
			</div>

			{/* Success */}
			{success && (
				<div className="card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
					{success}
				</div>
			)}

			{/* Content */}
			{loading ? (
				<div className="card flex justify-center py-12">
					<Loader2 className="w-6 h-6 animate-spin text-green-600" />
				</div>
			) : error ? (
				<div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
					{error}
				</div>
			) : users.length === 0 ? (
				<div className="card text-center py-12">
					<Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
					<p className="text-gray-500 dark:text-gray-400">No users found</p>
				</div>
			) : (
				<div className="card p-0 overflow-hidden">
					<UserToolbar
						search={search}
						onSearchChange={setSearch}
						roleFilter={roleFilter}
						onRoleFilterChange={setRoleFilter}
					/>

					{filteredUsers.length === 0 ? (
						<div className="text-center py-12">
							<Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
							<p className="text-gray-500 dark:text-gray-400">
								No users match your search
							</p>
						</div>
					) : (
						<UserTable
							users={filteredUsers}
							onEdit={setEditingUser}
							onDelete={setDeletingUser}
						/>
					)}
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
