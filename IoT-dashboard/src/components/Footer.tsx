import { useDashboardStore } from "@/store/dashboard"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="text-center px-6 py-8 text-[0.8125rem] text-text-muted">
      <p>
        © {year} Smart Agriculture · IoT Monitoring & Irrigation System ·{" "}
        <a
          href="https://github.com/mryeminaung"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent no-underline font-semibold hover:underline"
        >
          @mryeminaung
        </a>
      </p>
    </footer>
  )
}
