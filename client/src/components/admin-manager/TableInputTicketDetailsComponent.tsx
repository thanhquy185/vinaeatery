import TableNoActionsComponent from "./TableNoActionsComponent";
import type { InputTicketDDetailResponseType } from "../../types/InputTicketDetailType";

type TableInputTicketDetailsComponentProps = {
  className?: string;
  inputTicketDetails: InputTicketDDetailResponseType[];
};

const TableInputTicketDetailsComponent: React.FC<
  TableInputTicketDetailsComponentProps
> = ({ className, inputTicketDetails }) => {
  return (
    <TableNoActionsComponent
      className={`${className} input-ticket-detail`}
      columnWidths={["14%", "30%", "17%", "17%", "22%"]}
      columnTitles={[
        "Mã nguyên liệu",
        "Tên nguyên liệu",
        "Giá nhập",
        "Số lượng",
        "Thành tiền",
      ]}
      attributes={[
        "ingredient.id",
        "ingredient.name",
        "inputPrice",
        "quantity",
        "totalInputPriceDetail",
      ]}
      format={["", "", "price", "", "price"]}
      data={inputTicketDetails}
    />
  );
};

export default TableInputTicketDetailsComponent;
