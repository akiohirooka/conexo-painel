import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCurrentUser, hasRole, hasAnyRole } from '@/lib/auth/current-user'
import type { CurrentUser, UserRole } from '@/lib/auth/types'

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(),
}))

// Mock Prisma db
vi.mock('@/lib/db', () => ({
    db: {
        users: {
            findUnique: vi.fn(),
            upsert: vi.fn(),
        },
    },
}))

vi.mock('@/lib/auth/clerk-user-profile', () => ({
    getClerkUserProfile: vi.fn(),
    getUsersFallbackEmail: vi.fn(() => 'pending-email@placeholder.local'),
}))

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

const mockAuth = vi.mocked(auth)
const mockDb = vi.mocked(db)

describe('getCurrentUser', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns null when user is not authenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as any)

        const result = await getCurrentUser()

        expect(result).toBeNull()
        expect(mockDb.users.findUnique).not.toHaveBeenCalled()
    })

    it('returns existing user from database', async () => {
        const clerkUserId = 'user_abc123'
        const mockUser = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            clerk_user_id: clerkUserId,
            role: 'business' as const,
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
        }

        mockAuth.mockResolvedValue({ userId: clerkUserId } as any)
        mockDb.users.findUnique.mockResolvedValue(mockUser as any)

        const result = await getCurrentUser()

        expect(result).toEqual({
            clerkUserId: clerkUserId,
            dbUserId: mockUser.id,
            role: 'business',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
        })
    })

    it('creates new user when not found in database', async () => {
        const clerkUserId = 'user_new123'
        const createdUser = {
            id: '550e8400-e29b-41d4-a716-446655440001',
            clerk_user_id: clerkUserId,
            role: 'user' as const,
            email: 'pending-email@placeholder.local',
            first_name: null,
            last_name: null,
        }

        mockAuth.mockResolvedValue({ userId: clerkUserId } as any)
        mockDb.users.findUnique.mockResolvedValue(null)
        mockDb.users.upsert.mockResolvedValue(createdUser as any)

        const result = await getCurrentUser()

        expect(mockDb.users.upsert).toHaveBeenCalledWith({
            where: { clerk_user_id: clerkUserId },
            update: {},
            create: {
                clerk_user_id: clerkUserId,
                email: 'pending-email@placeholder.local',
                first_name: null,
                last_name: null,
                role: 'user',
            },
            select: {
                id: true,
                clerk_user_id: true,
                role: true,
                email: true,
                first_name: true,
                last_name: true,
            },
        })

        expect(result).toEqual({
            clerkUserId: clerkUserId,
            dbUserId: createdUser.id,
            role: 'user',
            email: 'pending-email@placeholder.local',
            firstName: null,
            lastName: null,
        })
    })
})

describe('hasRole', () => {
    const mockUser: CurrentUser = {
        clerkUserId: 'user_abc',
        dbUserId: 'uuid-123',
        role: 'business',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
    }

    it('returns true when user has the required role', () => {
        expect(hasRole(mockUser, 'business')).toBe(true)
    })

    it('returns false when user does not have the required role', () => {
        expect(hasRole(mockUser, 'user')).toBe(false)
    })

    it('returns false when user is null', () => {
        expect(hasRole(null, 'business')).toBe(false)
    })
})

describe('hasAnyRole', () => {
    const mockBusinessUser: CurrentUser = {
        clerkUserId: 'user_abc',
        dbUserId: 'uuid-123',
        role: 'business',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
    }

    const mockRegularUser: CurrentUser = {
        clerkUserId: 'user_def',
        dbUserId: 'uuid-456',
        role: 'user',
        email: 'user@test.com',
        firstName: 'Regular',
        lastName: 'User',
    }

    it('returns true when user has one of the allowed roles', () => {
        expect(hasAnyRole(mockBusinessUser, ['user', 'business'])).toBe(true)
        expect(hasAnyRole(mockRegularUser, ['user', 'business'])).toBe(true)
    })

    it('returns false when user role is not in allowed roles', () => {
        const roles: UserRole[] = ['business']
        expect(hasAnyRole(mockRegularUser, roles)).toBe(false)
    })

    it('returns false when user is null', () => {
        expect(hasAnyRole(null, ['user', 'business'])).toBe(false)
    })
})
