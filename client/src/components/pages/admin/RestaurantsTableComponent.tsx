import TableRUDActionsComponent from "../../shared/TableRUDActionsComponent";
import MainDataComponent from "../../admin-manager/tables/NewMainDataComponent";
import { Button, Image, Select, Tag } from "antd";
import { CommonStatusValue, ImageSourcePath, ModalWidthValue } from "../../../constants/values";
import type { ColumnsType } from "antd/es/table";
import type { ModalState } from "../../../hooks/useModal";
import type { ManagerCrudResponseType } from "../../../types/ManagerType";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RestaurantImageDetailResponseType } from "../../../types/RestaurantImageType";
import type { RestaurantSummaryResponseType } from "../../../types/RestaurantType";
import type { JSX } from "react";

type RestaurantTableModals = {
  detail: (data: RestaurantSummaryResponseType) => JSX.Element;
  update: (data: RestaurantSummaryResponseType) => JSX.Element;
  lock: (id: number, status: string | undefined) => JSX.Element;
};

type RestaurantsTableComponentProps = {
  tableKey: number;
  nameEN: string;
  nameVN: string;
  managers: ManagerCrudResponseType[] | undefined;
  managerModals: RestaurantTableModals;
  openModal: (payload: Omit<ModalState, "open">) => void;
  data: PageResponseType<RestaurantSummaryResponseType> | undefined;
  isLoading: boolean;
  onPageChange: (page: number, size: number) => void;
};
const RestaurantsTableComponent: React.FC<RestaurantsTableComponentProps> = (props) => {
  const { tableKey, nameEN, nameVN, managerModals, openModal, data, isLoading, onPageChange, managers } = props;
  const columns: ColumnsType<RestaurantSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Hình ảnh",
      dataIndex: "restaurantImages",
      key: "restaurantImages",
      width: "50%",
      render: (restaurantImages: RestaurantImageDetailResponseType[]) => {
        const list =
          restaurantImages && restaurantImages.length > 0
            ? restaurantImages
            : [{ image: ImageSourcePath + "no-image.png" }];

        return <Image src={list[0].image} alt="" />;
      },
    },
    {
      title: "Tên nhà hàng",
      dataIndex: "name",
      key: "name",
      width: "24%",
      className: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Chủ nhà hàng",
      key: "manager",
      width: "24%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 400, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Chủ nhà hàng"
            style={{ width: "100%" }}
            options={managers?.map((manager) => ({
              label: `#${manager.id} - ${manager.fullname}`,
              value: manager.id,
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
      onFilter: (value, record) => record.manager.id === value,
      sorter: (a, b) => a.manager.id - b.manager.id,
      render: (record) => `#${record.manager.id} - ${record.manager.fullname}`,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "18%",
      sorter: (a, b) => a.email.localeCompare(b.email),
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
      width: 100,
      fixed: "right",
      className: "buttons",
      render: (record: RestaurantSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isAdmin={true}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={managerModals}
          openModal={openModal}
        />
      ),
    },
  ];

  return (
    <MainDataComponent<RestaurantSummaryResponseType>
      tableKey={tableKey}
      object={nameEN}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isScroll={true}
      onPageChange={onPageChange}
    />
  );
};

export default RestaurantsTableComponent;
