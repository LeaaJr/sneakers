// src/components/admin/SneakerForm.tsx

import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useForm, useFieldArray, type SubmitHandler, type Control, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { type SneakerFormData, type FormSize, type FormImage, type Sneaker, createSneaker, updateSneaker, } from '@/services/sneakerService';

interface SneakerFormProps {
    initialData?: Sneaker | null;
    isEdit: boolean;
    brandOptions: { id: string; name: string }[];
    categoryOptions: { id: string; name: string }[];
}

const defaultSize: FormSize = { us_size: 7.0, eu_size: null, uk_size: null, quantity: 10 };
const defaultImage: FormImage = { image_url: "", order: 1 };
const emptyValues: SneakerFormData = {
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
    featured_details: [],
};

export function SneakerForm({ initialData, isEdit, brandOptions, categoryOptions }: SneakerFormProps) {
    const { toast } = useToast();
    
    const initialValues: SneakerFormData = isEdit && initialData 
        ? {
            ...initialData,
            release_date: initialData.release_date?.split('T')[0] ?? new Date().toISOString().split('T')[0],
            sizes: initialData.sizes?.map(s => ({ ...s })) ?? [defaultSize],
            images: initialData.images?.map(i => ({ ...i })) ?? [defaultImage],
        }
        : emptyValues;

    const { 
        register, 
        control, 
        handleSubmit, 
        setValue, 
        formState: { errors, isSubmitting } 
    } = useForm<SneakerFormData>({ defaultValues: initialValues });

    const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: "sizes" });
    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: "images" });

    const onSubmit: SubmitHandler<SneakerFormData> = async (data) => {
        console.log("Form Data:", data);
        const payload = {
            ...data,
            price: parseFloat(data.price.toString()),
            release_date: data.release_date ? new Date(data.release_date).toISOString() : null,
            images: data.images.filter(img => img.image_url),
        };

        try {
            if (isEdit) {
                console.log(`Payload for EDIT (PUT ${initialData!.id}):`, payload);
                toast({ title: "Success", description: "Sneaker updated successfully! (Simulated)" });
            } else {
                console.log("Payload for CREATE (POST):", payload);
                toast({ title: "Success", description: "Sneaker created successfully! (Simulated)" });
            }
        } catch (error) {
            console.error("API Error:", error);
            toast({ title: "Error", description: `Error ${isEdit ? 'updating' : 'creating'} sneaker.`, variant: "destructive" });
        }
    };

    const formTitle = isEdit ? `Edit Sneaker: ${initialData?.title || initialData?.id.substring(0, 8)}` : "Create New Sneaker";
    const submitButtonText = isEdit ? 'Save Changes' : 'Create Sneaker';

    return (
        <div className="max-w-6xl mx-auto">
            <Link to="/admin/sneakers" className="flex items-center text-amber-600 mb-6 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sneaker List
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{formTitle}</h1>

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
                        <Controller
                            name="brand_id"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brandOptions.map(b => (
                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Category ID */}
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="men">Men</SelectItem>
                                        <SelectItem value="women">Women</SelectItem>
                                        <SelectItem value="unisex">Unisex</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
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
                                    {...register(`images.${index}.image_url`, { required: true })} 
                                />
                                {errors.images?.[index]?.image_url && <p className="text-red-500 text-xs">{errors.images[index].image_url.message}</p>}
                            </div>
                            <div className="w-20 space-y-1">
                                <Label htmlFor={`images.${index}.order`}>Order</Label>
                                <Input 
                                    type="number" 
                                    {...register(`images.${index}.order`, { valueAsNumber: true })} 
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
                                <Input type="number" step="0.5" {...register(`sizes.${index}.us_size`, { required: true, valueAsNumber: true })} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`sizes.${index}.quantity`}>Quantity*</Label>
                                <Input type="number" {...register(`sizes.${index}.quantity`, { required: true, min: 0, valueAsNumber: true })} />
                            </div>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => removeSize(index)} 
                                disabled={sizeFields.length === 1}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendSize(defaultSize)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Size Row
                    </Button>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg">
                    {isSubmitting ? 'Creating...' : submitButtonText}
                </Button>
            </form>
        </div>
    );
}
