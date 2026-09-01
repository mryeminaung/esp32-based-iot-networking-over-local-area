import type { ReactNode } from "react"
import { Leaf } from "lucide-react"

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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-6 sm:p-8">
      {/* Decorative leaf pattern - right side */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
        <Leaf className="absolute right-8 top-1/2 -translate-y-1/2 h-48 w-48 text-white rotate-12" />
        <Leaf className="absolute right-24 top-1/4 h-32 w-32 text-white -rotate-45 opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-green-100/80 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  )
}
