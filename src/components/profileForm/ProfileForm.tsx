import React, { useState } from "react";
import {
	useGetProfileQuery,
	useUpdateProfileMutation,
} from "../../api/profileApi";
import { useLazyUploadImageQuery } from "../../api/uploadApi";
import InputField from "../inputField/InputField";
import ErrorText from "../errorText/ErrorText";
import { LuUpload } from "react-icons/lu";
import styles from "./profileForm.module.scss";
import { toast } from "react-toastify";
import ConfirmDelete from "../confirmDelete/ConfirmDelete";
import Modal from "../modal/Modal";
import { supabase } from "../../lib/supabase";
import { useZodForm } from "../../hooks/useZodForm";
import { profileSchema } from "../../schemas";
import type z from "zod";

type ProfileFormProps = {
	closeModal: () => void;
};

function ProfileForm({ closeModal }: ProfileFormProps) {
	const [file, setFile] = useState<File | null>();
	const { data: profile } = useGetProfileQuery({});
	const [error, setError] = useState<string | null>(null);
	const [removeProfileImage, setRemoveProfileImage] = useState(false);
	const [isRemoveProfileImageModalOpen, setIsRemoveProfileImageModalOpen] =
		useState(false);
	const [fileSizeError, setFileSizeError] = useState("");

	const initialValues = {
		firstName: profile?.firstName,
		lastName: profile?.lastName,
	};

	type profileSchema = z.infer<typeof profileSchema>;

	const { data, update, errors, isValid } = useZodForm<profileSchema>(
		profileSchema,
		initialValues,
		() => setError(null),
	);

	const [triggerUpload, { isLoading: imageLoading, isError: imageError }] =
		useLazyUploadImageQuery();
	const [updateProfile, { isLoading, isError }] = useUpdateProfileMutation();

	async function removeProfileImageFromSupabase() {
		const { error } = await supabase.storage
			.from("avatars")
			.remove([profile.profileImageUrl]);
		if (error) {
			setError("An error occured");
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFileSizeError("");
		const selected = e.target.files?.[0];
		const maxFileSize = 1 * 1024 * 1024;
		if (selected) {
			if (selected?.size > maxFileSize) {
				setFileSizeError("File should be less than 1MB");
				return;
			}
			setFile(selected);
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (file) {
			//remove file from bucket to replace with new image
			if (profile.profileImageUrl) {
				await removeProfileImageFromSupabase();
			}

			// get signed url from server
			const response = await triggerUpload({}).unwrap();

			if (!("error" in response)) {
				// upload image to bucket
				const fetchResponse = await fetch(response.signedUrl.signedUrl, {
					method: "PUT",
					headers: {
						"Content-Type": file.type,
					},
					body: file,
				});

				if (!fetchResponse.ok) {
					setError("An error occured while trying to upload image");
					return;
				}

				await updateProfile({
					...data,
					profileImageUrl: response.filePath,
				});
			}
		} else if (removeProfileImage) {
			// if user has chosen to remove profile image
			await removeProfileImageFromSupabase();
			await updateProfile({
				...data,
				profileImageUrl: null,
			});
		} else {
			// if user just updates first name and last name
			await updateProfile({
				...data,
			});
		}
		if (imageError || isError) {
			setError("An error occured while saving changes");
			return;
		} else {
			closeModal();
			toast.success("Successfully updated profile!");
		}
	}

	function handleRemoveProfileImage() {
		setRemoveProfileImage(true);
		setIsRemoveProfileImageModalOpen(false);
	}

	const bucketUrl = import.meta.env.VITE_BUCKET_URL;

	return (
		<>
			<form onSubmit={handleSubmit}>
				{profile?.profileImageUrl && (
					<div className={styles.imageWithButton}>
						<img
							className={styles.image}
							src={`${bucketUrl}/${profile?.profileImageUrl}`}
						/>
						{!removeProfileImage && (
							<button
								type="button"
								className="invertedButton"
								onClick={() => setIsRemoveProfileImageModalOpen(true)}
							>
								Remove profile image
							</button>
						)}
					</div>
				)}

				<label htmlFor="file" className={styles.labelInputFile}>
					<LuUpload />
					Upload a profile image
				</label>
				<input
					type="file"
					accept="image/*"
					name="file"
					id="file"
					onChange={(e) => handleChange(e)}
					className={styles.inputFile}
				/>
				<span className={styles.fileName}>
					{file ? file?.name : "No file chosen"}
				</span>
				<small className={styles.smallText}>Max file size should be 1MB</small>

				{fileSizeError && <ErrorText error={fileSizeError} />}

				<InputField
					label="First Name"
					name="firstName"
					value={data.firstName}
					type="text"
					placeholder="John"
					onChange={(e) => update("firstName", e.target.value)}
					error={errors.firstName}
				/>

				<InputField
					label="Last Name"
					name="lastName"
					value={data.lastName}
					type="text"
					placeholder="Doe"
					onChange={(e) => update("lastName", e.target.value)}
					error={errors.lastName}
				/>
				<button type="submit" disabled={isLoading || imageLoading || !isValid}>
					Submit
				</button>
				<ErrorText error={error ?? ""} />
			</form>
			{isRemoveProfileImageModalOpen && (
				<Modal
					title="Are you sure you want to remove your profile image?"
					closeModal={() => setIsRemoveProfileImageModalOpen(false)}
					children={
						<ConfirmDelete
							handleDelete={handleRemoveProfileImage}
							closeModal={() => setIsRemoveProfileImageModalOpen(false)}
							isLoading={isLoading}
						/>
					}
				/>
			)}
		</>
	);
}

export default ProfileForm;
