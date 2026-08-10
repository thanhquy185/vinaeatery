import { useMemo } from "react";
import { Table } from "antd";
import { vietnamMoneyFormat } from "../../utils/otherEvents";
import type { ExpenseSegmentKey } from "../../constants/enums";
import type {
  ExpenseInputTicketTableBodyResponseType,
  ExpenseInputTicketTableFootResponseType,
  ExpenseIngredientTableBodyResponseType,
  ExpenseIngredientTableFootResponseType,
  ExpenseSupplierTableBodyResponseType,
  ExpenseSupplierTableFootResponseType,
} from "../../types/ExpenseType";

const columnsWidth: Record<ExpenseSegmentKey, string[]> = {
  "input-ticket": ["10%", "10%", "10%", "22%", "22%", "26%"],
  ingredient: ["30%", "22%", "22%", "26%"],
  supplier: ["30%", "22%", "22%", "26%"],
};
const formats: Record<ExpenseSegmentKey, string[]> = {
  "input-ticket": ["", "", "", "", "", "price"],
  ingredient: ["", "price", "", "price"],
  supplier: ["", "", "", "price"],
};
const dataIndex: Record<ExpenseSegmentKey, string[]> = {
  "input-ticket": [
    "label",
    "start",
    "end",
    "inputTicket",
    "quantity",
    "expense",
  ],
  ingredient: ["ingredientName", "inputPrice", "quantity", "expense"],
  supplier: ["supplierFullname", "inputTicket", "quantity", "expense"],
};

type MainTableExpenseDashboardComponentProps = {
  id: string;
  className?: string;
  segmentValue: ExpenseSegmentKey;
  inputTicketTableBody?: ExpenseInputTicketTableBodyResponseType[];
  inputTicketTableFoot?: ExpenseInputTicketTableFootResponseType;
  ingredientTableBody?: ExpenseIngredientTableBodyResponseType[];
  ingredientTableFoot?: ExpenseIngredientTableFootResponseType;
  supplierTableBody?: ExpenseSupplierTableBodyResponseType[];
  supplierTableFoot?: ExpenseSupplierTableFootResponseType;
};

const MainTableExpenseDashboardComponent: React.FC<
  MainTableExpenseDashboardComponentProps
> = ({
  id,
  className,
  segmentValue,
  inputTicketTableBody,
  inputTicketTableFoot,
  ingredientTableBody,
  ingredientTableFoot,
  supplierTableBody,
  supplierTableFoot,
}) => {
  const columnsTitle = useMemo(() => {
    if (segmentValue === "input-ticket" && inputTicketTableBody) {
      return {
        "input-ticket": [
          (inputTicketTableBody ?? [{ label: " " }])[0].label.split(" ")[0] ??
            "",
          "Từ ngày",
          "Đến ngày",
          "Tổng số phiếu",
          "Tổng số nguyên liệu",
          "Chi tiêu",
        ],
        ingredient: [""],
        supplier: [""],
      };
    }
    if (segmentValue === "ingredient" && ingredientTableBody) {
      return {
        "input-ticket": [""],
        ingredient: ["Nguyên liệu", "Giá nhập", "Số lượng nhập", "Chi tiêu"],
        supplier: [""],
      };
    }
    if (segmentValue === "supplier" && supplierTableBody) {
      return {
        "input-ticket": [""],
        ingredient: [""],
        supplier: [
          "Nhà cung cấp",
          "Tổng số phiếu",
          "Tổng số nguyên liệu",
          "Chi tiêu",
        ],
      };
    }

    return { "input-ticket": [""], ingredient: [""], supplier: [""] };
  }, [
    segmentValue,
    inputTicketTableBody,
    ingredientTableBody,
    supplierTableBody,
  ]);
  const dataSource = useMemo(() => {
    if (segmentValue === "input-ticket" && inputTicketTableBody) {
      return inputTicketTableBody.map((item, index) => ({
        key: index,
        ...item,
      }));
    } else if (segmentValue === "ingredient" && ingredientTableBody) {
      return ingredientTableBody.map((item, index) => ({
        key: index,
        ...item,
      }));
    } else if (segmentValue === "supplier" && supplierTableBody) {
      return supplierTableBody.map((item, index) => ({
        key: index,
        ...item,
      }));
    }

    return [];
  }, [
    segmentValue,
    inputTicketTableBody,
    ingredientTableBody,
    supplierTableBody,
  ]);
  const columns = useMemo(() => {
    return columnsTitle[segmentValue].map((title, index) => ({
      title,
      dataIndex: dataIndex[segmentValue][index],
      key: dataIndex[segmentValue][index],
      width: columnsWidth[segmentValue][index],
      className: formats[segmentValue][index] === "info" ? "left" : "center",
      render:
        segmentValue === "ingredient" && index === 0
          ? (_: any, record: ExpenseIngredientTableBodyResponseType) => ({
              children: <span className="cell-span">{record.name}</span>,
              props: {
                rowSpan: record.rowSpan,
              },
            })
          : (value: any) => {
              if (formats[segmentValue][index] === "price") {
                return vietnamMoneyFormat(Number(value));
              }

              return value;
            },
    }));
  }, [
    segmentValue,
    inputTicketTableBody,
    ingredientTableBody,
    supplierTableBody,
  ]);

  const summary = () => {
    if (segmentValue === "input-ticket" && inputTicketTableFoot) {
      return (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}>
              <b>TỔNG</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">
              {inputTicketTableFoot.totalInputTicket}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="center">
              {inputTicketTableFoot.totalQuantity}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5} align="center">
              {vietnamMoneyFormat(inputTicketTableFoot.totalExpense)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
    } else if (segmentValue === "ingredient" && ingredientTableFoot) {
      return (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <b>TỔNG</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center">
              {ingredientTableFoot.totalQuantity}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">
              {vietnamMoneyFormat(ingredientTableFoot.totalExpense)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
    } else if (segmentValue === "supplier" && supplierTableFoot) {
      return (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={1}>
              <b>TỔNG</b>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="center">
              {supplierTableFoot.totalInputTicket}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="center">
              {supplierTableFoot.totalQuantity}
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="center">
              {vietnamMoneyFormat(supplierTableFoot.totalExpense)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      );
    }
  };

  return (
    <div id={id} className="admin-manager-main__data">
      <Table
        columns={columns}
        dataSource={dataSource as any}
        pagination={false}
        summary={summary}
        className={"table-dashboard " + className}
      />
    </div>
  );
};

export default MainTableExpenseDashboardComponent;
