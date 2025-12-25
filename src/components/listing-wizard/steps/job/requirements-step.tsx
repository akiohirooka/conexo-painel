"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Check } from 'lucide-react'
import { useState } from 'react'

export function JobRequirementsStep() {
    const { control, watch, setValue } = useFormContext()
    const requirements = watch("requirements") || []
    const benefits = watch("benefits") || []

    const [newReq, setNewReq] = useState("")
    const [newBen, setNewBen] = useState("")

    const addReq = () => {
        if (newReq.trim()) {
            setValue("requirements", [...requirements, newReq.trim()])
            setNewReq("")
        }
    }

    const removeReq = (index: number) => {
        setValue("requirements", requirements.filter((_: string, i: number) => i !== index))
    }

    const addBen = () => {
        if (newBen.trim()) {
            setValue("benefits", [...benefits, newBen.trim()])
            setNewBen("")
        }
    }

    const removeBen = (index: number) => {
        setValue("benefits", benefits.filter((_: string, i: number) => i !== index))
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Requisitos e Benefícios</h3>
                <p className="text-sm text-muted-foreground">O que você busca e o que oferece.</p>
            </div>

            {/* Requirements */}
            <div className="space-y-3">
                <FormLabel>Requisitos *</FormLabel>
                <div className="flex gap-2">
                    <Input
                        value={newReq}
                        onChange={(e) => setNewReq(e.target.value)}
                        placeholder="Ex: 5 anos de experiência com React..."
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addReq())}
                    />
                    <Button type="button" onClick={addReq} variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    {requirements.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm bg-muted/40 p-2 rounded">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="flex-1">{item}</span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 hover:bg-transparent text-muted-foreground hover:text-red-500"
                                onClick={() => removeReq(i)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                    {requirements.length === 0 && <span className="text-sm text-muted-foreground italic px-2">Adicione pelo menos 1 requisito.</span>}
                </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 pt-4 border-t">
                <FormLabel>Benefícios</FormLabel>
                <div className="flex gap-2">
                    <Input
                        value={newBen}
                        onChange={(e) => setNewBen(e.target.value)}
                        placeholder="Ex: Vale Transporte, Plano de Saúde..."
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBen())}
                    />
                    <Button type="button" onClick={addBen} variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {benefits.map((item: string, i: number) => (
                        <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                            {item}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                onClick={() => removeBen(i)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )
}
