"use client"

import { useState } from "react"
import { useSession } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { ACCOUNT_REACTIVATE_API_PATH } from "@/lib/auth/deleted-account"

type ReactivateResponse = {
  success: boolean
  role: "user" | "business"
  redirectTo: string
}

export function AccountDeletedDecisionActions() {
  const [isReactivating, setIsReactivating] = useState(false)
  const { session } = useSession()
  const router = useRouter()

  async function handleReactivateAccount() {
    if (isReactivating) return

    setIsReactivating(true)

    try {
      const response = await fetch(ACCOUNT_REACTIVATE_API_PATH, {
        method: "POST",
      })

      const payload = (await response.json().catch(() => null)) as
        | ReactivateResponse
        | { error?: string; redirectTo?: string }
        | null

      if (!response.ok || !payload || !("success" in payload)) {
        toast({
          title: "Erro ao reativar conta",
          description:
            (payload && "error" in payload && payload.error) ||
            "Não foi possível reativar sua conta agora.",
          variant: "destructive",
        })
        return
      }

      await session?.reload()
      router.refresh()
      window.location.href = payload.redirectTo || "/"
    } catch {
      toast({
        title: "Erro ao reativar conta",
        description: "Não foi possível reativar sua conta agora.",
        variant: "destructive",
      })
    } finally {
      setIsReactivating(false)
    }
  }

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      <Button type="button" size="lg" onClick={handleReactivateAccount} disabled={isReactivating}>
        {isReactivating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Reativando...
          </>
        ) : (
          "Reativar minha conta anterior"
        )}
      </Button>
      <Button type="button" size="lg" variant="outline">
        Começar do zero
      </Button>
    </div>
  )
}
