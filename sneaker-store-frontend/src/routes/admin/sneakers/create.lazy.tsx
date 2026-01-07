// src/routes/admin/sneakers/create.lazy.tsx

import React from 'react';
import { createLazyFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useForm, useFieldArray, type SubmitHandler, Controller } from 'react-hook-form';
import { type SneakerFormData, type FormSize, type FormImage } from '../../../../../sneaker-store-backend/src/types/admin'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchAllBrands, fetchAllCategories, createSneaker, type Brand, type Category } from '@/services/sneakerService';

// ----------------------------------------------------
// 1. DEFINICIÓN DEL TIPO DE DATOS DEL LOADER
// ----------------------------------------------------
interface CreateLoaderData {
    brandOptions: Brand[];
    categoryOptions: Category[];
}

// Tipo para un detalle destacado (asumo que es un string, si es un objeto con key/value se ajusta)
type FormFeaturedDetail = string; 

// --- VALORES INICIALES ---
const defaultSize: FormSize = { us_size: 7.0, eu_size: null, uk_size: null, quantity: 10 };
const defaultImage: FormImage = { image_url: "", order: 1 };
const defaultFeaturedDetail: FormFeaturedDetail = ""; // Valor por defecto: string vacío

const defaultValues: SneakerFormData = {
    title: "",
    description: "",
    price: 0,
    main_image_url: "",
    brand_id: "",
    category_id: "",
    sport: null,
    gender: 'unisex',
    release_date: new Date().toISOString().split('T')[0], 
    is_new: true,
    sizes: [defaultSize],
    images: [defaultImage],
    featured_details: [defaultFeaturedDetail],
};

// Define la ruta con un loader real
export const Route = createLazyFileRoute('/admin/sneakers/create')({
    // ----------------------------------------------------
    // LOADER REAL: Obtiene marcas y categorías de la API
    // ----------------------------------------------------
    loader: async (): Promise<CreateLoaderData> => {
        const [brandOptions, categoryOptions] = await Promise.all([
            fetchAllBrands(),
            fetchAllCategories(),
        ]);
        return { brandOptions, categoryOptions };
    },
    
    // El componente se renderizará una vez que el loader esté listo
    component: SneakerFormPage,

    // Componentes de estado/error (opcional, pero buena práctica)
    pendingComponent: () => (
        <div className="p-12 text-center text-amber-700 font-medium">
            ⏳ Cargando opciones de formulario...
        </div>
    ),
    errorComponent: ({ error }) => (
        <div className="text-red-600 p-6 bg-red-50 rounded-lg max-w-xl mx-auto mt-10 shadow-md">
            <h2 className="font-bold text-xl">❌ Error al cargar recursos</h2>
            <p className="mt-2">No se pudieron obtener las marcas/categorías. Detalles: {error.message}</p>
        </div>
    ),
});

