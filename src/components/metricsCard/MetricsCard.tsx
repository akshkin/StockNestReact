import { type ReactNode } from "react";
import styles from "./metricsCard.module.scss";

type MetricsCardProps = {
  title: string;
  icon: ReactNode;
  backgroundColor: string;
  value: number;
};

function MetricsCard({
  title,
  icon,
  backgroundColor,
  value,
}: MetricsCardProps) {
  return (
    <div className={styles.metricsCard} style={{ backgroundColor }}>
      <span className={styles.icon}>{icon}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.value}>{value}</p>
    </div>
  );
}

export default MetricsCard;
