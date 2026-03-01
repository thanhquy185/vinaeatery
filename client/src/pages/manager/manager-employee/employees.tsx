import { useMemo, useState, type FC } from "react";
import { Button, Select, Image, Tag } from "antd";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye, Key, Lock, PenBox, Unlock } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faLock,
//   faKey
//   faPenToSquare,
//   faUnlock,
// } from "@fortawesome/free-solid-svg-icons";
import type { ManagerPageProps } from "../../../common/props";
import type {
  RoleType,
  EmployeeType,
  RoleHistoryType,
  PermissionType,
} from "../../../common/types";
import {
  CommonStatus,
  EmployeeStatus,
  ImageSourcePath,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailEmployee from "../../../components/admin-manager/modal/employee/manager-detail-employee";
import ManagerCreateEmployee from "../../../components/admin-manager/modal/employee/manager-create-employee";
import ManagerUpdateEmployee from "../../../components/admin-manager/modal/employee/manager-update-employee.";
import ManagerLock from "../../../components/admin-manager/modal/manager-lock";
import ManagerChangePasswordEmployee from "../../../components/admin-manager/modal/employee/manager-change-password-employee";
import ManagerDetailRoleHistory from "../../../components/admin-manager/modal/role-history/manager-detail-role-history";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllRole } from "../../../requests/roles";
import { FindAllPermission } from "../../../requests/permissions";
import { FindAllEmployee } from "../../../requests/employees";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { getFilterSelectValueToShow } from "../../../utils/other-events";
import { useSecondModal } from "../../../hook/use-second-modal";

