import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import type { AdminManagerPageProps } from "../../../constants/props";

const ManagerRestaurantPage: React.FC<AdminManagerPageProps> = ({ nameVN }) => {
  return (
    <main className="admin-manager-main">
      <MainHeaderComponent title={nameVN} />
    </main>
  );
};

export default ManagerRestaurantPage;
