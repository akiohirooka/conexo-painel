"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export function JobLocationSalaryStep() {
    const { control, watch } = useFormContext()
    const workModel = watch("workModel")

    return (
        <div className="space-y-8">
            {/* Location */}
            {workModel !== 'remote' && (
                <div className="space-y-4 animate-in fade-in">
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Localização</h3>
                        <p className="text-sm text-muted-foreground">Onde a vaga é baseada?</p>
                    </div>
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

            {/* Salary */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Salário</h3>
                    <p className="text-sm text-muted-foreground">Remuneração oferecida.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="salary.amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={e => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="salary.period"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Período</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || 'month'}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="hour">Por Hora</SelectItem>
                                        <SelectItem value="month">Mensal</SelectItem>
                                        <SelectItem value="year">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={control}
                    name="salary.negotiable"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-3 rounded-lg border p-3 bg-muted/20">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-0.5">
                                <FormLabel>A combinar / Negociável</FormLabel>
                                <FormDescription>
                                    Marque se o salário for flexível.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
