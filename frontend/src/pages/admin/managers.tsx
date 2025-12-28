import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";
import {
  Image,
  DatePicker,
  Form,
  Input,
  Select,
  Tag,
  type SelectProps,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import type { ColumnsType } from "antd/es/table";
import type { ReactQueryMutationProps } from "../../common/props.tsx";
import type { ManagersFormatType, ManagersType } from "../../common/types.tsx";
import { ruleEmail, rulePhone, ruleRequired } from "../../common/rules.tsx";
import {
  CommonGender,
  CommonStatus,
  ReactQueryGetData,
  TitleModalCommon,
  UserIsUsingValue,
  UserRoleValue,
} from "../../common/values.tsx";
import CustomFindInput from "../../components/common/find-input.tsx";
import CustomFindSelect from "../../components/common/find-select.tsx";
import CustomImageUpload from "../../components/common/image-upload.tsx";
import CustomTableActions from "../../components/common/table-actions.tsx";
import CustomModal from "../../components/common/modal.tsx";
import {
  FindAllManager,
  FindAllUser,
  HandleCreateManager,
  HandleLockManager,
  HandleUpdateManager,
} from "../../services/api.tsx";
import { getActionNameEn } from "../../services/default-actions.tsx";
import { openConfirmation } from "../../utils/showConfirmation.ts";
import { openNotification } from "../../utils/showNotification.ts";
import { showCreateValidAddress } from "../../utils/showCreateValidAddress.tsx";
import dayjs from "dayjs";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Chủ nhà hàng";
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());
// - Key của notification
const notificationKey = "managers-notification";

