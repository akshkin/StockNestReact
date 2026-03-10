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

	const [profileData, setProfileData] = useState({
		firstName: profile?.firstName,
		lastName: profile?.lastName,
		profileImageUrl: profile?.profileImageUrl,
	});

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
		const selected = e.target.files?.[0];
		if (selected) {
			setFile(selected);
		}
	}

	console.log(profile.profileImageUrl);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (file) {
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
					...profileData,
					profileImageUrl: response.filePath,
				});
			}
		} else if (removeProfileImage) {
			await removeProfileImageFromSupabase();
			await updateProfile({
				...profileData,
				profileImageUrl: null,
			});
		} else {
			await updateProfile({
				...profileData,
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

				<InputField
					label="First Name"
					name="firstName"
					value={profileData.firstName}
					type="text"
					placeholder="John"
					onChange={(e) =>
						setProfileData({ ...profileData, firstName: e.target.value })
					}
				/>
				<InputField
					label="Last Name"
					name="lastName"
					value={profileData.lastName}
					type="text"
					placeholder="Doe"
					onChange={(e) =>
						setProfileData({ ...profileData, lastName: e.target.value })
					}
				/>
				<button type="submit" disabled={isLoading || imageLoading}>
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
