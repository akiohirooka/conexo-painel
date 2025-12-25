"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function JobBasicStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Informações da Vaga</h3>
                <p className="text-sm text-muted-foreground">Defina o cargo e a empresa.</p>
            </div>

            <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cargo / Título da Vaga</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Desenvolvedor Senior" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="company"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome da Empresa</FormLabel>
                        <FormControl>
                            <Input placeholder="Empresa S.A." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="workModel"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Modelo de Trabalho</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="onsite">Presencial</SelectItem>
                                <SelectItem value="hybrid">Híbrido</SelectItem>
                                <SelectItem value="remote">Remoto</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
