import { useForm, usePage } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { titleCase } from "@/lib/util";
import LabelEx from "@/Components/LabelEx";
import InputError from "@/Components/InputError";
import { Label } from "@/shadcn/ui/label";
import { useToast } from "@/shadcn/hooks/use-toast"; // Import useToast

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Separator } from "@/shadcn/ui/separator";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";

const GadgetCreate = ({ resourceName }) => {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        description: "",
        price: "",
        created_by: auth.user.id,
        image: null,
    });
    const { toast } = useToast(); // Use useToast

    const submit = (e) => {
        e.preventDefault();

        post(route("gadgets.store"), {
            onSuccess: () => {
                reset();
                setOpen(false);
                toast({
                    description: `${titleCase(resourceName)} has been created successfully.`,
                });
            },
        });
    };

    return (
        <Dialog className="bg-gray-100" open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 rounded-lg hover:bg-green-500 px-8 py-2 text-white">
                    Create {titleCase(resourceName)}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-white text-black border border-gray-300 rounded-lg shadow-lg">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            Create {titleCase(resourceName)}
                        </DialogTitle>
                    </DialogHeader>

                    <Separator className="h-[1px] my-4 bg-gray-300" />

                    <div className="grid gap-4 mb-7 pt-3">
                        <div className="">
                            <LabelEx htmlFor="name" required>Name</LabelEx>

                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                type="text"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm"
                            />

                            <InputError
                                message={errors.name}
                                className="mt-2 text-red-600"
                            />
                        </div>

                        <div className="">
                            <Label htmlFor="description">Description</Label>

                            <Textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm"
                            />
                        </div>

                        <div className="">
                            <LabelEx htmlFor="price" required>Price</LabelEx>

                            <Input
                                value={data.price}
                                onChange={(e) => setData("price", e.target.value)}
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm"
                            />

                            <InputError message={errors.price} className="mt-2 text-red-600" />
                        </div>

                        <div className="">
                            <LabelEx htmlFor="image">Image</LabelEx>

                            <Input
                                onChange={(e) => setData("image", e.target.files[0])}
                                type="file"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm"
                            />

                            <InputError message={errors.image} className="mt-2 text-red-600" />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end space-x-4">
                        {processing
                            ? (
                                <Button disabled className="rounded-lg w-32 bg-gray-400 text-white">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </Button>
                            )
                            : (
                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-500 rounded-lg w-32 text-white"
                                >
                                    Save
                                </Button>
                            )}

                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="rounded-lg w-32 bg-gray-200 hover:bg-gray-300 text-black">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default GadgetCreate;