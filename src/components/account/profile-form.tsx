"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateUserProfile } from "@/actions/user"

const profileFormSchema = z.object({
    first_name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    last_name: z.string().min(2, {
        message: "O sobrenome deve ter pelo menos 2 caracteres.",
    }),
    email: z.string().email().optional(),
    phone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
    defaultValues: {
        first_name: string
        last_name: string
        email: string
        phone?: string
    }
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
    })

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true)

        try {
            const result = await updateUserProfile({
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
            })

            if (result.success) {
                toast({
                    title: "Sucesso",
                    description: "Perfil atualizado com sucesso!",
                })
            } else {
                toast({
                    title: "Erro",
                    description: result.error || "Algo deu errado.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao atualizar o perfil.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu nome" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sobrenome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Seu sobrenome" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} disabled />
                            </FormControl>
                            <FormDescription>
                                O email não pode ser alterado diretamente.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Celular</FormLabel>
                            <FormControl>
                                <Input placeholder="(00) 00000-0000" {...field} />
                            </FormControl>
                            <FormDescription>
                                Seu número de contato principal.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Atualizar perfil
                </Button>
            </form>
        </Form>
    )
}
