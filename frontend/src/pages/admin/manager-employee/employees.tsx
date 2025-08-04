import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faKey,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import {
  DatePicker,
  Form,
  Image,
  Input,
  Select,
  Space,
  Tag,
  type SelectProps,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RcFile } from "antd/es/upload/interface";
import type {
  EmployeesFormatType,
  EmployeesType,
  ReactQueryMutationProps,
  RoleHistoriesFormatType,
} from "../../../common/types.tsx";
import { CommonGender, CommonStatus, ReactQueryGetData, TitleModalCommon } from "../../../common/values.tsx";
import { CustomPaginationProps } from "../../../common/props.tsx";
import { ruleEmail, rulePhone, ruleRequired } from "../../../common/rules.tsx";
import CustomFindInput from "../../../components/admin/find-input.tsx";
import CustomFindSelect from "../../../components/admin/find-select.tsx";
import CustomTableActions from "../../../components/admin/table-actions.tsx";
import CustomUpload from "../../../components/admin/upload.tsx";
import CustomTableNoActions from "../../../components/admin/table-no-actions.tsx";
import CustomModal from "../../../components/admin/modal.tsx";
import {
  FindAllEmployee,
  FindAllRole,
  HandleChangePasswordEmployee,
  HandleCreateEmployee,
  HandleLockEmployee,
  HandleUpdateEmployee,
} from "../../../services/api.tsx";
import { getActionNameEn, getActionNameVn } from "../../../services/default-actions.tsx";
import { getActionsString } from "../../../services/employee-login.tsx";
import { showCreateValidAddress } from "../../../utils/showCreateValidAddress.tsx";
import { openConfirmation } from "../../../utils/showConfirmation.ts";
import { openNotification } from "../../../utils/showNotification.ts";
import dayjs from "dayjs";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Nhân viên"
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());
const titleModalChangePassword = TitleModalCommon.changePassword(objectName.toLowerCase());

