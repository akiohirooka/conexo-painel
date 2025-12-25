"use client"

import { useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Mail, Phone, Instagram, Globe, MessageCircle } from 'lucide-react'

export function BusinessContactStep() {
    const { control } = useFormContext()

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Contatos</h3>
                <p className="text-sm text-muted-foreground">Como os clientes entram em contato?</p>
            </div>

            <div className="grid gap-6">
                <FormField
                    control={control}
                    name="contact.whatsapp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-green-500" />
                                WhatsApp
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="(11) 99999-9999" {...field} />
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
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="contato@empresa.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="contact.instagram"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-pink-500" />
                                Instagram
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="@seu_negocio" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="contact.phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Telefone Fixo
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="(11) 3333-3333" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="contact.website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Site
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
