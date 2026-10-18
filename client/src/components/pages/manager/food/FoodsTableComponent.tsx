import TableRUDActionsComponent from "../../../shared/TableRUDActionsComponent";
import { Button, Image, InputNumber, Select, Tag } from "antd";
import {
  FoodStatusValue,
  ImageSourcePath,
  ModalWidthValue,
  FoodUnitValues,
} from "../../../../constants/values";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { ColumnsType } from "antd/es/table";
import type { FC } from "react";
import type { CategoryFoodCrudResponseType } from "../../../../types/CategoryFoodType";
import type { ManagerTableContext, ManagerTableLockModals } from "../ManagerTableContextType";
import MainDataComponent from "../../../admin-manager/tables/NewMainDataComponent";
import type { PageResponseType } from "../../../../types/PageResponseType";
import type { FoodSummaryResponseType } from "../../../../types/FoodType";

type FoodsTableComponentContext = ManagerTableContext & {
  ManagerFoodModals: ManagerTableLockModals<FoodSummaryResponseType>;
  categoryFoods: CategoryFoodCrudResponseType[] | undefined;
};

type FoodsTableComponentProps = {
  context: FoodsTableComponentContext;
  tableKey: number;
  object: string;
  data: PageResponseType<FoodSummaryResponseType> | undefined;
  isLoading: boolean;
  isScroll?: boolean;
  onPageChange: (page: number, size: number) => void;
};

const FoodsTableComponent: FC<FoodsTableComponentProps> = ({
  context,
  tableKey,
  object,
  data,
  isLoading,
  isScroll,
  onPageChange,
}) => {
  const {
    categoryFoods,
    nameEN,
    nameVN,
    isManager,
    restaurantIdForCrud,
    validActions,
    ManagerFoodModals,
    openModal,
  } = context;
  const columns: ColumnsType<FoodSummaryResponseType> = [
    {
      title: "",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: "16%",
      align: "center",
      render: (imageUrl: string) => (
        <Image src={imageUrl ?? ImageSourcePath + "no-image.png"} alt="" />
      ),
    },
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên món ăn",
      dataIndex: "name",
      key: "name",
      width: "20%",
      className: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Loại món ăn",
      key: "categoryFood",
      width: "14%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại món ăn"
            options={categoryFoods?.map((categoryFood) => ({
              label: `#${categoryFood.id} - ${categoryFood.name}`,
              value: categoryFood.id,
            }))}
            style={{ width: "100%" }}
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
      onFilter: (value, record) => record.categoryFood.id === value,
      sorter: (a, b) => a.categoryFood.id - b.categoryFood.id,
      render: (record) =>
        `#${record.categoryFood.id} - ${record.categoryFood.name}`,
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
            options={FoodUnitValues?.map((unit) => ({
              label: unit,
              value: unit,
            }))}
            style={{ width: "100%" }}
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
      sorter: (a, b) => a.unit!.localeCompare(b.unit!),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: "10%",
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
        const price = record.price ?? 0;
        if (min && price < min) return false;
        if (max && price > max) return false;
        return true;
      },
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => vietnamMoneyFormat(price),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag
          color={status === FoodStatusValue.active ? "green" : "red"}
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
      width: "10%",
      className: "buttons",
      render: (record: FoodSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={ManagerFoodModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<FoodSummaryResponseType>
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

export default FoodsTableComponent;
