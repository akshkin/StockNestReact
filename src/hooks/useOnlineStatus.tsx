import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.info("You are back online!");
    };
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return isOnline;
}
