"use client";

import * as React from "react";
import { cn, isValidHex } from "@/lib/utils";
import { Input } from "../Input/input";
import { Button } from "../Button/button";

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  allowGradient?: boolean;
  className?: string;
}

const PRESET_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#06b6d4", // cyan
];

const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

const ColorInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-12 h-12 rounded-lg cursor-pointer border border-white/20"
    />
  );
};

export function ColorPicker({
  value,
  onChange,
  label,
  allowGradient = true,
  className,
}: ColorPickerProps) {
  const [isGradient, setIsGradient] = React.useState(
    value.startsWith("linear-gradient")
  );
  const [color1, setColor1] = React.useState(PRESET_COLORS[0]);
  const [color2, setColor2] = React.useState(PRESET_COLORS[1]);
  const [solidColor, setSolidColor] = React.useState(
    value.startsWith("#") ? value : PRESET_COLORS[0]
  );

  React.useEffect(() => {
    if (value.startsWith("linear-gradient")) {
      setIsGradient(true);

      const matches = value.match(/#([0-9a-fA-F]{3}){1,2}\b/g);
      if (matches && matches.length >= 2) {
        setColor1(matches[0]);
        setColor2(matches[1]);
      }
    } else if (value.startsWith("#")) {
      setIsGradient(false);
      setSolidColor(value);
    }
  }, [value]);

  const handleGradientChange = (c1: string, c2: string) => {
    if (!isValidHex(c1) || !isValidHex(c2)) return;
    const gradient = `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
    onChange(gradient);
  };

  const handleSolidChange = (color: string) => {
    setSolidColor(color);
    if (isValidHex(color)) {
      onChange(color);
    }
  };

  const handleToggleMode = () => {
    const newIsGradient = !isGradient;
    setIsGradient(newIsGradient);
    if (newIsGradient) {
      handleGradientChange(color1, color2);
    } else {
      onChange(solidColor);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="text-sm font-medium text-white/90">{label}</label>
      )}

      <div
        className="w-full h-20 rounded-xl border-2 border-white/20 shadow-lg"
        style={{ background: value }}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant={!isGradient ? "primary" : "ghost"}
          buttonSize="sm"
          onClick={() => handleToggleMode()}
          className="flex-1"
        >
          Solid
        </Button>
        {allowGradient && (
          <Button
            type="button"
            variant={isGradient ? "primary" : "ghost"}
            buttonSize="sm"
            onClick={() => handleToggleMode()}
            className="flex-1"
          >
            Gradient
          </Button>
        )}
      </div>

      {isGradient ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ColorInput
              value={color1}
              onChange={(value) => {
                setColor1(value);
                handleGradientChange(value, color2);
              }}
            />
            <div className="flex-1">
              <Input
                value={color1}
                onChange={(e) => {
                  setColor1(e.target.value);
                  handleGradientChange(e.target.value, color2);
                }}
                placeholder="#6366f1"
                className={cn("w-full", {
                  "border-red-400": !isValidHex(color1),
                })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorInput
              value={isValidHex(color2) ? color2 : "#000000"}
              onChange={(value) => {
                setColor2(value);
                handleGradientChange(color1, value);
              }}
            />
            <div className="flex-1">
              <Input
                value={color2}
                onChange={(e) => {
                  setColor2(e.target.value);
                  handleGradientChange(color1, e.target.value);
                }}
                placeholder="#8b5cf6"
                className={cn("w-full", {
                  "border-red-400": !isValidHex(color2),
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {PRESET_GRADIENTS.map((gradient, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(gradient)}
                className="h-10 rounded-lg border-2 border-white/20 hover:border-white/40 transition-all hover:scale-105"
                style={{ background: gradient }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ColorInput
              value={solidColor}
              onChange={(value) => {
                setSolidColor(value);
                handleSolidChange(value);
              }}
            />
            <div className="flex-1">
              <Input
                value={solidColor}
                onChange={(e) => handleSolidChange(e.target.value)}
                placeholder="#6366f1"
                className={cn("w-full", {
                  "border-red-400": !isValidHex(solidColor),
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSolidChange(color)}
                className="h-10 rounded-lg border-2 border-white/20 hover:border-white/40 transition-all hover:scale-105"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
