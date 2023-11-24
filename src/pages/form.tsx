"use client";

// React imports
import { useState } from "react";

// Next.js imports
import { useRouter } from "next/router";

// API and utility imports
import { api } from "@/utils/api";

// Next.js Cloudinary components
import {
  CldUploadButton,
  CldImage,
} from "next-cloudinary";

import type { CldUploadWidgetResults } from "next-cloudinary";

// Custom components
import TextInput from "@/components/TextInput";
import TextArea from "@/components/TextArea";
import RadioGroup from "@/components/RadioGroup";
import Dropdown from "@/components/Dropdown";
import DateInput from "@/components/DateInput";

// Types
import type { FormData } from "@/types/Form";

// Toast
import { toast } from "sonner";

export function CreateFormPage() {
  const router = useRouter();
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    textAnswer: "",
    regularTextInput: "",
    checkboxAnswers: [],
    radioAnswer: "",
    dropdownAnswer: "",
    dateAnswer: "",
  });
  const promise = () => new Promise((resolve) => setTimeout(resolve, 2000));

  const createForm = api.form.createForm.useMutation({
    onSuccess: () => {
      toast.promise(promise, {
          loading: 'Loading...',
          success: () => {
            return `Form has been added`;
          },
          error: 'Error',
      });
      setTimeout(() => {
        router.reload();
      }, 3000);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!formData ?? !formData.title) {
        throw new Error("Form title is missing or invalid");
      }
      const createdForm = await createForm.mutateAsync({
        title: formData.title,
        textAnswer: formData.textAnswer,
        regularTextInput: formData.regularTextInput,
        checkboxAnswers: formData.checkboxAnswers,
        radioAnswer: formData.radioAnswer,
        dropdownAnswer: formData.dropdownAnswer,
        dateAnswer: formData.dateAnswer,
        photoPublicId: cloudinaryPublicId,
      });
      console.log("Form created:", createdForm);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleUpload = (result: CldUploadWidgetResults) => {
    if (typeof result === "string") {
      console.log("Result is a string:", result);
    } else if (
      "info" in result &&
      result.info &&
      typeof result.info === "object" &&
      "public_id" in result.info
    ) {
      const publicId = result.info.public_id as string;
      console.log("Public ID:", publicId);
      setCloudinaryPublicId(publicId);
      setImagePreviewUrl(
        "https://res.cloudinary.com/your-cloud-name/image/upload/" + publicId,
      );
    }
  };
  

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      let updatedCheckboxAnswers: string[];
      if (checked) {
        updatedCheckboxAnswers = [...prevState.checkboxAnswers, value];
      } else {
        updatedCheckboxAnswers = prevState.checkboxAnswers.filter(
          (item) => item !== value,
        );
      }

      return {
        ...prevState,
        checkboxAnswers: updatedCheckboxAnswers,
      };
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <button
        onClick={() => router.push('/formlist')}
        className="self-start mt-4 mb-8 ml-4 px-4 py-2 font-semibold rounded-lg bg-indigo-500 text-white"
      >
        Back to Form List
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-md md:w-2/3 lg:w-1/2 xl:w-2/3"
      >
        {/* Title */}
        <TextInput
          label="Title"
          id="title"
          value={formData.title}
          onChange={(value) => setFormData({ ...formData, title: value })}
        />
          
        {/* Text Area */}
        <TextArea
          label="About you"
          id="textAnswer"
          value={formData.textAnswer}
          onChange={(value) => setFormData({ ...formData, textAnswer: value })}
          placeholder="Enter text answer"
        />
        
        {/* Text Input */}
        <TextInput
          label="Name"
          id="regularTextInput"
          value={formData.regularTextInput}
          onChange={(value) =>
            setFormData({ ...formData, regularTextInput: value })
          }
        />

        {/* Checkboxes */}
        <div className="mb-8">
          <label className="mb-2 block text-lg font-semibold text-gray-700">
            Preferred Hobbies
          </label>
          <div className="space-x-4">
            <label htmlFor="checkbox1" className="inline-flex items-center">
              <input
                id="checkbox1"
                type="checkbox"
                value="Sports"
                onChange={(e) => handleCheckboxChange(e)}
                className="mr-2 h-5 w-5 rounded border-gray-300 focus:outline-none focus:ring-blue-500"
              />
              <span className="text-md text-black">Sports</span>
            </label>
            <label htmlFor="checkbox2" className="inline-flex items-center">
              <input
                id="checkbox2"
                type="checkbox"
                value="Music"
                onChange={(e) => handleCheckboxChange(e)}
                className="mr-2 h-5 w-5 rounded border-gray-300 focus:outline-none focus:ring-blue-500"
              />
              <span className="text-md text-black">Music</span>
            </label>
            <label htmlFor="checkbox3" className="inline-flex items-center">
              <input
                id="checkbox3"
                type="checkbox"
                value="Cooking"
                onChange={(e) => handleCheckboxChange(e)}
                className="mr-2 h-5 w-5 rounded border-gray-300 focus:outline-none focus:ring-blue-500"
              />
              <span className="text-md text-black">Cooking</span>
            </label>
          </div>
        </div>

        {/* Radio Group */}
        <RadioGroup
          label="What is your race?"
          options={[
            { label: "Chinese", value: "Chinese" },
            { label: "Malay", value: "Malay" },
            { label: "Indian", value: "Indian" },
          ]}
          selectedValue={formData.radioAnswer}
          onChange={(value) => setFormData({ ...formData, radioAnswer: value })}
        />

        {/* Dropdown */}
        <Dropdown
          id="dropdownAnswer"
          value={formData.dropdownAnswer}
          onChange={(value) =>
            setFormData({ ...formData, dropdownAnswer: value })
          }
          options={[
            { label: "CSGO", value: "CSGO" },
            { label: "Fortnite", value: "Fortnite" },
            { label: "Valorant", value: "Valorant" },
          ]}
        />

        {/* Date Input */}
        <DateInput
          id="dateAnswer"
          value={formData.dateAnswer}
          onChange={(value) => setFormData({ ...formData, dateAnswer: value })}
        />

        <div className="mb-8">
          {/* Display the image preview */}
          {imagePreviewUrl && (
            <div className="mb-4">
              <label
                className="mb-2 block text-lg font-semibold text-gray-700"
                htmlFor="imagePreview"
              >
                Image Preview
              </label>
              <CldImage
                width="960"
                height="600"
                src={cloudinaryPublicId}
                sizes="100vw"
                alt="Image Preview"
              />
            </div>
          )}
        </div>
        <div>
          <label
            className="mb-2 block text-lg font-semibold text-gray-700"
            htmlFor="dateAnswer"
          >
            Upload Image
          </label>
        </div>

        <CldUploadButton
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          onUpload={handleUpload}
          uploadPreset="q9qlx4bf"
        />

        <div className="mt-6 flex items-center justify-end">
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-slate-200 px-4 py-2 font-bold text-black hover:bg-slate-400 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateFormPage;
