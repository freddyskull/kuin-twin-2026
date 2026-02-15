import * as React from "react"
import { cn } from "../../lib/utils"

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 has-[:checked]:bg-dashboard-primary bg-white/10 group">
        <input
          type="checkbox"
          className={cn(
            "peer absolute h-full w-full opacity-0 cursor-pointer z-10",
            className
          )}
          ref={ref}
          {...props}
        />
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform translate-x-0.5 peer-checked:translate-x-[22px] ml-0"
          )}
        />
      </div>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
