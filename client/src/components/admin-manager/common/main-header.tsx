// Admin - Manager Main Header Props
type AdminManagerMainHeaderProps = { title: string };

// Admin - Manager Main Header
const AdminManagerMainHeader: React.FC<AdminManagerMainHeaderProps> = ({
  title,
}) => {
  return (
    <div className="admin-manager-main__header">
      <h1>{title}</h1>
    </div>
  );
};

export default AdminManagerMainHeader;
