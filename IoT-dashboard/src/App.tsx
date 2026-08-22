import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AuthInitializer from "@/components/AuthInitializer";
import AppLayout from "@/components/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleRoute from "@/components/RoleRoute";
import NotFoundPage from "@/components/NotFoundPage";
import { ROLES } from "@/config/roles";
import LoginPage from "@/features/auth/LoginPage";
import ExperimentsPage from "@/features/experiments/ExperimentsPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import SensorsPage from "@/features/sensors/SensorsPage";
import ActuatorsPage from "@/features/actuators/ActuatorsPage";
import ActivityLogPage from "@/features/activity/ActivityLogPage";
import UserManagementPage from "@/features/users/UserManagementPage";
import DeviceInfoPage from "@/features/devices/DeviceInfoPage";
import AnalyticsPage from "@/features/analytics/AnalyticsPage";
import SettingsLayout from "@/features/settings/SettingsLayout";
import ProfilePage from "@/features/settings/pages/ProfilePage";
import SecurityPage from "@/features/settings/pages/SecurityPage";
import ThemePage from "@/features/settings/pages/ThemePage";
import AccountPage from "@/features/settings/pages/AccountPage";

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
							<Route path="sensors" element={<SensorsPage />} />
							<Route path="actuators" element={<ActuatorsPage />} />
							<Route
								path="activity"
								element={<RoleRoute allowedRoles={[ROLES.FARM_MANAGER]} />}
							>
								<Route index element={<ActivityLogPage />} />
							</Route>
							<Route path="analytics" element={<AnalyticsPage />} />
							<Route
								path="users"
								element={<RoleRoute allowedRoles={[ROLES.FARM_MANAGER]} />}
							>
								<Route index element={<UserManagementPage />} />
							</Route>
							<Route
								path="devices"
								element={
									<RoleRoute allowedRoles={[ROLES.FARM_MANAGER, ROLES.TECHNICIAN]} />
								}
							>
								<Route index element={<DeviceInfoPage />} />
							</Route>
							<Route path="settings" element={<SettingsLayout />}>
								<Route index element={<Navigate to="/settings/profile" replace />} />
								<Route path="profile" element={<ProfilePage />} />
								<Route path="security" element={<SecurityPage />} />
								<Route path="theme" element={<ThemePage />} />
								<Route path="account" element={<AccountPage />} />
							</Route>
						</Route>
					</Route>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</AuthInitializer>
		</BrowserRouter>
	);
}
