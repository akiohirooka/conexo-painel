import { UploadBox } from '@/components/UploadBox';
import Link from 'next/link';

export default function RootPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2 text-black">Conexo Painel</h1>
                <p className="text-gray-600 mb-6">Upload Test Page</p>
            </div>

            <UploadBox />

            <Link
                href="/dashboard"
                className="text-blue-600 hover:underline mt-8"
            >
                Go to Dashboard
            </Link>
        </main>
    );
}
