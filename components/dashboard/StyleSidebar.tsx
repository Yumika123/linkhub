"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { isValidHex } from "@/lib/utils";
import { Sidebar } from "../ui/Sidebar/Sidebar";
import { Button } from "../ui/Button/button";
import { ColorPicker, PRESET_COLORS } from "../ui/ColorPicker/ColorPicker";
import { X } from "lucide-react";

export interface StyleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  background: string | null;
  onBackgroundChange: (value: string | null) => void;
  onSave?: () => void;
  onReset?: () => void;
  isSaving?: boolean;
}

type StyleFormValues = {
  backgroundMode: string;
  backgroundSolid: string;
  backgroundGradient1: string;
  backgroundGradient2: string;
};

const parseBackground = (bg: string | null): StyleFormValues => {
  if (!bg) {
    return {
      backgroundMode: "solid",
      backgroundSolid: PRESET_COLORS[0],
      backgroundGradient1: PRESET_COLORS[0],
      backgroundGradient2: PRESET_COLORS[1],
    };
  }

  if (bg.startsWith("linear-gradient")) {
    const matches = bg.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g);
    return {
      backgroundMode: "gradient",
      backgroundSolid: PRESET_COLORS[0],
      backgroundGradient1: matches?.[0] || PRESET_COLORS[0],
      backgroundGradient2: matches?.[1] || PRESET_COLORS[1],
    };
  }

  return {
    backgroundMode: "solid",
    backgroundSolid: bg,
    backgroundGradient1: PRESET_COLORS[0],
    backgroundGradient2: PRESET_COLORS[1],
  };
};

export function StyleSidebar({
  isOpen,
  onClose,
  background,
  onBackgroundChange,
  onSave,
  onReset,
  isSaving = false,
}: StyleSidebarProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<StyleFormValues>({
    mode: "onChange",
    defaultValues: parseBackground(background),
  });

  const [initialBackground, setInitialBackground] = React.useState(background);

  React.useEffect(() => {
    if (isOpen) {
      setInitialBackground(background);
      reset(parseBackground(background));
    }
  }, [isOpen, background, reset]);

  const formValues = useWatch({ control });

  React.useEffect(() => {
    // Prevent auto-setting background on mount or reset
    if (!isDirty) return;

    const {
      backgroundMode,
      backgroundSolid,
      backgroundGradient1,
      backgroundGradient2,
    } = formValues as StyleFormValues;

    if (!backgroundMode) return;

    let newBackground = null;

    if (backgroundMode === "gradient") {
      if (isValidHex(backgroundGradient1) && isValidHex(backgroundGradient2)) {
        newBackground = `linear-gradient(135deg, ${backgroundGradient1} 0%, ${backgroundGradient2} 100%)`;
      }
    } else {
      if (isValidHex(backgroundSolid)) {
        newBackground = backgroundSolid;
      }
    }

    if (newBackground) {
      onBackgroundChange(newBackground);
    }
  }, [formValues, onBackgroundChange, isDirty]);

  const handleCancel = () => {
    onBackgroundChange(initialBackground);
    onClose();
  };

  const onSubmit = () => {
    onSave?.();
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  const Header = (
    <div className="flex items-center justify-between p-6 pb-0">
      <div>
        <h2 className="text-2xl font-bold text-white">Page Styles</h2>
        <p className="text-sm text-white/60 mt-1">
          Customize your page appearance
        </p>
      </div>
      <Button
        variant="ghost"
        buttonSize="icon"
        onClick={handleCancel}
        className="text-white/70 hover:text-white hover:bg-white/10"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );

  const Footer = (
    <div className="p-6 pt-0 mt-auto">
      <div className="p-6 border-t border-white/10 bg-black/20 -mx-6 -mb-6">
        <div className="flex gap-3">
          {onReset && (
            <Button
              variant="ghost"
              buttonSize="md"
              onClick={handleReset}
              disabled={isSaving}
              // TODO: fix buttons variants
              className="text-white/70 hover:text-red-400 hover:bg-red-400/10 mr-auto"
            >
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            buttonSize="md"
            onClick={handleCancel}
            disabled={isSaving}
            // TODO: fix buttons variants
            className="text-white/70 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving || !isValid}
            variant="gradient"
            buttonSize="md"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={handleCancel}
      position="right"
      mode="slide"
      width="w-full md:w-sm"
      header={Header}
      footer={Footer}
      showBackdrop={false}
    >
      <div className="p-6 space-y-6">
        <ColorPicker
          control={control}
          prefix="background"
          label="Page Background"
        />
      </div>
    </Sidebar>
  );
}
