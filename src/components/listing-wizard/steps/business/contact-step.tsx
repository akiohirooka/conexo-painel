"use client"

import { useFormContext, useFieldArray } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Mail, Phone, Instagram, Globe, MessageCircle, Plus, Trash2, User, Linkedin, Facebook, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

const contactTypes = [
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "email", label: "Email", icon: Mail },
    { value: "phone", label: "Telefone", icon: Phone },
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "website", label: "Site", icon: Globe },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "other", label: "Outro", icon: Share2 },
]

export function BusinessContactStep() {
    const { control, register, trigger } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "contactsData"
    })

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newContact, setNewContact] = useState({ type: "", value: "", responsible: "" })

    const handleAdd = () => {
        if (!newContact.type || !newContact.value) return
        append(newContact)
        setNewContact({ type: "", value: "", responsible: "" })
        setIsDialogOpen(false)
    }

    const getIcon = (type: string) => {
        const found = contactTypes.find(t => t.value === type)
        const Icon = found ? found.icon : Share2
        return <Icon className="w-4 h-4" />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Contatos</h3>
                    <p className="text-sm text-muted-foreground">Adicione os canais de contato do seu negócio.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Contato
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Contato</DialogTitle>
                            <DialogDescription>
                                Preencha os detalhes do contato abaixo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <FormLabel>Tipo de Contato</FormLabel>
                                <Select
                                    value={newContact.type}
                                    onValueChange={(val) => setNewContact({ ...newContact, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contactTypes.map(t => (
                                            <SelectItem key={t.value} value={t.value}>
                                                <div className="flex items-center gap-2">
                                                    <t.icon className="w-4 h-4" />
                                                    {t.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <FormLabel>Contato (Valor)</FormLabel>
                                <Input
                                    placeholder="Ex: (11) 99999-9999 ou user@email.com"
                                    value={newContact.value}
                                    onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormLabel>Responsável (Opcional)</FormLabel>
                                <Input
                                    placeholder="Ex: Comercial, João Silva"
                                    value={newContact.responsible}
                                    onChange={(e) => setNewContact({ ...newContact, responsible: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAdd} disabled={!newContact.type || !newContact.value}>
                                Adicionar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {fields.length > 0 ? (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead>Responsável</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {getIcon((field as any).type)}
                                        {contactTypes.find(t => t.value === (field as any).type)?.label || (field as any).type}
                                    </TableCell>
                                    <TableCell>{(field as any).value}</TableCell>
                                    <TableCell>
                                        {(field as any).responsible ? (
                                            <Badge variant="secondary" className="font-normal">
                                                <User className="w-3 h-3 mr-1" />
                                                {(field as any).responsible}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                    <div className="p-3 bg-background rounded-full mb-2">
                        <Share2 className="w-6 h-6 opacity-50" />
                    </div>
                    <p>Nenhum contato adicionado.</p>
                </div>
            )}
        </div>
    )
}
