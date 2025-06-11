"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface FaultToggleProps {
  faultName: string
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
}

export default function FaultToggle({ faultName, isEnabled, onToggle }: FaultToggleProps) {
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const handleToggle = async (checked: boolean) => {
    setIsPending(true)

    try {
      const action = checked ? "enable" : "disable"
      const response = await fetch(`/api/faults/${faultName}/${action}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} fault`)
      }

      onToggle(checked)

      toast({
        title: `Fault ${checked ? "Enabled" : "Disabled"}`,
        description: `${faultName} has been ${checked ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle fault",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch id={`toggle-${faultName}`} checked={isEnabled} onCheckedChange={handleToggle} disabled={isPending} />
      <Label htmlFor={`toggle-${faultName}`} className="cursor-pointer">
        {isPending ? "Updating..." : isEnabled ? "Enabled" : "Disabled"}
      </Label>
    </div>
  )
}
