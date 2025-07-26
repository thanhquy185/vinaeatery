import { useEffect, useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { DatePicker, Form, Input, InputNumber, Select, Space, Tag } from "antd";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  CustomerCardsType,
  CustomersFormatType,
} from "../../../common/types";
import { CustomPaginationProps } from "../../../common/pagination-props";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomModal from "../../../components/admin/modal";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import {
  FindAllCustomer,
  FindAllCustomerCard,
  HandleCreateCustomer,
  HandleLockCustomer,
  HandleUpdateCustomer,
} from "../../../services/api";
import { openNotification } from "../../../utils/showNotification";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { showCreateValidAddress } from "../../../utils/showCreateValidAddress";
import { ruleEmail, rulePhone, ruleRequired } from "../../../common/rules";
import { openConfirmation } from "../../../utils/showConfirmation";
import { CommonStatus } from "../../../common/values";

// Các giá trị chung
// - Giới tính
const male = "Nam";
const female = "Nữ";

// Admin Customers Page
const AdminCustomersPage = () => {
  // Cấu hình cột bảng dữ liệu của khách hàng
  const [loading, setLoading] = useState<boolean>(false);
  const columns: ColumnsType<CustomersFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "10%",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullname",
      key: "fullname",
      sorter: true,
      width: "24%",
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
      title: "Tổng tiêu (VNĐ)",
      key: "totalThreshold",
      sorter: true,
      width: "17%",
      render: (record) => vietnamMoneyFormat(record!.totalThreshold!),
    },
    {
      title: "Thẻ khách hàng",
      key: "customerCard",
      width: "17%",
      render: (record) =>
        `#${record.customerCard?.id} - ${record.customerCard?.name}`,
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
      width: "10%",
      render: (text: any, record: CustomersFormatType, index: number) => (
        <>
          <button
            className="action info"
            onClick={() =>
              updatePropertiesModal(
                "Chi tiết khách hàng",
                true,
                "60%",
                "info customers",
                AdminCustomersModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="action update margin-lr"
            onClick={() =>
              updatePropertiesModal(
                "Cập nhật khách hàng",
                true,
                "60%",
                "update customers",
                AdminCustomersModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="action lock"
            onClick={() =>
              updatePropertiesModal(
                (record.status == CommonStatus["active"] ? "Khoá" : "Mở khoá") +
                " khách hàng",
                true,
                "30%",
                "lock customers",
                AdminCustomersModal.lock(record!.id as number, record!.status)
              )
            }
          >
            <FontAwesomeIcon
              icon={record.status == CommonStatus["active"] ? faLock : faUnlock}
            />
          </button>
        </>
      ),
    },
  ];
  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [customers, setCustomers] = useState<CustomersFormatType[]>([]);
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(customers, 10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

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
  // - Thẻ khách hàng
  const [customerCards, setCustomerCards] = useState<CustomerCardsType[]>([]);
  const customerCardOptions: SelectProps["options"] = customerCards?.map(
    (customerCard) => ({
      label: "#" + customerCard.id + " - " + customerCard.name,
      value: customerCard.id,
    })
  );
  const [filterCustomerCardValue, setFilterCustomerCardValue] = useState<
    string[] | null
  >(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatus["active"], value: CommonStatus["active"] },
    { label: CommonStatus["inactive"], value: CommonStatus["inactive"] },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null
  );

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [childrenModal, setChildrenModal] = useState<ReactNode>();
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
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã khách hàng",
    fullname: "Tên khách hàng",
    birthday: "Ngày sinh",
    gender: "Giới tính",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    customerCard: "Thẻ khách hàng",
    totalThreshold: "Tổng tiêu (VNĐ)",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm !",
    fullname: "Nhập Tên khách hàng",
    birthday: "Chọn Ngày sinh",
    gender: "Chọn Giới tính",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    customerCard: "Chọn Thẻ khách hàng",
    totalThreshold: "Nhập Tổng tiêu (VNĐ)",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailCustomers = ({
    id,
    fullname,
    birthday,
    gender,
    phone,
    email,
    address,
    customerCard,
    totalThreshold,
    description,
    status,
  }: CustomersFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            customerCard: "#" + customerCard!.id + " - " + customerCard!.name,
            totalThreshold: totalThreshold!,
            fullname: fullname!,
            birthday: dayjs(birthday!),
            gender: gender!,
            phone: phone!,
            email: email!,
            address: address!,
            description: description!,
            status: status!,
          }}
          className="modal__form split-2"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
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
              <Form.Item
                name="customerCard"
                label={defaultLabels["customerCard"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                name="totalThreshold"
                label={defaultLabels["totalThreshold"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <InputNumber disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
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
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <TextArea className="multiple-2" disabled={true} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateCustomers = () => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form split-2"
          initialValues={{ customerCard: "#1 - Thẻ Đồng", totalThreshold: 0 }}
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

              // Gọi api xử lý
              const res = await HandleCreateCustomer({
                customerCardId: 1,
                totalThreshold: 0,
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
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Thêm thành công !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllCustomer();
                  setOpenModal(false);
                }, 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description: "Thêm thất bại !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  // Xoá class 'active' thể hiện nút không còn được nhấn
                  submitButton?.classList.remove("active");
                }, 1500);
              }
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input
                  placeholder={defaultInputs["id"]}
                  className="text-center"
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="fullname"
                label={defaultLabels["fullname"]}
                htmlFor="create-fullname"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên khách hàng không được để trống !")]}
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
              <Form.Item
                name="customerCard"
                label={defaultLabels["customerCard"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                name="totalThreshold"
                label={defaultLabels["totalThreshold"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
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
                      { label: male, value: male },
                      { label: female, value: female },
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
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                htmlFor="create-description"
                className="modal__form-group-item"
              >
                <TextArea
                  id="create-description"
                  className="multiple-2"
                  placeholder={defaultInputs["description"]}
                />
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
  const UpdateCustomers = ({
    id,
    fullname,
    birthday,
    gender,
    phone,
    email,
    address,
    customerCard,
    totalThreshold,
    description,
    status,
  }: CustomersFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            customerCard: customerCard!.id,
            totalThreshold: totalThreshold!,
            fullname: fullname!,
            birthday: dayjs(birthday!),
            gender: gender!,
            phone: phone!,
            email: email!,
            address: address!,
            description: description!,
            status: status!,
          }}
          className="modal__form split-2"
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

              // Gọi api xử lý
              const res = await HandleUpdateCustomer({
                id: id!,
                customerCardId: values!.customerCard || undefined,
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
                timeUpdate: new Date().toISOString(),
              });
              if (res.status === 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Cập nhật thành công !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllCustomer();
                  setOpenModal(false);
                }, 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description: "Cập nhật thất bại !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  // Xoá class 'active' thể hiện nút không còn được nhấn
                  submitButton?.classList.remove("active");
                }, 1500);
              }
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
              <Form.Item
                name="fullname"
                label={defaultLabels["fullname"]}
                htmlFor="update-fullname"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên khách hàng không được để trống !")]}
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
              <Form.Item
                name="customerCard"
                label={defaultLabels["customerCard"]}
                htmlFor="update-customerCard"
                className="modal__form-group-item"
                rules={[ruleRequired("Thẻ khách hàng không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="update-customerCard"
                  className="customer-cards"
                  placeholder={defaultInputs["customerCard"]}
                  options={customerCards?.map((customerCard) => ({
                    label: "#" + customerCard.id + " - " + customerCard.name,
                    value: customerCard.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="totalThreshold"
                label={defaultLabels["totalThreshold"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
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
                      { label: male, value: male },
                      { label: female, value: female },
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
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                htmlFor="update-description"
                className="modal__form-group-item"
              >
                <TextArea
                  id="update-description"
                  className="multiple-2"
                  placeholder={defaultInputs["description"]}
                />
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
  const LockCustomers = ({
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
          onFinish={async () => {
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
              // Gọi api xử lý
              const res = await HandleLockCustomer({
                id: id!,
                status: status!,
                timeUpdate: new Date().toISOString(),
              });
              if (res.status == 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: `${statusValue ? "Khoá" : "Mở khoá"
                    } thành công !`,
                  duration: 1.5,
                });

                setTimeout(() => {
                  getAllCustomer();
                  setOpenModal(false);
                }, 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description:
                    String(res.data) ??
                    `${statusValue ? "Khoá" : "Mở khoá"} thất bại !`,
                  duration: 1.5,
                });

                setTimeout(() => {
                  // Xoá class 'active' thể hiện nút không còn được nhấn
                  submitButton?.classList.remove("active");
                }, 1500);
              }
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
              khách hàng có mã đối tượng là <b>{id}</b> ?
            </p>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn lock">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const AdminCustomersModal = {
    detail: (table: CustomersFormatType) => (
      <DetailCustomers
        id={table!.id}
        fullname={table!.fullname}
        birthday={table!.birthday}
        gender={table!.gender}
        phone={table!.phone}
        email={table!.email}
        address={table!.address}
        customerCard={table!.customerCard}
        totalThreshold={table!.totalThreshold}
        description={table!.description}
        status={table!.status}
      />
    ),
    create: () => <CreateCustomers />,
    update: (table: CustomersFormatType) => (
      <UpdateCustomers
        id={table!.id}
        fullname={table!.fullname}
        birthday={table!.birthday}
        gender={table!.gender}
        phone={table!.phone}
        email={table!.email}
        address={table!.address}
        customerCard={table!.customerCard}
        totalThreshold={table!.totalThreshold}
        description={table!.description}
        status={table!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockCustomers id={id} status={status} />
    ),
  };

  // Hàm cập nhật danh sách các thẻ khách hàng và khách hàng (gọi API)
  const getAllCustomerCard = async () => {
    const res = await FindAllCustomerCard({
      statusValue: ["Hoạt động"],
    });
    if (res!.status === 200) {
      setCustomerCards(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };
  const getAllCustomer = async () => {
    setLoading(true);
    const res = await FindAllCustomer({
      findType: filterFindType!,
      findValue: filterFindValue!,
      customerCardValue: filterCustomerCardValue!,
      statusValue: filterStatusValue!,
    });
    if (res!.status === 200) {
      setLoading(false);
      setCustomers(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };

  //
  useEffect(() => {
    getAllCustomerCard();
    getAllCustomer();
  }, []);
  useEffect(() => {
    getAllCustomer();
  }, [
    filterFindType,
    filterFindValue,
    filterCustomerCardValue,
    filterStatusValue,
  ]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Vận hành quán ăn - Khách hàng</h2>
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
            placeholder="Chọn Thẻ khách hàng"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-customerCard"
            options={customerCardOptions}
            setFilterSelectValue={setFilterCustomerCardValue}
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
              "main__filter-button btn create" +
              (openModal &&
                String(titleModal).includes("Thêm") &&
                String(classNameModal).includes("create")
                ? " active"
                : "")
            }
            onClick={() =>
              updatePropertiesModal(
                "Thêm khách hàng",
                true,
                "60%",
                "create customers",
                AdminCustomersModal.create()
              )
            }
          >
            <FontAwesomeIcon icon={faPlus} className="icon" />
            &nbsp;Thêm
          </button>
        </div>
        <div className="main__table">
          <CustomTableActions
            columns={columns}
            rowKey={(record) => record!.id as number}
            data={currentItems}
            loading={loading}
            pagination={paginationProps}
            className="table-actions customers"
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
    </>
  );
};

export default AdminCustomersPage;
