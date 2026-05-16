import { useState } from "react";
import {
  useLazyGetAllSessionsQuery,
  useRevokeSessionMutation,
  type UserSessionType,
} from "../../api/profileApi";
import styles from "./settingsAndPrivacy.module.scss";
import Modal from "../modal/Modal";
import ConfirmDelete from "../confirmDelete/ConfirmDelete";
import UserSessionCard from "../userSession/UserSessionCard";
import { toast } from "react-toastify";
import ErrorText from "../errorText/ErrorText";
import Loading from "../loading/Loading";

function SettingsAndPrivacy() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<UserSessionType | null>(
    null,
  );

  const [revokeSession] = useRevokeSessionMutation();
  const [
    triggerSessions,
    { data: sessions, error, isLoading: sessionsLoading },
  ] = useLazyGetAllSessionsQuery();

  function closeModal() {
    setIsModalOpen(false);
  }

  const modalChild = (session: UserSessionType) => {
    return (
      <div>
        <UserSessionCard session={session} displayRevokeButton={false} />
        <br />
        {activeSession && (
          <ConfirmDelete
            handleDelete={() => handleRevokeSession(activeSession.sessionId)}
            closeModal={closeModal}
            isLoading={false}
          />
        )}
        {error && (
          <ErrorText error={"Something went wrong. Failed to revoke session"} />
        )}
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
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Failed to revoke session");
    } finally {
      setIsModalOpen(false);
      setActiveSession(null);
    }
  }

  function handleSettingsClick() {
    setIsSettingOpen((prev) => !prev);
    try {
      triggerSessions().unwrap();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={handleSettingsClick}>
        <h2>Settings & Privacy</h2>
        <span className={styles.chevron}>{isSettingOpen ? "▲" : "▼"}</span>
      </div>

      {isSettingOpen &&
        (sessionsLoading ? (
          <Loading />
        ) : (
          <div className={styles.content}>
            <p className={styles.subText}>
              You are currently logged in on these devices.
            </p>

            <div className={styles.sessionList}>
              {sessions &&
                sessions?.length > 0 &&
                sessions.map((session) => (
                  <UserSessionCard
                    session={session}
                    displayRevokeButton={true}
                    handleRevokeClick={handleRevokeClick}
                  />
                ))}
            </div>
            {error && (
              <ErrorText error="There was a problem loading sessions" />
            )}
          </div>
        ))}
      {isModalOpen && activeSession && (
        <Modal
          title="This will log you out of this device"
          children={modalChild(activeSession)}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default SettingsAndPrivacy;
