"use client"

import { useFormContext, useFieldArray } from 'react-hook-form'
import { FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Clock } from 'lucide-react'
import { useState } from 'react'

const daysOfWeek = [
    { id: 0, label: "Domingo" },
    { id: 1, label: "Segunda" },
    { id: 2, label: "Terça" },
    { id: 3, label: "Quarta" },
    { id: 4, label: "Quinta" },
    { id: 5, label: "Sexta" },
    { id: 6, label: "Sábado" },
]

export function BusinessHoursStep() {
    const { control } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "openingHoursData"
    })

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedDays, setSelectedDays] = useState<number[]>([])
    const [timeRange, setTimeRange] = useState({ start: "09:00", end: "18:00" })

    const handleToggleDay = (dayId: number) => {
        setSelectedDays(prev =>
            prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId].sort()
        )
    }

    const handleAdd = () => {
        if (selectedDays.length === 0 || !timeRange.start || !timeRange.end) return
        append({
            days: selectedDays,
            start: timeRange.start,
            end: timeRange.end
        })
        setSelectedDays([])
        setIsDialogOpen(false)
    }

    const formatDays = (days: number[]) => {
        if (days.length === 7) return "Todos os dias"
        if (days.length === 5 && days.includes(1) && days.includes(5) && !days.includes(0) && !days.includes(6)) return "Segunda a Sexta"
        return days.map(d => daysOfWeek.find(dow => dow.id === d)?.label.substring(0, 3)).join(", ")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Horários de Funcionamento</h3>
                    <p className="text-sm text-muted-foreground">Adicione os turnos de funcionamento.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Horário
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Turno</DialogTitle>
                            <DialogDescription>
                                Selecione os dias e o intervalo de horário.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <FormLabel>Dias da Semana</FormLabel>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {daysOfWeek.map((day) => (
                                        <div key={day.id} className="flex items-center space-x-2 border rounded-md p-2">
                                            <Checkbox
                                                id={`day-${day.id}`}
                                                checked={selectedDays.includes(day.id)}
                                                onCheckedChange={() => handleToggleDay(day.id)}
                                            />
                                            <label
                                                htmlFor={`day-${day.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {day.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormLabel>Abertura</FormLabel>
                                    <Input
                                        type="time"
                                        value={timeRange.start}
                                        onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Fechamento</FormLabel>
                                    <Input
                                        type="time"
                                        value={timeRange.end}
                                        onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleAdd} disabled={selectedDays.length === 0}>
                                Adicionar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {fields.length > 0 ? (
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                            <div className="space-y-1">
                                <div className="flex items-center font-medium">
                                    <Clock className="w-4 h-4 mr-2 text-primary" />
                                    {formatDays((field as any).days)}
                                </div>
                                <div className="text-sm text-muted-foreground ml-6">
                                    {(field as any).start} - {(field as any).end}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                    <Clock className="w-8 h-8 mb-2 opacity-50" />
                    <p>Nenhum horário cadastrado.</p>
                </div>
            )}
        </div>
    )
}
