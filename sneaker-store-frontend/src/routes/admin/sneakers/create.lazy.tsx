// src/routes/admin/sneakers/create.lazy.tsx
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { type SneakerFormData, type FormImage } from '../../../../../sneaker-store-backend/src/types/admin'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSneaker } from '@/services/sneakerService';
import { SizeGridPicker } from './SizeGridPicker';
import { SIZE_CONVERSION_CHART } from '@/lib/constants/size-conversions';
import { defaultSize } from './create'; 
import { useCallback } from 'react';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/admin/sneakers/create')({
  component: SneakerFormPage,
});

// --- VALORES INICIALES ---
const defaultImage: FormImage = { image_url: "", order: 1 };
const defaultFeaturedDetail = "";

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
    sizes: [], // Empezamos vacío para usar el Picker
    images: [defaultImage],
    featured_details: [defaultFeaturedDetail],
};

function SneakerFormPage() {
    const { brandOptions, categoryOptions } = Route.useLoaderData();
    
    const { 
        register, 
        control, 
        handleSubmit, 
        setValue, 
        watch,
        formState: { errors, isSubmitting } 
    } = useForm<SneakerFormData>({ defaultValues });
    
    const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: "sizes" });
    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: "images" });
    const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({ control, name: "featured_details" });

    const selectedCategoryId = watch("category_id");


useEffect(() => {
    if (selectedCategoryId && categoryOptions) {
        // Buscamos la categoría en la lista que viene del loader
        const category = categoryOptions.find((c: any) => c.id === selectedCategoryId);
        if (category && category.slug) {
            // Seteamos el slug en el campo sport automáticamente
            setValue("sport", category.slug);
        }
    }
}, [selectedCategoryId, categoryOptions, setValue]);


