import { db } from '@/lib/db'
import {
  isAccountDeletedRole,
  type AccountAccessState,
} from '@/lib/auth/deleted-account'

export interface AccountStatus {
  status: AccountAccessState
  clerkUserId: string
  email: string | null
  role: string | null
}

export class DeletedAccountError extends Error {
  readonly clerkUserId: string
  readonly email: string | null

  constructor(clerkUserId: string, email: string | null) {
    super('AccountDeleted')
    this.name = 'DeletedAccountError'
    this.clerkUserId = clerkUserId
    this.email = email
  }
}

export async function getAccountStatusByClerkUserId(
  clerkUserId: string,
): Promise<AccountStatus> {
  const user = await db.users.findUnique({
    where: { clerk_user_id: clerkUserId },
    select: {
      clerk_user_id: true,
      email: true,
      role: true,
    },
  })

  if (!user) {
    return {
      status: 'not_found',
      clerkUserId,
      email: null,
      role: null,
    }
  }

  return {
    status: isAccountDeletedRole(user.role) ? 'deleted' : 'active',
    clerkUserId: user.clerk_user_id,
    email: user.email,
    role: user.role,
  }
}

export async function assertAccountIsNotDeleted(
  clerkUserId: string,
): Promise<AccountStatus> {
  const accountStatus = await getAccountStatusByClerkUserId(clerkUserId)

  if (accountStatus.status === 'deleted') {
    throw new DeletedAccountError(accountStatus.clerkUserId, accountStatus.email)
  }

  return accountStatus
}
