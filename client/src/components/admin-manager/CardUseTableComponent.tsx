import { UseTableStatusValue } from "../../constants/values";
import type { UseTableSummaryResponseType } from "../../types/UseTableType";

type CardUseTableComponentProps = {
  useTable: UseTableSummaryResponseType;
  onClick: () => void;
};

const CardUseTableComponent: React.FC<CardUseTableComponentProps> = ({
  useTable,
  onClick,
}) => {
  return (
    <div
      key={useTable.id}
      className={
        "use-table-card " +
        (useTable.status === UseTableStatusValue.occupied
          ? "red"
          : useTable.status === UseTableStatusValue.reserved
            ? "yellow"
            : useTable.status === UseTableStatusValue.empty
              ? "green"
              : "gray")
      }
      onClick={onClick}
    >
      <div className="title">{useTable.table.name}</div>
      <div className="info">
        <b>Tầng: </b>
        {useTable.table.floor.name}
      </div>
      <div className="info">
        <b>Số chỗ ngồi: </b>
        {useTable.table.seats}
      </div>
      <div className="info">
        <b>Trạng thái: </b>
        <span className="status">{useTable.status}</span>
      </div>
    </div>
  );
};

export default CardUseTableComponent;
