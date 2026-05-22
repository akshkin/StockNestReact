import { LaptopMinimal, Monitor, Smartphone } from "lucide-react";
import type { UserSessionType } from "../../api/profileApi";
import styles from "./userSession.module.scss";

type UserSessionCardProps = {
  session: UserSessionType;
  displayRevokeButton: boolean;
  handleRevokeClick?: (session: UserSessionType) => void;
};

function UserSessionCard({
  session,
  displayRevokeButton = true,
  handleRevokeClick,
}: UserSessionCardProps) {
  const getDeviceIcon = (ua: string) => {
    if (
      ua.includes("Mobile") ||
      ua.includes("Android") ||
      ua.includes("iPhone")
    ) {
      return <Smartphone className={styles.icon} />;
    }

    if (ua.includes("Windows")) {
      return <LaptopMinimal className={styles.icon} />;
    }

    if (ua.includes("macintosh") || ua.includes("mac os")) {
      return <Monitor className={styles.icon} />;
    }

    if (ua.includes("linux")) {
      return <LaptopMinimal className={styles.icon} />;
    }

    return <LaptopMinimal className={styles.icon} />;
  };

  return (
    <div key={session.sessionId} className={styles.sessionCard}>
      <div className={styles.left}>
        <div className={styles.iconBox}>
          {getDeviceIcon(session.deviceName)}
        </div>

        <div>
          <h3 className={styles.deviceName}>{session.deviceName}</h3>
          {/* <p className={styles.location}>{session.location}</p> */}
        </div>
      </div>

      <div className={styles.right}>
        <p className={styles.time}>
          {new Date(session.lastActiveAt).toLocaleString()}
        </p>

        {session.isCurrentDevice && (
          <span className={styles.currentBadge}>This device</span>
        )}
      </div>
      {handleRevokeClick && displayRevokeButton && (
        <button
          className={styles.revokeButton}
          type="button"
          onClick={() => handleRevokeClick(session)}
        >
          Revoke
        </button>
      )}
    </div>
  );
}

export default UserSessionCard;
