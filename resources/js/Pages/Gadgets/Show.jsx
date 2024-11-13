// Show.jsx

import { Button } from "@/shadcn/ui/button";
import { Label } from "@/shadcn/ui/label";
import dayjs from "dayjs";

const GadgetShow = ({ model, onDialogConfig }) => {
    return (
        <>
            <div className="flex flex-col items-center pt-5 w-full">
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 w-full">
                    {model.image && (
                        <div className="flex justify-center mb-8 md:mb-0 md:w-1/2">
                            <img
                                src={`/storage/${model.image}`}
                                alt={model.name}
                                className="w-full h-auto rounded-md"
                            />
                        </div>
                    )}

                    <div className="space-y-6 w-full md:w-1/2 md:pl-6">
                        {/* Details Section */}
                        <div className="space-y-6">
                            <div className="grid w-full max-w-sm gap-1.5">
                                <Label className="dark:text-slate-300">Name</Label>
                                <div className="text-lg font-semibold">{model.name}</div>
                            </div>

                            <div className="grid w-full max-w-sm gap-1.5">
                                <Label className="dark:text-slate-300">Description</Label>
                                <div className="text-lg font-semibold">{model.description}</div>
                            </div>

                            <div className="grid w-full max-w-sm gap-1.5">
                                <Label className="dark:text-slate-300">Price</Label>
                                <div className="text-lg font-semibold">{model.price}</div>
                            </div>
                        </div>

                        {/* Additional Information Section */}
                        <div className="space-y-8">
                            <div className="grid w-full max-w-sm gap-1.5">
                                <Label className="dark:text-slate-300">Date Created</Label>
                                <div className="text-lg font-semibold">
                                    {dayjs(model.createdAt).format("MMMM D, YYYY")}
                                </div>
                            </div>

                            <div className="grid w-full max-w-sm gap-1.5">
                                <Label className="dark:text-slate-300">Created By</Label>
                                <div className="text-lg font-semibold">{model.createdBy.name}</div>
                            </div>

                            <div className="grid w-full max-w-sm gap-1.5">
                                <Label className="dark:text-slate-300">Date Updated</Label>
                                <div className="text-lg font-semibold">
                                    {dayjs(model.updatedAt).format("MMMM D, YYYY")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <Button
                    className="bg-green-600 hover:bg-green-500 rounded-lg w-40 text-white"
                    onClick={() =>
                        onDialogConfig({
                            open: true,
                            process: "update",
                            data: model,
                        })
                    }
                >
                    Update
                </Button>

                <Button
                    variant="secondary"
                    onClick={() =>
                        onDialogConfig({
                            open: false,
                            process: "",
                            data: null,
                        })
                    }
                    className="bg-gray-200 hover:bg-gray-300 rounded-lg w-40 text-black"
                >
                    Close
                </Button>
            </div>
        </>
    );
};

export default GadgetShow;