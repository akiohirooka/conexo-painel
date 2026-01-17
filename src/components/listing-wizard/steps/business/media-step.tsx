"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { useWizard } from '@/components/listing-wizard/wizard-context'
import { ImageUpload } from '@/components/ui-conexo/image-upload'
import { GalleryUpload } from '@/components/ui-conexo/gallery-upload'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export function BusinessMediaStep() {
    const { control } = useFormContext()
    const { editId, isEditMode } = useWizard()

    // Ensuring we have an ID to associate the upload with
    const canUpload = !!editId

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Mídia e Visual</h3>
                <p className="text-sm text-muted-foreground">Adicione a identidade visual e fotos do seu negócio.</p>
            </div>

            {!canUpload && (
                <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                    <Info className="h-4 w-4 text-yellow-800" />
                    <AlertTitle>Salvar necessário</AlertTitle>
                    <AlertDescription>
                        Para fazer upload de imagens, você precisa salvar o rascunho do negócio primeiro.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo */}
                <FormField
                    control={control}
                    name="logo" // Assuming this maps to logo_url in schema or transformed
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Logotipo (Quadrado)</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    label="Upload do Logo"
                                    value={field.value}
                                    onChange={field.onChange}
                                    entity="business"
                                    entityId={editId || 0} // 0 or dummy, but disabled handles it
                                    type="logo"
                                    aspectRatio={1}
                                    disabled={!canUpload}
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
                                <ImageUpload
                                    label="Upload da Capa"
                                    value={field.value}
                                    onChange={field.onChange}
                                    entity="business"
                                    entityId={editId || 0}
                                    type="cover"
                                    aspectRatio={16 / 9}
                                    disabled={!canUpload}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Gallery */}
            <FormField
                control={control}
                name="galleryImages"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Galeria de Fotos</FormLabel>
                        <FormDescription>
                            Adicione fotos do ambiente, produtos ou serviços. Máximo de 5 fotos.
                        </FormDescription>
                        <FormControl>
                            <GalleryUpload
                                value={field.value || []}
                                onChange={field.onChange}
                                entity="business"
                                entityId={editId || 0}
                                maxImages={5}
                                disabled={!canUpload}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
