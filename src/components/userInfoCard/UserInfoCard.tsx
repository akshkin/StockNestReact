import {
  useRemoveGroupMemberMutation,
  type GroupMember,
} from "../../api/groupsApi";
import styles from "./userInfoCard.module.scss";
import { useState } from "react";
import Modal from "../modal/Modal";
import ErrorText from "../errorText/ErrorText";
import ConfirmDelete from "../confirmDelete/ConfirmDelete";
import { toast } from "react-toastify";
import { UserRoundPen, UserRoundX } from "lucide-react";
import AddMemberForm from "../../routes/group/AddMemberForm";

type UserCardInfoProps = {
  groupId: number;
  user: GroupMember;
  myRole: string;
};

function UserInfoCard({ groupId, user, myRole }: UserCardInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { fullName, role, isMe, userId, profileImageUrl } = user;

  const [removeGroupMember, { isLoading, error }] =
    useRemoveGroupMemberMutation();

  async function handleDelete() {
    await removeGroupMember({ groupId, userId });

    if (!error) {
      setIsModalOpen(false);
      toast.success("Successfully removed member from the group");
    }
  }

  const bucketUrl = import.meta.env.VITE_BUCKET_URL;
  const imageSrc = profileImageUrl
    ? `${bucketUrl}/${profileImageUrl}`
    : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.fullName)}`;

  return (
    <div className={styles.userCard}>
      <span className={styles.avatar}>
        <img className={styles.avatar} alt="name avatar" src={imageSrc} />
      </span>
      <p className={styles.name}>
        {fullName} {isMe && <span className={styles.smallText}>(You)</span>}
      </p>
      <p className={styles.role}>{role}</p>

      {(myRole === "Owner" || myRole === "Co-Owner") &&
        !isMe && ( // show delete button only to owner of the group
          <div className={styles.iconsContainer}>
            <button
              title="Change user role"
              aria-label="Change user role"
              onClick={() => setIsEditModalOpen(true)}
            >
              <UserRoundPen />
            </button>{" "}
            <button
              className={styles.deleteIcon}
              onClick={() => setIsModalOpen(true)}
              title="Remove user from group"
              aria-label="Remove user from group"
            >
              <UserRoundX size={20} color="red" />{" "}
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
      {isEditModalOpen && (
        <Modal
          title={`Change user role for ${fullName}`}
          closeModal={() => setIsEditModalOpen(false)}
          children={
            <>
              <AddMemberForm
                groupId={groupId}
                closeModal={() => setIsEditModalOpen(false)}
                isEditingRole={true}
                memberRole={role}
                userId={userId}
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
