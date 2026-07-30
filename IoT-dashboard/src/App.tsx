import NotFoundPage from "@/components/NotFoundPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ExperimentsPage from "@/features/experiments/ExperimentsPage";
import { BrowserRouter, Route, Routes } from "react-router";
import RootLayout from "./layouts/Rootlayout";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<RootLayout />}>
					<Route
						index
						path="/"
						element={<DashboardPage />}
					/>
					<Route
						path="/experiments"
						element={<ExperimentsPage />}
					/>
					<Route
						path="*"
						element={<NotFoundPage />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
