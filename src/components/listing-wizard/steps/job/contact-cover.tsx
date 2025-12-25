"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'

export function JobContactCoverStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Finalizar Vaga</h3>
                <p className="text-sm text-muted-foreground">Como os candidatos se aplicam e imagem de capa.</p>
            </div>

            <div className="space-y-4">
                <FormField
                    control={control}
                    name="applicationUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link para Inscrição (ATS ou Form)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="contactEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email para Receber CVs</FormLabel>
                            <FormControl>
                                <Input placeholder="vagas@empresa.com" type="email" {...field} />
                            </FormControl>
                            <FormDescription>Preencha se preferir receber por email.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="pt-4 border-t space-y-4">
                <FormLabel>Imagem de Capa (Optional)</FormLabel>
                <div className="aspect-[3/1] w-full bg-muted/30 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span>Upload Banner da Vaga</span>
                </div>
            </div>
        </div>
    )
}
