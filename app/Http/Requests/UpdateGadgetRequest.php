<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UpdateGadgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate image if uploaded
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'created_by' => 'required',
        ];
    }

    /**
     * Handle the request data before validation is applied.
     */
    public function prepareForValidation()
{
    // Log the incoming request data to help with debugging
    Log::info("Incoming request data:", $this->all());

    // Check if the image field is a string (meaning it's a path and not a new file upload)
    if (is_string($this->input('image'))) {
        // Log the existing image path
        Log::info('Existing image path:', ['image_path' => $this->input('image')]);

        // Remove the 'image' field from the request data to prevent it from triggering validation
        $this->merge(['image' => null]); // So it doesn't get validated as a file
    }

    // Check if the image field is actually a file being uploaded
    if ($this->hasFile('image')) {
        Log::info('Image file uploaded:', [
            'image_name' => $this->file('image')->getClientOriginalName(),
            'image_size' => $this->file('image')->getSize(),
            'image_mime' => $this->file('image')->getMimeType(),
        ]);
    } else {
        Log::info('No image file uploaded.');
    }
}

    /**
     * Handle the request data after validation has passed.
     */
    public function validateResolved()
    {
        try {
            parent::validateResolved();
            Log::info("Request data validated successfully:", $this->all());
        } catch (ValidationException $e) {
            // Log validation errors
            Log::error("Validation errors:", $e->errors());
            throw $e;
        }
    }
}
