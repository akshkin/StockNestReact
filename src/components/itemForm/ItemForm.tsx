import { useState } from "react";
import InputField from "../inputField/InputField";
import { useZodForm } from "../../hooks/useZodForm";
import type z from "zod";
import {
  useCreateItemMutation,
  useUpdateItemMutation,
  type Item,
} from "../../api/itemsApi";
import ErrorText from "../errorText/ErrorText";
import { itemSchema } from "../../schemas";
import { toast } from "react-toastify";
import {
  checkDuplicateItemError,
  extractErrorMessage,
} from "../../helpers/utils";

type itemSchema = z.infer<typeof itemSchema>;

type ItemFormProps = {
  mode: "Add" | "Edit"; //edit, add
  groupId: number;
  categoryId: number;
  itemId?: number;
  closeModal: () => void;
  initialValues?: itemSchema;
};

const defaultValues = {
  name: "",
  quantity: 0,
};

function ItemForm({
  mode,
  groupId,
  categoryId,
  itemId,
  closeModal,
  initialValues,
}: ItemFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const { data, update, errors, isValid } = useZodForm<itemSchema>(
    itemSchema,
    initialValues
      ? initialValues
      : {
          ...defaultValues,
        },
    () => setFormError(null),
  );

  const [createItem] = useCreateItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [showUpdateQuantityOptions, setShowUpdateQuantityOptions] =
    useState(false);
  const [existingItemData, setExistingItemData] = useState<Item | null>(null);

  const isEditing = mode === "Edit";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let res;
    if (isEditing) {
      res = await updateItem({ groupId, categoryId, itemId, formData: data });
    } else {
      res = await createItem({
        groupId,
        categoryId,
        formData: data,
      });
    }

    if (!("error" in res)) {
      if (isEditing) {
        toast.success("Successfully updated item!");
      } else {
        toast.success("Successfuly created item");
      }
      return closeModal();
    } else {
      if ("error" in res) {
        const err = extractErrorMessage(res?.error);
        setFormError(err);

        const existingItem = checkDuplicateItemError(res.error);
        if (existingItem) {
          // allow users to update quantity of existing item if they try to add an item with the same name in the same category
          setFormError(
            `${existingItem.name} already exists in this category. Would you like to update the quantity instead?`,
          );
          setShowUpdateQuantityOptions(true);
          setExistingItemData(existingItem);
          return;
        }
      }
    }
  }

  async function updateFromCreate() {
    setShowUpdateQuantityOptions(false);

    const existingItem = existingItemData;
    if (!existingItem) return;

    const res = await updateItem({
      groupId,
      categoryId,
      itemId: existingItem.itemId,
      formData: data,
    });

    if (!("error" in res)) {
      toast.success("Successfully updated item!");
      return closeModal();
    }
  }

  return (
    <form className="group-category-item-form">
      <InputField
        label="Item name"
        name="name"
        value={data.name}
        placeholder="Enter name of item e.g. Rice"
        onChange={(e) => update("name", e.target.value)}
        error={errors.name}
      />
      <InputField
        label="Quantity"
        name="quantity"
        value={data.quantity.toString()}
        placeholder="Enter quantity of item"
        onChange={(e) => update("quantity", e.target.value)}
        error={errors.quantity}
        inputMode="numeric"
        pattern="[0-9]"
        onBeforeInput={(e) => {
          // disable typing non-numeric input
          if (!/^\d$/.test(e.data)) {
            e.preventDefault();
          }
        }}
      />
      {formError && <ErrorText error={formError} />}
      {!showUpdateQuantityOptions && (
        <button disabled={!isValid} onClick={handleSubmit} className="button">
          {isEditing ? "Update" : "Add"}
        </button>
      )}
      {showUpdateQuantityOptions && (
        <>
          <p>Would you like to update the existing item instead?</p>
          <button
            onClick={() => {
              setShowUpdateQuantityOptions(false);
              closeModal();
            }}
          >
            No
          </button>
          <button onClick={updateFromCreate}>Yes</button>
        </>
      )}
    </form>
  );
}

export default ItemForm;
