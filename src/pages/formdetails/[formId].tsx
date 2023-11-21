import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from "@/utils/api";

interface FormData {
  title: string;
  textAnswer: string;
  regularTextInput: string;
  checkboxAnswers: string[];
  radioAnswer: string;
  dropdownAnswer: string;
  dateAnswer: string;
}

export function FormDetails() {
  const router = useRouter();
  const { formId } = router.query;
  const [formData, setFormData] = useState<FormData>({
    title: '',
    textAnswer: '',
    regularTextInput: '',
    checkboxAnswers: [],
    radioAnswer: '',
    dropdownAnswer: '',
    dateAnswer: '',
  });

  
    const { data: formDetails, error: formDetailsError } = api.form.getFormById.useQuery({
      id: formId as string,
    });

    useEffect(() => {
      if (formDetails && formDetails.title) {
        const checkboxValues = (formDetails.fields
          ?.filter((field) => field.label === 'Checkbox')
          ?.map((checkboxField) => checkboxField.value) || []
        ).filter((value) => value !== null);
    
        setFormData((prevFormData) => ({
          ...prevFormData,
          title: formDetails.title || '',
          textAnswer: formDetails.fields?.find((field) => field.label === 'Text Answer')?.value || '',
          regularTextInput: formDetails.fields?.find((field) => field.label === 'Text Input')?.value || '',
          checkboxAnswers: checkboxValues as string[],
          radioAnswer: formDetails.fields?.find((field) => field.label === 'Radio')?.value || '',
          dropdownAnswer: formDetails.fields?.find((field) => field.label === 'Dropdown')?.value || '',
          dateAnswer: formDetails.fields?.find((field) => field.label === 'Date')?.value || '',
        }));
      }
    }, [formDetails]);

  const updateFormMutation = api.form.updateForm.useMutation({
    onSuccess: () => {
      router.reload();
      alert('Form updated successfully');
    },
    onError: (error) => {
      console.error('Error updating form:', error);
    },
  });
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFields = [
      { label: 'Text Answer', value: formData.textAnswer },
      { label: 'Text Input', value: formData.regularTextInput },
      { label: 'Checkbox', value: formData.checkboxAnswers.join(',') },
      { label: 'Radio', value: formData.radioAnswer },
      { label: 'Dropdown', value: formData.dropdownAnswer },
      { label: 'Date', value: formData.dateAnswer },
    ];
  
    const updatedFormData = {
      id: formId as string,
      title: formData.title,
      fields: updatedFields,
    };
  
    console.log('Form Data:', updatedFormData);
    updateFormMutation.mutate(updatedFormData);
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      let updatedCheckboxAnswers: string[] = [...prevFormData.checkboxAnswers];
  
      if (checked) {
        updatedCheckboxAnswers.push(value);
      } else {
        updatedCheckboxAnswers = updatedCheckboxAnswers.filter((item) => item !== value);
      }
  
      return { ...prevFormData, checkboxAnswers: updatedCheckboxAnswers };
    });
  };
  

  return (
    <div className="min-h-screen bg-purple-300 flex flex-col items-center justify-center">
        <button onClick={() => router.push('/formlist')} className="rounded-full bg-slate-200 px-4 py-2 text-gray-700 font-semibold mt-4 ml-4 self-start"
        >Back</button>
      <form className="flex-grow max-w-3xl w-full md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-md rounded p-6 mt-6 bg-white"
            onSubmit={handleFormSubmit}>
         {/* Text Input */}
         <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
  
        {/* Textarea Input */}
        <div className="mb-8">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="textAnswer">
            About you
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="textAnswer"
            placeholder="Enter text answer"
            value={formData.textAnswer}
            onChange={(e) => setFormData({ ...formData, textAnswer: e.target.value })}
          />
        </div>

        {/* Regular Text Input */}
        <div className="mb-8">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="regularTextInput">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="regularTextInput"
            type="text"
            placeholder="Enter regular text"
            value={formData.regularTextInput}
            onChange={(e) => setFormData({ ...formData, regularTextInput: e.target.value })}
          />
        </div>

        {/* Checkbox Inputs */}
        <div className="mb-8">
          <label className="block text-gray-700 text-lg font-bold mb-2">
            Preferred Hobbies
          </label>
          <div className='space-x-4'>
            <label htmlFor="checkbox1" className="inline-flex items-center">
              <input
                id="checkbox1"
                type="checkbox"
                value="Sports"
                checked={formData.checkboxAnswers.includes('Sports')}
                onChange={(e) => handleCheckboxChange(e)}
              />
              <span className="ml-2 text-black">Sports</span>
            </label>
            <label htmlFor="checkbox2" className="inline-flex items-center">
              <input
                id="checkbox2"
                type="checkbox"
                value="Music"
                checked={formData.checkboxAnswers.includes('Music')}
                onChange={(e) => handleCheckboxChange(e)}
              />
              <span className="ml-2 text-black">Music</span>
            </label>
            <label htmlFor="checkbox3" className="inline-flex items-center">
              <input
                id="checkbox3"
                type="checkbox"
                value="Cooking"
                checked={formData.checkboxAnswers.includes('Cooking')}
                onChange={(e) => handleCheckboxChange(e)}
              />
              <span className="ml-2 text-black">Cooking</span>
            </label>
          </div>
        </div>

                
        {/* Radio Group */}
        <div className="mb-8">
          <label className="block text-gray-700 text-lg font-bold mb-2">
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

            <label htmlFor="radioOption2" className="inline-flex items-center">
              <input
                id="radioOption2"
                type="radio"
                name="radioOptions" 
                value="Malay"
                onChange={(e) => setFormData({ ...formData, radioAnswer: e.target.value })}
                checked={formData.radioAnswer === 'Malay'}
              />
              <span className="ml-2 text-black">Malay</span>
            </label>

            <label htmlFor="radioOption3" className="inline-flex items-center">
              <input
                id="radioOption3"
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
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="dropdownAnswer">
            Preferred Game
          </label>
          <select
            id="dropdownAnswer"
            value={formData.dropdownAnswer}
            onChange={(e) => setFormData({ ...formData, dropdownAnswer: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select</option>
            <option value="CSGO">CSGO</option>
            <option value="Fortnite">Fortnite</option>
            <option value="Valorant">Valorant</option>
          </select>
        </div>

         {/* Date Input */}
         <div className="mb-8">
          <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="dateAnswer">
            Date of Birth
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="dateAnswer"
            type="date" 
            placeholder="Select date"
            value={formData.dateAnswer}
            onChange={(e) => setFormData({ ...formData, dateAnswer: e.target.value })} 
          />
        </div>

    
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormDetails;
