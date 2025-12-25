"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function BusinessLocationStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Localização</h3>
                <p className="text-sm text-muted-foreground">Onde seus clientes podem te encontrar?</p>
            </div>

            <div className="grid gap-4">
                <FormField
                    control={control}
                    name="location.zipCode"
                    render={({ field }) => (
                        <FormItem className="col-span-1">
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                                <Input placeholder="00000-000" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="location.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Endereço Completo</FormLabel>
                            <FormControl>
                                <Input placeholder="Rua, Número, Bairro" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="location.city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cidade</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: São Paulo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="location.state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado (UF)</FormLabel>
                                <FormControl>
                                    <Input placeholder="SP" maxLength={2} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
