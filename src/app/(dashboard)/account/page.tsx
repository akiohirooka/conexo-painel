export default function AccountPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Minha Conta</h1>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                    <p className="text-muted-foreground">Configurações da conta.</p>
                </div>
            </div>
        </div>
    )
}
