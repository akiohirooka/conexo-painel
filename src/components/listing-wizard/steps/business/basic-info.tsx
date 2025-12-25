"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const categories = [
    "Alimentação",
    "Varejo",
    "Saúde e Bem-estar",
    "Tecnologia",
    "Serviços",
    "Educação",
    "Automotivo",
    "Lazer",
]

export function BusinessBasicStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Informações Básicas</h3>
                <p className="text-sm text-muted-foreground">Conte um pouco sobre o seu negócio.</p>
            </div>

            <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome do Negócio</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Café Colonial da Serra" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                placeholder="Descreva seus produtos, serviços e o que torna seu negócio especial..."
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
