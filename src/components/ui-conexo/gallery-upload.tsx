"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Loader2, Trash2, Plus, ImageIcon, AlertTriangle, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface GalleryUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    entity: 'business' | 'events' | 'jobs'
    entityId: string | number
    maxImages?: number
    disabled?: boolean
}

const MAX_IMAGES_DEFAULT = 5

export function GalleryUpload({
    value = [],
    onChange,
    entity,
    entityId,
    maxImages = MAX_IMAGES_DEFAULT,
    disabled = false
}: GalleryUploadProps) {
    // State
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<string>('')

    // Deletion State
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Lightbox State
    const [lightboxImage, setLightboxImage] = useState<string | null>(null)

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null)

    const currentCount = value.length
    const remainingSlots = maxImages - currentCount
    const canAddMore = remainingSlots > 0

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const files = Array.from(e.target.files)
        e.target.value = '' // Reset input

        // Check how many we can actually upload
        const filesToUpload = files.slice(0, remainingSlots)
        const skippedCount = files.length - filesToUpload.length

        if (skippedCount > 0) {
            toast({
                title: "Limite de fotos",
                description: `Apenas ${filesToUpload.length} foto(s) serão adicionadas. ${skippedCount} foto(s) foram ignoradas pois excederiam o limite de ${maxImages}.`,
                variant: 'default'
            })
        }

        if (filesToUpload.length === 0) {
            toast({
                title: "Limite atingido",
                description: `Você já atingiu o limite de ${maxImages} fotos. Remova algumas para adicionar novas.`,
                variant: 'destructive'
            })
            return
        }

        await uploadFiles(filesToUpload)
    }

    const uploadFiles = async (files: File[]) => {
        setIsUploading(true)
        const uploadedUrls: string[] = []
        let errorCount = 0

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                setUploadProgress(`Enviando ${i + 1} de ${files.length}...`)

                try {
                    // Compress image
                    let fileToUpload: File | Blob = file

                    try {
                        const compressionOptions = {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true
                        }
                        fileToUpload = await imageCompression(file, compressionOptions)
                    } catch (compressionError) {
                        // If compression fails, use original file
                        console.warn('Compression failed, using original file:', compressionError)
                        fileToUpload = file
                    }

                    // Upload to API
                    const formData = new FormData()
                    formData.append('file', fileToUpload, file.name)
                    formData.append('entity', entity)
                    formData.append('type', 'gallery')
                    formData.append('entityId', String(entityId))

                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    })

                    // Check if response is JSON
                    const contentType = response.headers.get('content-type')
                    if (!contentType || !contentType.includes('application/json')) {
                        const text = await response.text()
                        console.error('Non-JSON response:', text)
                        throw new Error('Resposta inválida do servidor')
                    }

                    const data = await response.json()

                    if (!response.ok) {
                        throw new Error(data.error || 'Falha no upload')
                    }

                    uploadedUrls.push(data.key as string)
                } catch (error: any) {
                    console.error(`Failed to upload ${file.name}:`, error)
                    errorCount++
                }
            }

            // Update state with all successfully uploaded images
            if (uploadedUrls.length > 0) {
                onChange([...value, ...uploadedUrls])
                toast({
                    title: uploadedUrls.length === 1 ? "Foto adicionada!" : `${uploadedUrls.length} fotos adicionadas!`,
                    variant: 'success'
                })
            }

            if (errorCount > 0) {
                toast({
                    title: "Alguns uploads falharam",
                    description: `${errorCount} foto(s) não puderam ser enviadas.`,
                    variant: 'destructive'
                })
            }

        } catch (error: any) {
            console.error('Upload error:', error)
            toast({
                title: "Erro no upload",
                description: error.message || 'Erro desconhecido',
                variant: 'destructive'
            })
        } finally {
            setIsUploading(false)
            setUploadProgress('')
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return

        try {
            setIsDeleting(true)
            const response = await fetch('/api/upload', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    entity,
                    type: 'gallery',
                    entityId,
                    key: deleteTarget
                })
            })

            // Check if response is JSON
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text()
                console.error('Non-JSON response:', text)
                throw new Error('Resposta inválida do servidor')
            }

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete')
            }

            // Update local state
            onChange(value.filter(url => url !== deleteTarget))
            setIsDeleteDialogOpen(false)
            setDeleteTarget(null)

            toast({
                title: "Foto removida.",
                variant: 'success'
            })
        } catch (error: any) {
            toast({
                title: "Erro ao remover",
                description: error.message || 'Erro desconhecido',
                variant: 'destructive'
            })
        } finally {
            setIsDeleting(false)
        }
    }

    // Helper to get display URL with cache-busting
    const getDisplayUrl = (val: string, addCacheBust = true) => {
        let url = val
        if (!val.startsWith('http') && !val.startsWith('blob:')) {
            const domain = process.env.NEXT_PUBLIC_R2_BASE_URL || ''
            if (!domain) {
                console.warn('NEXT_PUBLIC_R2_BASE_URL not configured')
                return val
            }
            url = `${domain.replace(/\/+$/, '')}/${val}`
        }
        if (addCacheBust && url.startsWith('http')) {
            const separator = url.includes('?') ? '&' : '?'
            return `${url}${separator}t=${Date.now()}`
        }
        return url
    }

    const openDeleteDialog = (url: string, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setDeleteTarget(url)
        setIsDeleteDialogOpen(true)
    }

    const openLightbox = (url: string) => {
        setLightboxImage(url)
    }

    const closeLightbox = () => {
        setLightboxImage(null)
    }

    return (
        <>
            <div className="space-y-3">
                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {/* Existing Images */}
                    {value.map((imageUrl, index) => (
                        <div
                            key={imageUrl}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted/20 cursor-pointer"
                            onClick={() => openLightbox(imageUrl)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getDisplayUrl(imageUrl)}
                                alt={`Foto ${index + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {/* View button */}
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    className="h-9 w-9 p-0"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        openLightbox(imageUrl)
                                    }}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>

                                {/* Delete button */}
                                {!disabled && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        className="h-9 w-9 p-0"
                                        onClick={(e) => openDeleteDialog(imageUrl, e)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add New Button */}
                    {canAddMore && !disabled && !isUploading && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-muted/30 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                            <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground text-center px-2">
                                Adicionar
                                {remainingSlots > 1 && <br />}
                                {remainingSlots > 1 && `(até ${remainingSlots})`}
                            </span>
                        </div>
                    )}

                    {/* Uploading indicator */}
                    {isUploading && (
                        <div className="aspect-square bg-muted/30 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-primary/50">
                            <Loader2 className="w-6 h-6 text-primary animate-spin mb-1" />
                            <span className="text-xs text-muted-foreground text-center px-2">
                                {uploadProgress || 'Enviando...'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Limit Message */}
                {currentCount >= maxImages && (
                    <Alert variant="default" className="bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                            Limite de {maxImages} fotos atingido. Remova uma foto para adicionar outra.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Empty State */}
                {currentCount === 0 && disabled && (
                    <div className="aspect-video bg-muted/20 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">Salve o negócio para adicionar fotos</p>
                    </div>
                )}

                {/* Counter */}
                {currentCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                        {currentCount} de {maxImages} fotos
                    </p>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    disabled={disabled || isUploading}
                    multiple
                />
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={!!lightboxImage} onOpenChange={() => closeLightbox()}>
                <DialogContent showCloseButton={false} className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-none overflow-hidden text-white">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Visualização da Imagem</DialogTitle>
                        <DialogDescription>Imagem ampliada da galeria</DialogDescription>
                    </DialogHeader>

                    {lightboxImage && (() => {
                        const idx = value.findIndex(u => u === lightboxImage)
                        return (
                            <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center">
                                {/* Navigation Prev */}
                                {value.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const prevIndex = (idx - 1 + value.length) % value.length
                                            setLightboxImage(value[prevIndex])
                                        }}
                                        className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                )}

                                {/* Image */}
                                <div className="w-full h-full p-4 flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getDisplayUrl(lightboxImage, false)}
                                        alt="Visualização"
                                        className="max-w-full max-h-[85vh] object-contain"
                                    />
                                </div>

                                {/* Navigation Next */}
                                {value.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const nextIndex = (idx + 1) % value.length
                                            setLightboxImage(value[nextIndex])
                                        }}
                                        className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                )}

                                {/* Actions (Top Right) */}
                                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                                    {!disabled && (
                                        <button
                                            onClick={() => {
                                                setDeleteTarget(lightboxImage)
                                                setIsDeleteDialogOpen(true)
                                                setLightboxImage(null)
                                            }}
                                            className="p-2 rounded-full bg-white/10 hover:bg-red-900/50 text-white hover:text-red-400 transition-colors"
                                            title="Excluir imagem"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    )}
                                    <button
                                        onClick={closeLightbox}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        )
                    })()}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remover foto?</DialogTitle>
                        <DialogDescription>
                            Esta ação não pode ser desfeita. A foto será excluída permanentemente.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? 'Removendo...' : 'Sim, remover'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
