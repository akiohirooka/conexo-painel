"use client"

import { FormLabel, FormDescription } from '@/components/ui/form'
import { Upload } from 'lucide-react'

export function EventGalleryStep() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Imagens do Evento</h3>
                <p className="text-sm text-muted-foreground">Adicione banners e fotos.</p>
            </div>

            <div className="space-y-4">
                <FormLabel>Banner Principal</FormLabel>
                <div className="aspect-video w-full max-w-md bg-muted/30 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span>Upload Banner (16:9)</span>
                </div>
                <FormDescription>
                    Funcionalidade de upload simulada.
                </FormDescription>
            </div>
        </div>
    )
}
