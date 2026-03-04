// src/routes/admin/sneakers/index.lazy.tsx
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { Plus, Pencil, Trash2, Tag, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteSneaker } from '@/services/sneakerService';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';

// Fíjate que aquí usamos createLazyFileRoute y NO hay loader
export const Route = createLazyFileRoute('/admin/sneakers/')({
    component: SneakerListPage,
});

function SneakerListPage() {
    const sneakers = Route.useLoaderData(); // Ahora sí recibirá los datos del index.tsx
    const router = useRouter();

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Delete ${title}?`)) {
            try {
                await deleteSneaker(id);
                await router.invalidate();
                alert("Deleted!");
            } catch (error) {
                alert("Error deleting");
            }
        }
    };

    if (!sneakers || sneakers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold">No Sneakers Found</h2>
                <p className="text-gray-500 mt-2 mb-6">Start by creating a new sneaker.</p>
                <Link
                    to="/admin/sneakers/create"
                    className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    Create First Sneaker
                </Link>
            </div>
        );
    }

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopyId = async (id: string) => {
        try {
            await navigator.clipboard.writeText(id);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1500);
        } catch (err) {
            alert("Failed to copy ID");
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Sneaker Management ({sneakers.length})
                </h1>
                <Link
                    to="/admin/sneakers/create"
                    className="flex items-center bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Sneaker
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand / Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sneakers.map((sneaker) => (
                            <tr key={sneaker.id}>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-20 w-20">
                                            <img
                                                className="h-20 w-20 rounded-lg object-cover bg-gray-100"
                                                src={sneaker.main_image_url || 'https://via.placeholder.com/80'}
                                                alt={sneaker.title}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-1">{sneaker.title}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                                ID: {sneaker.id?.substring(0, 8) || 'No ID'}...
                                                <button onClick={() => handleCopyId(sneaker.id)} className="text-amber-600 font-bold">+</button>
                                                {copiedId === sneaker.id && <span className="text-green-600">Copied!</span>}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">${sneaker.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 flex items-center"><Tag className="w-3 h-3 mr-1" /> {sneaker.brand?.name || 'N/A'}</span>
                                        <span className="text-xs">Cat ID: {sneaker.category_id?.substring(0, 5) || 'N/A'}...</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {sneaker.is_new ? (
                                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium flex items-center w-fit">
                                            <Zap className="w-3 h-3 mr-1" /> New
                                        </span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium">Standard</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                    <Link to="/admin/sneakers/$sneakerId/edit" params={{ sneakerId: sneaker.id }} className="text-amber-600 hover:text-amber-900">
                                        <Pencil className="w-4 h-4 inline" />
                                    </Link>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(sneaker.id, sneaker.title)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}