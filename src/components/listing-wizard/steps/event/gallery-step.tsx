"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { useWizard } from '@/components/listing-wizard/wizard-context'
import { ImageUpload } from '@/components/ui-conexo/image-upload'
import { GalleryUpload } from '@/components/ui-conexo/gallery-upload'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

import { updateEventCover } from '@/actions/update-event-cover'
import { updateEventGallery } from '@/actions/update-event-gallery'
import { toast } from '@/hooks/use-toast'

export function EventGalleryStep() {
    const { control } = useFormContext()
    const { editId } = useWizard()

    // Ensuring we have an ID to associate the upload with
    const canUpload = !!editId

    const handleCoverUpload = async (url: string, fieldChange: (value: string) => void) => {
        fieldChange(url) // Update form state

        if (editId) {
            const result = await updateEventCover(editId, url)
            if (result.success) {
                toast({
                    title: "Capa atualizada!",
                    description: "A imagem de capa foi salva automaticamente.",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro ao salvar",
                    description: result.error || "Não foi possível salvar a capa.",
                })
            }
        }
    }

    const handleGalleryChange = async (urls: string[], fieldChange: (value: string[]) => void) => {
        fieldChange(urls) // Update form state

        if (editId) {
            const result = await updateEventGallery(editId, urls)
            if (result.success) {
                toast({
                    title: "Galeria atualizada!",
                    description: "As imagens foram salvas automaticamente.",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro ao salvar",
                    description: result.error || "Não foi possível salvar a galeria.",
                })
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Imagens do Evento</h3>
                    <p className="text-sm text-muted-foreground">Adicione um banner e fotos do evento.</p>
                </div>
            </div>

            {!canUpload && (
                <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                    <Info className="h-4 w-4 text-yellow-800" />
                    <AlertTitle>Salvar necessário</AlertTitle>
                    <AlertDescription>
                        Para fazer upload de imagens, você precisa salvar o rascunho do evento primeiro.
                    </AlertDescription>
                </Alert>
            )}

            <FormField
                control={control}
                name="coverImage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Banner / Imagem de Capa</FormLabel>
                        <FormDescription>
                            Recomendamos uma imagem no formato 16:9 (paisagem).
                        </FormDescription>
                        <FormControl>
                            <ImageUpload
                                label="Upload do Banner"
                                value={field.value}
                                onChange={(url) => handleCoverUpload(url, field.onChange)}
                                entity="events"
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

            {/* Gallery */}
            <FormField
                control={control}
                name="galleryImages"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Galeria de Fotos</FormLabel>
                        <FormDescription>
                            Adicione fotos do evento, local ou atividades. Máximo de 5 fotos.
                        </FormDescription>
                        <FormControl>
                            <GalleryUpload
                                value={field.value || []}
                                onChange={(urls) => handleGalleryChange(urls, field.onChange)}
                                entity="events"
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
