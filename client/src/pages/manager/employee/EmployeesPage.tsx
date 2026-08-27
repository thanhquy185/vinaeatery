import useModal from "../../../hooks/useModal";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import useEntityQueryToList from "../../../hooks/useEntityQueryToList";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import ModalComponent from "../../../components/ModalComponent";
import ConfigVNComponent from "../../../components/ConfigVNComponent";
import TableRUDActionsComponent from "../../../components/TableRUDActionsComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/MainFilterInfoComponent";
import MainDataComponent from "../../../components/admin-manager/NewMainDataComponent";
import DetailEmployeeModalComponent from "../../../components/admin-manager/modal/employee/DetailEmployeeModalComponent";
import CreateEmployeeModalComponent from "../../../components/admin-manager/modal/employee/CreateEmployeeModalComponent";
import UpdateEmployeeModalComponent from "../../../components/admin-manager/modal/employee/UpdateEmployeeModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import ChangePasswordModalComponent from "../../../components/admin-manager/modal/ChangePasswordModalComponent";
import RoleApiService from "../../../services/api/v1/RoleApiService";
import PermissionApiService from "../../../services/api/v1/PermissionApiService";
import EmployeeApiService from "../../../services/api/v1/EmployeeApiService";
import dayjs from "dayjs";
import { useState } from "react";
import { Button, Select, Image, Tag, DatePicker } from "antd";
import {
  CommonGenderValue,
  EmployeeStatusValue,
  ImageSourcePath,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../constants/values";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import {
  actionIndexes,
  getActionNameEn,
} from "../../../utils/defaultActionsUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { RoleCrudResponseType } from "../../../types/RoleType";
import type { PermissionCrudResponseType } from "../../../types/PermissionType";
import type { EmployeeSummaryResponseType } from "../../../types/EmployeeType";

const ManagerEmployeesPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Có là chủ nhà hàng đăng nhập
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

  // Biến giữ dữ liệu
  // - Chức vụ
  const { data: roles } = useEntityQueryToList<RoleCrudResponseType[]>({
    keys: ["roles-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: RoleApiService.handleGetCrud,
  });
  // - Quyền hạn
  const { data: permissions } = useEntityQueryToList<
    PermissionCrudResponseType[]
  >({
    keys: ["permissions-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: PermissionApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Họ tên", value: "fullname" },
    { label: "Tên TK", value: "username" },
    { label: "SĐT", value: "phone" },
    { label: "Email", value: "email" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: EmployeeStatusValue.active, value: EmployeeStatusValue.active },
    {
      label: EmployeeStatusValue.inactive,
      value: EmployeeStatusValue.inactive,
    },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: employeeData, isLoading } = useEntityQuery<
    PageResponseType<EmployeeSummaryResponseType>
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
    api: EmployeeApiService.handleGetSummary,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<EmployeeSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      className: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "8%",
      render: (image: string) => (
        <Image src={image ? image : ImageSourcePath + "no-image.png"} alt="" />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      width: "24%",
      className: "left",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: "Tên tài khoản",
      dataIndex: ["user", "username"],
      key: "username",
      width: "20%",
      sorter: (a, b) => a.user.username.localeCompare(b.user.username),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthdate",
      key: "birthdate",
      width: "12%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <ConfigVNComponent
            children={
              <DatePicker.RangePicker
                placeholder={["Bắt đầu", "Kết thúc"]}
                format="YYYY-MM-DD"
                style={{ display: "flex" }}
                value={
                  selectedKeys[0]
                    ? (() => {
                        const [start, end] = JSON.parse(
                          selectedKeys[0] as string,
                        ) as [string, string];
                        return [dayjs(start), dayjs(end)];
                      })()
                    : null
                }
                onChange={(dates) =>
                  setSelectedKeys(
                    dates
                      ? [
                          JSON.stringify([
                            dates[0]?.toISOString(),
                            dates[1]?.toISOString(),
                          ]),
                        ]
                      : [],
                  )
                }
              />
            }
          />
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
      onFilter: (value, record) => {
        if (!value) return true;
        const [start, end] = JSON.parse(value as string) as [string, string];
        const date = dayjs(record.birthdate);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) =>
        dayjs(a.birthdate).valueOf() - dayjs(b.birthdate).valueOf(),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: "12%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Giới tính"
            style={{ width: "100%" }}
            options={[
              { label: CommonGenderValue.male, value: CommonGenderValue.male },
              {
                label: CommonGenderValue.female,
                value: CommonGenderValue.female,
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
      onFilter: (value, record) => record.gender === value,
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      render: (gender: string) => (
        <Tag
          color={gender === CommonGenderValue.male ? "geekblue" : "magenta"}
          bordered={false}
        >
          {gender}
        </Tag>
      ),
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
      width: "20%",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Chức vụ",
      key: "role",
      width: "20%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Chức vụ"
            style={{ width: "100%" }}
            options={roles?.map((role) => ({
              label: `#${role.id} - ${role.name}`,
              value: role.id,
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
      onFilter: (value, record) => record.role.id === value,
      sorter: (a, b) => a.role.id - b.role.id,
      render: (record) => `#${record.role.id} - ${record.role.name}`,
    },
    {
      title: "Quyền hạn",
      key: "permission",
      width: "20%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Quyền hạn"
            style={{ width: "100%" }}
            options={permissions?.map((permission) => ({
              label: `#${permission.id} - ${permission.name}`,
              value: permission.id,
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
      onFilter: (value, record) => record.permission.id === value,
      sorter: (a, b) => a.permission.id - b.permission.id,
      render: (record) =>
        `#${record.permission.id} - ${record.permission.name}`,
    },
    {
      title: "Thông tin",
      dataIndex: "status",
      key: "status",
      width: "8%",
      render: (status: string) => (
        <Tag
          color={status === EmployeeStatusValue.active ? "green" : "red"}
          bordered={false}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Tài khoản",
      dataIndex: ["user", "status"],
      key: "userStatus",
      width: "8%",
      render: (userStatus: string) => (
        <Tag
          color={userStatus === EmployeeStatusValue.active ? "green" : "red"}
          bordered={false}
        >
          {userStatus}
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
      render: (record: EmployeeSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          hasLockUser={true}
          hasChangePasswordUser={true}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={ManagerEmployeeModals}
          openModal={openModal}
        />
      ),
    },
  ];

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    id: "Mã nhân viên",
    title1: "Thông tin cơ bản",
    title2: "Thông tin tài khoản",
    title3: "Thông tin làm việc",
    role: "Chức vụ (Hiện tại)",
    permission: "Quyền hạn",
    image: "Hình ảnh",
    fullname: "Họ và tên",
    birthdate: "Ngày sinh",
    gender: "Giới tính",
    phone: "Số điện thoại",
    email: "Email",
    houseNumber: "Số nhà",
    streetName: "Tên đường",
    ward: "Phường / Xã",
    province: "Tỉnh / Thành phố",
    description: "Mô tả",
    status: "Trạng thái",
    userId: "Mã tài khoản",
    userRole: "Quyền tài khoản",
    userMethod: "Phương thức tạo tài khoản",
    userStatus: "Trạng thái tài khoản",
    userUsername: "Tên tài khoản",
    userPassword: "Mật khẩu",
    roleHistories: "Lịch sử chức vụ",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    title3: "",
    id: "Được xác định sau khi xác nhận thêm!",
    role: "Chọn Chức vụ",
    permission: "Chọn Quyền hạn",
    image: "Chọn Hình ảnh",
    fullname: "Nhập Họ và tên",
    birthdate: "Chọn Ngày sinh",
    gender: "Chọn Giới tính",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    houseNumber: "Nhập Số nhà",
    streetName: "Nhập Tên đường",
    ward: "Chọn Phường / Xã",
    province: "Chọn Tỉnh / Thành phố",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
    userId: "Chưa xác định!",
    userRole: "Nhân viên",
    userMethod: "Tạo tài khoản thủ công",
    userStatus: "Hoạt động",
    userUsername: "Nhập Tên tài khoản",
    userPassword: "Nhập Mật khẩu",
    roleHistories: "",
  };
  // - Quản lý các modal
  const ManagerEmployeeModals = {
    detail: (employeeSummary: EmployeeSummaryResponseType) => (
      <DetailEmployeeModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={employeeSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateEmployeeModalComponent
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
    update: (employeeSummary: EmployeeSummaryResponseType) => (
      <UpdateEmployeeModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={employeeSummary}
        dataForCrud={{
          roles: roles,
          permissions: permissions,
        }}
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
    lockUser: (userId: number, userStatus: string) => (
      <LockModalComponent
        objectVN="Tài khoản nhân viên"
        objectEN="users"
        objectENPrimary={nameEN}
        fieldId={userId}
        fieldStatus={userStatus}
        closeModal={() => closeModal()}
      />
    ),
    changePasswordUser: (userId: number) => (
      <ChangePasswordModalComponent
        objectVN="Tài khoản nhân viên"
        objectEN="users"
        objectENPrimary={nameEN}
        fieldId={userId}
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
              children: ManagerEmployeeModals.create(),
            })
          }
        />
        <MainDataComponent<EmployeeSummaryResponseType>
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={employeeData}
          isLoading={isLoading}
          isScroll={true}
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

export default ManagerEmployeesPage;
