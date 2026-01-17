"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { useWizard } from '@/components/listing-wizard/wizard-context'
import { ImageUpload } from '@/components/ui-conexo/image-upload'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

import { updateJobCover } from '@/actions/update-job-cover'
import { toast } from '@/hooks/use-toast'

export function JobGalleryStep() {
    const { control } = useFormContext()
    const { editId } = useWizard()

    // Ensuring we have an ID to associate the upload with
    const canUpload = !!editId

    const handleCoverUpload = async (url: string, fieldChange: (value: string) => void) => {
        fieldChange(url) // Update form state

        if (editId) {
            const result = await updateJobCover(editId, url)
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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Imagens da Vaga</h3>
                    <p className="text-sm text-muted-foreground">Adicione um banner para destacar sua vaga.</p>
                </div>
            </div>

            {!canUpload && (
                <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                    <Info className="h-4 w-4 text-yellow-800" />
                    <AlertTitle>Salvar necessário</AlertTitle>
                    <AlertDescription>
                        Para fazer upload de imagens, você precisa salvar o rascunho da vaga primeiro.
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
                                entity="jobs"
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
    )
}
