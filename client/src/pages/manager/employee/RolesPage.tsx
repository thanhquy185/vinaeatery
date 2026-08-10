import useModal from "../../../hooks/useModal";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import ModalComponent from "../../../components/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import TableRUDActionsComponent from "../../../components/TableRUDActionsComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/MainFilterInfoComponent";
import MainDataComponent from "../../../components/admin-manager/NewMainDataComponent";
import DetailRoleModalComponent from "../../../components/admin-manager/modal/role/DetailRoleModalComponent";
import CreateRoleModalComponent from "../../../components/admin-manager/modal/role/CreateRoleModalComponent";
import UpdateRoleModalComponent from "../../../components/admin-manager/modal/role/UpdateRoleModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import RoleApiService from "../../../services/api/v1/RoleApiService";
import { useState } from "react";
import { Button, InputNumber, Select, Tag } from "antd";
import { RoleSalaryTypeValue } from "../../../constants/values";
import {
  CommonStatusValue,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../constants/values";
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
import type { RoleSummaryResponseType } from "../../../types/RoleType";

const ManagerRolesPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key
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
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatusValue.active, value: CommonStatusValue.active },
    { label: CommonStatusValue.inactive, value: CommonStatusValue.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: roleData, isLoading } = useEntityQuery<
    PageResponseType<RoleSummaryResponseType>
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
    api: RoleApiService.handleGetSummary,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<RoleSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "12%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên chức vụ",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Cách tính lương",
      dataIndex: "salaryType",
      key: "salaryType",
      width: "17%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Cách tính lương"
            style={{ width: "100%" }}
            options={[
              {
                label: RoleSalaryTypeValue.fixed,
                value: RoleSalaryTypeValue.fixed,
              },
              {
                label: RoleSalaryTypeValue.hours,
                value: RoleSalaryTypeValue.hours,
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
      onFilter: (value, record) => record.salaryType === value,
      sorter: (a, b) => a?.salaryType!.localeCompare(b?.salaryType!),
    },
    {
      title: "Tiền lương",
      dataIndex: "salaryValue",
      key: "salaryValue",
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
        const salaryValue = record.salaryValue ?? 0;
        if (min && salaryValue < min) return false;
        if (max && salaryValue > max) return false;
        return true;
      },
      sorter: (a, b) => a?.salaryValue! - b?.salaryValue!,
      render: (salaryValue: number) => vietnamMoneyFormat(salaryValue || 0),
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
      render: (record: RoleSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={ManagerRoleModals}
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
    id: "Mã chức vụ",
    name: "Tên chức vụ",
    salaryType: "Cách tính lương",
    salaryValue: "Tiền lương",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm !",
    name: "Nhập Tên chức vụ",
    salaryType: "Chọn Cách tính lương",
    salaryValue: "Nhập Tiền lương",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerRoleModals = {
    detail: (roleSummary: RoleSummaryResponseType) => (
      <DetailRoleModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={roleSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateRoleModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        closeModal={() => closeModal()}
      />
    ),
    update: (roleSummary: RoleSummaryResponseType) => (
      <UpdateRoleModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={roleSummary}
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
              width: ModalWidthValue.split2,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerRoleModals.create(),
            })
          }
        />
        <MainDataComponent<RoleSummaryResponseType>
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={roleData}
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

export default ManagerRolesPage;
