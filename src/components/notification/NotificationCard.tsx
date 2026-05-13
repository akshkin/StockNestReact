import { formatDistanceToNow } from "date-fns";
import styles from "./notificationCard.module.scss";
import {
  useSetNotificationAsSeenMutation,
  type NotificationType,
} from "../../api/notificationsApi";
import { useNavigate } from "react-router-dom";
import { navigateFromNotification } from "../../helpers/utils";
import {
  FileMinus,
  FilePen,
  FilePlus,
  FolderCheck,
  FolderMinus,
  FolderPen,
  UserMinus,
  UserPlus,
  UsersRound,
} from "lucide-react";

type NotificationCardProps = {
  id: number;
  message: string;
  type: NotificationType;
  seen: boolean;
  createdAt: string;
  groupId?: number | null;
  categoryId?: number | null;
  itemId?: number | null;
};

function NotificationCard(props: NotificationCardProps) {
  const navigate = useNavigate();
  const [setNotificationAsSeen] = useSetNotificationAsSeenMutation();
  const { id, message, type, seen, createdAt } = props;

  async function handleClick() {
    try {
      await setNotificationAsSeen(id);
      navigateFromNotification({ ...props }, navigate);
    } catch (error) {
      console.error("Error setting notification as seen:", error);
    }
  }

  const icon = () => {
    switch (type) {
      case "UserJoinedGroup":
        // return <MdOutlineGroupAdd />;
        return <UserPlus />;

      case "UserRemovedFromGroup":
        // return <MdOutlineGroupRemove />;
        return <UserMinus />;
      case "GroupUpdated":
      case "GroupDeleted":
        // return <MdGroup />;
        return <UsersRound />;
      case "ItemUpdated":
        return <FilePen />;
      case "CategoryUpdated":
        // return <RxUpdate />;
        return <FolderPen />;
      case "CategoryCreated":
        // return <MdOutlineCreateNewFolder />;
        return <FolderCheck />;
      case "CategoryDeleted":
        // return <CgFolderRemove />;
        return <FolderMinus />;
      case "ItemCreated":
        return <FilePlus />;
      case "ItemDeleted":
        // return <CgFileRemove />;
        return <FileMinus />;
      default:
        return "🔔";
    }
  };

  return (
    <div
      className={`${styles.notificationCard} ${seen ? styles.seen : styles.unseen}`}
      onClick={handleClick}
    >
      <span className={styles.avatar}>{icon()}</span>
      <div className={styles.content}>
        <p>{message}</p>
        <span className={styles.timestamp}>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

export default NotificationCard;
