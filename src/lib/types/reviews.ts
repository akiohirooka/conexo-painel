export interface BusinessReview {
  id: string
  rating: number
  title: string | null
  comment: string | null
  authorName: string | null
  createdAt: string
  businessId: string
  businessName: string
  hasResponse: boolean
  response: {
    body: string
    createdAt: string
  } | null
}

export interface UserReview {
  id: string
  rating: number
  title: string | null
  comment: string | null
  itemType: string
  itemName: string
  createdAt: string
  hasResponse: boolean
  response: {
    body: string
    createdAt: string
  } | null
}

export interface UserStats {
  reviewsCount: number
  favoritesCount: number
}
