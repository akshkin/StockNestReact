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

type ItemFormProps = {
	mode: string; //edit, add
	groupId: number;
	categoryId: number;
	itemId?: number;
	closeModal: () => void;
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
}: ItemFormProps) {
	type itemSchema = z.infer<typeof itemSchema>;
	// const [formData, setFormData] = useState<itemSchema>(defaultValues);
	const [formError, setFormError] = useState<string | null>(null);
	const { data, update, errors, isValid } = useZodForm<itemSchema>(itemSchema, {
		...defaultValues,
	});

	const [createItem] = useCreateItemMutation();
	const [updateItem] = useUpdateItemMutation();

	const isEditing = mode === "Edit";

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		let res;
		if (isEditing) {
			res = await updateItem({ groupId, categoryId, itemId, formData: data });
			console.log(res);
		} else {
			res = await createItem({
				groupId,
				categoryId,
				formData: data,
			});
			console.log(res);
		}

		if (!("error" in res)) {
			return closeModal();
		} else {
			if ("data" in res?.error && typeof res?.error?.data === "string") {
				setFormError(res?.error?.data);
			} else {
				setFormError("An error occured while saving");
			}
		}
	}

	return (
		<form>
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
