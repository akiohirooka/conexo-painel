"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useEffect, useState } from 'react'
import { getCategories } from '@/actions/get-categories'
import type { CategoryWithSubs } from '@/lib/types/categories'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BusinessBasicStep() {
    const { control, watch, setValue } = useFormContext()
    const [categories, setCategories] = useState<CategoryWithSubs[]>([])
    const HTTPS_PREFIX = "https://"

    const ensureHttpsPrefix = (value: string) => {
        const trimmed = value.trim()
        if (!trimmed || trimmed === HTTPS_PREFIX) return ""
        if (/^https?:\/\//i.test(trimmed)) return trimmed
        return `${HTTPS_PREFIX}${trimmed.replace(/^\/\//, '')}`
    }

    // Watch category to show relevant subcategories
    const selectedCategoryName = watch('category')
    const selectedSubcategories = watch('subcategory') || [] // Ensure array

    useEffect(() => {
        const fetchCats = async () => {
            const res = await getCategories()
            if (res.success && res.data) {
                setCategories(res.data)
            }
        }
        fetchCats()
    }, [])

    const selectedCategoryObj = categories.find(c => c.name === selectedCategoryName)

    const toggleSubcategory = (subName: string) => {
        const current = selectedSubcategories as string[]
        if (current.includes(subName)) {
            setValue('subcategory', current.filter(s => s !== subName), { shouldDirty: true })
        } else {
            setValue('subcategory', [...current, subName], { shouldDirty: true })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Informações Básicas</h3>
                    <p className="text-sm text-muted-foreground">Conte um pouco sobre o seu negócio.</p>
                </div>
            </div>

            <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome do Negócio</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Café Colonial da Serra" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Categoria <span className="text-destructive">*</span></FormLabel>
                        <Select
                            onValueChange={(val) => {
                                field.onChange(val)
                                setValue('subcategory', []) // Reset subs on cat change
                            }}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-popover text-popover-foreground">
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
                <FormItem className="space-y-3">
                    <FormLabel>Subcategorias</FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {selectedCategoryObj.subcategories.map((sub) => {
                            const isSelected = (selectedSubcategories as string[]).includes(sub.name)
                            return (
                                <div
                                    key={sub.id}
                                    onClick={() => toggleSubcategory(sub.name)}
                                    className={cn(
                                        "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all border select-none flex items-center gap-2",
                                        isSelected
                                            ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                            : "bg-background text-muted-foreground border-input hover:border-primary/50 hover:text-foreground"
                                    )}
                                >
                                    {sub.name}
                                    {isSelected && <Check className="h-3 w-3" />}
                                </div>
                            )
                        })}
                    </div>
                    <FormDescription>Selecione uma ou mais opções.</FormDescription>
                </FormItem>
            )}

            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Descreva seus produtos, serviços e o que torna seu negócio especial..."
                                className="min-h-[120px]"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>Mínimo de 20 caracteres.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="siteUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Site principal</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="https://www.seusite.com"
                                {...field}
                                onFocus={(e) => {
                                    if (!field.value) {
                                        field.onChange(HTTPS_PREFIX)
                                        requestAnimationFrame(() => {
                                            e.target.setSelectionRange(HTTPS_PREFIX.length, HTTPS_PREFIX.length)
                                        })
                                    }
                                }}
                                onBlur={(e) => {
                                    const normalized = ensureHttpsPrefix(e.target.value)
                                    field.onChange(normalized)
                                    field.onBlur()
                                }}
                            />
                        </FormControl>
                        <FormDescription>Você pode adicionar outros sites ou redes em Contatos.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
