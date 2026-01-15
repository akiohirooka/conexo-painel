'use client';

import { useState } from 'react';

const ENTITIES = ['users', 'business', 'events', 'jobs'];
const TYPES = ['avatar', 'logo', 'cover', 'gallery'];

export function UploadBox() {
    const [file, setFile] = useState<File | null>(null);
    const [entity, setEntity] = useState<string>('users');
    const [type, setType] = useState<string>('avatar');
    const [entityId, setEntityId] = useState<string>('');

    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [resultKey, setResultKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setError(null);
        setResultKey(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('entity', entity);
            formData.append('type', type);

            if (entity !== 'users') {
                if (!entityId) {
                    throw new Error('Entity ID is required for non-user entities');
                }
                formData.append('entityId', entityId);
            }

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setResultKey(data.key);
            setFile(null);
            // Optional: reset other fields or keep them for multiple uploads
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!resultKey) return;

        setDeleting(true);
        setError(null);

        try {
            const body: any = {
                entity,
                type,
                key: resultKey
            };

            if (entity !== 'users') {
                if (!entityId) throw new Error('Entity ID missing for delete');
                body.entityId = entityId;
            }

            const res = await fetch('/api/upload', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Delete failed');
            }

            // Success: clear key
            setResultKey(null);
            alert('File deleted successfully');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow-sm max-w-md bg-white text-black w-full">
            <h2 className="text-lg font-bold mb-4">Upload to R2 (Advanced)</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Entity Select */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Entity</label>
                    <select
                        value={entity}
                        onChange={(e) => setEntity(e.target.value)}
                        className="border p-2 rounded bg-white text-black"
                        disabled={uploading || deleting}
                    >
                        {ENTITIES.map(ent => (
                            <option key={ent} value={ent}>{ent}</option>
                        ))}
                    </select>
                </div>

                {/* Type Select */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border p-2 rounded bg-white text-black"
                        disabled={uploading || deleting}
                    >
                        {TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                {/* Entity ID Input (Conditional) */}
                {entity !== 'users' && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Entity ID</label>
                        <input
                            type="number"
                            value={entityId}
                            onChange={(e) => setEntityId(e.target.value)}
                            placeholder="Enter ID"
                            className="border p-2 rounded text-black"
                            disabled={uploading || deleting}
                            required
                        />
                    </div>
                )}

                {/* File Input */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">File</label>
                    <input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setFile(e.target.files[0]);
                            }
                        }}
                        disabled={uploading || deleting}
                        className="border p-2 rounded"
                    />
                </div>

                <div className="flex gap-2 mt-2">
                    <button
                        type="submit"
                        disabled={!file || uploading || deleting}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex-1"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>

                    {resultKey && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            {deleting ? 'Deleting...' : 'Delete Last'}
                        </button>
                    )}
                </div>
            </form>

            {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded transition-all">
                    Error: {error}
                </div>
            )}

            {resultKey && (
                <div className="mt-4 p-2 bg-green-100 text-green-700 rounded transition-all">
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm break-all font-mono bg-green-200 p-1 rounded mt-1">{resultKey}</p>
                </div>
            )}
        </div>
    );
}
