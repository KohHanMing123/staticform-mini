// React imports
import { useEffect, useState } from "react";

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

export function FormDetails() {
  const router = useRouter();
  const { formId } = router.query;
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [newPhotoPublicId, setNewPhotoPublicId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    textAnswer: "",
    regularTextInput: "",
    checkboxAnswers: [],
    radioAnswer: "",
    dropdownAnswer: "",
    dateAnswer: "",
  });

  const { data: formDetails, error: formDetailsError } =
    api.form.getFormById.useQuery({
      id: formId as string,
    });
    
    if (formDetailsError) {
      console.error('Form details retrieval error:', formDetailsError);
    }

  useEffect(() => {
    if (formDetails && formDetails.title) {
      const checkboxField = formDetails.fields?.find(
        (field) => field.label === "Checkbox",
      );
      const checkboxValues = checkboxField?.value
        ? checkboxField.value.split(",").map((value) => value.trim())
        : [];

      const uploadImageField = formDetails.fields?.find(
        (field) => field.label === "Upload Image",
      );
      if (uploadImageField) {
        console.log(
          "Photo Public ID from database:",
          uploadImageField.photoPublicId,
        );
        setImagePreviewUrl(uploadImageField.photoPublicId ?? ""); 
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        title: formDetails.title || "",
        textAnswer:
          formDetails.fields?.find((field) => field.label === "Text Answer")
            ?.value ?? "",
        regularTextInput:
          formDetails.fields?.find((field) => field.label === "Text Input")
            ?.value ?? "",
        checkboxAnswers: checkboxValues,
        radioAnswer:
          formDetails.fields?.find((field) => field.label === "Radio")?.value ??
          "",
        dropdownAnswer:
          formDetails.fields?.find((field) => field.label === "Dropdown")
            ?.value ?? "",
        dateAnswer:
          formDetails.fields?.find((field) => field.label === "Date")?.value ??
          "",
      }));
    }
  }, [formDetails]);

  const promise = () => new Promise((resolve) => setTimeout(resolve, 2000));

  const updateFormMutation = api.form.updateForm.useMutation({
    onSuccess: () => {
      toast.promise(promise, {
          loading: 'Loading...',
          success: () => {
            return `Form has been updated`;
          },
          error: 'Error',
      });
      setTimeout(() => {
        router.reload();
      }, 3000);
    },
    onError: (error) => {
      console.error("Error updating form:", error);
    },
  });

  const handleShare = () => {
    const formUrl = window.location.href;
    navigator.clipboard
      .writeText(formUrl)
      .then(() => {
        toast.success("Form URL copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy URL:", error);
      });
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
      const publicId = result.info.public_id;
      console.log("Public ID in update:", publicId);
      setNewPhotoPublicId(publicId as string);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFields = [
      { label: "Text Answer", value: formData.textAnswer },
      { label: "Text Input", value: formData.regularTextInput },
      { label: "Checkbox", value: formData.checkboxAnswers.join(",") },
      { label: "Radio", value: formData.radioAnswer },
      { label: "Dropdown", value: formData.dropdownAnswer },
      { label: "Date", value: formData.dateAnswer },
    ];

    const updatedFormData = {
      id: formId as string,
      title: formData.title,
      fields: updatedFields,
      photoPublicId: newPhotoPublicId,
    };

    console.log("Form Data:", updatedFormData);

    console.log("newPhotoPublicId before submission:", newPhotoPublicId);

    updateFormMutation.mutate(updatedFormData);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      let updatedCheckboxAnswers: string[] = [...prevFormData.checkboxAnswers];

      if (checked) {
        updatedCheckboxAnswers.push(value);
      } else {
        updatedCheckboxAnswers = updatedCheckboxAnswers.filter(
          (item) => item !== value,
        );
      }

      return { ...prevFormData, checkboxAnswers: updatedCheckboxAnswers };
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <button
        onClick={() => router.push('/formlist')}
        className="self-start mt-4 mb-8 ml-4 px-4 py-2 font-semibold rounded-lg bg-indigo-500 hover:bg-indigo-700 text-white"
      >
        Back
      </button>

      <button
        onClick={handleShare}
        className="absolute top-4 right-4 px-4 py-2 font-bold rounded-lg bg-green-500 text-white hover:bg-green-700 focus:outline-none focus:shadow-outline"
      >
        Share
      </button>

      <form
        className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-md md:w-2/3 lg:w-1/2 xl:w-2/3 relative"
        onSubmit={handleFormSubmit}
      >
        {/* Title */}
        <TextInput
          label="Title"
          id="title"
          value={formData.title || ""}
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

        {/* Checkbox Inputs */}
        <div className="mb-8">
          <label className="mb-2 block text-lg font-bold text-gray-700">
            Preferred Hobbies
          </label>
          <div className="space-x-4">
            <label htmlFor="checkbox1" className="inline-flex items-center">
              <input
                id="checkbox1"
                type="checkbox"
                value="Sports"
                checked={formData.checkboxAnswers.includes("Sports")}
                onChange={(e) => handleCheckboxChange(e)}
              />
              <span className="ml-2 text-black">Sports</span>
            </label>
            <label htmlFor="checkbox2" className="inline-flex items-center">
              <input
                id="checkbox2"
                type="checkbox"
                value="Music"
                checked={formData.checkboxAnswers.includes("Music")}
                onChange={(e) => handleCheckboxChange(e)}
              />
              <span className="ml-2 text-black">Music</span>
            </label>
            <label htmlFor="checkbox3" className="inline-flex items-center">
              <input
                id="checkbox3"
                type="checkbox"
                value="Cooking"
                checked={formData.checkboxAnswers.includes("Cooking")}
                onChange={(e) => handleCheckboxChange(e)}
              />
              <span className="ml-2 text-black">Cooking</span>
            </label>
          </div>
        </div>

        {/* Radio Inputs */}
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

        {/* Dropdown Input */}
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
                Image retrieved from database
              </label>
              <CldImage
                width="960"
                height="600"
                src={imagePreviewUrl}
                sizes="100vw"
                alt="Image Preview"
              />
            </div>
          )}
        </div>

        <CldUploadButton
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
          onUpload={handleUpload}
          uploadPreset="q9qlx4bf"
        />

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormDetails;
