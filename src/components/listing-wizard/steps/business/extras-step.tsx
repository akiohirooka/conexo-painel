"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Upload, Plus } from 'lucide-react'
import { useState } from 'react'

export function BusinessExtrasStep() {
    const { control, watch, setValue } = useFormContext()
    const amenities = watch("amenities") || []
    const [newAmenity, setNewAmenity] = useState("")

    const addAmenity = () => {
        if (newAmenity.trim()) {
            setValue("amenities", [...amenities, newAmenity.trim()])
            setNewAmenity("")
        }
    }

    const removeAmenity = (index: number) => {
        setValue("amenities", amenities.filter((_: string, i: number) => i !== index))
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Extras e Galeria</h3>
                <p className="text-sm text-muted-foreground">Destaque o que seu negócio oferece.</p>
            </div>

            {/* Opening Hours - Simple Text for now */}
            <FormField
                control={control}
                name="openingHours"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Horário de Funcionamento</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Seg-Sex 09:00 - 18:00" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Amenities Input */}
            <div className="space-y-3">
                <FormLabel>Comodidades</FormLabel>
                <div className="flex gap-2">
                    <Input
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        placeholder="Ex: Wi-Fi, Estacionamento, Pet Friendly"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    />
                    <Button type="button" onClick={addAmenity} variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {amenities.map((item: string, i: number) => (
                        <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                            {item}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                onClick={() => removeAmenity(i)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </Badge>
                    ))}
                    {amenities.length === 0 && <span className="text-sm text-muted-foreground italic">Nenhuma comodidade adicionada.</span>}
                </div>
            </div>

            {/* Fake Gallery Upload */}
            <div className="space-y-4">
                <FormLabel>Galeria de Fotos</FormLabel>
                <div className="border border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer bg-muted/20">
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-4 rounded-full bg-background border shadow-sm">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">Clique para fazer upload</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG ou WebP (max. 5MB)</p>
                        </div>
                    </div>
                </div>
                <FormDescription>
                    Funcionalidade de upload simulada. As imagens não serão enviadas.
                </FormDescription>
            </div>
        </div>
    )
}
