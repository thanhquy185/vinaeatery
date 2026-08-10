import TableNoActionsComponent from "./TableNoActionsComponent";
import type { BillDDetailResponseType } from "../../types/BillDetailType";

type TableBillDetailsComponentProps = {
  className?: string;
  billDetails: BillDDetailResponseType[];
};

const TableBillDetailsComponent: React.FC<TableBillDetailsComponentProps> = ({
  className,
  billDetails,
}) => {
  return (
    <TableNoActionsComponent
      className={`${className} bill-detail`}
      columnWidths={["14%", "30%", "17%", "17%", "22%"]}
      columnTitles={[
        "Mã món ăn",
        "Tên món ăn",
        "Giá bán",
        "Số lượng",
        "Thành tiền",
      ]}
      attributes={[
        "food.id",
        "food.name",
        "price",
        "quantity",
        "totalPriceDetail",
      ]}
      format={["", "", "price", "", "price"]}
      data={billDetails}
    />
  );
};

export default TableBillDetailsComponent;
