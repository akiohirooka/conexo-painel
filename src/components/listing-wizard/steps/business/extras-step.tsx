"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Upload, Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function BusinessExtrasStep() {
    const { control, watch, setValue } = useFormContext()

    // Tag-based fields
    const amenities = watch("amenities") || []
    const operatingModes = watch("operatingModes") || []
    const serviceLanguages = watch("serviceLanguages") || []
    const paymentMethods = watch("paymentMethods") || []

    // Input-based fields
    const specialties = watch("specialties") || []
    const [newSpecialty, setNewSpecialty] = useState("")

    // Predefined options
    const OPERATING_MODES = [
        "Consumo no local",
        "Delivery local",
        "Delivery todo Japão",
        "Retirada na loja",
        "Atendimento Presencial",
        "Atendimento Online",
        "Presencial",
        "Online"
    ]

    const LANGUAGES = [
        "Português",
        "Japonês",
        "Espanhol",
        "Inglês"
    ]

    const AMENITIES_OPTIONS = [
        "Estacionamento gratuito",
        "Wi-Fi",
        "Climatizado",
        "Espaço Kids",
        "Acessibilidade",
        "Pet Friendly"
    ]

    const PAYMENT_METHODS = [
        "Dinheiro",
        "Cartão de Crédito",
        "e-Money (PayPay, Rakuten Pay, au PAY, etc.)",
        "Transferência bancária",
        "Pagamento na entrega (contra entrega)"
    ]

    // Helpers
    const toggleTag = (field: string, current: string[], value: string) => {
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value]
        setValue(field, updated)
    }

    const addSpecialty = () => {
        if (newSpecialty.trim()) {
            setValue("specialties", [...specialties, newSpecialty.trim()])
            setNewSpecialty("")
        }
    }

    const removeSpecialty = (index: number) => {
        setValue("specialties", specialties.filter((_: string, i: number) => i !== index))
    }

    const TagSection = ({ title, options, current, field }: { title: string, options: string[], current: string[], field: string }) => (
        <div className="space-y-3">
            <FormLabel>{title}</FormLabel>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = current.includes(option)
                    return (
                        <div
                            key={option}
                            onClick={() => toggleTag(field, current, option)}
                            className={cn(
                                "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all border select-none flex items-center gap-2",
                                isSelected
                                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                    : "bg-background text-muted-foreground border-input hover:border-primary/50 hover:text-foreground"
                            )}
                        >
                            {option}
                            {isSelected && <Check className="h-3 w-3" />}
                        </div>
                    )
                })}
            </div>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Detalhes do Negócio</h3>
                <p className="text-sm text-muted-foreground">Selecione as características do seu estabelecimento.</p>
            </div>

            {/* Operating Mode */}
            <TagSection
                title="Modo de Funcionamento"
                options={OPERATING_MODES}
                current={operatingModes}
                field="operatingModes"
            />

            {/* Service Language */}
            <TagSection
                title="Idioma de Atendimento"
                options={LANGUAGES}
                current={serviceLanguages}
                field="serviceLanguages"
            />

            {/* Amenities */}
            <TagSection
                title="Comodidades"
                options={AMENITIES_OPTIONS}
                current={amenities}
                field="amenities"
            />

            {/* Payment Methods */}
            <TagSection
                title="Formas de Pagamento"
                options={PAYMENT_METHODS}
                current={paymentMethods}
                field="paymentMethods"
            />

            {/* Specialties (Input Style) */}
            <div className="space-y-3">
                <FormLabel>Especialidades</FormLabel>
                <div className="flex gap-2">
                    <Input
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        placeholder="Ex: Sushi, Rodízio, Cortes Especiais"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    />
                    <Button type="button" onClick={addSpecialty} variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {specialties.map((item: string, i: number) => (
                        <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                            {item}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                onClick={() => removeSpecialty(i)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </Badge>
                    ))}
                    {specialties.length === 0 && <span className="text-sm text-muted-foreground italic">Nenhuma especialidade adicionada.</span>}
                </div>
            </div>
        </div>
    )
}
