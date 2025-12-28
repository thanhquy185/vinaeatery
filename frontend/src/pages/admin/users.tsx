import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faGear,
  faKey,
  faLock,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Tag,
  type SelectProps,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ReactQueryMutationProps } from "../../common/props.tsx";
import type { UsersType } from "../../common/types.tsx";
import { ruleRequired } from "../../common/rules.tsx";
import {
  CommonStatus,
  ReactQueryGetData,
  TitleModalCommon,
  UserIsUsingValue,
  UserMethodValue,
  UserRoleValue,
} from "../../common/values.tsx";
import CustomFindInput from "../../components/common/find-input.tsx";
import CustomFindSelect from "../../components/common/find-select.tsx";
import CustomTableActions from "../../components/common/table-actions.tsx";
import CustomModal from "../../components/common/modal.tsx";
import {
  FindAllUser,
  HandleChangePasswordUser,
  HandleCreateUser,
  HandleLockUser,
  HandleUpdateUser,
} from "../../services/api.tsx";
import { getActionNameEn } from "../../services/default-actions.tsx";
import { openConfirmation } from "../../utils/showConfirmation.ts";
import { openNotification } from "../../utils/showNotification.ts";
import dayjs from "dayjs";

const { Option } = Select;

// Các giá trị chung
// - Tên đối tượng
const objectName = "Tài khoản";
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());
const titleModalChangePassword = TitleModalCommon.changePassword(
  objectName.toLowerCase()
);
// - Key của notification
const notificationKey = "users-notification";

