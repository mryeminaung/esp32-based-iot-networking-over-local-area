import AppLayout from "@/components/AppLayout";
import AuthInitializer from "@/components/AuthInitializer";
import NotFoundPage from "@/components/NotFoundPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleRoute from "@/components/RoleRoute";
import { Toaster } from "@/components/ui/toast";
import { ROLES } from "@/config/roles";
import ActivityLogPage from "@/features/activity/ActivityLogPage";
import ActuatorsPage from "@/features/actuators/ActuatorsPage";
import AnalyticsPage from "@/features/analytics/AnalyticsPage";
import LoginPage from "@/features/auth/LoginPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import DeviceSettingsPage from "@/features/device-settings/DeviceSettingsPage";
import DeviceInfoPage from "@/features/devices/DeviceInfoPage";
import DiagnosticsPage from "@/features/diagnostics/DiagnosticsPage";
import ExperimentsPage from "@/features/experiments/ExperimentsPage";
import SensorsPage from "@/features/sensors/SensorsPage";
import SettingsLayout from "@/features/settings/SettingsLayout";
import AccountPage from "@/features/settings/pages/AccountPage";
import ProfilePage from "@/features/settings/pages/ProfilePage";
import SecurityPage from "@/features/settings/pages/SecurityPage";
import ThemePage from "@/features/settings/pages/ThemePage";
import QRCodePage from "@/features/settings/pages/QRCodePage";
import UserManagementPage from "@/features/users/UserManagementPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

export default function App() {
	return (
		<BrowserRouter>
			<Toaster>
				<AuthInitializer>
					<Routes>
						<Route
							path="/login"
							element={<LoginPage />}
						/>
						<Route
							path="/experiments"
							element={<ExperimentsPage />}
						/>
						<Route element={<ProtectedRoute />}>
							<Route element={<AppLayout />}>
								<Route
									index
									element={<DashboardPage />}
								/>
								<Route
									path="sensors"
									element={<SensorsPage />}
								/>
								<Route
									path="actuators"
									element={<ActuatorsPage />}
								/>
								<Route
									path="activity"
									element={
										<RoleRoute
											allowedRoles={[ROLES.FARM_MANAGER, ROLES.FARM_WORKER]}
										/>
									}>
									<Route
										index
										element={<ActivityLogPage />}
									/>
								</Route>
								<Route
									path="analytics"
									element={<RoleRoute allowedRoles={[ROLES.FARM_MANAGER]} />}>
									<Route
										index
										element={<AnalyticsPage />}
									/>
								</Route>
								<Route
									path="users"
									element={<RoleRoute allowedRoles={[ROLES.FARM_MANAGER]} />}>
									<Route
										index
										element={<UserManagementPage />}
									/>
								</Route>
								<Route
									path="devices"
									element={<RoleRoute allowedRoles={[ROLES.TECHNICIAN]} />}>
									<Route
										index
										element={<DeviceInfoPage />}
									/>
								</Route>
								<Route
									path="settings"
									element={<SettingsLayout />}>
									<Route
										index
										element={
											<Navigate
												to="/settings/profile"
												replace
											/>
										}
									/>
									<Route
										path="profile"
										element={<ProfilePage />}
									/>
									<Route
										path="security"
										element={<SecurityPage />}
									/>
									<Route
										path="theme"
										element={<ThemePage />}
									/>
									<Route
										path="account"
										element={<AccountPage />}
									/>
									<Route
										path="qr-code"
										element={<QRCodePage />}
									/>
								</Route>
								<Route
									path="device-settings"
									element={<RoleRoute allowedRoles={[ROLES.FARM_MANAGER]} />}>
									<Route
										index
										element={<DeviceSettingsPage />}
									/>
								</Route>
								<Route
									path="diagnostics"
									element={<RoleRoute allowedRoles={[ROLES.TECHNICIAN]} />}>
									<Route
										index
										element={<DiagnosticsPage />}
									/>
								</Route>
							</Route>
						</Route>
						<Route
							path="*"
							element={<NotFoundPage />}
						/>
					</Routes>
				</AuthInitializer>
			</Toaster>
		</BrowserRouter>
	);
}
