import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const notificationVariants = cva(
  "relative flex items-start gap-3 p-4 rounded-xl backdrop-blur-xl border shadow-xl transition-all duration-300 animate-slide-in",
  {
    variants: {
      variant: {
        success:
          "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-emerald-500/20",
        error: "bg-red-500/10 border-red-500/30 text-red-500 shadow-red-500/20",
        warning:
          "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/20",
        info: "bg-blue-500/10 border-blue-500/30 text-blue-500 shadow-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface NotificationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id">,
    VariantProps<typeof notificationVariants> {
  id: string;
  title?: string;
  message: string;
  duration?: number;
  onClose?: (id: string) => void;
  showProgress?: boolean;
}

const iconMap = {
  success: (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-5 h-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  ),
};

const colorMap = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

export const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      className,
      variant = "info",
      id,
      title,
      message,
      duration = 5000,
      onClose,
      showProgress = true,
      ...props
    },
    ref
  ) => {
    const [progress, setProgress] = React.useState(100);
    const [isExiting, setIsExiting] = React.useState(false);

    React.useEffect(() => {
      if (duration && duration > 0) {
        const interval = 50; // Update every 50ms
        const decrement = (interval / duration) * 100;

        const timer = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev - decrement;
            if (newProgress <= 0) {
              clearInterval(timer);
              handleClose();

              return 0;
            }
            return newProgress;
          });
        }, interval);

        return () => clearInterval(timer);
      }
    }, [duration]);

    const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => {
        onClose?.(id);
      }, 300); // Match animation duration
    };

    return (
      <div
        ref={ref}
        className={cn(
          notificationVariants({ variant }),
          isExiting && "animate-slide-out opacity-0",
          "min-w-[320px] max-w-md overflow-hidden",
          className
        )}
        role="alert"
        {...props}
      >
        <div className="mt-0.5">{iconMap[variant || "info"]}</div>

        <div className="flex-1 min-w-0">
          {title && (
            <h4
              className={`font-semibold text-${
                colorMap[variant || "info"]
              } mb-1 text-sm`}
            >
              {title}
            </h4>
          )}
          <p
            className={`text-sm text-${
              colorMap[variant || "info"]
            }/90 leading-relaxed`}
          >
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className={`shrink-0 text-${
            colorMap[variant || "info"]
          }/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10`}
          aria-label="Close notification"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {showProgress && !!duration && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className={cn(
                "h-full transition-all duration-50 ease-linear rounded-bl-xl",
                colorMap[variant || "info"]
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);

Notification.displayName = "Notification";

export { notificationVariants };
