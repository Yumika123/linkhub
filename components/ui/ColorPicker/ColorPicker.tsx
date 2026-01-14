"use client";

import * as React from "react";
import { useController, Control } from "react-hook-form";
import { cn, isValidHex } from "@/lib/utils";
import { Input } from "../Input/input";
import { Button } from "../Button/button";

export interface ColorPickerProps {
  control: Control<any>;
  prefix?: string;
  label?: string;
  className?: string;
}

export const PRESET_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#06b6d4", // cyan
];

export const PRESET_GRADIENTS = [
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
  control,
  prefix = "color",
  label,
  className,
}: ColorPickerProps) {
  const { field: modeField } = useController({
    name: `${prefix}Mode`,
    control,
    defaultValue: "solid",
  });

  const {
    field: solidField,
    fieldState: { error: solidError },
  } = useController({
    name: `${prefix}Solid`,
    control,
    rules: {
      validate: (value) => {
        if (modeField.value === "solid") {
          return isValidHex(value) || "Invalid hex color";
        }
        return true;
      },
    },
  });

  const {
    field: gradient1Field,
    fieldState: { error: gradient1Error },
  } = useController({
    name: `${prefix}Gradient1`,
    control,
    rules: {
      validate: (value) => {
        if (modeField.value === "gradient") {
          return isValidHex(value) || "Invalid hex color";
        }
        return true;
      },
    },
  });

  const {
    field: gradient2Field,
    fieldState: { error: gradient2Error },
  } = useController({
    name: `${prefix}Gradient2`,
    control,
    rules: {
      validate: (value) => {
        if (modeField.value === "gradient") {
          return isValidHex(value) || "Invalid hex color";
        }
        return true;
      },
    },
  });

  const handlePresetGradient = (gradient: string) => {
    const matches = gradient.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g);
    if (matches && matches.length >= 2) {
      batch(() => {
        modeField.onChange("gradient");
        gradient1Field.onChange(matches[0]);
        gradient2Field.onChange(matches[1]);
      });
    }
  };

  const handlePresetSolid = (color: string) => {
    batch(() => {
      modeField.onChange("solid");
      solidField.onChange(color);
    });
  };

  // Helper to batch updates if possible, though React 18 auto-batches.
  // We'll just call them sequentially.
  const batch = (fn: () => void) => fn();

  return (
    <div className={cn("space-y-3", className)}>
      {label && <label className="text-sm text-white/90">{label}</label>}

      <div
        className="w-full h-20 rounded-xl border-2 border-white/20 shadow-lg"
        style={{
          background:
            modeField.value === "gradient"
              ? `linear-gradient(135deg, ${gradient1Field.value} 0%, ${gradient2Field.value} 100%)`
              : solidField.value,
        }}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant={modeField.value === "solid" ? "primary" : "ghost"}
          buttonSize="sm"
          onClick={() => modeField.onChange("solid")}
          className="flex-1"
        >
          Solid
        </Button>
        <Button
          type="button"
          variant={modeField.value === "gradient" ? "primary" : "ghost"}
          buttonSize="sm"
          onClick={() => modeField.onChange("gradient")}
          className="flex-1"
        >
          Gradient
        </Button>
      </div>

      {modeField.value === "gradient" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ColorInput
              value={gradient1Field.value}
              onChange={gradient1Field.onChange}
            />
            <div className="flex-1">
              <Input
                value={gradient1Field.value}
                onChange={gradient1Field.onChange}
                placeholder="#6366f1"
                className={cn("w-full", {
                  "border-red-400": !!gradient1Error,
                })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorInput
              value={gradient2Field.value}
              onChange={gradient2Field.onChange}
            />
            <div className="flex-1">
              <Input
                value={gradient2Field.value}
                onChange={gradient2Field.onChange}
                placeholder="#8b5cf6"
                className={cn("w-full", {
                  "border-red-400": !!gradient2Error,
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {PRESET_GRADIENTS.map((gradient, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetGradient(gradient)}
                className="h-10 rounded-lg border-2 border-white/20 hover:border-white/40 transition-all hover:scale-105 hover:cursor-pointer"
                style={{ background: gradient }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ColorInput
              value={solidField.value}
              onChange={solidField.onChange}
            />
            <div className="flex-1">
              <Input
                value={solidField.value}
                onChange={solidField.onChange}
                placeholder="#6366f1"
                className={cn("w-full", {
                  "border-red-400": !!solidError,
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSolid(color)}
                className="h-10 rounded-lg border-2 border-white/20 hover:border-white/40 transition-all hover:scale-105 hover:cursor-pointer"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
