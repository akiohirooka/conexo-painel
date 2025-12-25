import { z } from 'zod'

// --- Shared Schemas ---
const contactSchema = z.object({
    whatsapp: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal('')),
    instagram: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().url("URL inválida").optional().or(z.literal('')),
})

const locationSchema = z.object({
    address: z.string().min(5, "Endereço muito curto"),
    city: z.string().min(2, "Cidade obrigatória"),
    state: z.string().length(2, "Use a sigla do estado (ex: SP)"),
    zipCode: z.string().optional(),
})

const gallerySchema = z.object({
    images: z.array(z.string()).optional(), // URLs (fake)
})

// --- Business Schemas ---
export const businessSchema = z.object({
    type: z.literal('business'),
    // Step 1: Basic
    title: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    category: z.string().min(1, "Selecione uma categoria"),
    description: z.string().min(20, "A descrição deve ser mais detalhada"),
    // Step 2: Location
    location: locationSchema,
    // Step 3: Contact
    contact: contactSchema,
    // Step 4: Extras
    amenities: z.array(z.string()).optional(),
    openingHours: z.string().optional(),
    // Step 5: Gallery
    gallery: gallerySchema,
})

// --- Event Schemas ---
export const eventSchema = z.object({
    type: z.literal('event'),
    // Step 1: Basic
    title: z.string().min(3, "Nome do evento obrigatório"),
    description: z.string().min(20, "Descrição muito curta"),
    category: z.string().optional(),
    // Step 2: Date & Loc
    startDate: z.string().min(1, "Data de início obrigatória"),
    endDate: z.string().optional(),
    startTime: z.string().min(1, "Horário de início obrigatório"),
    location: locationSchema,
    isOnline: z.boolean().default(false),
    // Step 3: Price
    price: z.number().min(0).optional(),
    ticketUrl: z.string().url("URL do ingresso inválida").optional().or(z.literal('')),
    // Step 4: Contact
    organizer: z.string().min(2, "Nome do organizador obrigatório"),
    contact: contactSchema,
    // Step 5: Gallery
    gallery: gallerySchema,
})

// --- Job Schemas ---
export const jobSchema = z.object({
    type: z.literal('job'),
    // Step 1: Basic
    title: z.string().min(3, "Cargo obrigatório"),
    company: z.string().min(2, "Empresa obrigatória"),
    workModel: z.enum(['remote', 'hybrid', 'onsite']),
    // Step 2: Loc & Salary
    location: z.object({
        city: z.string().optional(),
        state: z.string().optional(),
    }).optional(), // Optional for remote
    salary: z.object({
        amount: z.number().min(0).optional(),
        period: z.enum(['hour', 'month', 'year']).default('month'),
        currency: z.string().default('BRL'),
        negotiable: z.boolean().default(false),
    }).optional(),
    // Step 3: Description
    description: z.string().min(50, "Descreva bem a vaga"),
    // Step 4: Reqs & Bens
    requirements: z.array(z.string()).min(1, "Adicione pelo menos 1 requisito"),
    benefits: z.array(z.string()).optional(),
    // Step 5: Contact
    applicationUrl: z.string().url("URL inválida").optional().or(z.literal('')),
    contactEmail: z.string().email("Email inválido").optional().or(z.literal('')),
    // Step 6: Cover
    coverImage: z.string().optional(),
})

// Union type
export const listingSchema = z.discriminatedUnion('type', [
    businessSchema,
    eventSchema,
    jobSchema,
])

export type ListingSchema = z.infer<typeof listingSchema>
export type BusinessSchema = z.infer<typeof businessSchema>
export type EventSchema = z.infer<typeof eventSchema>
export type JobSchema = z.infer<typeof jobSchema>
