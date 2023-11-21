import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from "@/utils/api";

export function FormList() {
  const router = useRouter();
  const { mutate: deleteFormMutation } = api.form.deleteForm.useMutation();

  const { data: fetchedForms = [], error: allFormsError } = api.form.getAllForms.useQuery();

  // useEffect(() => {
  // }, []);

  const handleFormClick = (formId: string) => {
    router.push(`/formdetails/${encodeURIComponent(formId)}`);
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      await deleteFormMutation({ id: formId });
      window.alert(`Form with ID ${formId} has been deleted.`);
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  return (
    <div className="text-center bg-purple-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">All Forms</h1>
      <div className="flex flex-wrap justify-center">
        {allFormsError && <p>Error fetching all forms: {allFormsError.message}</p>}
        {fetchedForms.map((form) => (
          <div key={form.id} className="max-w-md w-full md:w-1/3 lg:w-1/4 mx-4 my-4 bg-slate-200 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4">
              <p className="text-xl font-semibold mb-2 cursor-pointer" onClick={() => handleFormClick(form.id)}>
                Title: {form.title}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleDeleteForm(form.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormList;
