"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from "@/utils/api";

export function CreateFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    title: string;
    textAnswer: string;
    regularTextInput: string;
    checkboxAnswers: string[];
    radioAnswer: string;
    dropdownAnswer: string;
    dateAnswer: string;
  }>({
    title: '',
    textAnswer: '',
    regularTextInput: '',
    checkboxAnswers: [],
    radioAnswer: '',
    dropdownAnswer: '',
    dateAnswer: '',
  });

  const createForm = api.form.createForm.useMutation({
    onSuccess: () => {
      router.reload();
      alert('Form created successfully');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!formData || !formData.title) {
        throw new Error('Form title is missing or invalid');
      }
      const createdForm = await createForm.mutateAsync({ title: formData.title, textAnswer: formData.textAnswer, regularTextInput: formData.regularTextInput, checkboxAnswers: formData.checkboxAnswers, radioAnswer: formData.radioAnswer, dropdownAnswer: formData.dropdownAnswer, dateAnswer: formData.dateAnswer});
      console.log('Form created:', createdForm);
      // router.push('/success-page'); 
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      let updatedCheckboxAnswers: string[];
      if (checked) {
        updatedCheckboxAnswers = [...prevState.checkboxAnswers, value];
      } else {
        updatedCheckboxAnswers = prevState.checkboxAnswers.filter((item) => item !== value);
      }
  
      return {
        ...prevState,
        checkboxAnswers: updatedCheckboxAnswers,
      };
    });
  };
  

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      radioAnswer: value, 
    }));
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      dropdownAnswer: value, 
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, dateAnswer: e.target.value });
  };




  return (
    <div className="min-h-screen bg-purple-300 flex flex-col items-center justify-center">
      <button
        onClick={() => router.push('/formlist')}
        className="rounded-full bg-slate-200 px-4 py-2 text-gray-700 font-semibold mt-4 ml-4 self-start"
      >
        Back to form list
      </button>

      <form onSubmit={handleSubmit} className="flex-grow max-w-3xl w-full md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-md rounded p-6 mt-6 bg-white">
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="border border-gray-300 rounded w-full py-3 px-4 text-lg text-gray-700 focus:outline-none focus:border-blue-500"
            id="title"
            type="text"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
  
       {/* Textarea Input */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="textAnswer">
          About you
        </label>
        <textarea
          className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          id="textAnswer"
          placeholder="Enter text answer"
          value={formData.textAnswer}
          onChange={(e) => setFormData({ ...formData, textAnswer: e.target.value })}
        />
      </div>

      {/* Regular Text Input */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="regularTextInput">
          Name
        </label>
        <input
          className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          id="regularTextInput"
          type="text"
          placeholder="Enter regular text"
          value={formData.regularTextInput}
          onChange={(e) => setFormData({ ...formData, regularTextInput: e.target.value })}
        />
      </div>

      {/* Checkboxes */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
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
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          What is your race?
        </label>
        <div className='space-x-4'>
          <label htmlFor="radioOption1" className="inline-flex items-center">
            <input
              id="radioOption1"
              type="radio"
              name="radioOptions"
              value="Chinese"
              onChange={(e) => setFormData({ ...formData, radioAnswer: e.target.value })}
              checked={formData.radioAnswer === 'Chinese'}
            />
            <span className="ml-2 text-black">Chinese</span>
          </label>

          <label htmlFor="radioOption1" className="inline-flex items-center">
            <input
              id="radioOption1"
              type="radio"
              name="radioOptions"
              value="Malay"
              onChange={(e) => setFormData({ ...formData, radioAnswer: e.target.value })}
              checked={formData.radioAnswer === 'Malay'}
            />
            <span className="ml-2 text-black">Malay</span>
          </label>

          <label htmlFor="radioOption1" className="inline-flex items-center">
            <input
              id="radioOption1"
              type="radio"
              name="radioOptions"
              value="Indian"
              onChange={(e) => setFormData({ ...formData, radioAnswer: e.target.value })}
              checked={formData.radioAnswer === 'Indian'}
            />
            <span className="ml-2 text-black">Indian</span>
          </label>
        </div>
      </div>

      {/* Dropdown Input */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="dropdownAnswer">
          Preferred Game
        </label>
        <select
          id="dropdownAnswer"
          value={formData.dropdownAnswer}
          onChange={handleDropdownChange}
          className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
        >
          <option value="">Select</option>
          <option value="CSGO">CSGO</option>
          <option value="Fortnite">Fortnite</option>
          <option value="Valorant">Valorant</option>
        </select>
      </div>

      {/* Date Input */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="dateAnswer">
          Date of Birth
        </label>
        <input
          className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          id="dateAnswer"
          type="date"
          placeholder="Select date"
          value={formData.dateAnswer}
          onChange={handleDateChange}
        />
      </div>

      <div className="flex items-center justify-end mt-6">
        <button
          type="submit"
          className="bg-slate-200 hover:bg-slate-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
);
}

export default CreateFormPage;