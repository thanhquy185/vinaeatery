import TableRUDActionsComponent from "../../../shared/TableRUDActionsComponent";
import { Button, InputNumber, Select, Tag } from "antd";
import { CommonStatusValue, IngredientUnitValues, ModalWidthValue } from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { CategoryIngredientCrudResponseType } from "../../../../types/CategoryIngredientType";
import type { ManagerTableContext, ManagerTableLockModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { IngredientSummaryResponseType } from "../../../../types/IngredientType";

type IngredientsTableComponentContext = ManagerTableContext & {
  ManagerIngredientModals: ManagerTableLockModals<IngredientSummaryResponseType>;
  categoryIngredients: CategoryIngredientCrudResponseType[] | undefined;
};

type IngredientsTableComponentProps = {
  context: IngredientsTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<IngredientSummaryResponseType> | undefined;
  isLoading: boolean;
  isScroll?: boolean;
  onPageChange: (page: number, size: number) => void;
};

const IngredientsTableComponent: FC<IngredientsTableComponentProps> = ({
  context,
  tableKey,
  object,
  data,
  isLoading,
  isScroll,
  onPageChange,
}) => {
  const {
    categoryIngredients,
    nameEN,
    nameVN,
    isManager,
    restaurantIdForCrud,
    validActions,
    ManagerIngredientModals,
    openModal,
  } = context;
  const columns: ColumnsType<IngredientSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
      width: "24%",
      className: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Loại nguyên liệu",
      key: "categoryIngredient",
      width: "14%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại nguyên liệu"
            style={{ width: "100%" }}
            options={categoryIngredients?.map((categoryIngredient) => ({
              label: `#${categoryIngredient.id} - ${categoryIngredient.name}`,
              value: categoryIngredient.id,
            }))}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          ></Select>
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.categoryIngredient.id === value,
      sorter: (a, b) => a.categoryIngredient.id - b.categoryIngredient.id,
      render: (record) =>
        `#${record.categoryIngredient.id} - ${record.categoryIngredient.name}`,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: "10%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Đơn vị"
            style={{ width: "100%" }}
            options={IngredientUnitValues?.map((unit) => ({
              label: unit,
              value: unit,
            }))}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          ></Select>
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.unit === value,
      sorter: (a, b) => a.unit!.localeCompare(b.unit),
    },
    {
      title: "Định lượng",
      dataIndex: "capacity",
      key: "capacity",
      width: "10%",
      sorter: (a, b) => a.capacity - b.capacity,
    },
    {
      title: "Giá nhập",
      dataIndex: "inputPrice",
      key: "inputPrice",
      width: "17%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
          </div>
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const inputPrice = record.inputPrice ?? 0;
        if (min && inputPrice < min) return false;
        if (max && inputPrice > max) return false;
        return true;
      },
      sorter: (a, b) => a.inputPrice - b.inputPrice,
      render: (inputPrice: number) => vietnamMoneyFormat(inputPrice),
    },
    {
      title: "Tồn kho",
      dataIndex: "inventory",
      key: "inventory",
      width: "12%",
      sorter: (a, b) => a.inventory - b.inventory,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag
          color={status === CommonStatusValue.active ? "green" : "red"}
          bordered={false}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: 200,
      fixed: "right",
      className: "buttons",
      render: (record: IngredientSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={ManagerIngredientModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<IngredientSummaryResponseType>
      tableKey={tableKey}
      object={object}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isScroll={isScroll}
      onPageChange={onPageChange}
    />
  );
};

export default IngredientsTableComponent;
