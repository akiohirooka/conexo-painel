"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Image as ImageIcon, Upload, Plus } from 'lucide-react'

// Placeholder for a real file upload component
const ImageUploadPlaceholder = ({ label, value, onChange }: { label: string, value?: string, onChange: (val: string) => void }) => (
    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
        <div className="p-4 bg-muted rounded-full mb-3 group-hover:bg-background transition-colors">
            {value ? (
                <div className="relative w-full h-full">
                    {/* In a real app, show preview here */}
                    <ImageIcon className="w-6 h-6 text-primary" />
                </div>
            ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
            )}
        </div>
        <div className="space-y-1">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">Clique para fazer upload (Mock)</p>
        </div>
        {/* Mock Input for URL */}
        <Input
            className="mt-4 max-w-xs text-xs h-8"
            placeholder="Ou cole uma URL aqui..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
        />
        {value && <p className="text-xs text-green-600 mt-2 font-medium">Imagem selecionada!</p>}
    </div>
)

export function BusinessMediaStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Mídia e Visual</h3>
                <p className="text-sm text-muted-foreground">Adicione a identidade visual e fotos do seu negócio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo */}
                <FormField
                    control={control}
                    name="logo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Logotipo (Quadrado)</FormLabel>
                            <FormControl>
                                <ImageUploadPlaceholder
                                    label="Upload do Logo"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Cover */}
                <FormField
                    control={control}
                    name="coverImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capa (Retangular)</FormLabel>
                            <FormControl>
                                <ImageUploadPlaceholder
                                    label="Upload da Capa"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <h4 className="text-sm font-medium">Galeria de Fotos</h4>
                    <p className="text-xs text-muted-foreground">Adicione fotos do ambiente, produtos ou serviços.</p>
                </div>

                {/* Mock Gallery List */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center border border-dashed text-muted-foreground text-xs">
                            Foto {i}
                        </div>
                    ))}
                    <div className="aspect-square bg-muted/30 rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 cursor-pointer transition-colors">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </div>
    )
}