// Manager Employees Page
const ManagerEmployeesPage: FC<ManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Có là chủ nhà hàng đăng nhập
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ["roles"] });
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Biến giữ dữ liệu
  // - Chức vụ
  const { data: roles } = useEntityQuery<RoleType[]>({
    keys: ["roles", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllRole,
  });
  // - Quyền hạn
  const { data: permissions } = useEntityQuery<PermissionType[]>({
    keys: ["permissions", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllPermission,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: employees,
    isLoading,
    isError,
    error,
  } = useEntityQuery<EmployeeType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllEmployee,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<EmployeeType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "8%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "8%",
      render: (image: string) => (
        <Image src={image! ? image : ImageSourcePath + "no-image.png"} alt="" />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      width: "30",
      className: "left",
      sorter: (a, b) => a?.fullname!.localeCompare(b?.fullname!),
    },
    {
      title: "Chức vụ",
      key: "currentRole",
      width: "20%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Chức vụ"
            style={{ width: "100%" }}
            options={roles?.map((role) => ({
              label: `#${role?.id} - ${role?.name}`,
              value: role?.id,
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
      onFilter: (value, record) => record.currentRole?.id === value,
      sorter: (a, b) => a.currentRole?.id! - b.currentRole?.id!,
      render: (record) =>
        `#${record.currentRole?.id} - ${record.currentRole?.name}`,
    },
    {
      title: "Quyền hạn",
      key: "permission",
      width: "20%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Quyền hạn"
            style={{ width: "100%" }}
            options={permissions?.map((permission) => ({
              label: `#${permission?.id} - ${permission?.name}`,
              value: permission?.id,
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
      onFilter: (value, record) => record.permission?.id === value,
      sorter: (a, b) => a.permission?.id! - b.permission?.id!,
      render: (record) =>
        `#${record.permission?.id} - ${record.permission?.name}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag color={status === EmployeeStatus.active ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "14%",
      className: "buttons",
      render: (text: any, record: EmployeeType, index: number) => (
        <>
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.detail,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.detail)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.detail(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: ManagerEmployeeModals.detail(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faEye} /> */}
              <Eye />
            </button>
          )}
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.update,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.update)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.update(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: ManagerEmployeeModals.update(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
              <PenBox />
            </button>
          )}
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.lock,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.lock)}
              onClick={() =>
                openModal({
                  title:
                    record.status == EmployeeStatus.active
                      ? ModalTitleValue.lock(nameVN.toLowerCase())
                      : ModalTitleValue.unlock(nameVN.toLowerCase()),
                  width: ModalWidthValue.lock,
                  className: `${getActionNameEn(actionIndexes.lock)} ${nameEN}`,
                  children: ManagerEmployeeModals.lock(
                    record?.id as number,
                    record?.status!,
                  ),
                })
              }
            >
              {/* <FontAwesomeIcon
                icon={record.status == EmployeeStatus.active ? faLock : faUnlock}
              /> */}
              {record.status == EmployeeStatus.active ? <Lock /> : <Unlock />}
            </button>
          )}
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.print,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.print)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.changePassword(nameVN.toLowerCase()),
                  width: ModalWidthValue.split1,
                  className: `${getActionNameEn(
                    actionIndexes.print,
                  )} ${nameEN}`,
                  children: ManagerEmployeeModals.changePassword(
                    record?.user?.id!,
                  ),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faKey} /> */}
              <Key />
            </button>
          )}
        </>
      ),
    },
  ];

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Họ tên", value: "fullname" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatus.active, value: CommonStatus.active },
    { label: CommonStatus.inactive, value: CommonStatus.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );
  // - Lọc dữ liệu
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];

    return employees.filter((employee) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(employee.id).includes(value);
        }

        if (filterFindType === "fullname") {
          matchFind = employee.fullname?.toLowerCase().includes(value)!;
        }

        if (filterFindType === "phone") {
          matchFind = employee.phone?.toLowerCase().includes(value)!;
        }

        // if (filterFindType === "email") {
        //   matchFind = employee.email?.toLowerCase().includes(value)!;
        // }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(employee.status!);
      }

      return matchFind && matchStatus;
    });
  }, [employees, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title1: "Thông tin làm việc",
    title2: "Thông tin cá nhân",
    image: "Hình ảnh",
    fullname: "Họ và tên",
    birthday: "Ngày sinh",
    gender: "Giới tính",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    id: "Mã nhân viên",
    currentRole: "Chức vụ (Hiện tại)",
    username: "Tên tài khoản",
    password: "Mật khẩu",
    permission: "Quyền hạn",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    image: "Chọn Hình ảnh",
    fullname: "Nhập Họ và tên",
    birthday: "Chọn Ngày sinh",
    gender: "Chọn Giới tính",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    id: "Được xác định sau khi xác nhận thêm!",
    currentRole: "Chọn Chức vụ",
    username: "Nhập Tên tài khoản",
    password: "Nhập Mật khẩu",
    permission: "Chọn Quyền hạn",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerEmployeeModals = {
    detail: (employee: EmployeeType) => (
      <ManagerDetailEmployee
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={employee}
        dataForCrud={{
          roleHistories: employee?.roleHistories,
        }}
        modalForCrud={{
          roleHistories: {
            openModalDetail: ({
              roleHistories,
            }: {
              roleHistories?: RoleHistoryType[];
            }) =>
              openSecondModal({
                title: "Lịch sử chức vụ",
                width: ModalWidthValue.split3,
                className: "secondary role-history",
                children: ManagerRoleHistoryModals.detail({
                  roleHistories: roleHistories,
                }),
              }),
          },
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateEmployee
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        dataForCrud={{
          roles: roles,
          permissions: permissions,
        }}
        restaurantId={restaurantIdForCrud}
        closeModal={() => closeModal()}
      />
    ),
    update: (employee: EmployeeType) => (
      <ManagerUpdateEmployee
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={employee}
        dataForCrud={{
          roles: roles,
          permissions: permissions,
          roleHistories: employee?.roleHistories,
        }}
        modalForCrud={{
          roleHistories: {
            openModalDetail: ({
              roleHistories,
            }: {
              roleHistories?: RoleHistoryType[];
            }) =>
              openSecondModal({
                title: "Lịch sử chức vụ",
                width: ModalWidthValue.split3,
                className: "secondary role-history",
                children: ManagerRoleHistoryModals.detail({
                  roleHistories: roleHistories,
                }),
              }),
          },
        }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <ManagerLock
        objectVN={nameVN}
        objectEN={nameEN}
        restaurantId={restaurantIdForCrud}
        fieldId={id}
        fieldStatus={status}
        closeModal={() => closeModal()}
      />
    ),
    changePassword: (id: number) => (
      <ManagerChangePasswordEmployee
        objectVN={nameVN}
        objectEN={nameEN}
        fieldId={id}
        closeModal={() => closeModal()}
      />
    ),
  };

  // Các thành phần giữ giá trị cho việc hiển thị modal thứ 2
  // - Các biến
  const { secondModal, openSecondModal, closeSecondModal } = useSecondModal();
  // - Quản lý các modal
  const ManagerRoleHistoryModals = {
    detail: ({ roleHistories }: { roleHistories?: RoleHistoryType[] }) => (
      <ManagerDetailRoleHistory
        objectEN=""
        restaurantId={restaurantIdForCrud}
        roleHistories={roleHistories}
        closeModal={() => closeSecondModal()}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <AdminManagerMainHeader title={nameVN} />
        <AdminManagerMainFilterInfo
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
              children: ManagerEmployeeModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredEmployees || []}
          isLoading={isLoading}
        />
      </main>
      {modal.open && (
        <CustomModal
          title={modal.title}
          open={modal.open}
          width={modal.width}
          className={modal.className}
          children={modal.children}
          setCloseModal={() => closeModal()}
        />
      )}
      {secondModal.open && (
        <CustomModal
          title={secondModal.title}
          open={secondModal.open}
          width={secondModal.width}
          className={secondModal.className}
          children={secondModal.children}
          setCloseModal={() => closeSecondModal()}
        />
      )}
    </>
  );
};

export default ManagerEmployeesPage;
