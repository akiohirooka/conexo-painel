"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock list of Japanese prefectures (Províncias)
const prefectures = [
    "Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka", "Fukushima", "Gifu", "Gunma",
    "Hiroshima", "Hokkaido", "Hyogo", "Ibaraki", "Ishikawa", "Iwate", "Kagawa", "Kagoshima", "Kanagawa",
    "Kochi", "Kumamoto", "Kyoto", "Mie", "Miyagi", "Miyazaki", "Nagano", "Nagasaki", "Nara", "Niigata",
    "Oita", "Okayama", "Okinawa", "Osaka", "Saga", "Saitama", "Shiga", "Shimane", "Shizuoka", "Tochigi",
    "Tokushima", "Tokyo", "Tottori", "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"
]

export function BusinessLocationStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Localização</h3>
                <p className="text-sm text-muted-foreground">Onde seu negócio está localizado? (Formato Japão)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Postal Code */}
                <FormField
                    control={control}
                    name="location.zipCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Código Postal (〒)</FormLabel>
                            <FormControl>
                                <Input placeholder="000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Prefecture */}
                <FormField
                    control={control}
                    name="location.state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Província (Prefeitura)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* City */}
                <FormField
                    control={control}
                    name="location.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cidade (市区町村)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Nagoya-shi, Naka-ku" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Address (Street/Building) */}
                <FormField
                    control={control}
                    name="location.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Endereço Completo (番地・建物名)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Nishiki 3-1-1, Prédio Comercial 2F" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground border border-dashed">
                Mapa (Google Maps) será exibido aqui
            </div>
        </div>
    )
}
