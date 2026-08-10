import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/ModalComponent";
import TableRUDActionsComponent from "../../../components/TableRUDActionsComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/MainFilterInfoComponent";
import MainDataComponent from "../../../components/admin-manager/NewMainDataComponent";
import DetailMenuModalComponent from "../../../components/admin-manager/modal/menu/DetailMenuModalComponent";
import CreateMenuModalComponent from "../../../components/admin-manager/modal/menu/CreateMenuModalComponent";
import UpdateMenuModalComponent from "../../../components/admin-manager/modal/menu/UpdateMenuModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import FoodApiService from "../../../services/api/v1/FoodApiService";
import MenuApiService from "../../../services/api/v1/MenuApiService";
import { useState } from "react";
import {
  CommonStatusValue,
  MenuTypeValue,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../constants/values";
import { Button, InputNumber, Select, Tag } from "antd";
import { hasPermission } from "../../../utils/hasPermissions";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActions";
import {
  getFilterSelectValueToShow,
  vietnamMoneyFormat,
} from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { FoodCrudResponseType } from "../../../types/FoodType";
import type { MenuSummaryResponseType } from "../../../types/MenuType";

const ManagerMenusPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

  // Các biến giữ dữ liệu
  // - Món ăn
  const { data: foods } = useEntityQuery<FoodCrudResponseType[]>({
    keys: ["foods-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FoodApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "name" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatusValue.active, value: CommonStatusValue.active },
    { label: CommonStatusValue.inactive, value: CommonStatusValue.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: menuData, isLoading } = useEntityQuery<
    PageResponseType<MenuSummaryResponseType>
  >({
    keys: [
      nameEN,
      page,
      size,
      filterFindType,
      filterFindValue,
      filterStatusValue,
      restaurantIdForCrud,
    ],
    params: {
      page: page,
      size: size,
      findType: filterFindType!,
      findValue: filterFindValue!,
      statusValue: filterStatusValue!,
      restaurantId: restaurantIdForCrud,
    },
    api: MenuApiService.handleGetSummary,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<MenuSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "12%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên thực đơn",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Loại thực đơn",
      dataIndex: "type",
      key: "type",
      width: "17%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại thực đơn"
            style={{ width: "100%" }}
            options={[
              {
                label: MenuTypeValue.ala_carte,
                value: MenuTypeValue.ala_carte,
              },
              {
                label: MenuTypeValue.buffet,
                value: MenuTypeValue.buffet,
              },
            ]}
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
      onFilter: (value, record) => record.type === value,
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
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
      width: "12%",
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
      width: "12%",
      className: "buttons",
      render: (record: MenuSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={ManagerMenuModals}
          openModal={openModal}
        />
      ),
    },
  ];

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã thực đơn",
    name: "Tên thực đơn",
    type: "Loại thực đơn",
    price: "Giá tiền",
    description: "Mô tả",
    status: "Trạng thái",
    menuDetails: "Chi tiết thực đơn",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Chưa xác định!",
    name: "Nhập Tên thực đơn",
    type: "Chọn Loại thực đơn",
    price: "Nhập Giá tiền",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
    menuDetails: "",
  };
  // - Quản lý các modal
  const ManagerMenuModals = {
    detail: (menuSummary: MenuSummaryResponseType) => (
      <DetailMenuModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={menuSummary}
        dataForCrud={{ foods: foods }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateMenuModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{ foods: foods }}
        closeModal={() => closeModal()}
      />
    ),
    update: (menuSummary: MenuSummaryResponseType) => (
      <UpdateMenuModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={menuSummary}
        dataForCrud={{ foods: foods }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        restaurantId={restaurantIdForCrud}
        fieldId={id}
        fieldStatus={status}
        closeModal={() => closeModal()}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <MainHeaderComponent title={nameVN} />
        <MainFilterInfoComponent
          objectName={nameVN}
          findOptions={findOptions}
          filterFindType={filterFindType}
          filterFindValue={filterFindValue}
          setFilterFindType={setFilterFindType}
          setFilterFindValue={setFilterFindValue}
          statusOptions={statusOptions}
          filterStatusValue={getFilterSelectValueToShow({
            options: statusOptions,
            filterSelectValue: filterStatusValue,
          })}
          setFilterStatusValue={setFilterStatusValue}
          onClickFilterReset={() => {
            setFilterFindType(findOptions[0].value);
            setFilterFindValue(null);
            setFilterStatusValue(null);
            setTableKey((prev) => prev + 1);
          }}
          isShowFilterCreate={hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.create,
          })}
          onClickFilterCreate={() =>
            openModal({
              title: ModalTitleValue.create(nameVN.toLowerCase()),
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerMenuModals.create(),
            })
          }
        />
        <MainDataComponent<MenuSummaryResponseType>
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={menuData}
          isLoading={isLoading}
          onPageChange={(page, size) => {
            setPage(page);
            setSize(size);
          }}
        />
      </main>
      {modal.open && (
        <ModalComponent
          title={modal.title}
          open={modal.open}
          width={modal.width}
          className={modal.className}
          children={modal.children}
          setCloseModal={() => closeModal()}
        />
      )}
    </>
  );
};

export default ManagerMenusPage;
