/**
 * Design System Tokens
 * Centralized design tokens for consistent styling across the application
 */

export const designTokens = {
    // Glass morphism effects
    glass: {
        base: "bg-white/5 backdrop-blur-md",
        card: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl",
        hover: "hover:bg-white/20",
        input: "bg-white/10 border border-white/20",
    },

    // Gradient backgrounds
    gradient: {
        primary: "bg-gradient-to-br from-violet-600 via-blue-500 to-purple-600",
        text: "bg-gradient-to-r from-white to-blue-200",
    },

    // Text colors for dark theme
    text: {
        primary: "text-white",
        secondary: "text-white/60",
        muted: "text-white/40",
        accent: "text-blue-200",
        gradient: "bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200",
    },

    // Interactive states
    interactive: {
        hover: "hover:scale-105 active:scale-95 transition-all duration-300",
        hoverSubtle: "hover:bg-white/10 transition-colors duration-200",
        focus: "focus:outline-none focus:ring-2 focus:ring-purple-500",
    },

    // Shadows and glows
    shadow: {
        default: "shadow-xl",
        glow: "shadow-2xl shadow-purple-500/20",
        lg: "shadow-lg",
    },

    // Borders
    border: {
        default: "border border-white/10",
        light: "border border-white/20",
        focus: "border-white/30",
    },

    // Rounded corners
    rounded: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
        full: "rounded-full",
    },

    // Animations
    animation: {
        float: "animate-float",
        gradient: "animate-gradient-xy",
    },
} as const

export type DesignTokens = typeof designTokens
