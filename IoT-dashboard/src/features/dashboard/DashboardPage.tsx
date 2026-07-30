import Dashboard from "./components/Dashboard"
import useEsp32Sync from "./hooks/useEsp32Sync"

export default function DashboardPage() {
	useEsp32Sync()

	return <Dashboard />
}
