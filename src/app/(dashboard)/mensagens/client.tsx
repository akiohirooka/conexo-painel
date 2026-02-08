"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui-conexo/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { respondToReview } from "@/actions/respond-to-review"
import type { BusinessReview } from "@/lib/types/reviews"
import {
    MessageSquare,
    Star,
    Clock,
    CheckCircle2,
    Loader2,
    Mail,
    Send
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/ui-conexo/empty-state"

interface MensagensClientProps {
    reviews: BusinessReview[]
}

export function MensagensClient({ reviews }: MensagensClientProps) {
    const [selectedReview, setSelectedReview] = useState<BusinessReview | null>(null)
    const [responseText, setResponseText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [localReviews, setLocalReviews] = useState(reviews)

    const handleOpenResponse = (review: BusinessReview) => {
        setSelectedReview(review)
        setResponseText(review.response?.body || "")
    }

    const handleCloseResponse = () => {
        setSelectedReview(null)
        setResponseText("")
    }

    const handleSubmitResponse = async () => {
        if (!selectedReview || !responseText.trim()) return

        setIsSubmitting(true)

        try {
            const result = await respondToReview({
                reviewId: selectedReview.id,
                body: responseText
            })

            if (result.success) {
                toast({
                    title: "Resposta enviada!",
                    description: "Sua resposta foi salva com sucesso.",
                })

                // Update local state
                setLocalReviews(prev => prev.map(r =>
                    r.id === selectedReview.id
                        ? { ...r, hasResponse: true, response: { body: responseText, createdAt: new Date().toISOString() } }
                        : r
                ))

                handleCloseResponse()
            } else {
                toast({
                    title: "Erro",
                    description: typeof result.error === 'string' ? result.error : "Erro ao salvar resposta.",
                    variant: "destructive",
                })
            }
        } catch {
            toast({
                title: "Erro",
                description: "Ocorreu um erro inesperado.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <PageHeader
                title="Mensagens"
                description="Gerencie suas mensagens e reviews."
            />

            <Tabs defaultValue="reviews" className="w-full">
                <TabsList>
                    <TabsTrigger value="contatos" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Contatos
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="gap-2">
                        <Star className="h-4 w-4" />
                        Reviews
                        {localReviews.length > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {localReviews.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="contatos" className="mt-6">
                    <EmptyState
                        icon={Mail}
                        title="Em breve"
                        description="A seção de contatos estará disponível em breve."
                    />
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    {localReviews.length === 0 ? (
                        <EmptyState
                            icon={MessageSquare}
                            title="Nenhum review ainda"
                            description="Quando seus clientes deixarem reviews, eles aparecerão aqui."
                        />
                    ) : (
                        <div className="space-y-4">
                            {localReviews.map((review) => (
                                <Card key={review.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {renderStars(review.rating)}
                                                    <span className="text-sm text-muted-foreground">
                                                        {review.rating}/5
                                                    </span>
                                                </div>
                                                {review.title && (
                                                    <CardTitle className="text-base">{review.title}</CardTitle>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {review.hasResponse ? (
                                                    <Badge variant="default" className="gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Respondido
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Sem resposta
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <CardDescription className="flex items-center gap-2">
                                            <span>{review.authorName}</span>
                                            <span>•</span>
                                            <span>{formatDate(review.createdAt)}</span>
                                            <span>•</span>
                                            <span className="font-medium">{review.businessName}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {review.comment && (
                                            <p className="text-sm text-muted-foreground">
                                                {review.comment}
                                            </p>
                                        )}

                                        {review.response && (
                                            <div className="rounded-lg bg-muted p-4 space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Sua resposta • {formatDate(review.response.createdAt)}
                                                </p>
                                                <p className="text-sm">{review.response.body}</p>
                                            </div>
                                        )}

                                        <Button
                                            variant={review.hasResponse ? "outline" : "default"}
                                            size="sm"
                                            onClick={() => handleOpenResponse(review)}
                                        >
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            {review.hasResponse ? "Editar resposta" : "Responder"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Response Dialog */}
            <Dialog open={!!selectedReview} onOpenChange={(open) => !open && handleCloseResponse()}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedReview?.hasResponse ? "Editar resposta" : "Responder review"}
                        </DialogTitle>
                        <DialogDescription>
                            Responda ao review de {selectedReview?.authorName} sobre {selectedReview?.businessName}.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedReview && (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-muted p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    {renderStars(selectedReview.rating)}
                                </div>
                                {selectedReview.title && (
                                    <p className="font-medium">{selectedReview.title}</p>
                                )}
                                {selectedReview.comment && (
                                    <p className="text-sm text-muted-foreground">{selectedReview.comment}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Escreva sua resposta..."
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    rows={4}
                                    maxLength={2000}
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {responseText.length}/2000
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseResponse}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmitResponse}
                            disabled={isSubmitting || responseText.length < 10}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar resposta
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
