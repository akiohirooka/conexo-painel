export type CategoryWithSubs = {
  id: number
  name: string
  slug: string
  subcategories: {
    id: number
    name: string
    slug: string
  }[]
}