// Admin Managers Page
const AdminManagersPage = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Biến giữ dữ liệu về chức vụ
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await FindAllUser({
        roleValue: [UserRoleValue.manager],
        isUsingValue: [UserIsUsingValue.notUsing],
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
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "fullname" },
    { label: "SĐT", value: "phone" },
    { label: "Email", value: "email" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
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
    data: managers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["managers", filterFindType, filterFindValue, filterStatusValue],
    queryFn: async () => {
      const res = await FindAllManager({
        findType: filterFindType!,
        findValue: filterFindValue!,
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
  const columns: ColumnsType<ManagersFormatType> = [
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
        <Image
          src={image! ? image : "/src/assets/images/others/no-image.png"}
          alt=""
        />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      width: "26%",
      className: "left",
      sorter: (a, b) => a?.fullname!.localeCompare(b?.fullname!),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "14%",
      sorter: (a, b) => a?.phone!.localeCompare(b?.phone!),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      sorter: (a, b) => a?.email!.localeCompare(b?.email!),
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
      width: "12%",
      className: "buttons",
      render: (text: any, record: ManagersFormatType, index: number) => (
        <>
          {
            <button
              className={"action " + getActionNameEn(0)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalDetail,
                  true,
                  "89%",
                  getActionNameEn(0) + " managers",
                  AdminManagersModal.detail(record)
                )
              }
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(2)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalUpdate,
                  true,
                  "89%",
                  getActionNameEn(2) + " managers",
                  AdminManagersModal.update(record)
                )
              }
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(3)}
              onClick={() =>
                updatePropertiesModal(
                  record.status == CommonStatus.active
                    ? titleModalLock
                    : titleModalUnlock,
                  true,
                  "30%",
                  getActionNameEn(3) + " managers",
                  AdminManagersModal.lock(record!.id as number, record!.status)
                )
              }
            >
              <FontAwesomeIcon
                icon={record.status == CommonStatus.active ? faLock : faUnlock}
              />
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
    id: "Mã chủ nhà hàng",
    user: "Tài khoản",
    createAt: "Thời gian tạo",
    image: "Hình ảnh",
    fullname: "Họ và tên",
    birthday: "Ngày sinh",
    gender: "Giới tính",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title: "",
    id: "Chưa xác định !",
    user: "Chọn Tài khoản",
    createAt: "",
    image: "Chọn Hình ảnh",
    fullname: "Nhập Họ và tên",
    birthday: "Chọn Ngày sinh",
    gender: "Chọn Giới tính",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    description: "Nhập Mô tả",
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
      imageFile,
    }: ReactQueryMutationProps<ManagersType>) => {
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          const res = await HandleCreateManager({
            userId: values!.userId || undefined,
            createAt:
              values!.createAt && dayjs(values!.createAt).isValid()
                ? dayjs(values!.createAt).format("YYYY-MM-DD HH:mm:ss")
                : undefined,
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
            description: values!.description || undefined,
            status: values!.status || undefined,
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          const res = await HandleUpdateManager({
            id: values!.id,
            userId: values!.userId || undefined,
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
            description: values!.description || undefined,
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
          const res = await HandleLockManager({
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
              : titleModal === titleModalLock
              ? "Khoá"
              : "Mở khoá"
            : "") + " thành công!",
        duration: 1.5,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["managers"] });
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
  const DetailManagers = ({ manager }: { manager: ManagersFormatType }) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: manager?.id,
            user: "#" + manager?.user?.id + " - " + manager?.user?.username,
            createAt: manager?.createAt! ? dayjs(manager?.createAt!) : undefined,
            fullname: manager?.fullname!,
            birthday: manager?.birthday! ? dayjs(manager?.birthday!) : undefined,
            gender: manager?.gender!,
            phone: manager?.phone!,
            email: manager?.email!,
            address: manager?.address!,
            description: manager?.description!,
            status: manager?.status!,
          }}
          className="modal__form split-3"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title}</p>
            <div className="modal__form-group">
              <Form.Item
                name="image"
                label={defaultLabels.image}
                className="modal__form-group-item"
              >
                <CustomImageUpload
                  defaultSrc={manager?.image! as string}
                  alt="image-preview"
                  imageClassName="image-preview"
                  imageCategoryName="managers"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs.image}
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <TextArea className="multiple-2" disabled />
              </Form.Item>
            </div>
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
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    className="text-center"
                    disabled
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="fullname"
                label={defaultLabels.fullname}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled />
              </Form.Item>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="birthday"
                  label={defaultLabels.birthday}
                  className="modal__form-group-item"
                >
                  <DatePicker format="YYYY-MM-DD" disabled />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label={defaultLabels.gender}
                  className="modal__form-group-item"
                >
                  <Select disabled />
                </Form.Item>
              </div>
              <Form.Item
                name="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="address"
                label={defaultLabels.address}
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="user"
                label={defaultLabels.user}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item
                name="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
              >
                <Input disabled />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateManagers = () => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={{
            createAt: dayjs(),
          }}
          className="modal__form split-3"
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
              handleSubmitMutation.mutate({
                type: "create",
                values: values,
                imageFile: imageFile,
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
              <Form.Item
                label={defaultLabels.image}
                htmlFor="create-image"
                className="modal__form-group-item"
              >
                <CustomImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  htmlFor="create-image"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs.image}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.description}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
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
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    className="text-center"
                    disabled
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="fullname"
                htmlFor="fullname"
                label={defaultLabels.fullname}
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Họ và tên không được để trống !")]}
              >
                <Input id="fullname" placeholder={defaultInputs.fullname} />
              </Form.Item>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="birthday"
                  htmlFor="birthday"
                  label={defaultLabels.birthday}
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="birthday"
                    allowClear
                    format="YYYY-MM-DD"
                    placeholder={defaultInputs.birthday}
                  />
                </Form.Item>
                <Form.Item
                  name="gender"
                  htmlFor="gender"
                  label={defaultLabels.gender}
                  className="modal__form-group-item"
                >
                  <Select
                    id="gender"
                    allowClear
                    options={[
                      {
                        label: CommonGender.male,
                        value: CommonGender.male,
                      },
                      {
                        label: CommonGender.female,
                        value: CommonGender.female,
                      },
                    ]}
                    placeholder={defaultInputs.gender}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="phone"
                htmlFor="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống !"),
                  rulePhone(),
                ]}
              >
                <Input id="phone" placeholder={defaultInputs.phone} />
              </Form.Item>
              <Form.Item
                label={defaultLabels.address}
                className="modal__form-group-item multiple-2"
              >
                <Space.Compact>
                  <Form.Item name="address" noStyle>
                    <Input
                      id="update-address"
                      placeholder={defaultInputs.address}
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
              <Form.Item
                name="status"
                htmlFor="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
                rules={[ruleRequired("Trạng thái không được để trống !")]}
              >
                <Select
                  id="status"
                  allowClear
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
                  placeholder={defaultInputs.status}
                />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="userId"
                htmlFor="user"
                label={defaultLabels.user}
                className="modal__form-group-item"
                rules={[ruleRequired("Tài khoản không được để trống !")]}
              >
                <Select
                  id="user"
                  allowClear
                  options={users?.map((user) => ({
                    label: "#" + user?.id + " - " + user?.username,
                    value: user?.id,
                  }))}
                  placeholder={defaultInputs.user}
                />
              </Form.Item>
              <Form.Item
                name="email"
                htmlFor="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
                rules={[ruleRequired("Email không được để trống"), ruleEmail()]}
              >
                <Input id="email" placeholder={defaultInputs.email} />
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
  const UpdateManagers = ({ manager }: { manager: ManagersFormatType }) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={{
            id: manager?.id || undefined,
            userId: manager?.user?.id || undefined,
            createAt: manager?.createAt ? dayjs(manager?.createAt) : undefined,
            fullname: manager?.fullname || undefined,
            birthday: manager?.birthday ? dayjs(manager?.birthday) : undefined,
            gender: manager?.gender || undefined,
            phone: manager?.phone || undefined,
            email: manager?.email || undefined,
            address: manager?.address || undefined,
            description: manager?.description || undefined,
            status: manager?.status || undefined,
          }}
          className="modal__form split-3"
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
                imageFile: imageFile,
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
              <Form.Item
                label={defaultLabels.image}
                htmlFor="create-image"
                className="modal__form-group-item"
              >
                <CustomImageUpload
                defaultSrc={manager?.image}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  htmlFor="create-image"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs.image}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.description}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
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
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    className="text-center"
                    disabled
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="fullname"
                htmlFor="fullname"
                label={defaultLabels.fullname}
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Họ và tên không được để trống !")]}
              >
                <Input id="fullname" placeholder={defaultInputs.fullname} />
              </Form.Item>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="birthday"
                  htmlFor="birthday"
                  label={defaultLabels.birthday}
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="birthday"
                    allowClear
                    format="YYYY-MM-DD"
                    placeholder={defaultInputs.birthday}
                  />
                </Form.Item>
                <Form.Item
                  name="gender"
                  htmlFor="gender"
                  label={defaultLabels.gender}
                  className="modal__form-group-item"
                >
                  <Select
                    id="gender"
                    allowClear
                    options={[
                      {
                        label: CommonGender.male,
                        value: CommonGender.male,
                      },
                      {
                        label: CommonGender.female,
                        value: CommonGender.female,
                      },
                    ]}
                    placeholder={defaultInputs.gender}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="phone"
                htmlFor="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống !"),
                  rulePhone(),
                ]}
              >
                <Input id="phone" placeholder={defaultInputs.phone} />
              </Form.Item>
              <Form.Item
                label={defaultLabels.address}
                className="modal__form-group-item multiple-2"
              >
                <Space.Compact>
                  <Form.Item name="address" noStyle>
                    <Input
                      id="update-address"
                      placeholder={defaultInputs.address}
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
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="userId"
                htmlFor="user"
                label={defaultLabels.user}
                className="modal__form-group-item"
                rules={[ruleRequired("Tài khoản không được để trống !")]}
              >
                <Select
                  id="user"
                  allowClear
                  options={users?.map((user) => ({
                    label: "#" + user?.id + " - " + user?.username,
                    value: user?.id,
                  }))}
                  placeholder={defaultInputs.user}
                />
              </Form.Item>
              <Form.Item
                name="email"
                htmlFor="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
                rules={[ruleRequired("Email không được để trống"), ruleEmail()]}
              >
                <Input id="email" placeholder={defaultInputs.email} />
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
  const LockManagers = ({
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
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b> chủ
              nhà hàng có mã đối tượng là <b>{id}</b> ?
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
  // - Các modal tương ứng cho từng chức năng
  const AdminManagersModal = {
    detail: (manager: ManagersFormatType) => (
      <DetailManagers manager={manager} />
    ),
    create: () => <CreateManagers />,
    update: (manager: ManagersFormatType) => (
      <UpdateManagers manager={manager} />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockManagers id={id} status={status} />
    ),
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
            placeholder="Chọn Trạng thái"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-status"
            options={statusOptions}
            setFilterSelectValue={setFilterStatusValue}
          />
          {
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
                  "89%",
                  getActionNameEn(1) + " managers",
                  AdminManagersModal.create()
                )
              }
            >
              <FontAwesomeIcon icon={faPlus} className="icon" />
              &nbsp;Thêm&nbsp;{objectName.toLowerCase()}
            </button>
          }
        </div>
        <div className="main__table">
          <CustomTableActions<ManagersFormatType>
            columns={columns}
            data={managers || []}
            rowKey={(record) => String(record?.id)}
            loading={isLoading}
            defaultPageSize={10}
            className="table-actions managers"
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

export default AdminManagersPage;
