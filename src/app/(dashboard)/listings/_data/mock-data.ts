export type Status = 'active' | 'pending' | 'archived' | 'rejected'
export type WorkModel = 'onsite' | 'hybrid' | 'remote'
export type SalaryPeriod = 'hour' | 'month' | 'year'

export interface ContactInfo {
    whatsapp?: string
    email?: string
    instagram?: string
    phone?: string
    website?: string
}

export interface LocationInfo {
    zipCode?: string
    address?: string
    city?: string
    state?: string
}

export interface Business {
    id: string
    title: string
    category: string
    description?: string
    location: LocationInfo
    contact: ContactInfo
    status: Status
    views: number
    updatedAt: string
}

export interface Event {
    id: string
    title: string
    description?: string
    date: string
    startTime?: string
    isOnline?: boolean
    location?: LocationInfo
    price?: number
    ticketUrl?: string
    status: Status
    registrations: number
    updatedAt: string
}

export interface Job {
    id: string
    title: string
    company: string
    workModel: WorkModel
    location?: LocationInfo
    salary?: {
        amount: number
        period: SalaryPeriod
        negotiable: boolean
    }
    requirements: string[]
    benefits: string[]
    status: Status
    applicants: number
    updatedAt: string
}

export const mockBusinesses: Business[] = [
    {
        id: "BUS-001",
        title: "Café Colonial da Serra",
        category: "Alimentação",
        description: "O melhor café colonial da região, com produtos artesanais e ambiente acolhedor.",
        location: {
            city: "Gramado",
            state: "RS",
            address: "Av. das Hortênsias, 1234"
        },
        contact: {
            whatsapp: "(54) 99999-9999",
            instagram: "@cafecolonial",
            email: "contato@cafe.com.br"
        },
        status: "active",
        views: 1250,
        updatedAt: "2024-03-20",
    },
    {
        id: "BUS-002",
        title: "Tech Solutions Ltda",
        category: "Tecnologia",
        location: {
            city: "São Paulo",
            state: "SP",
            address: "Av. Paulista, 1000"
        },
        contact: {
            website: "https://techsolutions.com.br",
            email: "contato@tech.com"
        },
        status: "active",
        views: 850,
        updatedAt: "2024-03-19",
    },
    {
        id: "BUS-003",
        title: "Estúdio de Yoga Zen",
        category: "Saúde e Bem-estar",
        location: {
            city: "Rio de Janeiro",
            state: "RJ"
        },
        contact: {
            whatsapp: "(21) 98888-8888"
        },
        status: "pending",
        views: 45,
        updatedAt: "2024-03-21",
    },
]

export const mockEvents: Event[] = [
    {
        id: "EVT-001",
        title: "Workshop de React Avançado",
        date: "2024-04-15",
        startTime: "14:00",
        isOnline: true,
        description: "Aprenda patterns avançados de React com especialistas.",
        price: 150.00,
        ticketUrl: "https://sympla.com.br/workshop-react",
        status: "active",
        registrations: 145,
        updatedAt: "2024-03-20",
    },
    {
        id: "EVT-002",
        title: "Feira de Gastronomia Local",
        date: "2024-05-01",
        isOnline: false,
        location: {
            city: "Gramado",
            state: "RS",
            address: "Rua Coberta"
        },
        status: "active",
        registrations: 50,
        updatedAt: "2024-03-18",
    },
    {
        id: "EVT-003",
        title: "Meetup de Startups",
        date: "2024-04-10",
        location: {
            city: "São Paulo",
            state: "SP"
        },
        status: "pending",
        registrations: 0,
        updatedAt: "2024-03-21",
    },
]

export const mockJobs: Job[] = [
    {
        id: "JOB-001",
        title: "Desenvolvedor Frontend Senior",
        company: "Tech Corp",
        workModel: "remote",
        salary: {
            amount: 15000,
            period: 'month',
            negotiable: false
        },
        requirements: ["React", "TypeScript", "Next.js", "5+ anos de xp"],
        benefits: ["Plano de Saúde", "VR", "Gympass"],
        location: {
            city: "Brasil",
            state: ""
        },
        status: "active",
        applicants: 45,
        updatedAt: "2024-03-20",
    },
    {
        id: "JOB-002",
        title: "Gerente de Projetos",
        company: "Consultoria ABC",
        workModel: "hybrid",
        location: {
            city: "São Paulo",
            state: "SP"
        },
        requirements: ["PMP", "Scrum", "Inglês Fluente"],
        benefits: ["PLR", "Seguro de Vida"],
        status: "active",
        applicants: 12,
        updatedAt: "2024-03-19",
    },
    {
        id: "JOB-003",
        title: "Designer UI/UX",
        company: "Creative Studio",
        workModel: "onsite",
        location: {
            city: "Curitiba",
            state: "PR"
        },
        requirements: ["Figma", "Design System"],
        benefits: [],
        status: "pending",
        applicants: 5,
        updatedAt: "2024-03-21",
    },
]
