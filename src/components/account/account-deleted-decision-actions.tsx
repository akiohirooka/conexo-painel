"use client"

import { useState } from "react"
import { useClerk, useSession } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import {
  ACCOUNT_REACTIVATE_API_PATH,
  ACCOUNT_RESET_API_PATH,
} from "@/lib/auth/deleted-account"

type ReactivateResponse = {
  success: boolean
  role: "user" | "business"
  redirectTo: string
}

type ResetResponse = {
  success: boolean
  reset: boolean
}

export function AccountDeletedDecisionActions() {
  const [isReactivating, setIsReactivating] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const { session } = useSession()
  const { signOut, setActive } = useClerk()
  const router = useRouter()
  const isBusy = isReactivating || isResetting

  async function handleReactivateAccount() {
    if (isBusy) return

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

  async function handleResetAccount() {
    if (isBusy) return

    setIsResetting(true)

    try {
      const response = await fetch(ACCOUNT_RESET_API_PATH, {
        method: "POST",
      })

      const payload = (await response.json().catch(() => null)) as
        | ResetResponse
        | { error?: string }
        | null

      if (!response.ok || !payload || !("success" in payload)) {
        toast({
          title: "Erro ao resetar conta",
          description:
            (payload && "error" in payload && payload.error) ||
            "Não foi possível resetar sua conta agora.",
          variant: "destructive",
        })
        return
      }

      try {
        await signOut({ redirectUrl: "/sign-up" })
      } catch {
        try {
          await setActive?.({ session: null })
        } catch {
          // ignore and fallback to hard redirect
        }
        window.location.href = "/sign-up"
      }
    } catch {
      toast({
        title: "Erro ao resetar conta",
        description: "Não foi possível resetar sua conta agora.",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      <Button
        type="button"
        size="lg"
        onClick={handleReactivateAccount}
        disabled={isBusy}
        className="border border-blue-300 bg-blue-50/70 text-blue-900 hover:bg-blue-100"
      >
        {isReactivating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Reativando...
          </>
        ) : (
          "Reativar minha conta anterior"
        )}
      </Button>
      <Button
        type="button"
        size="lg"
        variant="outline"
        onClick={handleResetAccount}
        disabled={isBusy}
        className="border-amber-300 bg-amber-50/70 text-amber-900 hover:bg-amber-100"
      >
        {isResetting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Começar do zero"
        )}
      </Button>
    </div>
  )
}
