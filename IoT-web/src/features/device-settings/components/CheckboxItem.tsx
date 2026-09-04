export default function CheckboxItem({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 p-2.5 rounded-lg border border-border cursor-pointer transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
      />
      <span className="text-sm text-text-primary">{label}</span>
    </label>
  );
}
