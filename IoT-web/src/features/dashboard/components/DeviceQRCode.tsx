import { Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export default function DeviceQRCode() {
	const DASHBOARD_URL =
		import.meta.env.VITE_DASHBOARD_URL || "http://192.168.4.1";
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(DASHBOARD_URL);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback: select text manually
			const input = document.createElement("input");
			input.value = DASHBOARD_URL;
			document.body.appendChild(input);
			input.select();
			document.execCommand("copy");
			document.body.removeChild(input);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="w-full max-w-[400px] mx-auto overflow-hidden rounded-3xl shadow-lg bg-bg-card p-6 sm:p-8 flex flex-col items-center gap-5">
			{/* QR Code */}
			<div className="rounded-2xl bg-bg-muted p-4 sm:p-5 shadow-md w-full max-w-[200px]">
				<div className="aspect-square w-full">
					<QRCodeSVG
						value={DASHBOARD_URL}
						size={200}
						level="H"
						className="w-full h-auto"
						style={{ width: "100%", height: "auto" }}
					/>
				</div>
			</div>

			<p className="text-sm font-medium text-text-secondary -mt-2">
				Scan to connect
			</p>

			{/* Direct Access Link card */}
			<div className="w-full rounded-xl border border-border bg-bg-muted p-3 sm:p-4">
				<p className="text-[0.7rem] font-semibold uppercase tracking-wider text-text-muted mb-2">
					Direct Access Link
				</p>

				<div className="flex items-center gap-2">
					<code className="flex-1 text-[0.8125rem] sm:text-[0.875rem] font-mono text-green bg-bg-card border border-border rounded-lg px-3 py-2 truncate select-all">
						{DASHBOARD_URL}
					</code>

					<button
						onClick={handleCopy}
						className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-bg-card text-text-muted hover:text-green hover:border-green transition-all cursor-pointer"
						title={copied ? "Copied!" : "Copy URL"}>
						{copied ? (
							<Check
								size={16}
								className="text-green-500"
							/>
						) : (
							<Copy size={16} />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
