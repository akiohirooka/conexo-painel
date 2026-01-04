# Guia de Deploy na Vercel

Este guia ajudará você a implantar o projeto **conexo-painel** na Vercel.

## Pré-requisitos

1.  Uma conta na [Vercel](https://vercel.com/).
2.  O projeto enviado para um repositório Git (GitHub, GitLab ou Bitbucket).

## Passos para Deploy

1.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard) e clique em **"Add New..."** -> **"Project"**.
2.  Importe o repositório Git do projeto `conexo-painel`.
3.  Configure o projeto:
    *   **Framework Preset**: Next.js (deve ser detectado automaticamente).
    *   **Root Directory**: `./` (padrão).
    *   **Build Command**: `prisma generate && next build` (ou o padrão do `package.json` será usado).
    *   **Install Command**: `npm install` (padrão).

4.  **Importante**: Antes de clicar em "Deploy", você DEVE configurar as **Environment Variables** (Variáveis de Ambiente).

## Variáveis de Ambiente Necessárias

Expanda a seção "Environment Variables" e adicione as seguintes chaves. Os valores devem corresponder aos do seu arquivo `.env` local ou de produção.

### Autenticação (Clerk)
*   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Sua chave pública do Clerk.
*   `CLERK_SECRET_KEY`: Sua chave secreta do Clerk.
*   `CLERK_WEBHOOK_SECRET`: Secret para webhooks (se configurado).
*   `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: `/sign-in`
*   `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: `/sign-up`
*   `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: `/dashboard`
*   `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: `/dashboard`

### Banco de Dados (Neon / Postgres)
*   `DATABASE_URL`: A string de conexão do seu banco de dados PostgreSQL (ex: Neon).
    *   *Nota: Certifique-se de que o banco de dados é acessível externamente.*

### Aplicação
*   `NEXT_PUBLIC_APP_URL`: A URL final da sua aplicação na Vercel (ex: `https://seu-projeto.vercel.app`).
    *   *Nota: No primeiro deploy, você pode não saber a URL exata. Você pode colocar uma temporária e atualizar depois nas configurações do projeto.*

### Admin
*   `ADMIN_EMAILS`: Lista de emails separados por vírgula (ex: `seu@email.com`).
*   `ADMIN_USER_IDS`: (Opcional) IDs de usuário do Clerk.

### Serviços Externos (Se estiver usando)
*   `BLOB_READ_WRITE_TOKEN`: Se usar Vercel Blob para upload de imagens.
*   `OPENROUTER_API_KEY`: Se usar funcionalidades de IA.
*   `NEXT_PUBLIC_GTM_ID`: Google Tag Manager ID (opcional).
*   `NEXT_PUBLIC_GA_ID`: Google Analytics 4 ID (opcional).

## Deploy

Após adicionar as variáveis, clique em **"Deploy"**. A Vercel iniciará o processo de build.

Se houver erros de build relacionados ao banco de dados, verifique se a variável `DATABASE_URL` está correta e se o banco de dados está acessível. O comando `prisma generate` roda automaticamente durante o build para gerar o cliente Prisma.
