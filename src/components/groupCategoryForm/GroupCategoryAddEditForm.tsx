import React, { useState } from "react";
import InputField from "../inputField/InputField";
import ErrorText from "../errorText/ErrorText";
import { useZodForm } from "../../hooks/useZodForm";
import type { ZodSchema } from "zod";
import { toast } from "react-toastify";
import { normalizeApiError } from "../../helpers/utils";

type FormProps<T> = {
  mode?: string;
  initialValue: T;
  label: "Group" | "Category"; // "Group", "Category",
  schema: ZodSchema<T>;
  groupId?: number;
  categoryId?: number;
  onCreate?: ({
    groupId,
    formData,
  }: {
    groupId?: number;
    formData: T;
  }) => Promise<any>; // eslint-disable-line
  onUpdate: ({
    groupId,
    categoryId,
    formData,
  }: {
    groupId: number;
    categoryId?: number;
    formData: T;
  }) => Promise<any>; // eslint-disable-line
  closeModal: () => void;
};

function GroupCategoryAddEditForm<T extends { name: string }>({
  mode,
  groupId,
  categoryId,
  initialValue,
  label,
  closeModal,
  schema,
  onCreate,
  onUpdate,
}: FormProps<T>) {
  const isEditing = mode === "Edit";
  const [error, setError] = useState<string | null>(null);

  const { data, update, errors, isValid } = useZodForm<T>(
    schema,
    {
      ...initialValue,
    } as T,
    () => setError(null),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        if (label === "Category") {
          //update category
          await onUpdate({
            groupId: groupId!,
            categoryId: categoryId,
            formData: data,
          });
        } else {
          //update group
          await onUpdate({
            groupId: groupId!,
            formData: data,
          });
        }
      } else {
        if (onCreate) {
          // create category or group
          if (groupId) {
            // create category
            await onCreate({ groupId: groupId, formData: data });
          } else {
            //create group
            await onCreate({ formData: data });
          }
        }
      }
      closeModal();
      toast.success(
        `${isEditing ? "Succesfully saved changes!" : `Succesfully created ${label}!`}`,
      );
    } catch (err: unknown) {
      const apiError = normalizeApiError(err);
      setError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="group-category-item-form">
      <InputField
        label={`${label} name`}
        name="name"
        value={data.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder={`Type ${label.toLowerCase()} name`}
        error={errors.name}
      />

      <button
        disabled={isSubmitting || !isValid}
        onClick={onSubmit}
        type="submit"
        className="button"
      >
        {isEditing ? "Update" : "Create"}
      </button>

      {error && <ErrorText error={error} />}
    </form>
  );
}

export default GroupCategoryAddEditForm;
