// src/routes/admin/categories/CategoryForm.tsx

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Tipado del Formulario (basado en CategoryCreate y CategoryUpdate)
interface CategoryFormInput {
    name: string;
    slug: string;
    cover_image: string;
    description: string;
}

interface CategoryFormProps {
    initialData?: CategoryFormInput; // Datos para la edición
    isEdit: boolean;
    categoryId?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, isEdit, categoryId }) => {
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm<CategoryFormInput>({ defaultValues: initialData });

    const onSubmit: SubmitHandler<CategoryFormInput> = async (data) => {
    // ⚠️ Opcional: Si el slug está vacío, generar uno a partir del nombre
    const cleanedSlug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const payload = {
        name: data.name,
        slug: cleanedSlug,
        cover_image: data.cover_image || null,
        description: data.description || null,
    };

    try {
        if (isEdit) {
            // ⚠️ TODO: Llamada PUT/PATCH con el payload
            console.log("UPDATE payload:", payload);
            alert(`Updating category ${categoryId} (simulated)...`);
        } else {
            // ⚠️ TODO: Llamada POST con el payload
            console.log("CREATE payload:", payload);
            alert('Creating new category (simulated)...');
        }
        navigate({ to: '/admin/categories' });
    } catch (error) {
        console.error("API Error:", error);
    }
};

    return (
        <div className="max-w-xl mx-auto">
            <Link to="/admin/categories" className="flex items-center text-amber-600 mb-6 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Category List
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {isEdit ? `Edit Category: ${initialData?.name}` : 'Create New Category'}
            </h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name*</Label>
                    <Input id="name" {...register("name", { required: "Name is required" })} />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">Slug* (e.g., running-shoes)</Label>
                    <Input 
                        id="slug" 
                        {...register("slug", { 
                            required: "Slug is required",
                            pattern: {
                                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                message: "Slug must be lowercase, alphanumeric, and use hyphens."
                            }
                        })} 
                    />
                    {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cover_image">Cover Image URL</Label>
                    <Input id="cover_image" {...register("cover_image")} />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={3} {...register("description")} />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-lg">
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
                </Button>
            </form>
        </div>
    );
};

export default CategoryForm;