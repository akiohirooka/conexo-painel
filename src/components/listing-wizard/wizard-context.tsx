"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ListingSchema } from '@/lib/schemas/listing-wizard' // Adjust import path
import { UseFormReturn } from 'react-hook-form'

export type ListingType = 'business' | 'event' | 'job'

interface WizardContextType {
    listingType: ListingType | null
    setListingType: (type: ListingType) => void
    currentStep: number
    setCurrentStep: (step: number) => void
    totalSteps: number
    setTotalSteps: (steps: number) => void
    nextStep: () => void
    prevStep: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any> | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setForm: (form: UseFormReturn<any>) => void
    isEditMode: boolean
    setIsEditMode: (v: boolean) => void
    // Editing helpers
    editId: string | null
    setEditId: (id: string | null) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setInitialData: (data: any) => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

interface WizardProviderProps {
    children: ReactNode
    initialType?: ListingType | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any
    initialIsEditMode?: boolean
    initialEditId?: string | null
}

export function WizardProvider({
    children,
    initialType = null,
    initialData = null,
    initialIsEditMode = false,
    initialEditId = null
}: WizardProviderProps) {
    const [listingType, setListingType] = useState<ListingType | null>(initialType)
    const [currentStep, setCurrentStep] = useState(0)
    const [totalSteps, setTotalSteps] = useState(4)
    const [isEditMode, setIsEditMode] = useState(initialIsEditMode)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [form, setForm] = useState<UseFormReturn<any> | null>(null)
    const [editId, setEditId] = useState<string | null>(initialEditId)
    const [localInitialData, setInitialData] = useState(initialData)

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

    return (
        <WizardContext.Provider
            value={{
                listingType,
                setListingType,
                currentStep,
                setCurrentStep,
                totalSteps,
                setTotalSteps,
                nextStep,
                prevStep,
                form,
                setForm,
                isEditMode,
                setIsEditMode,
                editId,
                setEditId,
                initialData: localInitialData,
                setInitialData
            }}
        >
            {children}
        </WizardContext.Provider>
    )
}

export function useWizard() {
    const context = useContext(WizardContext)
    if (!context) {
        throw new Error('useWizard must be used within a WizardProvider')
    }
    return context
}
