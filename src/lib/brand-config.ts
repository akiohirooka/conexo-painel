import type { Metadata } from 'next'

type LogoPaths = {
  light?: string
  dark?: string
  collapsed?: string
}

type IconPaths = {
  favicon?: string
  apple?: string
  shortcut?: string
}

export type AnalyticsConfig = {
  gtmId?: string
  gaMeasurementId?: string
  facebookPixelId?: string
}

export const site = {
  // INFORMAÇÕES BÁSICAS
  name: 'Conexo - Painel Administrativo',
  shortName: 'Conexo',
  description:
    'Conexo é um portal/marketplace criado para centralizar Negócios, Eventos e Vagas da comunidade brasileira e latino-americana no Japão, substituindo a dependência de grupos desorganizados no Facebook, Instagram e WhatsApp por uma plataforma moderna, organizada e fácil de navegar.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://painel.conexo.jp/',
  author: 'Flowtic (Akio Hirooka)',

  // PALAVRAS-CHAVE
  keywords: [
    'Conexo',
    'Brasileiros no Japão',
    'Latinos no Japão',
    'Brasil no Japão',
    'Marketplace',
    'Portal',
    'Negócios',
    'Eventos',
    'Empregos',
    'Vagas',
    'Comunidade',
    'Japão',
  ],

  // OPEN GRAPH
  ogImage: '/og-image.png',

  // LOGOS
  logo: {
    light: '/images/conexo-full-color.png',
    dark: '/images/conexo-full-color.png',
    collapsed: '/conexo-collapsed.png',
  } as LogoPaths,

  // ÍCONES
  icons: {
    favicon: '/icon-512x512.png',
    apple: '/icon-512x512.png',
    shortcut: '/icon-512x512.png',
  } as IconPaths,

  // REDES SOCIAIS
  socials: {
    twitter: '', // adicione quando tiver o @ oficial
  },

  // SUPORTE
  support: {
    email: 'contato@conexo.jp',
  },

  // ANALYTICS (via .env)
  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  } as AnalyticsConfig,
} as const

export const siteMetadata: Metadata = {
  title: site.name,
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.author }],
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: site.ogImage ? [{ url: site.ogImage }] : undefined,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
  },
  icons: {
    icon: site.icons.favicon,
    apple: site.icons.apple,
    shortcut: site.icons.shortcut,
  },
}
