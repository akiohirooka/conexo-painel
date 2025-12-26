export type ListingType = "business" | "event" | "job";

export interface PendingItem {
    id: string;
    title: string;
    type: ListingType;
    author: {
        name: string;
        email: string;
        image?: string;
    };
    submittedAt: string; // ISO Date string
    status: "pending" | "approved" | "rejected" | "live";
    location?: string;
    description: string;

    // Richer details object matching our new Schema
    details?: {
        // Business
        category?: string;
        contact?: {
            whatsapp?: string;
            instagram?: string;
            phone?: string;
            website?: string;
            email?: string;
        };
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
        };

        // Event
        eventDate?: string;
        startTime?: string;
        isOnline?: boolean;
        ticketPrice?: number;
        ticketUrl?: string;

        // Job
        company?: string;
        workModel?: 'onsite' | 'hybrid' | 'remote';
        salary?: {
            amount: number;
            period: 'hour' | 'month' | 'year';
            negotiable: boolean;
        };
        requirements?: string[];
        benefits?: string[];
    };
}

export const PENDING_ITEMS: PendingItem[] = [
    {
        id: "1",
        title: "Cafeteria Central",
        type: "business",
        author: {
            name: "João Silva",
            email: "joao.silva@example.com",
        },
        submittedAt: "2024-05-10T14:30:00Z",
        status: "pending",
        location: "São Paulo, SP",
        description: "Uma cafeteria aconchegante no centro da cidade, especializada em grãos especiais e doces artesanais. Oferecemos ambiente para co-working e wi-fi gratuito.",
        details: {
            category: "Alimentação",
            contact: {
                whatsapp: "(11) 99999-9999",
                instagram: "@cafecentralsps",
                website: "https://cafeteriacentral.com.br"
            },
            address: {
                street: "Rua Augusta, 1000",
                city: "São Paulo",
                state: "SP",
                zipCode: "01305-100"
            }
        },
    },
    {
        id: "2",
        title: "Web Summit Floripa 2024",
        type: "event",
        author: {
            name: "Maria Oliveira",
            email: "maria.eventos@example.com",
        },
        submittedAt: "2024-05-11T09:15:00Z",
        status: "pending",
        location: "Florianópolis, SC",
        description: "O maior evento de tecnologia do sul do Brasil, reunindo startups, investidores e palestrantes internacionais. Networking, palestras e feira de negócios.",
        details: {
            eventDate: "2024-11-20T08:00:00Z",
            startTime: "09:00",
            ticketPrice: 450.00,
            ticketUrl: "https://websummitfloripa.com.br/ingressos",
            isOnline: false,
            address: {
                street: "Centro Sul",
                city: "Florianópolis",
                state: "SC"
            }
        },
    },
    {
        id: "3",
        title: "Desenvolvedor Frontend Sênior",
        type: "job",
        author: {
            name: "Tech Solutions",
            email: "rh@techsolutions.com",
        },
        submittedAt: "2024-05-12T16:45:00Z",
        status: "pending",
        location: "Remoto",
        description: "Estamos buscando um desenvolvedor Frontend experiente em React, Next.js e Tailwind CSS para liderar nossa equipe de produtos. Você trabalhará em projetos desafiadores e escaláveis.",
        details: {
            company: "Tech Solutions",
            workModel: "remote",
            salary: {
                amount: 15000,
                period: "month",
                negotiable: true
            },
            requirements: [
                "5+ anos de experiência com React",
                "Domínio de TypeScript e Next.js",
                "Experiência com Testes (Jest/Cypress)",
                "Inglês Avançado"
            ],
            benefits: [
                "Plano de Saúde Internacional",
                "Stock Options",
                "Auxílio Home Office",
                "Gympass"
            ]
        },
    },
];

export async function getPendingItems(): Promise<PendingItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return PENDING_ITEMS;
}

export async function getPendingItemById(id: string): Promise<PendingItem | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return PENDING_ITEMS.find((item) => item.id === id);
}
