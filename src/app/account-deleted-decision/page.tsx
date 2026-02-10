import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import {
  buildAccountDeletedDecisionPath,
} from '@/lib/auth/deleted-account'
import { getAccountStatusByClerkUserId } from '@/lib/auth/account-status'
import { AccountDeletedDecisionActions } from '@/components/account/account-deleted-decision-actions'

interface AccountDeletedDecisionPageProps {
  searchParams: {
    clerk_user_id?: string
    email?: string
  }
}

export default async function AccountDeletedDecisionPage({
  searchParams,
}: AccountDeletedDecisionPageProps) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const accountStatus = await getAccountStatusByClerkUserId(userId)

  if (accountStatus.status !== 'deleted') {
    redirect('/')
  }

  const redirectPath = buildAccountDeletedDecisionPath({
    clerkUserId: accountStatus.clerkUserId,
    email: accountStatus.email,
  })

  if (
    searchParams.clerk_user_id !== accountStatus.clerkUserId ||
    (searchParams.email || '') !== (accountStatus.email || '')
  ) {
    redirect(redirectPath)
  }

  return (
    <main className="min-h-screen w-full bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Conta marcada para exclusão
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">
          Encontramos uma conta associada a este login que foi marcada para exclusão anteriormente.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Para sua segurança, o acesso ao painel está temporariamente bloqueado até você escolher como deseja continuar.
        </p>
        <p className="mt-6 text-base text-muted-foreground">Você pode:</p>
        <p className="mt-2 text-base text-muted-foreground">
          • Reativar sua conta anterior e continuar de onde parou
          <br />
          ou
          <br />
          • Começar do zero, criando uma nova conta sem dados antigos
        </p>
        <p className="mt-4 text-base text-muted-foreground">
          Escolha a opção que faz mais sentido para você.
        </p>

        <AccountDeletedDecisionActions />
      </div>
    </main>
  )
}
