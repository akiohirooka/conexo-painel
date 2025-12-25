"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function EventBasicStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Informações do Evento</h3>
                <p className="text-sm text-muted-foreground">Conte sobre o seu evento.</p>
            </div>

            <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome do Evento</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Workshop de React" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Detalhes sobre o evento, atrações, objetivos..."
                                className="min-h-[120px]"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>Mínimo de 20 caracteres.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
