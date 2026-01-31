import { Button } from "ui-components"
import { useTheme } from "./theme-provider"
import { Moon, Sun } from "lucide-react"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={() => setTheme("light")}>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Light theme</span>
      </Button>
      <Button variant="outline" size="icon" onClick={() => setTheme("dark")}>
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Dark theme</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => setTheme("system")}>
        System
      </Button>
    </div>
  )
}
