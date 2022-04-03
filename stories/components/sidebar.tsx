import styles from "./sidebar.module.css";

export type SidebarProps = {
  title: string;
};

export const Sidebar = ({ title }: SidebarProps) => (
  <div className={styles.sidebar}>
    <div className={styles.title}>
      <div className={styles.titleLabel}>
        <h2>{title}</h2>
      </div>
      <div className={styles.titleActions}>
        <div className={styles.actionsContainer}>
          <a className="codicon codicon-ellipsis"></a>
        </div>
      </div>
    </div>
  </div>
);
