import type { ReactNode } from "react"

type PageHeaderProps = {
  title: string
  description?: string
  children?: ReactNode
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-text-primary truncate">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-muted truncate">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  )
}
