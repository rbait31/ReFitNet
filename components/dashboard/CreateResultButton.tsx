"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ResultDialog } from "./ResultDialog"
import { useRouter } from "next/navigation"

export function CreateResultButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        Новый результат
      </Button>
      <ResultDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          router.refresh()
        }}
      />
    </>
  )
}