// Admin Users Page
const AdminUsersPage = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên TK", value: "username" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Sử dụng
  const isUsingOptions: SelectProps["options"] = [
    { label: UserIsUsingValue.using, value: UserIsUsingValue.using },
    { label: UserIsUsingValue.notUsing, value: UserIsUsingValue.notUsing },
  ];
  const [filterIsUsingValue, setFilterIsUsingValue] = useState<string[] | null>(
    null
  );
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatus.active, value: CommonStatus.active },
    { label: CommonStatus.inactive, value: CommonStatus.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "users",
      filterFindType,
      filterFindValue,
      filterIsUsingValue,
      filterStatusValue,
    ],
    queryFn: async () => {
      const res = await FindAllUser({
        findType: filterFindType!,
        findValue: filterFindValue!,
        isUsingValue: filterIsUsingValue!,
        statusValue: filterStatusValue!,
      });
      if (res.status === 200) {
        return res.data;
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw res;
      }
    },
    enabled: !!filterFindType, //
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<UsersType> = [
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
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          >
            <Option key="admin" value={UserRoleValue.admin}>
              {UserRoleValue.admin}
            </Option>
            <Option key="manager" value={UserRoleValue.manager}>
              {UserRoleValue.manager}
            </Option>
            <Option key="customer" value={UserRoleValue.customer}>
              {UserRoleValue.customer}
            </Option>
            <Option key="employee" value={UserRoleValue.employee}>
              {UserRoleValue.employee}
            </Option>
          </Select>
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
      render: (text: any, record: UsersType, index: number) => (
        <>
          {
            <button
              className={"action " + getActionNameEn(0)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalDetail,
                  true,
                  "60%",
                  getActionNameEn(0) + " users",
                  AdminUsersModal.detail(record)
                )
              }
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(2)}
              style={{
                display:
                  record?.role === UserRoleValue.admin ||
                  record?.role === UserRoleValue.employee
                    ? "none"
                    : "block",
              }}
              onClick={() =>
                updatePropertiesModal(
                  titleModalUpdate,
                  true,
                  "31%",
                  getActionNameEn(2) + " users",
                  AdminUsersModal.update(record)
                )
              }
            >
              <FontAwesomeIcon icon={faGear} />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(3)}
              style={{
                display:
                  record?.role === UserRoleValue.admin ? "none" : "block",
              }}
              onClick={() =>
                updatePropertiesModal(
                  record.status == CommonStatus.active
                    ? titleModalLock
                    : titleModalUnlock,
                  true,
                  "30%",
                  getActionNameEn(3) + " users",
                  AdminUsersModal.lock(record!.id as number, record!.status)
                )
              }
            >
              <FontAwesomeIcon
                icon={record.status == CommonStatus.active ? faLock : faUnlock}
              />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(4)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalChangePassword,
                  true,
                  "31%",
                  getActionNameEn(4) + " users",
                  AdminUsersModal.changePassword(record!.id as number)
                )
              }
            >
              <FontAwesomeIcon icon={faKey} />
            </button>
          }
        </>
      ),
    },
  ];

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [childrenModal, setChildrenModal] = useState<ReactNode>();
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
    id: "Chưa xác định !",
    createAt: "",
    role: "Chọn Quyền hạn",
    username: "Nhập Tên tài khoản",
    password: "Nhập Mật khẩu",
    method: "Chọn Phương thức",
    isUsing: "Chưa sử dụng",
    status: "Chọn Trạng thái",
  };
  // - Hàm cập nhật
  const updatePropertiesModal = (
    titleModal: string,
    openModal: boolean,
    widthModal: string,
    classNameModal: string,
    childrenModal: ReactNode
  ) => {
    setTitleModal(titleModal);
    setOpenModal(openModal);
    setWidthModal(widthModal);
    setClassNameModal(classNameModal);
    setChildrenModal(childrenModal);
  };
  // - Mutation cho việc thêm, cập nhật và khoá dữ liệu
  const handleSubmitMutation = useMutation({
    mutationFn: async ({
      type,
      values,
      objectId,
    }: ReactQueryMutationProps<UsersType>) => {
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          const res = await HandleCreateUser({
            createAt:
              values!.createAt && dayjs(values!.createAt).isValid()
                ? dayjs(values!.createAt).format("YYYY-MM-DD HH:mm:ss")
                : undefined,
            role: values!.role || undefined,
            username: values!.username || undefined,
            password: values!.password || undefined,
            method: values!.method || undefined,
            isUsing: values!.isUsing || undefined,
            status: values!.status || undefined,
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          const res = await HandleUpdateUser({
            id: objectId ? (objectId as number) : undefined,
            role: values!.role || undefined,
            // method: values!.method || undefined,
            updateAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        } else if (
          (type === "lock" && titleModal === titleModalLock) ||
          (type === "unlock" && titleModal === titleModalUnlock)
        ) {
          const res = await HandleLockUser({
            id: objectId! as number,
            status:
              (type === "lock" ? CommonStatus.active : CommonStatus.inactive) ||
              undefined,
            updateAt: new Date().toISOString(),
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        } else if (
          type === "change-password" &&
          titleModal === titleModalChangePassword
        ) {
          const res = await HandleChangePasswordUser({
            id: objectId! as number,
            newPassword: values!.newPassword || undefined,
            authNewPassword: values!.authNewPassword || undefined,
            updateAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        }
      }
    },
    onMutate: () => {
      openNotification({
        key: notificationKey,
        type: "info",
        icon: <LoadingOutlined />,
        message: "Đang xử lý...",
        description: "Vui lòng chờ giây lát",
        duration: null,
      });
    },
    onSuccess: () => {
      openNotification({
        key: notificationKey,
        type: "success",
        message: "Thành công",
        description:
          (openModal
            ? titleModal === titleModalCreate
              ? "Thêm"
              : titleModal === titleModalUpdate
              ? "Cập nhật"
              : titleModal === titleModalChangePassword
              ? "Thay đổi mật khẩu"
              : titleModal === titleModalLock
              ? "Khoá"
              : "Mở khoá"
            : "") + " thành công!",
        duration: 1.5,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setOpenModal(false);
      }, 1500);
    },
    onError: (error) => {
      openNotification({
        key: notificationKey,
        type: "error",
        message: "Thất bại",
        description: error
          ? error.message
          : (openModal
              ? titleModal === titleModalCreate
                ? "Thêm"
                : titleModal === titleModalUpdate
                ? "Cập nhật"
                : titleModal === titleModalChangePassword
                ? "Thay đổi mật khẩu"
                : titleModal === titleModalLock
                ? "Khoá"
                : "Mở khoá"
              : "") + " thất bại!",
        duration: 1.5,
      });

      setTimeout(() => {}, 1500);
    },
  });
  // - Các modal tương ứng cho từng chức năng
  const DetailUsers = ({ user }: { user: UsersType }) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: user?.id,
            createAt: dayjs(user.createAt),
            role: user?.role,
            username: user?.username,
            method: user?.method,
            isUsing: user?.isUsing,
            status: user?.status,
          }}
          className="modal__form split-2"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled />
                </Form.Item>
                <Form.Item
                  name="createAt"
                  label={defaultLabels.createAt}
                  className="modal__form-group-item"
                >
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" disabled />
                </Form.Item>
              </div>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="isUsing"
                  label={defaultLabels.isUsing}
                  className="modal__form-group-item"
                >
                  <Select disabled />
                </Form.Item>
                <Form.Item
                  name="status"
                  label={defaultLabels.status}
                  className="modal__form-group-item"
                >
                  <Select className="text-center" disabled />
                </Form.Item>
              </div>
              <Form.Item
                name="username"
                label={defaultLabels.username}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="method"
                label={defaultLabels.method}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item
                name="role"
                label={defaultLabels.role}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item
                name="password"
                label={defaultLabels.password}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input
                  className="text-center"
                  placeholder="Mật khẩu đã được mã hoá !"
                  disabled
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateUsers = () => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            createAt: dayjs(),
            method: UserMethodValue.handmade,
            isUsing: UserIsUsingValue.notUsing,
          }}
          autoComplete="off"
          className="modal__form split-2"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              console.log(values);

              // Thực thi mutation
              handleSubmitMutation.mutate({
                type: "create",
                values: values,
              });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="modal__form-group-item"
                >
                  <Input
                    placeholder={defaultInputs.id}
                    className="text-center"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="createAt"
                  label={defaultLabels.createAt}
                  className="modal__form-group-item"
                >
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" disabled />
                </Form.Item>
              </div>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="isUsing"
                  label={defaultLabels.isUsing}
                  className="modal__form-group-item"
                >
                  <Select placeholder={defaultInputs.isUsing} disabled />
                </Form.Item>
                <Form.Item
                  name="status"
                  htmlFor="status"
                  label={defaultLabels.status}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Trạng thái !")]}
                >
                  <Select
                    allowClear
                    id="status"
                    placeholder={defaultInputs.status}
                    options={[
                      {
                        label: CommonStatus.active,
                        value: CommonStatus.active,
                      },
                      {
                        label: CommonStatus.inactive,
                        value: CommonStatus.inactive,
                      },
                    ]}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="username"
                htmlFor="username"
                label={defaultLabels.username}
                className="modal__form-group-item"
                rules={[ruleRequired("Tên tài khoản không được để trống !")]}
              >
                <Input placeholder={defaultInputs.username} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="method"
                label={defaultLabels.method}
                className="modal__form-group-item"
              >
                <Select placeholder={defaultInputs.method} disabled />
              </Form.Item>
              <Form.Item
                name="role"
                htmlFor="role"
                label={defaultLabels.role}
                className="modal__form-group-item"
                rules={[ruleRequired("Quyền hạn không được để trống !")]}
              >
                <Select
                  allowClear
                  id="role"
                  placeholder={defaultInputs.role}
                  options={[
                    {
                      label: UserRoleValue.manager,
                      value: UserRoleValue.manager,
                    },
                    {
                      label: UserRoleValue.customer,
                      value: UserRoleValue.customer,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="password"
                htmlFor="password"
                label={defaultLabels.password}
                className="modal__form-group-item"
                rules={[ruleRequired("Mật khẩu không được để trống !")]}
              >
                <Input placeholder={defaultInputs.password} />
              </Form.Item>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn create">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const UpdateUsers = ({ user }: { user: UsersType }) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: user?.id ? user.id : undefined,
            role: user?.role ? user.role : undefined,
          }}
          autoComplete="off"
          className="modal__form"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn cập nhật ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              handleSubmitMutation.mutate({
                type: "update",
                values: values,
                objectId: user?.id ? user?.id : undefined,
              });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="role"
                htmlFor="role"
                label={defaultLabels.role}
                className="modal__form-group-item"
                rules={[ruleRequired("Quyền hạn không được để trống !")]}
              >
                <Select
                  allowClear
                  id="role"
                  placeholder={defaultInputs.role}
                  options={[
                    {
                      label: UserRoleValue.manager,
                      value: UserRoleValue.manager,
                    },
                    {
                      label: UserRoleValue.customer,
                      value: UserRoleValue.customer,
                    },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn update">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const LockUsers = ({
    id,
    status,
  }: {
    id: number;
    status: string | undefined;
  }) => {
    const [form] = Form.useForm();
    const statusValue = status == CommonStatus.active ? true : false;

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form"
          onFinish={async (e) => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn ${statusValue ? "khoá" : "mở khoá"} ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Thực thi mutation
              handleSubmitMutation.mutate({
                type: statusValue ? "lock" : "unlock",
                objectId: id!,
              });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-image">
            <img
              src={
                statusValue
                  ? "/src/assets/images/others/lock-icon.png"
                  : "/src/assets/images/others/unlock-icon.png"
              }
              alt=""
            />
          </div>
          <div className="modal__form-content">
            <p>
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b> tài
              khoản có mã đối tượng là <b>{id}</b> ?
            </p>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn lock">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const ChangePasswordUsers = ({ id }: { id: number }) => {
    const [form] = Form.useForm();

    return (
      <>
        <>
          <Form
            layout="vertical"
            form={form}
            className="modal__form"
            autoComplete="off"
            onFinish={async () => {
              // Nút để submit form
              const submitButton = document.querySelector(
                ".modal__form button[type='submit']"
              );

              // Thêm class 'active' thể hiện nút đang được nhấn
              submitButton?.classList.add("active");

              // Hỏi trước khi xử khi xử lý ?
              const answer = await openConfirmation({
                title: `Bạn có chắc chắn cập nhập ?`,
                content: "Hành động này không thể hoàn tác.",
              });
              if (answer) {
                // Danh sách dữ liệu
                const values = form.getFieldsValue();

                // Thực thi mutation
                handleSubmitMutation.mutate({
                  type: "change-password",
                  values: values,
                  objectId: id,
                });

                // Xoá class 'active' thể hiện nút không còn được nhấn
                submitButton?.classList.remove("active");
              }

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }}
          >
            <div className="modal__form-group-warper">
              {/* <p className="modal__form-group-title">Thông tin cần thiết</p> */}
              <div className="modal__form-group">
                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  htmlFor="new-password"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Mật khẩu mới không được để trống!")]}
                >
                  <Input id="new-password" placeholder="Nhập Mật khẩu mới" />
                </Form.Item>
                <Form.Item
                  name="authNewPassword"
                  label="Xác nhận mật khẩu mới"
                  htmlFor="auth-new-password"
                  className="modal__form-group-item"
                  rules={[
                    ruleRequired("Xác nhận mật khẩu mới không được để trống!"),
                  ]}
                >
                  <Input
                    id="auth-new-password"
                    placeholder="Nhập Xác nhận mật khẩu mới"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn print">
                Xác nhận
              </button>
            </div>
          </Form>
        </>
      </>
    );
  };
  const AdminUsersModal = {
    detail: (user: UsersType) => <DetailUsers user={user} />,
    create: () => <CreateUsers />,
    update: (user: UsersType) => <UpdateUsers user={user} />,
    lock: (id: number, status: string | undefined) => (
      <LockUsers id={id} status={status} />
    ),
    changePassword: (id: number) => <ChangePasswordUsers id={id} />,
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h1 className="main__title">{objectName}</h1>
        </div>
        <div className="main__filter">
          <CustomFindInput
            selectItems={findOptions}
            placeholder="Nhập thông tin cần tìm kiếm"
            defaultValue=""
            className="main__filter-find"
            setFilterFindType={setFilterFindType}
            setFilterFindValue={setFilterFindValue}
          />
          <CustomFindSelect
            mode={undefined}
            placeholder="Chọn Sử dụng"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-using"
            options={isUsingOptions}
            setFilterSelectValue={setFilterIsUsingValue}
          />
          <CustomFindSelect
            mode={undefined}
            placeholder="Chọn Trạng thái"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-status"
            options={statusOptions}
            setFilterSelectValue={setFilterStatusValue}
          />
          <button
            className={
              "main__filter-button btn " +
              getActionNameEn(1) +
              (openModal && titleModal === titleModalCreate ? " active" : "")
            }
            onClick={() =>
              updatePropertiesModal(
                titleModalCreate,
                true,
                "60%",
                getActionNameEn(1) + " users",
                AdminUsersModal.create()
              )
            }
          >
            <FontAwesomeIcon icon={faPlus} className="icon" />
            &nbsp;Thêm&nbsp;{objectName.toLowerCase()}
          </button>
        </div>
        <div className="main__table">
          <CustomTableActions<UsersType>
            columns={columns}
            data={users || []}
            rowKey={(record) => String(record?.id)}
            loading={isLoading}
            defaultPageSize={10}
            className="table-actions users"
          />
        </div>
      </main>
      {openModal && (
        <CustomModal
          title={titleModal}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
          width={widthModal}
          className={classNameModal}
          children={childrenModal}
        />
      )}
    </>
  );
};

export default AdminUsersPage;
