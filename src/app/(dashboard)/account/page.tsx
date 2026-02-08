import { getUserProfile } from "@/actions/user"
import { ProfileForm } from "@/components/account/profile-form"
import { DeleteAccountSection } from "@/components/account/delete-account-section"

export default async function AccountPage() {
    const { success, data } = await getUserProfile()

    if (!success || !data) {
        // Handle error or redirect
        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Minha Conta</h1>
                <div className="rounded-xl border bg-destructive/10 p-6 text-destructive">
                    Erro ao carregar perfil. Tente novamente mais tarde.
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Minha Conta</h1>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold">Perfil</h2>
                        <p className="text-sm text-muted-foreground">
                            Atualize suas informações pessoais e configurações.
                        </p>
                    </div>

                    <ProfileForm
                        defaultValues={{
                            first_name: data.first_name || "",
                            last_name: data.last_name || "",
                            email: data.email,
                            phone: data.phone || ""
                        }}
                    />
                </div>
            </div>

            <DeleteAccountSection />
        </div>
    )
}
