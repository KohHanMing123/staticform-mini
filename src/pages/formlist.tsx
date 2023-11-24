// Next.js imports
import { useRouter } from 'next/router';

// API and utility imports
import { api } from "@/utils/api";

// Toast
import { toast } from "sonner";

export function FormList() {
  const router = useRouter();
  const { mutate: deleteFormMutation } = api.form.deleteForm.useMutation();

  const { data: fetchedForms = [], error: allFormsError } = api.form.getAllForms.useQuery();

  //to be used later 

  // useEffect(() => {
  // }, []);

  const handleFormClick = async (formId: string) => {
    await router.push(`/formdetails/${encodeURIComponent(formId)}`);
    // Any code that needs to be executed after the route change
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      deleteFormMutation({ id: formId });
      toast.error('Form has been deleted');
      setTimeout(() => {
        router.reload();
      }, 400);
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  return (
    <div className="text-center bg-purple-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">All Forms</h1>

      <div className="flex justify-center mb-4">
      <button
        onClick={() => router.push('/form')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
      >     
        New Form
      </button>
    </div>

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
