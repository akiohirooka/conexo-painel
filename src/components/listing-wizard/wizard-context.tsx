"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
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
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: ReactNode }) {
    const [listingType, setListingType] = useState<ListingType | null>(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [totalSteps, setTotalSteps] = useState(4)
    const [isEditMode, setIsEditMode] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [form, setForm] = useState<UseFormReturn<any> | null>(null)

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
                setIsEditMode
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