/// --- COMPONENTE PRINCIPAL ---
function SneakerFormPage() {
    // 💡 USAMOS useLoaderData para obtener las opciones cargadas
    const { brandOptions, categoryOptions } = Route.useLoaderData();
    
    const { 
        register, 
        control, 
        handleSubmit, 
        setValue, 
        formState: { errors, isSubmitting } 
    } = useForm<SneakerFormData>({ defaultValues });
    
    const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: "sizes" });
    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: "images" });
    const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({ control, name: "featured_details" });


    const onSubmit: SubmitHandler<SneakerFormData> = async (data) => {
        // --- PREPARACIÓN DEL PAYLOAD REAL ---
        const payload = {
            ...data,
            // Conversiones necesarias antes de enviar a la API
            price: parseFloat(data.price.toString()), 
            brand_id: data.brand_id as string, 
            category_id: data.category_id as string, 
            release_date: data.release_date ? new Date(data.release_date).toISOString() : null,
            
            // Filtramos detalles vacíos y tallas con US Size inválido
            featured_details: data.featured_details.filter(d => d && d.trim().length > 0),
            sizes: data.sizes.filter(s => s.us_size !== null && s.us_size > 0),
        };
        
        try {
            // 💡 LLAMADA A LA API REAL (createSneaker debe estar definida en sneakerService)
            const response = await createSneaker(payload);
            console.log("Sneaker creado exitosamente:", response);
            alert("Sneaker created successfully! ID: " + response.id);
        } catch (error) {
            console.error("API Error:", error);
            alert("Error al crear sneaker. Revisa la consola para detalles.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Link to="/admin/sneakers" className="flex items-center text-amber-600 mb-6 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sneaker List
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Sneaker</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg space-y-8">
                
                {/* --- SECCIÓN 1: DETALLES BÁSICOS --- */}
                <h2 className="text-2xl font-semibold border-b pb-2">Basic Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title", { required: "Title is required" })} />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" type="number" step="0.01" {...register("price", { required: "Price is required", valueAsNumber: true })} />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={4} {...register("description")} />
                </div>
                
                {/* --- SECCIÓN 2: RELACIONES Y METADATOS --- */}
                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Metadata</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Brand ID */}
                    <div className="space-y-2">
                        <Label>Brand</Label>
                        {/* Nota: En react-hook-form, la integración de Select requiere Controller o registrar el cambio manualmente */}
                        <Select onValueChange={(value) => setValue("brand_id", value, { shouldValidate: true })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                            <SelectContent>
                                {brandOptions.map(b => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* Errors handling here */}
                    </div>

                    {/* Category ID */}
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select onValueChange={(value) => setValue("category_id", value, { shouldValidate: true })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select onValueChange={(value) => setValue("gender", value as 'men' | 'women' | 'unisex', { shouldValidate: true })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="men">Men</SelectItem>
                                <SelectItem value="women">Women</SelectItem>
                                <SelectItem value="unisex">Unisex</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sport">Sport/Sport Type</Label>
                        <Input id="sport" {...register("sport")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="release_date">Release Date</Label>
                        <Input id="release_date" type="date" {...register("release_date")} />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox id="is_new" {...register("is_new")} />
                        <Label htmlFor="is_new">Is New Release?</Label>
                    </div>
                </div>


                {/* --- SECCIÓN 3: IMÁGENES --- */}
                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Images</h2>
                
                <div className="space-y-2">
                    <Label htmlFor="main_image_url">Main Image URL</Label>
                    <Input id="main_image_url" {...register("main_image_url", { required: "Main image URL is required" })} />
                    {errors.main_image_url && <p className="text-red-500 text-sm">{errors.main_image_url.message}</p>}
                </div>

                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-700">Additional Images</h3>
                    {imageFields.map((field, index) => (
                        <div key={field.id} className="flex space-x-3 items-center">
                            <div className="flex-grow space-y-1">
                                <Label htmlFor={`images.${index}.image_url`}>URL ({index + 1})</Label>
                                <Input 
                                    {...register(`images.${index}.image_url` as const, { required: "URL is required" })} 
                                />
                                {errors.images?.[index]?.image_url && <p className="text-red-500 text-xs">{errors.images[index].image_url.message}</p>}
                            </div>
                            <div className="w-20 space-y-1">
                                <Label htmlFor={`images.${index}.order`}>Order</Label>
                                <Input 
                                    type="number" 
                                    {...register(`images.${index}.order` as const, { valueAsNumber: true })} 
                                />
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)} disabled={imageFields.length === 1}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendImage(defaultImage)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Image
                    </Button>
                </div>


                {/* --- SECCIÓN 4: TALLAS Y CANTIDAD --- */}
                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Sizes & Inventory</h2>

                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-700">Available Sizes</h3>
                    
                    {sizeFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-5 gap-3 items-end">
                            <div className="space-y-1">
                                <Label htmlFor={`sizes.${index}.us_size`}>US Size*</Label>
                                <Input type="number" step="0.5" {...register(`sizes.${index}.us_size` as const, { required: true, valueAsNumber: true })} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`sizes.${index}.eu_size`}>EU Size</Label>
                                <Input type="number" step="0.5" {...register(`sizes.${index}.eu_size` as const, { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`sizes.${index}.uk_size`}>UK Size</Label>
                                <Input type="number" step="0.5" {...register(`sizes.${index}.uk_size` as const, { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`sizes.${index}.quantity`}>Quantity*</Label>
                                <Input type="number" {...register(`sizes.${index}.quantity` as const, { required: true, valueAsNumber: true, min: 0 })} />
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeSize(index)} disabled={sizeFields.length === 1}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendSize(defaultSize)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Size Row
                    </Button>
                </div>

                {/* --- SECCIÓN 5: FEATURED DETAILS (AÑADIDA) --- */}
                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Featured Details</h2>
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-700">Key Features (e.g., Material, Closure)</h3>
                    
                    {detailFields.map((field, index) => (
                        <div key={field.id} className="flex space-x-3 items-center">
                            <div className="flex-grow space-y-1">
                                <Label htmlFor={`featured_details.${index}`}>Detail {index + 1}</Label>
                                <Input 
                                    {...register(`featured_details.${index}` as const, { required: "Detail is required" })} 
                                />
                                {errors.featured_details?.[index]?.message && <p className="text-red-500 text-xs">{errors.featured_details[index].message}</p>}
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeDetail(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendDetail(defaultFeaturedDetail)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Detail
                    </Button>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg">
                    {isSubmitting ? 'Creating...' : 'Create Sneaker'}
                </Button>
            </form>
        </div>
    );
}