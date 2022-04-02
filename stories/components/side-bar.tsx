import styles from "./sidebar.module.css";

export const Sidebar = () => (
  <div className={styles.sidebar}>
    <div className={styles.title}>
      <div className={styles.titleLabel}>
        <h2>Allotment</h2>
      </div>
      <a className="codicon codicon-ellipsis"></a>
    </div>
  </div>
);
