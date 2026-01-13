// src/routes/admin/categories/CategoryForm.tsx
import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createCategory, updateCategory } from '@/services/sneakerService';
import { useRouter } from '@tanstack/react-router';

interface CategoryFormInput {
    name: string;
    slug: string;
    cover_image: string;
    description: string;
}

interface CategoryFormProps {
    initialData?: CategoryFormInput;
    isEdit: boolean;
    categoryId?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, isEdit, categoryId }) => {
    const navigate = useNavigate();
    const router = useRouter();
    
    const { 
        register, 
        handleSubmit, 
        setValue, 
        watch, 
        formState: { errors, isSubmitting } 
    } = useForm<CategoryFormInput>({ defaultValues: initialData });

    // --- LÓGICA DE AUTO-SLUG ---
    const nameValue = watch("name");

    useEffect(() => {
        // Solo generamos el slug automáticamente si NO estamos editando 
        // o si el campo slug está vacío (para no romper SEO en categorías existentes)
        if (!isEdit && nameValue) {
            const generatedSlug = nameValue
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            
            setValue("slug", generatedSlug, { shouldValidate: true });
        }
    }, [nameValue, setValue, isEdit]);

    const onSubmit: SubmitHandler<CategoryFormInput> = async (data) => {
        try {
            if (isEdit && categoryId) {
                await updateCategory(categoryId, data);
            } else {
                await createCategory(data);
            }
            await router.invalidate(); 
            navigate({ to: '/admin/categories' });
        } catch (error) {
            alert("Error al guardar la categoría");
        }
    }

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
                    <Input 
                        id="name" 
                        placeholder="e.g. Running"
                        {...register("name", { required: "Name is required" })} 
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug" className="flex justify-between">
                        Slug* <span className="text-[10px] text-slate-400 uppercase font-bold">Automatic Sync On</span>
                    </Label>
                    <Input 
                        id="slug" 
                        className="bg-slate-50 font-mono text-sm" // Estilo ligeramente diferente para indicar que es "especial"
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

                <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-lg font-bold">
                    {isSubmitting ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
                </Button>
            </form>
        </div>
    );
};

export default CategoryForm;