// Lógica para el SizeGridPicker (Añadir/Quitar tallas rápidamente)
    const currentSizes = watch("sizes") || [];
    // --- NUEVA LÓGICA DE TALLAS AUTO ---
    const handleAddQuickSize = useCallback((size: number) => {
        const alreadyExists = currentSizes.some(s => s.us_size === size);
        if (!alreadyExists) {
            const conversion = SIZE_CONVERSION_CHART[size] || { eu: null, uk: null };
            appendSize({ 
                us_size: size, 
                eu_size: conversion.eu, 
                uk_size: conversion.uk, 
                quantity: 10 
            });
        }
    }, [appendSize, currentSizes]);

    const handleRemoveQuickSize = useCallback((size: number) => {
        const index = currentSizes.findIndex(s => s.us_size === size);
        if (index !== -1) removeSize(index);
    }, [currentSizes, removeSize]);

    const onSubmit: SubmitHandler<SneakerFormData> = async (data) => {
        const payload = {
            ...data,
            price: parseFloat(data.price.toString()), 
            release_date: data.release_date ? new Date(data.release_date).toISOString() : null,
            featured_details: data.featured_details.filter(d => d && d.trim().length > 0),
            sizes: data.sizes.filter(s => s.us_size !== null && s.us_size > 0),
        };
        
        try {
            const response = await createSneaker(payload);
            alert("Sneaker creado exitosamente!");
        } catch (error) {
            console.error(error);
            alert("Error al crear sneaker.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Link to="/admin/sneakers" className="flex items-center text-amber-600 mb-6 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sneaker List
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
                
                {/* --- SECCIÓN 2: METADATA --- */}
                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Metadata</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Brand</Label>
                        <Select onValueChange={(value) => setValue("brand_id", value)}>
                            <SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger>
                            <SelectContent>
                                {brandOptions.map(b => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select 
                            value={watch("category_id")} // Añadimos esto para que el select sea "controlado"
                            onValueChange={(value) => setValue("category_id", value)}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select onValueChange={(value) => setValue("gender", value as any)}>
                            <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
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
                        <Label htmlFor="sport" className="flex items-center gap-2">
                            Sport / Slug
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
                                Auto-Sync
                            </span>
                        </Label>
                        <Input 
                            id="sport" 
                            {...register("sport")} 
                            readOnly 
                            placeholder="Generated from category..."
                            className="bg-gray-50 border-dashed font-mono text-sm"
                        />
                        </div>
                    <div className="space-y-2">
                        <Label htmlFor="release_date">Release Date</Label>
                        <Input id="release_date" type="date" {...register("release_date")} />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Checkbox id="is_new" onCheckedChange={(checked) => setValue("is_new", !!checked)} defaultChecked />
                        <Label htmlFor="is_new">Is New Release?</Label>
                    </div>
                </div>

                {/* --- SECCIÓN 3: IMÁGENES --- */}
                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Images</h2>
                <div className="space-y-2">
                    <Label htmlFor="main_image_url">Main Image URL</Label>
                    <Input id="main_image_url" {...register("main_image_url", { required: true })} />
                </div>

                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                    <h3 className="font-medium">Additional Images</h3>
                    {imageFields.map((field, index) => (
                        <div key={field.id} className="flex space-x-3 items-center">
                            <Input {...register(`images.${index}.image_url` as const)} placeholder="URL" />
                            <Input type="number" className="w-24" {...register(`images.${index}.order` as const, { valueAsNumber: true })} />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)}><X className="h-4 w-4"/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendImage(defaultImage)}><Plus className="mr-2 h-4 w-4"/> Add Image</Button>
                </div>

                {/* --- SECCIÓN 4: TALLAS (CON EL PICKER) --- */}
                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Sizes & Inventory</h2>
                
                <SizeGridPicker 
                    currentSizes={currentSizes} 
                    onAdd={handleAddQuickSize} 
                    onRemove={handleRemoveQuickSize} 
                />

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {sizeFields.map((field, index) => {
                        const currentUS = watch(`sizes.${index}.us_size`);
                        return (
                            <div key={field.id} className="p-4 bg-white border rounded-xl shadow-sm border-slate-200 space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <Label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">US Size</Label>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            className="h-9 border-none text-lg font-bold p-0 focus-visible:ring-0 text-amber-600"
                                            {...register(`sizes.${index}.us_size`, {
                                                valueAsNumber: true,
                                                onChange: (e) => {
                                                    const val = parseFloat(e.target.value);
                                                    const conv = SIZE_CONVERSION_CHART[val];
                                                    if (conv) {
                                                        setValue(`sizes.${index}.eu_size`, conv.eu);
                                                        setValue(`sizes.${index}.uk_size`, conv.uk);
                                                    }
                                                }
                                            })}
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSize(index)} className="text-slate-300 hover:text-red-500">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <div className="text-center">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase italic">EU Auto</p>
                                        <p className="font-bold text-slate-700">{watch(`sizes.${index}.eu_size`) || '-'}</p>
                                        <input type="hidden" {...register(`sizes.${index}.eu_size`)} />
                                    </div>
                                    <div className="text-center border-x border-slate-200">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase italic">UK Auto</p>
                                        <p className="font-bold text-slate-700">{watch(`sizes.${index}.uk_size`) || '-'}</p>
                                        <input type="hidden" {...register(`sizes.${index}.uk_size`)} />
                                    </div>
                                    <div className="text-center pl-1">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase italic">Stock</p>
                                        <Input
                                            type="number"
                                            className="h-6 border-slate-300 bg-white text-center text-xs font-bold"
                                            {...register(`sizes.${index}.quantity`, { valueAsNumber: true })}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                                        
                {/* --- SECCIÓN 5: FEATURED DETAILS --- */}
                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Featured Details</h2>
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                    {detailFields.map((field, index) => (
                        <div key={field.id} className="flex space-x-3 items-center">
                            <Input {...register(`featured_details.${index}` as const)} placeholder="e.g. Premium Leather" />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeDetail(index)}><X className="h-4 w-4"/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendDetail(defaultFeaturedDetail)}><Plus className="mr-2 h-4 w-4"/> Add Detail</Button>
                </div>

{/* --- BOTÓN SUBMIT --- */}
                <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-xl font-bold">
                    {isSubmitting ? 'Creating...' : 'Create Sneaker'}
                </Button>
            </form>
        </div>
    );
}