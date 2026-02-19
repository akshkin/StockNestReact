import {
	useRemoveGroupMemberMutation,
	type GroupMember,
} from "../../api/groupsApi";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import styles from "./userInfoCard.module.scss";
import { useState } from "react";
import Modal from "../modal/Modal";
import Loading from "../loading/Loading";
import ErrorText from "../errorText/ErrorText";

type UserCardInfoProps = {
	groupId: number;
	user: GroupMember;
	myRole: string;
};

function UserInfoCard({ groupId, user, myRole }: UserCardInfoProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { fullName, role, email, isMe } = user;

	const [removeGroupMember, { isLoading, error }] =
		useRemoveGroupMemberMutation();

	async function handleDelete() {
		await removeGroupMember({ groupId, email });

		if (!error) setIsModalOpen(false);
	}

	const modalChild = (
		<>
			<div>
				<button onClick={handleDelete}>
					{isLoading ? <Loading /> : "Confirm"}
				</button>
				<button onClick={() => setIsModalOpen(false)}>Cancel</button>
			</div>
			{error && (
				<ErrorText error="An error occured while removing the member" />
			)}
		</>
	);

	console.log(myRole, isMe);

	return (
		<div className={styles.userCard}>
			<span className={styles.avatar}></span>
			<p className={styles.name}>{fullName}</p>
			<p className={styles.role}>{role}</p>
			{myRole === "Owner" &&
				!isMe && ( // show delete button only to owner of the group
					<div className={styles.iconsContainer}>
						{/* <button>
						<RiEditLine color="blue" />
					</button>{" "} */}
						<button onClick={() => setIsModalOpen(true)}>
							<RiDeleteBin6Line color="red" />{" "}
						</button>
					</div>
				)}
			{isModalOpen && (
				<Modal
					title="Are you sure you want to remove this member from the group?"
					closeModal={() => setIsModalOpen(false)}
					children={modalChild}
				/>
			)}
		</div>
	);
}

export default UserInfoCard;
