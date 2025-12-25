"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function EventDateLocationStep() {
    const { control, watch } = useFormContext()
    const isOnline = watch("isOnline")

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Data e Local</h3>
                <p className="text-sm text-muted-foreground">Quando e onde vai acontecer?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Início</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="startTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Horário</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="isOnline"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Evento Online</FormLabel>
                            <FormDescription>
                                Se marcado, não solicitaremos endereço físico.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            {!isOnline && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <FormField
                        control={control}
                        name="location.address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endereço do Local</FormLabel>
                                <FormControl>
                                    <Input placeholder="Rua, Número, Local" {...field} />
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
                                        <Input placeholder="Cidade" {...field} />
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
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                        <Input placeholder="UF" maxLength={2} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}

            <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-4">Ingressos</h4>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preço (R$)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={e => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>Deixe 0 para Gratuito.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="ticketUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Link para Ingressos</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
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
