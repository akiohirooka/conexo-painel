"use client"

import React, { useState, useRef, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Loader2, Upload, Trash2, Edit2, RotateCcw, Image as ImageIcon } from 'lucide-react'
import getCroppedImg from '@/lib/image-utils'
import imageCompression from 'browser-image-compression'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

interface ImageUploadProps {
    value?: string | null
    onChange: (value: string | null) => void
    entity: 'users' | 'business' | 'events' | 'jobs'
    entityId: string | number
    type: 'avatar' | 'logo' | 'cover' | 'gallery'
    aspectRatio?: number // default 1 for logo
    label?: string
    disabled?: boolean
}

export function ImageUpload({
    value,
    onChange,
    entity,
    entityId,
    type,
    aspectRatio = 1,
    label = "Upload Image",
    disabled = false
}: ImageUploadProps) {
    // State
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Deletion State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImageSrc(reader.result?.toString() || null)
                setIsCropDialogOpen(true)
            })
            reader.readAsDataURL(file)
            // Reset input so same file can be selected again if needed
            e.target.value = ''
        }
    }

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return

        try {
            setIsUploading(true)

            // 1. Get Cropped Blob
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
            if (!croppedBlob) throw new Error('Falha ao processar imagem.')

            // 2. Compress Blob
            const compressionOptions = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true
            }

            // Convert Blob to File for compression lib
            const file = new File([croppedBlob], "upload.jpg", { type: "image/jpeg" })
            const compressedFile = await imageCompression(file, compressionOptions)

            // 3. Upload to API
            const formData = new FormData()
            formData.append('file', compressedFile)
            formData.append('entity', entity)
            formData.append('type', type)
            formData.append('entityId', String(entityId))

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Falha no upload')
            }

            // 4. Update Value
            onChange(data.key as string)
            setIsCropDialogOpen(false)
            toast({
                title: "Upload concluído!",
                variant: 'success'
            })

        } catch (error: any) {
            console.error(error)
            toast({
                title: "Erro no upload",
                description: error.message,
                variant: 'destructive'
            })
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const response = await fetch('/api/upload', {
                method: 'DELETE',
                body: JSON.stringify({
                    entity,
                    type,
                    entityId,
                    key: value
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete')
            }

            onChange(null)
            setIsDeleteDialogOpen(false)
            toast({
                title: "Imagem removida.",
                variant: 'success'
            })
        } catch (error: any) {
            toast({
                title: "Erro ao remover",
                description: error.message,
                variant: 'destructive'
            })
        } finally {
            setIsDeleting(false)
        }
    }

    // Helper to get display URL
    const getDisplayUrl = (val: string) => {
        if (val.startsWith('http')) return val
        if (val.startsWith('blob:')) return val
        // Use the public R2 base URL for relative paths
        const domain = process.env.NEXT_PUBLIC_R2_BASE_URL || ''
        if (!domain) {
            console.warn('NEXT_PUBLIC_R2_BASE_URL not configured')
            return val
        }
        return `${domain.replace(/\/+$/, '')}/${val}`
    }

    return (
        <>
            <div className="w-full">
                {!value ? (
                    <div
                        onClick={() => !disabled && fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center 
                            transition-colors group min-h-[200px]
                            ${disabled ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'hover:bg-muted/50 cursor-pointer hover:border-primary/50'}
                        `}
                    >
                        <div className="p-4 bg-muted rounded-full mb-3 group-hover:bg-background transition-colors">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-xs text-muted-foreground">
                                {disabled ? "Salve o negócio para habilitar o upload" : "Clique para fazer upload (JPG, PNG)"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative group rounded-lg overflow-hidden border border-border bg-muted/20 h-[150px] w-[150px] flex items-center justify-center">
                        {/* Display Image */}
                        <div className="relative w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getDisplayUrl(value)}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Overlay Actions */}
                        {!disabled && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 text-xs gap-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    <Edit2 className="w-3 h-3" /> Alterar
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 text-xs gap-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setIsDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" /> Remover
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    disabled={disabled}
                />
            </div>

            {/* Crop Dialog */}
            <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
                <DialogContent className="sm:max-w-[600px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Editar Imagem</DialogTitle>
                        <DialogDescription>
                            Ajuste a imagem para o recorte desejado.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative w-full h-[400px] bg-black/5 rounded-md overflow-hidden my-4 border border-border">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>

                    <div className="flex items-center gap-4 py-4 px-2">
                        <span className="text-sm font-medium w-16 text-foreground">Zoom</span>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(v) => setZoom(v[0])}
                            className="flex-1 cursor-pointer"
                        />
                        <span className="text-xs text-muted-foreground w-8 text-right">{zoom.toFixed(1)}x</span>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCropDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUpload} disabled={isUploading}>
                            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isUploading ? 'Enviando...' : 'Confirmar e Salvar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remover imagem?</DialogTitle>
                        <DialogDescription>
                            Esta ação não pode ser desfeita. A imagem será excluída permanentemente.
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
