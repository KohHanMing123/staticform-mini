// Next.js imports
import { useRouter } from 'next/router';

// API and utility imports
import { api } from "@/utils/api";

// Toast
import { toast } from "sonner";

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

export function FormList() {
  const router = useRouter();
  const { mutate: deleteFormMutation } = api.form.deleteForm.useMutation();

  const { data: fetchedForms = [], error: allFormsError } = api.form.getAllForms.useQuery();

  //to be used later 

  // useEffect(() => {
  // }, []);

  const handleFormClick = async (formId: string) => {
    await router.push(`/formdetails/${encodeURIComponent(formId)}`);
  };

  const handleDeleteForm = (formId: string) => {
    try {
      deleteFormMutation({ id: formId });
      toast.error('Form has been deleted');
      setTimeout(() => {
        router.reload();
      }, 800);
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  return (
    <div className="text-center bg-gray-100 min-h-screen py-8 px-4">
      <h1 className="text-5xl font-bold mb-8 text-indigo-800">All Forms</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div
          onClick={() => router.push('/form')}
          className="bg-indigo-200 rounded-lg shadow-md border-dashed border-2 border-indigo-500 p-8 cursor-pointer flex justify-center items-center col-span-1 transition duration-300 transform hover:scale-105"
          style={{ minHeight: '200px' }}
        >
          <FontAwesomeIcon icon={faPlus} className="text-indigo-600 mr-3 h-8 w-8" />
          <span className="text-indigo-800 text-xl font-semibold">Create New Form</span>
        </div>

        {allFormsError && <p className="text-red-600">Error fetching all forms: {allFormsError.message}</p>}
        {fetchedForms.map((form) => (
          <div
            key={form.id}
            onClick={() => handleFormClick(form.id)}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer transition duration-300 transform hover:shadow-lg"
            style={{ minHeight: '200px', padding: '30px' }}
          >
            <div className="h-full flex flex-col justify-between">
              <div>
                <p className="text-2xl text-center font-semibold mb-4 cursor-pointer text-indigo-800">
                  <span className="block pt-10">{form.title}</span>
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteForm(form.id);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold focus:outline-none"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2 h-5 w-5" />
                  
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
