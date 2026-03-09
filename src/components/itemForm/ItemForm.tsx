import { useState } from "react";
import InputField from "../inputField/InputField";
import { useZodForm } from "../../hooks/useZodForm";
import type z from "zod";
import {
	useCreateItemMutation,
	useUpdateItemMutation,
} from "../../api/itemsApi";
import ErrorText from "../errorText/ErrorText";
import { itemSchema } from "../../schemas";
import { toast } from "react-toastify";

type itemSchema = z.infer<typeof itemSchema>;

type ItemFormProps = {
	mode: string; //edit, add
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
	);

	const [createItem] = useCreateItemMutation();
	const [updateItem] = useUpdateItemMutation();

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
				const err = res?.error;
				if (err && "data" in err && typeof err?.data === "string") {
					setFormError(err?.data);
				} else {
					setFormError("An error occured while saving");
				}
			}
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
			/>
			{formError && <ErrorText error={formError} />}
			<button disabled={!isValid} onClick={handleSubmit}>
				Add
			</button>
		</form>
	);
}

export default ItemForm;
