"use client"

import { useFormContext, useFieldArray } from 'react-hook-form'
import { FormLabel, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Mail, Phone, Instagram, MessageCircle, Plus, Trash2, User, Linkedin, Facebook, Share2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui-conexo/empty-state'
import { Alert, AlertDescription } from '@/components/ui/alert'

const contactTypes = [
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "email", label: "E-mail", icon: Mail },
    { value: "phone", label: "Telefone", icon: Phone },
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "other", label: "Outro", icon: Share2 },
]

export function EventContactStep() {
    const { control } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "contactsData"
    })

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newContact, setNewContact] = useState({ type: "", value: "", responsible: "" })

    const handleAdd = () => {
        if (!newContact.type || !newContact.value) return

        const value = newContact.value.trim()

        if (!value) return

        append({ ...newContact, value })
        setNewContact({ type: "", value: "", responsible: "" })
        setIsDialogOpen(false)
    }

    const getIcon = (type: string) => {
        const found = contactTypes.find(t => t.value === type)
        const Icon = found ? found.icon : Share2
        return <Icon className="w-4 h-4" />
    }

    const getContactLabel = (type: string) => {
        switch (type) {
            case 'email': return 'E-mail'
            case 'whatsapp': return 'Número do WhatsApp'
            case 'phone': return 'Número de Telefone'
            case 'instagram': return 'Perfil do Instagram'
            case 'facebook': return 'Perfil do Facebook'
            case 'linkedin': return 'Perfil do LinkedIn'
            default: return 'Contato (Valor)'
        }
    }

    const getContactPlaceholder = (type: string) => {
        switch (type) {
            case 'email': return 'Escreva seu e-mail'
            case 'whatsapp': return 'Escreva seu número de WhatsApp (Ex: 11 99999-9999)'
            case 'phone': return 'Escreva seu número de telefone (Ex: 11 3333-3333)'
            case 'instagram': return 'Escreva seu perfil do Instagram (Ex: @seu_perfil)'
            case 'facebook': return 'Escreva seu perfil do Facebook'
            case 'linkedin': return 'Escreva seu perfil do LinkedIn'
            default: return 'Preencha o contato'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">Contatos do Evento</h3>
                    <p className="text-sm text-muted-foreground">Adicione os canais de contato para dúvidas e informações.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default" size="sm" className="shadow-sm flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Contato
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white text-black sm:max-w-[425px]">
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
                                    onValueChange={(val) => {
                                        setNewContact((prev) => ({
                                            ...prev,
                                            type: val,
                                            value: prev.value
                                        }))
                                    }}
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
                                <FormLabel>{getContactLabel(newContact.type)}</FormLabel>
                                <Input
                                    placeholder={getContactPlaceholder(newContact.type)}
                                    value={newContact.value}
                                    onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                                    onBlur={(e) => {
                                        setNewContact((prev) => ({
                                            ...prev,
                                            value: e.target.value.trim()
                                        }))
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormLabel>Responsável (Opcional)</FormLabel>
                                <Input
                                    placeholder="Ex: Organização, João Silva"
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

            <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <AlertTriangle className="w-4 h-4 text-yellow-800" />
                <AlertDescription>
                    Importante: Não se esqueça de clicar em <strong>Salvar</strong> no final da página para confirmar a inclusão dos contatos.
                </AlertDescription>
            </Alert>

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
                                    <TableCell className="font-medium align-middle">
                                        <div className="flex items-center gap-2">
                                            {getIcon((field as any).type)}
                                            {contactTypes.find(t => t.value === (field as any).type)?.label || (field as any).type}
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-middle">{(field as any).value}</TableCell>
                                    <TableCell className="align-middle">
                                        {(field as any).responsible ? (
                                            <Badge variant="secondary" className="font-normal">
                                                <User className="w-3 h-3 mr-1" />
                                                {(field as any).responsible}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="align-middle">
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
                <EmptyState
                    title="Nenhum contato adicionado"
                    description="Adicione os canais de contato do evento para que as pessoas possam tirar dúvidas."
                    icon={Share2}
                />
            )}
        </div>
    )
}
