import { useMemo, useState, type FC } from "react";
import { Eye, Key, Lock, Unlock, Wrench } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faLock,
//   faPenToSquare,
//   faUnlock,
// } from "@fortawesome/free-solid-svg-icons";
import { Button, Select, Tag, type SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table/index";
import type { UserType } from "../../common/types.tsx";
import {
  CommonStatus,
  ModalTitleValue,
  UserIsUsingValue,
  UserRoleValue,
  ModalWidthValue,
} from "../../common/values.tsx";
import CustomModal from "../../components/common/modal.tsx";
import AdminManagerMainHeader from "../../components/admin-manager/common/main-header.tsx";
import AdminManagerMainData from "../../components/admin-manager/common/main-data.tsx";
import AdminManagerMainFilterInfo from "../../components/admin-manager/common/main-filter-info.tsx";
import AdminDetailUser from "../../components/admin-manager/modal/user/admin-detail-user.tsx";
import AdminCreateUser from "../../components/admin-manager/modal/user/admin-create-user.tsx";
import AdminUpdateUser from "../../components/admin-manager/modal/user/admin-update-user.tsx";
import AdminChangePasswordUser from "../../components/admin-manager/modal/user/admin-change-password-user.tsx";
import ManagerLock from "../../components/admin-manager/modal/manager-lock.tsx";
import { useModal } from "../../hook/use-modal.tsx";
import { useEntityQuery } from "../../hook/use-entity-query.tsx";
import { FindAllUser } from "../../requests/users.tsx";
import { actionIndexes, getActionNameEn } from "../../utils/default-actions.ts";
import { getFilterSelectValueToShow } from "../../utils/other-events.ts";

// Các giá trị chung
// - Tên đối tượng
const nameVN = "Tài khoản";
const nameEN = "users";

// Admin Users Page
const AdminUsersPage: FC = ({}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // // Quản trị hệ thống đăng nhập
  // const infoLoginRouteLoaderData = useRouteLoaderData("manager-info-login");
  // const infoLogin = infoLoginRouteLoaderData?.infoLogin;

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useEntityQuery<UserType[]>({
    keys: ["users"],
    params: {},
    api: FindAllUser,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<UserType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "8%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createAt",
      key: "createAt",
      width: "16%",
      //   filterDropdown: ({
      //     setSelectedKeys,
      //     selectedKeys,
      //     confirm,
      //     clearFilters,
      //   }) => (
      //     <div style={{ padding: 8 }}>
      //       <DatePicker.RangePicker
      //         format="YYYY-MM-DD"
      //         style={{ display: "flex" }}
      //         value={
      //           selectedKeys[0]
      //             ? (() => {
      //                 const [start, end] = JSON.parse(
      //                   selectedKeys[0] as string
      //                 ) as [string, string];
      //                 return [dayjs(start), dayjs(end)];
      //               })()
      //             : null
      //         }
      //         onChange={(dates) =>
      //           setSelectedKeys(
      //             dates
      //               ? [
      //                   JSON.stringify([
      //                     dates[0]?.toISOString(),
      //                     dates[1]?.toISOString(),
      //                   ]),
      //                 ]
      //               : []
      //           )
      //         }
      //       />
      //       <Button
      //         type="primary"
      //         size="small"
      //         style={{ width: "100%", marginTop: 8 }}
      //         onClick={() => confirm()}
      //       >
      //         Lọc
      //       </Button>
      //       {/* <Button
      //         size="small"
      //         style={{ width: "100%", marginTop: 4 }}
      //         onClick={() => {
      //           clearFilters?.();
      //           confirm();
      //         }}
      //       >
      //         Đặt lại
      //       </Button> */}
      //     </div>
      //   ),
      //   onFilter: (value, record) => {
      //     if (!value) return true;
      //     // parse JSON
      //     const [start, end] = JSON.parse(value as string) as [string, string];
      //     const date = dayjs(record.createAt);

      //     return (
      //       date.isSame(dayjs(start), "day") ||
      //       date.isSame(dayjs(end), "day") ||
      //       (date.isAfter(dayjs(start), "day") &&
      //         date.isBefore(dayjs(end), "day"))
      //     );
      //   },
      sorter: (a, b) => a?.createAt!.localeCompare(b?.createAt!),
      //   render: (val) => (val ? dayjs(val).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
      width: "20%",
      className: "left",
      sorter: (a, b) => a?.username!.localeCompare(b?.username!),
    },
    {
      title: "Quyền hạn",
      key: "role",
      width: "16%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Quyền hạn"
            style={{ width: "100%" }}
            options={[
              {
                label: UserRoleValue.admin,
                value: UserRoleValue.admin,
              },
              {
                label: UserRoleValue.manager,
                value: UserRoleValue.manager,
              },
              {
                label: UserRoleValue.customer,
                value: UserRoleValue.customer,
              },
              {
                label: UserRoleValue.employee,
                value: UserRoleValue.employee,
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
      onFilter: (value, record) => record.role === value,
      sorter: (a, b) => a.role!.localeCompare(b.role!),
      render: (record) => (
        <Tag
          color={
            record.role === UserRoleValue.admin
              ? "volcano"
              : record.role === UserRoleValue.manager
                ? "orange"
                : record.role === UserRoleValue.employee
                  ? "gold"
                  : "cyan"
          }
        >
          {record.role}
        </Tag>
      ),
    },
    {
      title: "Sử dụng",
      dataIndex: "isUsing",
      key: "isUsing",
      width: "12%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Sử dụng"
            style={{ width: "100%" }}
            options={[
              { label: UserIsUsingValue.using, value: UserIsUsingValue.using },
              {
                label: UserIsUsingValue.notUsing,
                value: UserIsUsingValue.notUsing,
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
      onFilter: (value, record) => record.isUsing === value,
      sorter: (a, b) => a?.isUsing!.localeCompare(b?.isUsing!),
      render: (isUsing: string) => (
        <Tag
          color={isUsing === UserIsUsingValue.using ? "magenta" : "geekblue"}
        >
          {isUsing}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: string) => (
        <Tag color={status === CommonStatus.active ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "16%",
      className: "buttons",
      render: (text: any, record: UserType, index: number) => (
        <>
          <button
            className={"action " + getActionNameEn(actionIndexes.detail)}
            onClick={() =>
              openModal({
                title: ModalTitleValue.detail(nameVN.toLowerCase()),
                width: ModalWidthValue.split2,
                className: `${getActionNameEn(actionIndexes.detail)} ${nameEN}`,
                children: AdminUserModals.detail(record),
              })
            }
          >
            {/* <FontAwesomeIcon icon={faEye} /> */}
            <Eye />
          </button>
          <button
            className={"action " + getActionNameEn(actionIndexes.update)}
            onClick={() =>
              openModal({
                title: ModalTitleValue.update(nameVN.toLowerCase()),
                width: ModalWidthValue.split1,
                className: `${getActionNameEn(actionIndexes.update)} ${nameEN}`,
                children: AdminUserModals.update(record),
              })
            }
          >
            {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
            <Wrench />
          </button>
          <button
            className={"action " + getActionNameEn(actionIndexes.lock)}
            onClick={() =>
              openModal({
                title:
                  record.status == CommonStatus.active
                    ? ModalTitleValue.lock(nameVN.toLowerCase())
                    : ModalTitleValue.unlock(nameVN.toLowerCase()),
                width: ModalWidthValue.lock,
                className: `${getActionNameEn(actionIndexes.lock)} ${nameEN}`,
                children: AdminUserModals.lock(
                  record?.id as number,
                  record?.status!,
                ),
              })
            }
          >
            {/* <FontAwesomeIcon
                icon={record.status == CommonStatus.active ? faLock : faUnlock}
              /> */}
            {record.status == CommonStatus.active ? <Lock /> : <Unlock />}
          </button>
          <button
            className={"action " + getActionNameEn(actionIndexes.print)}
            onClick={() =>
              openModal({
                title: ModalTitleValue.changePassword(nameVN.toLowerCase()),
                width: ModalWidthValue.split1,
                className: `${getActionNameEn(actionIndexes.print)} ${nameEN}`,
                children: AdminUserModals.changePassword(record?.id!),
              })
            }
          >
            {/* <FontAwesomeIcon icon={faKey} /> */}
            <Key />
          </button>
        </>
      ),
    },
  ];

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên TK", value: "username" },
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
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(user.id).includes(value);
        }

        if (filterFindType === "username") {
          matchFind = user.username?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(user.status!);
      }

      return matchFind && matchStatus;
    });
  }, [users, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã tài khoản",
    createAt: "Thời gian tạo",
    role: "Quyền hạn",
    username: "Tên tài khoản",
    password: "Mật khẩu",
    method: "Phương thức",
    isUsing: "Sử dụng",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title: "",
    id: "Chưa xác định!",
    createAt: "",
    role: "Chọn Quyền hạn",
    username: "Nhập Tên tài khoản",
    password: "Nhập Mật khẩu",
    method: "Chọn Phương thức",
    isUsing: "Chưa sử dụng",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const AdminUserModals = {
    detail: (user: UserType) => (
      <AdminDetailUser
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={user}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <AdminCreateUser
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        closeModal={() => closeModal()}
      />
    ),
    update: (user: UserType) => (
      <AdminUpdateUser
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={user}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <ManagerLock
        objectVN={nameVN}
        objectEN={nameEN}
        fieldId={id}
        fieldStatus={status}
        closeModal={() => closeModal()}
      />
    ),
    changePassword: (id: number) => (
      <AdminChangePasswordUser
        objectVN={nameVN}
        objectEN={nameEN}
        fieldId={id}
        closeModal={() => closeModal()}
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
          isShowFilterCreate={true}
          onClickFilterCreate={() =>
            openModal({
              title: ModalTitleValue.create(nameVN.toLowerCase()),
              width: ModalWidthValue.split2,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: AdminUserModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredUsers || []}
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
    </>
  );
};

export default AdminUsersPage;