// Admin Employees Page
const AdminEmployeesPage = ({ functionId }: { functionId: number }) => {
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId })

  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Các biến giữ dữ liệu về chức vụ
  const {
    data: roles,
  } = useQuery({
    queryKey: [
      'roles',
    ],
    queryFn: async () => {
      const res = await FindAllRole({ statusValue: [CommonStatus.active] });
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
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "fullname" },
    { label: "SĐT", value: "phone" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Chức vụ
  const roleOptions: SelectProps["options"] = roles?.map((role) => ({
    label: "#" + role!.id + " - " + role!.name,
    value: role!.id,
  }));
  const [filterRoleValue, setFilterRoleValue] = useState<string[] | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatus["active"], value: CommonStatus["active"] },
    { label: CommonStatus["inactive"], value: CommonStatus["inactive"] },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: employees,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'employees',
      filterFindType,
      filterFindValue,
      filterRoleValue,
      filterStatusValue,
    ],
    queryFn: async () => {
      const res = await FindAllEmployee({
        findType: filterFindType!,
        findValue: filterFindValue!,
        roleValue: filterRoleValue!,
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
    enabled: !!filterFindType,  //
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<EmployeesFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "8%",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "8%",
      render: (image: string) => (
        <Image
          src={
            image!
              ? "/src/assets/images/employees/" + image
              : "/src/assets/images/others/no-image.png"
          }
          alt=""
        />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      sorter: true,
      width: "18%",
      className: "left",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      sorter: true,
      width: "12%",
    },
    {
      title: "Ngày vào làm",
      dataIndex: "dateBegin",
      key: "dateBegin",
      sorter: true,
      width: "12%",
    },
    {
      title: "Chức vụ",
      key: "currentRole",
      width: "20%",
      render: (record) =>
        `#${record.currentRole?.id} - ${record.currentRole?.name}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag color={status === CommonStatus["active"] ? "green" : "red"}>
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
      render: (text: any, record: EmployeesFormatType, index: number) => (
        <>
          {
            validActions?.includes(getActionNameVn(0)) && (
              <button
                className={"action " + getActionNameEn(0)}
                onClick={() =>
                  updatePropertiesModal(
                    titleModalDetail,
                    true,
                    "89%",
                    getActionNameEn(0) + " employees",
                    AdminEmployeesModal.detail(record)
                  )
                }
              >
                <FontAwesomeIcon icon={faCircleInfo} />
              </button>
            )
          }
          {
            validActions?.includes(getActionNameVn(2)) && (
              <button
                className={"action " + getActionNameEn(2)}
                onClick={() =>
                  updatePropertiesModal(
                    titleModalUpdate,
                    true,
                    "89%",
                    getActionNameEn(2) + " employees",
                    AdminEmployeesModal.update(record)
                  )
                }
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            )
          }
          {
            validActions?.includes(getActionNameVn(3)) && (
              <button
                className={"action " + getActionNameEn(3)}
                onClick={() =>
                  updatePropertiesModal(
                    (record.status == CommonStatus["active"] ? titleModalLock : titleModalUnlock),
                    true,
                    "30%",
                    getActionNameEn(3) + " employees",
                    AdminEmployeesModal.lock(record!.id as number, record!.status)
                  )
                }
              >
                <FontAwesomeIcon
                  icon={record.status == CommonStatus["active"] ? faLock : faUnlock}
                />
              </button>
            )
          }
          {
            validActions?.includes(getActionNameVn(2)) && (

              <button
                className={"action " + getActionNameEn(4)}
                onClick={() =>
                  updatePropertiesModal(
                    titleModalChangePassword,
                    true,
                    "31%",
                    getActionNameEn(4) + " employees",
                    AdminEmployeesModal.changePassword(record!.id as number)
                  )
                }
              >
                <FontAwesomeIcon icon={faKey} />
              </button>
            )
          }
        </>
      ),
    },
  ];
  // - Các thành phần
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(employees || [], 7, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [childrenModal, setChildrenModal] = useState<ReactNode>();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title1: "Thông tin nhân viên",
    title2: "Thông tin cá nhân",
    image: "Hình ảnh",
    fullname: "Họ và tên",
    birthday: "Ngày sinh",
    gender: "Giới tính",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    id: "Mã nhân viên",
    dateBegin: "Ngày vào làm",
    dateEnd: "Ngày nghỉ làm",
    currentRole: "Chức vụ (Hiện tại)",
    diploma: "Bằng cấp",
    diplomaDetail: "Nơi cấp bằng",
    username: "Tên tài khoản",
    password: "Mật khẩu",
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
    id: "Được xác định sau khi xác nhận thêm !",
    dateBegin: "Chọn Ngày vào làm",
    dateEnd: "Chọn Ngày nghỉ làm",
    currentRole: "Chọn Chức vụ",
    diploma: "Chọn Bằng cấp",
    diplomaDetail: "Chọn Nơi cấp bằng",
    username: "Nhập Tên tài khoản",
    password: "Nhập Mật khẩu",
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
    mutationFn: async ({ type, values, objectId, imageFile }: ReactQueryMutationProps<EmployeesType>) => {
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          const res = await HandleCreateEmployee({
            image: imageFile! || undefined,
            fullname: values!.fullname || undefined,
            birthday:
              values!.birthday && dayjs(values!.birthday).isValid()
                ? dayjs(values!.birthday).format("YYYY-MM-DD")
                : undefined,
            gender: values!.gender || undefined,
            phone: values!.phone || undefined,
            email: values!.email || undefined,
            address: values!.address || undefined,
            dateBegin:
              values!.dateBegin && dayjs(values!.dateBegin).isValid()
                ? dayjs(values!.dateBegin).format("YYYY-MM-DD")
                : undefined,
            dateEnd:
              values!.dateEnd && dayjs(values!.dateEnd).isValid()
                ? dayjs(values!.dateEnd).format("YYYY-MM-DD")
                : undefined,
            roleId: values!.roleId || undefined,
            username: values!.username || undefined,
            password: values!.password || undefined,
            status: values!.status || undefined,
          })

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          const res = await HandleUpdateEmployee({
            id: values!.id,
            image: imageFile! || undefined,
            fullname: values!.fullname || undefined,
            birthday:
              values!.birthday && dayjs(values!.birthday).isValid()
                ? dayjs(values!.birthday).format("YYYY-MM-DD")
                : undefined,
            gender: values!.gender || undefined,
            phone: values!.phone || undefined,
            email: values!.email || undefined,
            address: values!.address || undefined,
            dateBegin:
              values!.dateBegin && dayjs(values!.dateBegin).isValid()
                ? dayjs(values!.dateBegin).format("YYYY-MM-DD")
                : undefined,
            dateEnd:
              values!.dateEnd && dayjs(values!.dateEnd).isValid()
                ? dayjs(values!.dateEnd).format("YYYY-MM-DD")
                : undefined,
            roleId: values!.roleId || undefined,
            timeUpdate: new Date().toISOString(),
          });

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        } else if ((type === "lock" && titleModal === titleModalLock)
          || (type === "unlock" && titleModal === titleModalUnlock)) {
          const res = await HandleLockEmployee({
            id: objectId! as number,
            status: (type === "lock" ? CommonStatus.active : CommonStatus.inactive) || undefined,
            timeUpdate: new Date().toISOString(),
          })

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        } else if (type === "change-password" && titleModal === titleModalChangePassword) {
          const res = await HandleChangePasswordEmployee({
            id: objectId! as number,
            currentPassword: values!.currentPassword || undefined,
            newPassword: values!.newPassword || undefined,
            authNewPassword: values!.authNewPassword || undefined,
            timeUpdate: new Date().toISOString(),
          })

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        }
      }
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Thành công",
        description: (openModal ? (titleModal === titleModalCreate ? "Thêm" : titleModal === titleModalUpdate ? "Cập nhật" : titleModal === titleModalChangePassword ? "Thay đổi mật khẩu" : titleModal === titleModalLock ? "Khoá" : "Mở khoá") : "") + " thành công!",
        duration: 1.5,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        setOpenModal(false);
      }, 1500);
    },
    onError: (error) => {
      openNotification({
        type: "error",
        message: "Thất bại",
        description: (error ? error.message : (openModal ? (titleModal === titleModalCreate ? "Thêm" : titleModal === titleModalUpdate ? "Cập nhật" : titleModal === titleModalChangePassword ? "Thay đổi mật khẩu" : titleModal === titleModalLock ? "Khoá" : "Mở khoá") : "") + " thất bại!"),
        duration: 1.5,
      });

      setTimeout(() => {
      }, 1500);
    },
  });
  // - Các modal tương ứng cho từng chức năng
  const DetailEmployees = ({
    image,
    fullname,
    birthday,
    gender,
    phone,
    email,
    address,
    id,
    dateBegin,
    dateEnd,
    currentRole,
    roleHistories,
    username,
    status,
  }: EmployeesFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            // image: image!,
            fullname: fullname!,
            birthday: dayjs(birthday!),
            gender: gender!,
            phone: phone!,
            email: email!,
            address: address!,
            dateBegin: dayjs(dateBegin!),
            dateEnd: dayjs(dateEnd!),
            currentRole: "#" + currentRole!.id + " - " + currentRole!.name,
            username: username!,
            status: status!,
          }}
          className="modal__form split-3"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
              <Form.Item
                name="username"
                label={defaultLabels["username"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="dateBegin"
                  label={defaultLabels["dateBegin"]}
                  className="modal__form-group-item"
                >
                  <DatePicker disabled={true} />
                </Form.Item>
                <Form.Item
                  name="dateEnd"
                  label={defaultLabels["dateEnd"]}
                  className="modal__form-group-item"
                >
                  <DatePicker disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels["password"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input
                  className="text-center"
                  value="Mật khẩu đã được mã hoá !"
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["currentRole"]}
                className="modal__form-group-item"
              >
                <Space.Compact>
                  <Form.Item name="currentRole" noStyle>
                    <Select disabled={true} />
                  </Form.Item>
                  <button
                    type="button"
                    className="btn secondary-btn diff"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Lịch sử chức vụ",
                        true,
                        "60%",
                        "secondary employees",
                        AdminRoleHistoriesModal.detail({ roleHistories })
                      )
                    }
                  >
                    Chi tiết
                  </button>
                </Space.Compact>
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <Select disabled={true} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["image"]}
                className="modal__form-group-item"
              >
                <CustomUpload
                  defaultSrc={image! as string}
                  alt="image-preview"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  imageCategoryName="employees"
                  labelButton={defaultInputs["image"]}
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="fullname"
                label={defaultLabels["fullname"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels["phone"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="address"
                label={defaultLabels["address"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="birthday"
                  label={defaultLabels["birthday"]}
                  className="modal__form-group-item"
                >
                  <DatePicker disabled={true} />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label={defaultLabels["gender"]}
                  className="modal__form-group-item"
                >
                  <Select disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                name="email"
                label={defaultLabels["email"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateEmployees = ({ }) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form split-3"
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
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              handleSubmitMutation.mutate({ type: "create", values: values, imageFile: imageFile });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input
                  className="text-center"
                  value={defaultInputs["id"]}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="username"
                label={defaultLabels["username"]}
                htmlFor="create-username"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên tài khoản không được để trống !")]}
              >
                <Input
                  id="create-username"
                  placeholder={defaultInputs["username"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="dateBegin"
                  label={defaultLabels["dateBegin"]}
                  htmlFor="create-dateBegin"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="create-dateBegin"
                    placeholder={defaultInputs["dateBegin"]}
                  />
                </Form.Item>
                <Form.Item
                  name="dateEnd"
                  label={defaultLabels["dateEnd"]}
                  htmlFor="create-dateEnd"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="create-dateEnd"
                    placeholder={defaultInputs["dateEnd"]}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="password"
                label={defaultLabels["password"]}
                htmlFor="create-password"
                className="modal__form-group-item"
                rules={[ruleRequired("Mật khẩu không được để trống !")]}
              >
                <Input
                  id="create-password"
                  placeholder={defaultInputs["password"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="roleId"
                label={defaultLabels["currentRole"]}
                htmlFor="create-currentRole"
                className="modal__form-group-item"
                rules={[ruleRequired("Chức vụ không được để trống !")]}
              >
                <Select
                  allowClear={true}
                  showSearch={true}
                  id="create-currentRole"
                  placeholder={defaultInputs["currentRole"]}
                  options={roles?.map((role) => ({
                    label: "#" + role!.id + " - " + role!.name,
                    value: role!.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                htmlFor="create-status"
                className="modal__form-group-item"
                rules={[ruleRequired("Trạng thái không được để trống !")]}
              >
                <Select
                  allowClear={true}
                  id="create-status"
                  placeholder={defaultInputs["status"]}
                  options={[
                    {
                      label: CommonStatus["active"],
                      value: CommonStatus["active"],
                    },
                    {
                      label: CommonStatus["inactive"],
                      value: CommonStatus["inactive"],
                    },
                  ]}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["image"]}
                htmlFor="create-image"
                className="modal__form-group-item"
              >
                <CustomUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  htmlFor="create-image"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs["image"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="fullname"
                label={defaultLabels["fullname"]}
                htmlFor="create-fullname"
                className="modal__form-group-item"
                rules={[ruleRequired("Họ và tên không được để trống !")]}
              >
                <Input
                  id="create-fullname"
                  placeholder={defaultInputs["fullname"]}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels["phone"]}
                htmlFor="create-phone"
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống !"),
                  rulePhone(),
                ]}
              >
                <Input id="create-phone" placeholder={defaultInputs["phone"]} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["address"]}
                className="modal__form-group-item multiple-2"
              >
                <Space.Compact>
                  <Form.Item name="address" noStyle>
                    <Input
                      id="create-address"
                      placeholder={defaultInputs["address"]}
                    />
                  </Form.Item>
                  <button
                    type="button"
                    className="btn secondary-btn"
                    onClick={async () => {
                      const result = await showCreateValidAddress();
                      if (result) {
                        const { houseNumberAndStreetName, province, ward } =
                          result;

                        form.setFieldsValue({
                          address: `${houseNumberAndStreetName}, ${ward}, ${province}`,
                        });
                      }
                    }}
                  >
                    Tạo địa chỉ
                  </button>
                </Space.Compact>
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="birthday"
                  label={defaultLabels["birthday"]}
                  htmlFor="create-birthday"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="create-birthday"
                    placeholder={defaultInputs["birthday"]}
                  />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label={defaultLabels["gender"]}
                  htmlFor="create-gender"
                  className="modal__form-group-item"
                >
                  <Select
                    allowClear={true}
                    id="create-gender"
                    placeholder={defaultInputs["gender"]}
                    options={[
                      { label: CommonGender.male, value: CommonGender.male },
                      { label: CommonGender.female, value: CommonGender.female },
                    ]}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="email"
                label={defaultLabels["email"]}
                htmlFor="create-email"
                className="modal__form-group-item"
                rules={[ruleEmail()]}
              >
                <Input id="create-email" placeholder={defaultInputs["email"]} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn create">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const UpdateEmployees = ({
    image,
    fullname,
    birthday,
    gender,
    phone,
    email,
    address,
    id,
    dateBegin,
    dateEnd,
    currentRole,
    roleHistories,
    username,
    status,
  }: EmployeesFormatType) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            // image: image!,
            fullname: fullname!,
            birthday: dayjs(birthday!),
            gender: gender!,
            phone: phone!,
            email: email!,
            address: address!,
            dateBegin: dayjs(dateBegin!),
            dateEnd: dayjs(dateEnd!),
            roleId: currentRole!.id,
            username: username!,
            status: status!,
          }}
          className="modal__form split-3"
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
              title: `Bạn có chắc chắn cập nhật ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              handleSubmitMutation.mutate({ type: "update", values: values, imageFile: imageFile });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
              <Form.Item
                name="username"
                label={defaultLabels["username"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="dateBegin"
                  label={defaultLabels["dateBegin"]}
                  htmlFor="update-dateBegin"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="update-dateBegin"
                    placeholder={defaultInputs["dateBegin"]}
                  />
                </Form.Item>
                <Form.Item
                  name="dateEnd"
                  label={defaultLabels["dateEnd"]}
                  htmlFor="update-dateEnd"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="update-dateEnd"
                    placeholder={defaultInputs["dateEnd"]}
                  />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels["password"]}
                className="modal__form-group-item"
              >
                <Input
                  className="text-center"
                  value="Mật khẩu đã được mã hoá !"
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["currentRole"]}
                htmlFor="update-currentRole"
                className="modal__form-group-item"
              >
                <Space.Compact>
                  <Form.Item
                    name="roleId"
                    noStyle
                    rules={[ruleRequired("Chức vụ không được để trống !")]}
                  >
                    <Select
                      showSearch={true}
                      allowClear={true}
                      id="update-currentRole"
                      placeholder={defaultInputs["currentRole"]}
                      options={roles?.map((role) => ({
                        label: "#" + role!.id + " - " + role!.name,
                        value: role!.id,
                      }))}
                    />
                  </Form.Item>
                  <button
                    type="button"
                    className="btn secondary-btn diff"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Lịch sử chức vụ",
                        true,
                        "60%",
                        "secondary employees",
                        AdminRoleHistoriesModal.detail({ roleHistories })
                      )
                    }
                  >
                    Chi tiết
                  </button>
                </Space.Compact>
              </Form.Item>
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["image"]}
                htmlFor="update-image"
                className="modal__form-group-item"
              >
                <CustomUpload
                  defaultSrc={image!}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  htmlFor="update-image"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  imageCategoryName="employees"
                  labelButton={defaultInputs["image"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="fullname"
                label={defaultLabels["fullname"]}
                htmlFor="update-fullname"
                className="modal__form-group-item"
                rules={[ruleRequired("Họ và tên không được để trống !")]}
              >
                <Input
                  id="update-fullname"
                  placeholder={defaultInputs["fullname"]}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels["phone"]}
                htmlFor="update-phone"
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống !"),
                  rulePhone(),
                ]}
              >
                <Input id="update-phone" placeholder={defaultInputs["phone"]} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["address"]}
                className="modal__form-group-item multiple-2"
              >
                <Space.Compact>
                  <Form.Item name="address" noStyle>
                    <Input
                      id="update-address"
                      placeholder={defaultInputs["address"]}
                    />
                  </Form.Item>
                  <button
                    type="button"
                    className="btn secondary-btn"
                    onClick={async () => {
                      const result = await showCreateValidAddress();
                      if (result) {
                        const { houseNumberAndStreetName, province, ward } =
                          result;

                        form.setFieldsValue({
                          address: `${houseNumberAndStreetName}, ${ward}, ${province}`,
                        });
                      }
                    }}
                  >
                    Tạo địa chỉ
                  </button>
                </Space.Compact>
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="birthday"
                  label={defaultLabels["birthday"]}
                  htmlFor="update-birthday"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="update-birthday"
                    placeholder={defaultInputs["birthday"]}
                  />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label={defaultLabels["gender"]}
                  htmlFor="update-gender"
                  className="modal__form-group-item"
                >
                  <Select
                    allowClear={true}
                    id="update-gender"
                    placeholder={defaultInputs["gender"]}
                    options={[
                      { label: CommonGender.male, value: CommonGender.male },
                      { label: CommonGender.female, value: CommonGender.female },
                    ]}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="email"
                label={defaultLabels["email"]}
                htmlFor="update-email"
                className="modal__form-group-item"
                rules={[ruleEmail()]}
              >
                <Input id="update-email" placeholder={defaultInputs["email"]} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const LockEmployees = ({
    id,
    status,
  }: {
    id: number;
    status: string | undefined;
  }) => {
    const [form] = Form.useForm();
    const statusValue = status == CommonStatus["active"] ? true : false;

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
              handleSubmitMutation.mutate({ type: (statusValue ? "lock" : "unlock"), objectId: id! });

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
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b>{" "}
              nhân viên có mã đối tượng là <b>{id}</b> ?
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
  const ChangePasswordEmployees = ({ id }: { id: number }) => {
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
                handleSubmitMutation.mutate({ type: "change-password", values: values, objectId: id });

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
                  name="currentPassword"
                  label="Mật khẩu hiện tại"
                  htmlFor="current-password"
                  className="modal__form-group-item"
                  rules={[
                    ruleRequired("Mật khẩu hiện tại không được để trống !"),
                  ]}
                >
                  <Input
                    id="current-password"
                    placeholder="Nhập Mật khẩu hiện tại"
                  />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  htmlFor="new-password"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Mật khẩu mới không được để trống !")]}
                >
                  <Input id="new-password" placeholder="Nhập Mật khẩu mới" />
                </Form.Item>
                <Form.Item
                  name="authNewPassword"
                  label="Xác nhận mật khẩu mới"
                  htmlFor="auth-new-password"
                  className="modal__form-group-item"
                  rules={[
                    ruleRequired("Xác nhận mật khẩu mới không được để trống !"),
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
  const AdminEmployeesModal = {
    detail: (employee: EmployeesFormatType) => (
      <DetailEmployees
        image={employee!.image}
        fullname={employee!.fullname}
        birthday={employee!.birthday}
        gender={employee!.gender}
        phone={employee!.phone}
        email={employee!.email}
        address={employee!.address}
        id={employee!.id}
        dateBegin={employee!.dateBegin}
        dateEnd={employee!.dateEnd}
        currentRole={employee!.currentRole}
        roleHistories={employee!.roleHistories}
        username={employee!.username}
        status={employee!.status}
      />
    ),
    create: () => <CreateEmployees />,
    update: (employee: EmployeesFormatType) => (
      <UpdateEmployees
        image={employee!.image}
        fullname={employee!.fullname}
        birthday={employee!.birthday}
        gender={employee!.gender}
        phone={employee!.phone}
        email={employee!.email}
        address={employee!.address}
        id={employee!.id}
        dateBegin={employee!.dateBegin}
        dateEnd={employee!.dateEnd}
        currentRole={employee!.currentRole}
        roleHistories={employee!.roleHistories}
        username={employee!.username}
        status={employee!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockEmployees id={id} status={status} />
    ),
    changePassword: (id: number) => <ChangePasswordEmployees id={id} />,
  };

  // Các thành phần giữ giá trị cho việc hiển thị modal thứ 2
  // - Các biến
  const [titleSecondModal, setTitleSecondModal] = useState<string>("");
  const [openSecondModal, setOpenSecondModal] = useState<boolean>(false);
  const [widthSecondModal, setWidthSecondModal] = useState<string>("");
  const [classNameSecondModal, setClassNameSecondModal] = useState<string>("");
  const [childrenSecondModal, setChildrenSecondModal] = useState<ReactNode>();
  // - Hàm cập nhật
  const updatePropertiesSecondModal = (
    titleSecondModal: string,
    openSecondModal: boolean,
    widthSecondModal: string,
    classNameSecondModal: string,
    childrenSecondModal: ReactNode
  ) => {
    setTitleSecondModal(titleSecondModal);
    setOpenSecondModal(openSecondModal);
    setWidthSecondModal(widthSecondModal);
    setClassNameSecondModal(classNameSecondModal);
    setChildrenSecondModal(childrenSecondModal);
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailRoleHistories = ({
    roleHistories,
  }: {
    roleHistories?: RoleHistoriesFormatType[];
  }) => {
    return (
      <>
        <Form.Item
          // label="Danh sách chức vụ"
          className="modal__form-group-item margin-bottom-0"
        >
          <CustomTableNoActions
            className="recipe"
            columnWidths={["20%", "40%", "20%", "20%"]}
            columnTitles={[
              "Mã chức vụ",
              "Tên chức vụ",
              "Thời gian bắt đầu",
              "Thời gian kết thúc",
            ]}
            data={roleHistories!}
            attributes={["roleId", "roleName", "dateBegin", "dateEnd"]}
            format={["", "", "", ""]}
          />
        </Form.Item>
      </>
    );
  };
  const AdminRoleHistoriesModal = {
    detail: ({
      roleHistories,
    }: {
      roleHistories?: RoleHistoriesFormatType[];
    }) => <DetailRoleHistories roleHistories={roleHistories} />,
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h1 className="main__title">Quản lý nhân sự - {objectName}</h1>
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
            mode="tags"
            placeholder="Chọn Chức vụ"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-role"
            options={roleOptions}
            setFilterSelectValue={setFilterRoleValue}
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
          {
            validActions?.includes(getActionNameVn(1)) && (
              <button
                className={
                  "main__filter-button btn " + getActionNameEn(1) +
                  (openModal && titleModal === titleModalCreate
                    ? " active"
                    : "")
                }
                onClick={() =>
                  updatePropertiesModal(
                    titleModalCreate,
                    true,
                    "89%",
                    getActionNameEn(1) + " employees",
                    AdminEmployeesModal.create()
                  )
                }
              >
                <FontAwesomeIcon icon={faPlus} className="icon" />
                &nbsp;Thêm
              </button>
            )
          }
        </div>
        <div className="main__table">
          <CustomTableActions
            columns={columns}
            rowKey={(record) => record!.id as number}
            data={currentItems}
            loading={isLoading}
            pagination={paginationProps}
            className="table-actions employees"
            onChange={handleTableChange}
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
      {openSecondModal && (
        <CustomModal
          title={titleSecondModal}
          openModal={openSecondModal}
          setOpenModal={() => setOpenSecondModal(false)}
          width={widthSecondModal}
          className={classNameSecondModal}
          children={childrenSecondModal}
        />
      )}
    </>
  );
};

export default AdminEmployeesPage;
