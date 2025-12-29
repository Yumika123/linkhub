import * as React from "react"
import { Card } from "./card"

interface FormCardProps {
    onSubmit: (formData: FormData) => Promise<void>
    children: React.ReactNode
    actions?: React.ReactNode
    className?: string
}

/**
 * Reusable form card wrapper with glass-morphism styling
 * Provides consistent form structure across the application
 */
export function FormCard({
    onSubmit,
    children,
    actions,
    className
}: FormCardProps) {
    return (
        <Card variant="glassLight" padding="sm" rounded="xl" className={className}>
            <form action={onSubmit} className="flex flex-col gap-3">
                {children}
                {actions && (
                    <div className="flex justify-end gap-2">
                        {actions}
                    </div>
                )}
            </form>
        </Card>
    )
}
