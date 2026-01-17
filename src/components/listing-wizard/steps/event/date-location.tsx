"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { MapPin, Globe, Users } from 'lucide-react'

// Japanese prefectures list (same as business location)
const prefectures = [
    "Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka", "Fukushima", "Gifu", "Gunma",
    "Hiroshima", "Hokkaido", "Hyogo", "Ibaraki", "Ishikawa", "Iwate", "Kagawa", "Kagoshima", "Kanagawa",
    "Kochi", "Kumamoto", "Kyoto", "Mie", "Miyagi", "Miyazaki", "Nagano", "Nagasaki", "Nara", "Niigata",
    "Oita", "Okayama", "Okinawa", "Osaka", "Saga", "Saitama", "Shiga", "Shimane", "Shizuoka", "Tochigi",
    "Tokushima", "Tokyo", "Tottori", "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"
]

export function EventDateLocationStep() {
    const { control, watch } = useFormContext()
    const eventMode = watch("eventMode") || "presencial"
    const startDate = watch("startDate") || ""

    // Show location fields for presencial and hybrid modes
    const showLocationFields = eventMode === "presencial" || eventMode === "hybrid"

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Data e Local</h3>
                    <p className="text-sm text-muted-foreground">Quando e onde vai acontecer?</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Início <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="date" min={today} {...field} />
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
                            <FormLabel>Horário de Início <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Término</FormLabel>
                            <FormControl>
                                <Input type="date" min={startDate || today} {...field} />
                            </FormControl>
                            <FormDescription>Opcional para eventos de um dia.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="endTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Horário de Término</FormLabel>
                            <FormControl>
                                <Input type="time" {...field} />
                            </FormControl>
                            <FormDescription className="invisible">Espaçador</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="eventMode"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Modalidade do Evento</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value || "presencial"}
                                value={field.value || "presencial"}
                                className="grid grid-cols-3 gap-4"
                            >
                                <div>
                                    <RadioGroupItem
                                        value="presencial"
                                        id="presencial"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="presencial"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <MapPin className="mb-2 h-6 w-6" />
                                        <span className="text-sm font-medium">Presencial</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="online"
                                        id="online"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="online"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <Globe className="mb-2 h-6 w-6" />
                                        <span className="text-sm font-medium">Online</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="hybrid"
                                        id="hybrid"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="hybrid"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <Users className="mb-2 h-6 w-6" />
                                        <span className="text-sm font-medium">Híbrido</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <FormDescription>
                            {eventMode === "online" && "Evento 100% online, sem local físico."}
                            {eventMode === "presencial" && "Evento presencial em local físico."}
                            {eventMode === "hybrid" && "Evento com opção online e presencial."}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {showLocationFields && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="location.state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Província (Prefeitura)</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a província" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[300px]">
                                            {prefectures.map((pref) => (
                                                <SelectItem key={pref} value={pref}>
                                                    {pref}
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
                            name="location.city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Cidade" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={control}
                        name="location.address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endereço do Local</FormLabel>
                                <FormControl>
                                    <Input placeholder="Rua, Número, Local" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                <FormLabel>Preço (¥)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
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
                                    <Input placeholder="exemplo.com/ingressos" {...field} />
                                </FormControl>
                                <FormDescription className="invisible">Espaçador</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

        </div>
    )
}
