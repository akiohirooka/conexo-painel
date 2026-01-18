"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { toast } from "@/hooks/use-toast"
import { createSupportTicket, SupportTicketInput } from "@/actions/create-support-ticket"
import { Loader2, Send, MessageCircle } from "lucide-react"

const categories = [
    { value: "QUESTION", label: "Dúvida" },
    { value: "BUG", label: "Problema / Bug" },
    { value: "SUGGESTION", label: "Sugestão" },
    { value: "OTHER", label: "Outro" },
] as const

export default function FaleConoscoPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    // Initialize category as undefined/empty string to force selection
    const [formData, setFormData] = useState<Partial<SupportTicketInput>>({
        category: undefined,
        message: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.category) {
            toast({
                title: "Campo obrigatório",
                description: "Por favor, selecione um assunto.",
                variant: "destructive",
            })
            return
        }

        if (!formData.message?.trim()) {
            toast({
                title: "Campo obrigatório",
                description: "Por favor, escreva sua mensagem.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            // Find label for the subject
            const selectedCategory = categories.find(c => c.value === formData.category)
            const subject = selectedCategory ? selectedCategory.label : "Contato"

            const result = await createSupportTicket({
                category: formData.category as any,
                subject: subject, // Use category label as subject
                message: formData.message,
            })

            if (result.success) {
                toast({
                    title: "Mensagem enviada!",
                    description: "Recebemos sua mensagem e responderemos em breve.",
                })
                setFormData({ category: undefined, message: "" })
            } else {
                toast({
                    title: "Erro ao enviar",
                    description: typeof result.error === 'string'
                        ? result.error
                        : "Erro ao enviar mensagem. Tente novamente.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro inesperado. Tente novamente.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <PageHeader
                title="Fale Conosco"
                description="Envie sua mensagem, dúvida ou sugestão para nossa equipe."
            />

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Enviar Mensagem
                    </CardTitle>
                    <CardDescription>
                        Preencha o formulário abaixo e responderemos o mais breve possível.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Assunto *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                    setFormData(prev => ({ ...prev, category: value as any }))
                                }
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Selecione o assunto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Mensagem *</Label>
                            <Textarea
                                id="message"
                                placeholder="Descreva sua dúvida, problema ou sugestão em detalhes..."
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData(prev => ({ ...prev, message: e.target.value }))
                                }
                                rows={6}
                                maxLength={5000}
                                required
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {formData.message ? formData.message.length : 0}/5000
                            </p>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar Mensagem
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
