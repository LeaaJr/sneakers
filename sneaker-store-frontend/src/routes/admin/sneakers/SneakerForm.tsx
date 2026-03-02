// src/components/admin/SneakerForm.tsx
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useForm, useFieldArray, type SubmitHandler, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { memo, useCallback, useMemo } from 'react';
import { SIZE_CONVERSION_CHART } from '@/lib/constants/size-conversions';
import { 
    type SneakerFormData, 
    type FormSize, 
    type FormImage, 
    type Sneaker, 
    createSneaker, 
    updateSneaker 
} from '@/services/sneakerService';
import { SizeGridPicker } from './SizeGridPicker';

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
    sport: "", // Cambiado de null a "" para evitar errores de input
    gender: 'unisex',
    release_date: new Date().toISOString().split('T')[0],
    is_new: true,
    sizes: [defaultSize],
    images: [defaultImage],
    featured_details: [],
};

const BrandSelect = memo(({ control, options }: { control: any, options: { id: string, name: string }[] }) => (
    <div className="space-y-2">
        <Label>Brand</Label>
        <Controller
            name="brand_id"
            control={control}
            render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map(b => (
                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        />
    </div>
));
BrandSelect.displayName = 'BrandSelect';

export function SneakerForm({ isEdit, initialData, brandOptions, categoryOptions }: SneakerFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const navigate = useNavigate();

    const initialValues = useMemo(() => {
        if (isEdit && initialData) {
            return {
                ...initialData,
                release_date: initialData.release_date ? initialData.release_date.split('T')[0] : "",
                sizes: initialData.sizes?.length ? initialData.sizes.map(s => ({ ...s })) : [defaultSize],
                images: initialData.images?.length ? initialData.images.map(i => ({ ...i })) : [defaultImage],
                featured_details: initialData.featured_details || [],
                sport: initialData.sport || "",
                gender: (initialData.gender as any) || 'unisex'
            } as SneakerFormData;
        }
        return emptyValues;
    }, [isEdit, initialData]);

    const { 
        register, 
        control, 
        handleSubmit,
        watch,
        setValue, 
        formState: { errors, isSubmitting } 
    } = useForm<SneakerFormData>({ 
        defaultValues: initialValues,
        mode: 'onTouched'
    });

    const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: "sizes" });
    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: "images" });
    const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({ control, name: "featured_details" });

    const watchSizes = watch("sizes");

    const handleAddQuickSize = useCallback((size: number) => {
        const alreadyExists = watchSizes.some(s => s.us_size === size);
        if (!alreadyExists) {
            const conversion = SIZE_CONVERSION_CHART[size];
            appendSize({ 
                us_size: size, 
                eu_size: conversion ? conversion.eu : null, 
                uk_size: conversion ? conversion.uk : null, 
                quantity: 10 
            });
        }
    }, [appendSize, watchSizes]);

    const handleRemoveQuickSize = useCallback((size: number) => {
        const index = watchSizes.findIndex(s => s.us_size === size);
        if (index !== -1) removeSize(index);
    }, [watchSizes, removeSize]);

    const onSubmit: SubmitHandler<SneakerFormData> = async (data) => {
        // Limpieza de datos antes de enviar
        const payload = {
            ...data,
            price: Number(data.price),
            release_date: data.release_date ? new Date(data.release_date).toISOString() : new Date().toISOString(),
            images: data.images.filter(img => img.image_url !== ""),
            featured_details: data.featured_details.filter(d => typeof d === 'string' && d.trim().length > 0),
        };

        try {
            if (isEdit && initialData?.id) {
                await updateSneaker(initialData.id, payload);
                toast({ title: "Éxito", description: "Zapatilla actualizada correctamente!" });
                router.invalidate();
            } else {
                const newSneaker = await createSneaker(payload);
                toast({ title: "Éxito", description: "Zapatilla creada correctamente!" });
                await navigate({ 
                    to: '/admin/sneakers/$sneakerId/edit', 
                    params: { sneakerId: newSneaker.id } 
                } as any);
            }
        } catch (error) {
            console.error("API Error:", error);
            toast({ 
                title: "Error", 
                description: "Ocurrió un problema con el servidor.", 
                variant: "destructive" 
            });
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <Link to="/admin/sneakers" className="flex items-center text-amber-600 mb-6 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sneaker List
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {isEdit ? `Edit: ${initialData?.title}` : "Create New Sneaker"}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-lg space-y-8">
                
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
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={4} {...register("description")} />
                </div>

                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Metadata</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <BrandSelect control={control} options={brandOptions} />

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || 'unisex'}>
                                    <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="sport">Sport</Label>
                        <Input id="sport" {...register("sport")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="release_date">Release Date</Label>
                        <Input id="release_date" type="date" {...register("release_date")} />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                        <Controller
                            name="is_new"
                            control={control}
                            render={({ field }) => (
                                <Checkbox 
                                    id="is_new" 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange} 
                                />
                            )}
                        />
                        <Label htmlFor="is_new" className="cursor-pointer">Is New Release?</Label>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Images</h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="main_image_url">Main Image URL</Label>
                        <Input id="main_image_url" {...register("main_image_url", { required: "Required" })} />
                    </div>

                    <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                        <Label className="text-gray-700 font-bold">Additional Images</Label>
                        {imageFields.map((field, index) => (
                            <div key={field.id} className="flex space-x-3 items-end">
                                <div className="flex-grow space-y-1">
                                    <Input {...register(`images.${index}.image_url` as const)} placeholder="URL" />
                                </div>
                                <div className="w-24 space-y-1">
                                    <Input type="number" {...register(`images.${index}.order` as const, { valueAsNumber: true })} placeholder="Order" />
                                </div>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendImage(defaultImage)}>
                            <Plus className="h-4 w-4 mr-2" /> Add Image
                        </Button>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Sizes & Inventory</h2>
                <div className="space-y-6">
                    <SizeGridPicker
                        currentSizes={watchSizes}
                        onAdd={handleAddQuickSize}
                        onRemove={handleRemoveQuickSize}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                        </div>
                                        <div className="text-center border-x border-slate-200">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase italic">UK Auto</p>
                                            <p className="font-bold text-slate-700">{watch(`sizes.${index}.uk_size`) || '-'}</p>
                                        </div>
                                        <div className="text-center pl-1">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase italic">Stock</p>
                                            <Input
                                                type="number"
                                                className="h-6 border-slate-300 bg-white text-center text-xs font-bold"
                                                {...register(`sizes.${index}.quantity` as const, { valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <h2 className="text-2xl font-semibold border-b pb-2 pt-4">Featured Details</h2>
                <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                    {detailFields.map((field, index) => (
                        <div key={field.id} className="flex space-x-2">
                            <Input {...register(`featured_details.${index}` as any)} placeholder="e.g. Premium Leather" />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeDetail(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendDetail("" as any)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Detail
                    </Button>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-xl font-bold">
                    {isSubmitting ? 'Processing...' : (isEdit ? 'Update Sneaker' : 'Create Sneaker')}
                </Button>
            </form>
        </div>
    );
}