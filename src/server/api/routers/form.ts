import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

export const formRouter = createTRPCRouter({
  getAllForms: publicProcedure.query(async () => {
    try {
      const forms = await db.form.findMany();
      return forms;
    } catch (error: any) {
      throw new Error(`Failed to fetch all forms: ${error.message}`);
    }
  }),

  getFormById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const { id } = input;
        const form = await db.form.findUnique({
          where: { id },
          include: { fields: true },
        });
        if (!form) {
          throw new Error(`Form with ID ${id} not found`);
        }
        return form;
      } catch (error: any) {
        throw new Error(`Failed to fetch form by ID: ${error.message}`);
      }
    }),

  createForm: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        textAnswer: z.string(),
        regularTextInput: z.string(),
        checkboxAnswers: z.array(z.string()),
        radioAnswer: z.string().optional(),
        dropdownAnswer: z.string().optional(),
        dateAnswer: z.string().optional(),
        photoPublicId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const {
          title,
          textAnswer,
          regularTextInput,
          checkboxAnswers,
          radioAnswer,
          dropdownAnswer,
          dateAnswer,
          photoPublicId,
        } = input;

        const concatenatedCheckboxValues = checkboxAnswers.join(", ");

        const formFields = [
          {
            label: "Text Answer",
            type: "text",
            value: textAnswer,
          },
          {
            label: "Text Input",
            type: "text",
            value: regularTextInput,
          },
          {
            label: "Checkbox",
            type: "checkbox",
            value: concatenatedCheckboxValues,
          },
          ...(dropdownAnswer
            ? [
                {
                  label: "Dropdown",
                  type: "dropdown",
                  value: dropdownAnswer,
                },
              ]
            : []),
          ...(dateAnswer
            ? [
                {
                  label: "Date",
                  type: "date",
                  value: dateAnswer,
                },
              ]
            : []),
          ...(photoPublicId
            ? [
                {
                  label: "Upload Image",
                  type: "upload",
                  photoPublicId: photoPublicId,
                },
              ]
            : []),
        ];

        if (radioAnswer) {
          formFields.push({
            label: "Radio",
            type: "radio",
            value: radioAnswer,
          });
        }

        const createdForm = await db.form.create({
          data: {
            title,
            fields: {
              create: formFields,
            },
          },
          include: {
            fields: true,
          },
        });

        return createdForm;
      } catch (error: any) {
        throw new Error(`Failed to create form: ${error.message}`);
      }
    }),

  updateForm: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        fields: z.array(
          z.object({
            label: z.string(),
            value: z.string().optional(),
          }),
        ),
        photoPublicId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("Received input:", input);
      try {
        const { id, title, fields, photoPublicId } = input;

        const existingForm = await db.form.findUnique({
          where: { id },
          include: { fields: true },
        });

        if (!existingForm) {
          throw new Error(`Form with ID ${id} not found`);
        }

        const updatedForm = await db.form.update({
          where: { id },
          data: { title },
        });

        let updatedFields = [];

        if (photoPublicId) {
          const existingImageField = existingForm.fields.find(
            (field) => field.label === "Upload Image",
          );

          if (!existingImageField) {
            throw new Error(`'Upload Image' field not found`);
          }

          const updatedImageField = await db.formField.update({
            where: { id: existingImageField.id },
            data: {
              photoPublicId,
            },
          });

          console.log("Updated image field:", updatedImageField);
          updatedFields.push(updatedImageField);
        }

        const otherFieldsToUpdate = fields.filter(
          (field) => field.label !== "Upload Image",
        );
        for (const newField of otherFieldsToUpdate) {
          try {
            const existingField = existingForm.fields.find(
              (field) => field.label === newField.label,
            );

            if (!existingField) {
              throw new Error(`Field with label ${newField.label} not found`);
            }

            const updatedField = await db.formField.update({
              where: { id: existingField.id },
              data: {
                value: newField.value || existingField.value,
              },
            });

            updatedFields.push(updatedField);
          } catch (error) {
            console.error("Error updating field:", error);
            if (typeof error === "string") {
              throw new Error(`Failed to update field: ${error}`);
            } else if (error instanceof Error) {
              throw error;
            } else {
              throw new Error(`Failed to update field: Unknown error`);
            }
          }
        }

        return { updatedForm, updatedFields };
      } catch (error: any) {
        throw new Error(`Failed to update form: ${error.message}`);
      }
    }),

  deleteForm: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { id } = input;

        await db.formField.deleteMany({
          where: { formId: id },
        });

        const deletedForm = await db.form.delete({
          where: { id },
        });

        return deletedForm;
      } catch (error: any) {
        throw new Error(`Failed to delete form: ${error.message}`);
      }
    }),

  getAllFormFields: publicProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ input }) => {
      const { formId } = input;
      const formFields = await db.formField.findMany({
        where: { formId },
      });
      return formFields;
    }),

  getFormFieldById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      const formField = await db.formField.findUnique({
        where: { id },
      });
      return formField;
    }),
});

// createFormWithFields: protectedProcedure
//   .input(
//     z.object({
//       title: z.string(),
//       fields: z.array(
//         z.object({
//           label: z.string(),
//           type: z.string(),
//           options: z.array(
//             z.object({
//               value: z.string(),
//             })
//           ),
//         })
//       ),
//     })
//   )
//   .mutation(async ({ input, ctx }) => {
//     const { title, fields } = input;

//     // Create a new form
//     const createdForm = await ctx.db.form.create({
//       data: {
//         title,
//       },
//     });

//     // Create form fields (questions) for the form
//     for (const field of fields) {
//       const { label, type, options } = field;

//       const createdField = await ctx.db.formField.create({
//         data: {
//           label,
//           type,
//           formId: createdForm.id,
//           options: {
//             createMany: {
//               data: options.map((option) => ({ value: option.value })),
//             },
//           },
//         },
//       });
//     }

//     return createdForm;
//   }),
