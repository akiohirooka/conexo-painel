"use client"

import { PageHeader } from "@/components/ui-conexo/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui-conexo/empty-state"
import type { UserReview } from "@/lib/types/reviews"
import { Star, MessageSquare, CheckCircle2, Clock, Building2, Calendar, Briefcase } from "lucide-react"

interface MeusReviewsClientProps {
    reviews: UserReview[]
}

export function MeusReviewsClient({ reviews }: MeusReviewsClientProps) {
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

    const getItemTypeIcon = (itemType: string) => {
        switch (itemType) {
            case 'BUSINESS':
                return <Building2 className="h-4 w-4" />
            case 'EVENT':
                return <Calendar className="h-4 w-4" />
            case 'JOB':
                return <Briefcase className="h-4 w-4" />
            default:
                return <Building2 className="h-4 w-4" />
        }
    }

    const getItemTypeLabel = (itemType: string) => {
        switch (itemType) {
            case 'BUSINESS':
                return 'Negócio'
            case 'EVENT':
                return 'Evento'
            case 'JOB':
                return 'Vaga'
            default:
                return 'Item'
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <PageHeader
                title="Meus Reviews"
                description="Reviews que você escreveu sobre negócios, eventos e vagas."
            />

            {reviews.length === 0 ? (
                <EmptyState
                    icon={Star}
                    title="Nenhum review ainda"
                    description="Quando você avaliar negócios, eventos ou vagas, seus reviews aparecerão aqui."
                />
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
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
                                                Aguardando
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <CardDescription className="flex items-center gap-2">
                                    {getItemTypeIcon(review.itemType)}
                                    <span className="font-medium">{review.itemName}</span>
                                    <span>•</span>
                                    <Badge variant="outline" className="text-xs">
                                        {getItemTypeLabel(review.itemType)}
                                    </Badge>
                                    <span>•</span>
                                    <span>{formatDate(review.createdAt)}</span>
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
                                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                            <MessageSquare className="h-3 w-3" />
                                            Resposta do estabelecimento • {formatDate(review.response.createdAt)}
                                        </p>
                                        <p className="text-sm">{review.response.body}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
