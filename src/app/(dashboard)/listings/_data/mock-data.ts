export type Status = 'active' | 'pending' | 'archived' | 'rejected'

export interface Business {
    id: string
    title: string
    category: string
    location: string
    status: Status
    views: number
    updatedAt: string
}

export interface Event {
    id: string
    title: string
    date: string
    location: string
    status: Status
    registrations: number
    updatedAt: string
}

export interface Job {
    id: string
    title: string
    type: string
    location: string
    status: Status
    applicants: number
    updatedAt: string
}

export const mockBusinesses: Business[] = [
    {
        id: "BUS-001",
        title: "Café Colonial da Serra",
        category: "Alimentação",
        location: "Gramado, RS",
        status: "active",
        views: 1250,
        updatedAt: "2024-03-20",
    },
    {
        id: "BUS-002",
        title: "Tech Solutions Ltda",
        category: "Tecnologia",
        location: "São Paulo, SP",
        status: "active",
        views: 850,
        updatedAt: "2024-03-19",
    },
    {
        id: "BUS-003",
        title: "Estúdio de Yoga Zen",
        category: "Saúde e Bem-estar",
        location: "Rio de Janeiro, RJ",
        status: "pending",
        views: 45,
        updatedAt: "2024-03-21",
    },
    {
        id: "BUS-004",
        title: "Mercado do Bairro",
        category: "Varejo",
        location: "Curitiba, PR",
        status: "archived",
        views: 2300,
        updatedAt: "2024-02-15",
    },
    {
        id: "BUS-005",
        title: "Consultoria Financeira Elite",
        category: "Serviços",
        location: "São Paulo, SP",
        status: "rejected",
        views: 10,
        updatedAt: "2024-03-21",
    },
]

export const mockEvents: Event[] = [
    {
        id: "EVT-001",
        title: "Workshop de React Avançado",
        date: "2024-04-15",
        location: "Online",
        status: "active",
        registrations: 145,
        updatedAt: "2024-03-20",
    },
    {
        id: "EVT-002",
        title: "Feira de Gastronomia Local",
        date: "2024-05-01",
        location: "Gramado, RS",
        status: "active",
        registrations: 50,
        updatedAt: "2024-03-18",
    },
    {
        id: "EVT-003",
        title: "Meetup de Startups",
        date: "2024-04-10",
        location: "São Paulo, SP",
        status: "pending",
        registrations: 0,
        updatedAt: "2024-03-21",
    },
    {
        id: "EVT-004",
        title: "Curso de Fotografia",
        date: "2024-05-20",
        location: "Rio de Janeiro, RJ",
        status: "archived",
        registrations: 12,
        updatedAt: "2024-02-01",
    },
]

export const mockJobs: Job[] = [
    {
        id: "JOB-001",
        title: "Desenvolvedor Frontend Senior",
        type: "Remoto",
        location: "Brasil",
        status: "active",
        applicants: 45,
        updatedAt: "2024-03-20",
    },
    {
        id: "JOB-002",
        title: "Gerente de Projetos",
        type: "Híbrido",
        location: "São Paulo, SP",
        status: "active",
        applicants: 12,
        updatedAt: "2024-03-19",
    },
    {
        id: "JOB-003",
        title: "Designer UI/UX",
        type: "Presencial",
        location: "Curitiba, PR",
        status: "pending",
        applicants: 5,
        updatedAt: "2024-03-21",
    },
    {
        id: "JOB-004",
        title: "Estagiário de Marketing",
        type: "Presencial",
        location: "Porto Alegre, RS",
        status: "archived",
        applicants: 89,
        updatedAt: "2024-01-15",
    },
]
