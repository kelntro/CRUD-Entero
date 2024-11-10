import { useState, useRef } from "react";
import InputError from "@/Components/InputError";
import LabelEx from "@/Components/LabelEx";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { useForm, usePage } from "@inertiajs/react";
import { Loader2 } from "lucide-react";

const GadgetUpdate = ({ model, onDialogConfig, refreshData }) => {
    const { auth } = usePage().props;
    const { data, setData, patch, processing, reset, errors } = useForm({
        name: model.name ?? "",
        description: model.description ?? "",
        price: model.price ?? "",
        created_by: auth.user.id,
        image: model.image ?? null,
    });

    const fileInputRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('created_by', data.created_by);
    
        if (data.image instanceof File) {
            formData.append('image', data.image);
        }
    
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
        fetch(route("gadgets.update", { gadget: model.id }), {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-HTTP-Method-Override': 'PATCH', // Override the method to PATCH
                'X-CSRF-TOKEN': csrfToken // Ensure CSRF token is included
            },
        })
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (!response.ok) {
                if (contentType && contentType.includes('application/json')) {
                    return response.json().then(data => { throw new Error(JSON.stringify(data.errors)) });
                } else {
                    return response.text().then(text => { 
                        throw new Error('Unexpected response format: ' + text);
                    });
                }
            }
            return response.json();
        })
        .then(data => {
            console.log("Form submission successful");
            reset();
            onDialogConfig({
                open: false,
                process: "",
                data: null,
            });
            refreshData();
        })
        .catch(error => {
            console.error("Form submission errors:", error.message);
            try {
                const parsedErrors = JSON.parse(error.message);
                for (const [field, messages] of Object.entries(parsedErrors)) {
                    if (Array.isArray(messages)) {
                        messages.forEach(message => console.error(`${field}: ${message}`));
                    } else {
                        console.error(`${field}: ${messages}`);
                    }
                }
            } catch (e) {
                console.error("An unexpected error occurred:", error.message);
            }
        });
    };
    

    return (
        <>
            <form onSubmit={submit} encType="multipart/form-data">
                <div className="grid gap-4 mb-7 pt-3">
                    <div>
                        <LabelEx htmlFor="name" required>Name</LabelEx>
                        <Input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            className="mt-1 block w-full"
                        />
                    </div>

                    <div>
                        <LabelEx htmlFor="price" required>Price</LabelEx>
                        <Input
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <div>
                        <LabelEx htmlFor="image">Image</LabelEx>
                        <div
                            className="w-32 h-32 object-cover rounded-md cursor-pointer border border-dashed flex items-center justify-center"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {data.image ? (
                                <img
                                    src={data.image instanceof File ? URL.createObjectURL(data.image) : `/storage/${data.image}`}
                                    alt={model.name}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <span>Upload Image</span>
                            )}
                        </div>
                        <Input
                            ref={fileInputRef}
                            onChange={(e) => {
                                console.log("Image file selected:", e.target.files[0]);
                                setData("image", e.target.files[0]);
                            }}
                            type="file"
                            className="mt-1 block w-full"
                            style={{ display: 'none' }}
                        />
                        <InputError message={errors.image} className="mt-2" />
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    {processing ? (
                        <Button disabled className="rounded-full w-40">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 rounded-full w-40"
                        >
                            Save
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        onClick={() =>
                            onDialogConfig({
                                open: false,
                                process: "",
                                data: null,
                            })
                        }
                        className="rounded-full w-40"
                    >
                        Close
                    </Button>
                </div>
            </form>
        </>
    );
};

export default GadgetUpdate;