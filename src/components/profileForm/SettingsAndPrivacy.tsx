import { useState } from "react";
import {
  useGetAllSessionsQuery,
  useRevokeSessionMutation,
  type UserSessionType,
} from "../../api/profileApi";
import styles from "./settingsAndPrivacy.module.scss";
import Modal from "../modal/Modal";
import ConfirmDelete from "../confirmDelete/ConfirmDelete";
import UserSessionCard from "../userSession/UserSessionCard";

function SettingsAndPrivacy() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<UserSessionType | null>(
    null,
  );

  const [revokeSession, { error }] = useRevokeSessionMutation();
  const { data: sessions } = useGetAllSessionsQuery();

  function closeModal() {
    setIsModalOpen(false);
  }

  console.log(error);
  console.log(activeSession);

  const modalChild = (session: UserSessionType) => {
    return (
      <div>
        <UserSessionCard
          session={session}
          displayRevokeButton={false}
          handleRevokeClick={handleRevokeClick}
        />
        <br />
        <ConfirmDelete
          handleDelete={() => handleRevokeSession(activeSession.sessionId!)}
          closeModal={closeModal}
          isLoading={false}
        />
      </div>
    );
  };

  function handleRevokeClick(session: UserSessionType) {
    setIsModalOpen(true);
    setActiveSession(session);
  }

  function handleRevokeSession(sessionId: number) {
    try {
      revokeSession(sessionId).unwrap();
      setIsModalOpen(false);
      // if (sessionId === activeSession?.sessionId) {
      // 	navigate("/");
      // }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        onClick={() => setIsSettingOpen((prev) => !prev)}
      >
        <h2>Settings & Privacy</h2>
        <span className={styles.chevron}>{isSettingOpen ? "▲" : "▼"}</span>
      </div>

      {isSettingOpen && (
        <div className={styles.content}>
          <p className={styles.subText}>
            You are currently logged in on these devices.
          </p>

          <div className={styles.sessionList}>
            {sessions?.length &&
              sessions.map((session) => (
                <UserSessionCard
                  session={session}
                  displayRevokeButton={true}
                  handleRevokeClick={handleRevokeClick}
                />
              ))}
          </div>
        </div>
      )}
      {isModalOpen && (
        <Modal
          title="This will log you out of this device"
          children={modalChild(activeSession!)}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default SettingsAndPrivacy;
