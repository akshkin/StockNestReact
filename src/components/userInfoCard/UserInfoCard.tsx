import {
	useRemoveGroupMemberMutation,
	type GroupMember,
} from "../../api/groupsApi";
import { RiDeleteBin6Line } from "react-icons/ri";
import styles from "./userInfoCard.module.scss";
import { useState } from "react";
import Modal from "../modal/Modal";
import ErrorText from "../errorText/ErrorText";
import ConfirmDelete from "../confirmDelete/ConfirmDelete";

type UserCardInfoProps = {
	groupId: number;
	user: GroupMember;
	myRole: string;
};

function UserInfoCard({ groupId, user, myRole }: UserCardInfoProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { fullName, role, isMe, userId } = user;

	const [removeGroupMember, { isLoading, error }] =
		useRemoveGroupMemberMutation();

	async function handleDelete() {
		await removeGroupMember({ groupId, userId });

		if (!error) setIsModalOpen(false);
	}

	return (
		<div className={styles.userCard}>
			<span className={styles.avatar}></span>
			<p className={styles.name}>{fullName}</p>
			<p className={styles.role}>{role}</p>
			{(myRole === "Owner" || myRole === "Co-Owner") &&
				!isMe && ( // show delete button only to owner of the group
					<div className={styles.iconsContainer}>
						{/* <button>
						<RiEditLine color="blue" />
					</button>{" "} */}
						<button
							className={styles.deleteIcon}
							onClick={() => setIsModalOpen(true)}
						>
							<RiDeleteBin6Line color="red" />{" "}
						</button>
					</div>
				)}
			{isModalOpen && (
				<Modal
					title="Are you sure you want to remove this member from the group?"
					closeModal={() => setIsModalOpen(false)}
					children={
						<>
							<ConfirmDelete
								handleDelete={handleDelete}
								closeModal={() => setIsModalOpen(false)}
								isLoading={isLoading}
							/>
							{error && (
								<ErrorText error="An error occured while removing the member" />
							)}
						</>
					}
				/>
			)}
		</div>
	);
}

export default UserInfoCard;
