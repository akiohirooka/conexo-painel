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
    status: "pending" | "approved" | "rejected" | "live"; // 'live' is essentially approved for this context
    location?: string;
    description: string;
    // Specific fields for different types could be added here or kept generic for the list preview
    details?: {
        category?: string;
        salaryRange?: string; // for jobs
        eventDate?: string; // for events
        website?: string;
        phone?: string;
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
        description: "Uma cafeteria aconchegante no centro da cidade, especializada em grãos especiais e doces artesanais.",
        details: {
            category: "Alimentação",
            website: "https://cafeteriacentral.com.br",
            phone: "(11) 99999-9999",
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
        description: "O maior evento de tecnologia do sul do Brasil, reunindo startups, investidores e palestrantes internacionais.",
        details: {
            category: "Tecnologia",
            eventDate: "2024-11-20T08:00:00Z",
            website: "https://websummitfloripa.com.br",
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
        description: "Estamos buscando um desenvolvedor Frontend experiente em React, Next.js e Tailwind CSS para liderar nossa equipe de produtos.",
        details: {
            category: "Desenvolvimento",
            salaryRange: "R$ 12.000 - R$ 15.000",
            website: "https://techsolutions.com/careers",
        },
    },
    {
        id: "4",
        title: "Padaria do Bairro",
        type: "business",
        author: {
            name: "Carlos Santos",
            email: "carlos.padaria@example.com",
        },
        submittedAt: "2024-05-13T07:00:00Z",
        status: "pending",
        location: "Curitiba, PR",
        description: "Pães frescos todos os dias com receitas tradicionais da família.",
        details: {
            category: "Alimentação",
            phone: "(41) 3333-3333",
        },
    },
    {
        id: "5",
        title: "Workshop de UX Design",
        type: "event",
        author: {
            name: "Ana Costa",
            email: "ana.ux@example.com",
        },
        submittedAt: "2024-05-14T18:20:00Z",
        status: "pending",
        location: "Online",
        description: "Aprenda as melhores práticas de UX Design com especialistas do mercado em um workshop prático de 4 horas.",
        details: {
            category: "Educação",
            eventDate: "2024-06-15T14:00:00Z",
            website: "https://uxworkshop.com.br",
        },
    },
];

export async function getPendingItems(): Promise<PendingItem[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return PENDING_ITEMS;
}

export async function getPendingItemById(id: string): Promise<PendingItem | undefined> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return PENDING_ITEMS.find((item) => item.id === id);
}
