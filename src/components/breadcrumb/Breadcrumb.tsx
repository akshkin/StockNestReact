import { Link, useLocation } from "react-router-dom";
import styles from "./breadcrumb.module.scss";
import { useGetGroupByIdQuery } from "../../api/groupsApi";
import { useGetCategoryByIdQuery } from "../../api/categoriesApi";

export default function Breadcrumb() {
  const location = useLocation();

  const paths = location.pathname.split("/").filter(Boolean);
  const groupId = paths[1];
  const categoryId = paths[3];

  const { data: group } = useGetGroupByIdQuery(groupId!, {
    skip: !groupId,
  });

  const { data: category } = useGetCategoryByIdQuery(
    { groupId: groupId!, categoryId: categoryId! },
    {
      skip: !categoryId,
    },
  );

  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    groups: "Groups",
    profile: "Profile",
    notifications: "Notifications",
  };

  // display group/category name instead of ids
  function getLabel(segment: string, index: number) {
    if (index === 1 && group?.name) {
      return group.name;
    }

    if (index === 3 && category?.name) {
      return category.name;
    }

    return labels[segment] || segment;
  }

  function shouldLink(index: number) {
    return paths[index] !== "category" && !(index === 3 && categoryId);
  }

  return (
    <nav className={styles.breadcrumb}>
      <Link to="/dashboard">Dashboard</Link>

      {paths.map((segment, index) => {
        // do not show / category
        if (segment === "category") return null;

        const to = "/" + paths.slice(0, index + 1).join("/");

        const label = getLabel(segment, index);

        return (
          <span key={to}>
            <span className={styles.separator}>/ </span>

            {shouldLink(index) ? (
              <Link to={to} className={styles.current}>
                {label}
              </Link>
            ) : (
              <span className={styles.current}>{label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
