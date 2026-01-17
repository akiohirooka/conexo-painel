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
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
})

// Gallery is now a direct array of image URLs (max 5)

// --- Business Schemas ---
export const businessSchema = z.object({
    type: z.literal('business'),
    // Step 1: Basic
    title: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    category: z.string().min(1, "Selecione uma categoria"),
    subcategory: z.array(z.string()).default([]),
    description: z.string().min(20, "A descrição deve ser mais detalhada"),
    siteUrl: z.string().url("URL inválida").optional().or(z.literal('')),
    isPublished: z.boolean().default(false), // Toggle
    // Step 2: Location
    location: locationSchema,
    // Step 3: Contact (Dynamic)
    contactsData: z.array(z.object({
        type: z.enum(['whatsapp', 'phone', 'email', 'instagram', 'website', 'facebook', 'linkedin', 'other']),
        value: z.string().min(1, "Preencha o contato"),
        responsible: z.string().optional()
    })).default([]),
    // Step 4: Hours (Dynamic)
    openingHoursData: z.array(z.object({
        days: z.array(z.number()), // 0-6 (Sun-Sat)
        start: z.string(),
        end: z.string()
    })).default([]),
    // Step 5: Media
    logo: z.string().nullable().optional(),
    coverImage: z.string().nullable().optional(),
    galleryImages: z.array(z.string()).optional().default([]),

    // Legacy/Optional placeholders if strictly needed by UI before migration
    // Extras
    operatingModes: z.array(z.string()).default([]),
    serviceLanguages: z.array(z.string()).default([]),
    paymentMethods: z.array(z.string()).default([]),
    specialties: z.array(z.string()).default([]),
    amenities: z.array(z.string()).default([]), // Now tag based
    contact: contactSchema.optional(), // Legacy support or just use dynamic
})

// --- Event Schemas ---
export const eventSchema = z.object({
    type: z.literal('event'),
    // Organizer (required - links to a business)
    organizerId: z.string().min(1, "Selecione o organizador do evento"),
    // Step 1: Basic
    title: z.string().min(3, "Nome do evento obrigatório"),
    description: z.string().min(20, "Descrição muito curta"),
    // Step 2: Date & Location
    startDate: z.string().min(1, "Data de início obrigatória"),
    endDate: z.string().optional(),
    startTime: z.string().min(1, "Horário de início obrigatório"),
    endTime: z.string().optional(),
    eventMode: z.enum(['presencial', 'online', 'hybrid']).default('presencial'),
    location: locationSchema.partial(), // Location optional for online events
    // Step 2: Price & Tickets
    price: z.number().min(0).optional(),
    priceCurrency: z.string().default("JPY"),
    ticketUrl: z.string().optional(),
    // Step 3: Contact (Dynamic - same pattern as business)
    contactsData: z.array(z.object({
        type: z.enum(['whatsapp', 'phone', 'email', 'instagram', 'website', 'facebook', 'linkedin', 'other']),
        value: z.string().min(1, "Preencha o contato"),
        responsible: z.string().optional()
    })).default([]),
    // Step 4: Media
    coverImage: z.string().nullable().optional(),
    galleryImages: z.array(z.string()).default([]),
    // Control
    isPublished: z.boolean().default(false),
})

// --- Job Schemas ---
export const jobSchema = z.object({
    type: z.literal('job'),
    // Contratante (required - links to a business)
    contractorId: z.string().min(1, "Selecione o contratante"),
    // Step 1: Basic
    title: z.string().min(3, "Cargo obrigatório"),
    companyName: z.string().optional(),
    category: z.string().optional(),
    employmentType: z.string().optional(), // CLT, PJ, Freelancer, etc.
    workModel: z.enum(['remote', 'hybrid', 'onsite']).default('onsite'),
    // Step 2: Location & Salary
    location: z.object({
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
    }).optional(),
    salary: z.object({
        amount: z.number().min(0).optional(),
        unit: z.enum(['hour', 'month', 'year']).default('month'),
        currency: z.string().default('JPY'),
        negotiable: z.boolean().default(false),
    }).optional(),
    // Step 3: Description
    description: z.string().min(20, "Descrição muito curta"),
    // Step 4: Requirements
    requirements: z.array(z.string()).default([]),
    benefits: z.array(z.string()).default([]),
    // Step 5: Contacts (Dynamic)
    contactsData: z.array(z.object({
        type: z.enum(['whatsapp', 'phone', 'email', 'instagram', 'website', 'facebook', 'linkedin', 'other']),
        value: z.string().min(1, "Preencha o contato"),
        responsible: z.string().optional()
    })).default([]),
    applicationUrl: z.string().url("URL inválida").optional().or(z.literal('')),
    contactEmail: z.string().email("Email inválido").optional().or(z.literal('')),
    // Step 6: Media
    coverImage: z.string().nullable().optional(),
    galleryImages: z.array(z.string()).default([]),
    // Control
    isPublished: z.boolean().default(false),
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
