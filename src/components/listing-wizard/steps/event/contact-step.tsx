"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Mail, MessageCircle, User } from 'lucide-react'

export function EventContactStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Organizador e Contato</h3>
                <p className="text-sm text-muted-foreground">Quem está organizando?</p>
            </div>

            <FormField
                control={control}
                name="organizer"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Nome do Organizador
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Nome da empresa ou pessoa" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="contact.email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email de Suporte
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="contato@evento.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="contact.whatsapp"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            WhatsApp para dúvidas
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
