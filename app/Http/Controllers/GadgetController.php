<?php

namespace App\Http\Controllers;

use App\Models\Gadget;
use App\Http\Requests\StoreGadgetRequest;
use App\Http\Requests\UpdateGadgetRequest;
use App\Http\Resources\GadgetResource;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class GadgetController extends Controller
{
    public function index()
    {
        $model = Gadget::query()
            ->where('name', 'like', '%'.request()->query('search').'%')
            ->orWhere('description', 'like', '%'.request()->query('search').'%')
            ->orderBy(
                request('sort_field', 'created_at'),
                request('sort_direction', 'desc')
            )
            ->paginate(5)
            ->appends(request()->query());

        return Inertia::render('Gadgets/Index', [
            'model' => GadgetResource::collection($model),
            'queryParams' => request()->query(),
        ]);
    }

    public function store(StoreGadgetRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('gadgets', 'public');
        }

        Gadget::create($data);

        session()->flash('message', 'Successfully created a new gadget');

        return redirect(route('gadgets.index'));
    }

    public function update(UpdateGadgetRequest $request, Gadget $gadget)
{
    // Log the incoming request data
    Log::info('Incoming update request data:', $request->all());

    // Validate and capture the data
    $data = $request->validated();

    // Log the validated data
    Log::info('Validated data:', $data);

    // Check if a new image is uploaded and handle accordingly
    if ($request->hasFile('image')) {
        // Store the new image and update the path
        $data['image'] = $request->file('image')->store('gadgets', 'public');
        Log::info('New image uploaded and stored at:', ['path' => $data['image']]);
    } else {
        // No new image uploaded, keep the existing image
        Log::info('No new image uploaded, keeping the existing image.');
        unset($data['image']); // Retain the existing image in the database
    }

    // Update the gadget record with the validated data
    $gadget->update($data);

    Log::info('Gadget updated successfully:', ['gadget' => $gadget]);

    // Return JSON response instead of a redirect
    return response()->json([
        'success' => true,
        'message' => 'Gadget updated successfully.',
        'gadget' => $gadget
    ]);
}


    public function destroy(Gadget $gadget)
    {
        if ($gadget->image) {
            Storage::disk('public')->delete($gadget->image);
        }

        $gadget->delete();

        session()->flash('message', 'Successfully deleted gadget');

        return redirect(route('gadgets.index'));
    }
}