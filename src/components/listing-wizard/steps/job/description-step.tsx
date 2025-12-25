"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export function JobDescriptionStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Sobre a Vaga</h3>
                <p className="text-sm text-muted-foreground">Descreva as responsabilidades e o dia a dia.</p>
            </div>

            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descrição Completa</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Principais atividades e desafios..."
                                className="min-h-[250px]"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>Mínimo de 50 caracteres.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
