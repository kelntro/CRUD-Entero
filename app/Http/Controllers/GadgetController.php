<?php

namespace App\Http\Controllers;

use App\Models\Gadget;
use App\Http\Requests\StoreGadgetRequest;
use App\Http\Requests\UpdateGadgetRequest;
use App\Http\Resources\GadgetResource;
use Inertia\Inertia;

class GadgetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Gadgets/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGadgetRequest $request)
    {
        Gadget::create($request->validated());

        session()->flash('message', 'Successfully created a new gadget');

        return redirect(route('gadgets.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Gadget $gadget)
    {
        return Inertia::render('Gadgets/Show', [
            'gadget' => new GadgetResource($gadget),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gadget $gadget)
    {
        return Inertia::render('Gadgets/Update', [
            'gadget' => new GadgetResource($gadget),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGadgetRequest $request, Gadget $gadget)
    {
        $gadget->update($request->validated());

        session()->flash('message', 'Successfully updated gadget');

        return redirect(route('gadgets.index', $request->query()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gadget $gadget)
    {
        $gadget->delete();

        session()->flash('message', 'Successfully deleted gadget');

        return redirect(route('gadgets.index'));
    }
}
