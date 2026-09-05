import DeviceQRCode from "@/features/dashboard/components/DeviceQRCode"

export default function QRCodeTab() {
	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold text-text-primary">
					QR Code
				</h3>
				<p className="text-sm text-text-muted mt-1">
					Share this QR code with farm workers to let them quickly
					access the IoT dashboard from their devices.
				</p>
			</div>
			<DeviceQRCode />
		</div>
	)
}
