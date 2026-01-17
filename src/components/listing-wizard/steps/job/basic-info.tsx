"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { MapPin, Globe, Users } from 'lucide-react'

const employmentTypes = [
    { value: "full-time", label: "Tempo Integral" },
    { value: "part-time", label: "Meio Período" },
    { value: "contract", label: "Contrato / PJ" },
    { value: "freelance", label: "Freelancer" },
    { value: "internship", label: "Estágio" },
    { value: "temporary", label: "Temporário" },
]

const jobCategories = [
    { value: "tech", label: "Tecnologia" },
    { value: "admin", label: "Administrativo" },
    { value: "sales", label: "Vendas" },
    { value: "marketing", label: "Marketing" },
    { value: "healthcare", label: "Saúde" },
    { value: "education", label: "Educação" },
    { value: "hospitality", label: "Hotelaria / Restaurante" },
    { value: "construction", label: "Construção" },
    { value: "manufacturing", label: "Manufatura / Fábrica" },
    { value: "logistics", label: "Logística" },
    { value: "services", label: "Serviços Gerais" },
    { value: "other", label: "Outro" },
]

export function JobBasicStep() {
    const { control, watch } = useFormContext()
    const workModel = watch("workModel") || "onsite"

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Informações da Vaga</h3>
                    <p className="text-sm text-muted-foreground">Defina o cargo, categoria e modelo de trabalho.</p>
                </div>
            </div>

            <FormField
                control={control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cargo / Título da Vaga <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Desenvolvedor Senior, Garçom, Assistente Administrativo" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="companyName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome da Empresa (Opcional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Deixe em branco para usar o nome do Contratante" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>Nome público da empresa. Se vazio, usará o nome do Contratante.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {jobCategories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="employmentType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Contratação</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {employmentTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="workModel"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Modelo de Trabalho</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value || "onsite"}
                                value={field.value || "onsite"}
                                className="grid grid-cols-3 gap-4"
                            >
                                <div>
                                    <RadioGroupItem
                                        value="onsite"
                                        id="onsite"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="onsite"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <MapPin className="mb-2 h-6 w-6" />
                                        <span className="text-sm font-medium">Presencial</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="remote"
                                        id="remote"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="remote"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <Globe className="mb-2 h-6 w-6" />
                                        <span className="text-sm font-medium">Remoto</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value="hybrid"
                                        id="hybrid"
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor="hybrid"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <Users className="mb-2 h-6 w-6" />
                                        <span className="text-sm font-medium">Híbrido</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </FormControl>
                        <FormDescription>
                            {workModel === "remote" && "Trabalho 100% remoto, sem necessidade de ir ao escritório."}
                            {workModel === "onsite" && "Trabalho presencial no local da empresa."}
                            {workModel === "hybrid" && "Combinação de trabalho presencial e remoto."}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
