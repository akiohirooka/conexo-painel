export const ACCOUNT_DELETED_DECISION_PATH = '/account-deleted-decision'
export const ACCOUNT_REACTIVATE_API_PATH = '/api/account/reactivate'

export type AccountAccessState = 'active' | 'deleted' | 'not_found'

export function isAccountDeletedRole(role: string | null | undefined): boolean {
  return role === 'deleted'
}

export function buildAccountDeletedDecisionPath(params: {
  clerkUserId: string
  email?: string | null
}): string {
  const searchParams = new URLSearchParams()
  searchParams.set('clerk_user_id', params.clerkUserId)

  if (params.email) {
    searchParams.set('email', params.email)
  }

  return `${ACCOUNT_DELETED_DECISION_PATH}?${searchParams.toString()}`
}
