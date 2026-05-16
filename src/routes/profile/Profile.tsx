import { useState } from "react";
import { useGetProfileQuery } from "../../api/profileApi";
import styles from "./profile.module.scss";
import Modal from "../../components/modal/Modal";
import ProfileForm from "../../components/profileForm/ProfileForm";
import Loading from "../../components/loading/Loading";
import ErrorText from "../../components/errorText/ErrorText";
import { Pencil } from "lucide-react";
import SettingsAndPrivacy from "../../components/profileForm/SettingsAndPrivacy";

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: profile,
    isLoading,
    isFetching,
    isError,
  } = useGetProfileQuery({});

  const bucketUrl = import.meta.env.VITE_BUCKET_URL;

  const imgSrc = profile?.profileImageUrl
    ? `${bucketUrl}/${profile.profileImageUrl}`
    : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(profile?.fullName)}`;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.flex}>
        <h2>Profile</h2>
        <button
          className={styles.editIcon}
          onClick={() => setIsModalOpen(true)}
        >
          <Pencil />
        </button>
      </div>
      {isLoading || isFetching ? (
        <Loading />
      ) : isError ? (
        <ErrorText error={"An error occured while fetching details"} />
      ) : (
        <div className={styles.mainContent}>
          <img className={styles.avatar} src={imgSrc} alt="avatar" />
          <div>
            <div className={styles.flexColumn}>
              <h3>Name</h3>
              <p>{profile?.fullName}</p>
            </div>
            <div className={styles.flexColumn}>
              <h3>Email</h3>
              <p>{profile?.email}</p>
            </div>
          </div>
        </div>
      )}
      <SettingsAndPrivacy />
      {isModalOpen && (
        <Modal
          title="Edit Profile"
          closeModal={() => setIsModalOpen(false)}
          children={<ProfileForm closeModal={() => setIsModalOpen(false)} />}
        />
      )}
    </div>
  );
}

export default Profile;
