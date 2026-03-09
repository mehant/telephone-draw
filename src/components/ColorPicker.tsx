"use client";

const COLORS = [
  "#000000", "#ffffff", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#92400e",
];

interface ColorPickerProps {
  selected: string;
  onSelect: (color: string) => void;
}

export default function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className={`h-8 w-8 rounded-full border-2 transition ${
            selected === color ? "border-blue-400 scale-110" : "border-gray-600"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
