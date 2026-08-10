type MainHeaderComponentProps = { title: string };

const MainHeaderComponent: React.FC<MainHeaderComponentProps> = ({ title }) => {
  return (
    <div className="admin-manager-main__header">
      <h1>{title}</h1>
    </div>
  );
};

export default MainHeaderComponent;
