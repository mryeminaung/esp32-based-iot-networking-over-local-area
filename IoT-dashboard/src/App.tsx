import NotFoundPage from "@/components/NotFoundPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthInitializer from "@/components/AuthInitializer";
import AppLayout from "@/components/AppLayout";
import RoleRoute from "@/components/RoleRoute";
import LoginPage from "@/features/auth/LoginPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ExperimentsPage from "@/features/experiments/ExperimentsPage";
import ActivityLogPage from "@/features/activity/ActivityLogPage";
import UserManagementPage from "@/features/users/UserManagementPage";
import DeviceInfoPage from "@/features/devices/DeviceInfoPage";
import SettingsPage from "@/features/settings/SettingsPage";
import SensorsPage from "@/features/sensors/SensorsPage";
import ActuatorsPage from "@/features/actuators/ActuatorsPage";
import { BrowserRouter, Route, Routes } from "react-router";
import { ROLES } from "@/config/roles";

export default function App() {
	return (
		<BrowserRouter>
			<AuthInitializer>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/experiments" element={<ExperimentsPage />} />
					<Route element={<ProtectedRoute />}>
						<Route element={<AppLayout />}>
							<Route index element={<DashboardPage />} />
							<Route path="/sensors" element={<SensorsPage />} />
							<Route path="/actuators" element={<ActuatorsPage />} />
							<Route
								path="/activity"
								element={
									<RoleRoute
										allowedRoles={[ROLES.FARM_MANAGER]}
									/>
								}
							>
								<Route index element={<ActivityLogPage />} />
							</Route>
							<Route
								path="/users"
								element={
									<RoleRoute
										allowedRoles={[ROLES.FARM_MANAGER]}
									/>
								}
							>
								<Route index element={<UserManagementPage />} />
							</Route>
							<Route
								path="/devices"
								element={
									<RoleRoute
										allowedRoles={[
											ROLES.FARM_MANAGER,
											ROLES.TECHNICIAN,
										]}
									/>
								}
							>
								<Route index element={<DeviceInfoPage />} />
							</Route>
							<Route path="/settings" element={<SettingsPage />} />
						</Route>
					</Route>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</AuthInitializer>
		</BrowserRouter>
	);
}
