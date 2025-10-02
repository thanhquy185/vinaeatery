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
import dayjs from "dayjs";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Tag,
  type SelectProps,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import type { ColumnsType } from "antd/es/table";
import type {
  OrderTablesFormatType,
  OrderTablesType,
  ReactQueryMutationProps,
} from "../../../common/types";
import { ruleEmail, rulePhone, ruleRequired } from "../../../common/rules";
import {
  CommonStatus,
  ReactQueryGetData,
  TitleModalCommon,
} from "../../../common/values";
import CustomFindInput from "../../../components/admin/find-input";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomModal from "../../../components/admin/modal";
import CustomFindSelect from "../../../components/admin/find-select";
import {
  FindAllOrderTable,
  HandleCreateOrderTable,
  HandleLockOrderTable,
  HandleUpdateOrderTable,
} from "../../../services/api";
import {
  getActionNameEn,
  getActionNameVn,
} from "../../../services/default-actions";
import { getActionsString } from "../../../services/employee-login";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";
import { showCreateValidAddress } from "../../../utils/showCreateValidAddress";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Đơn đặt bàn";
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());

// Admin Order Tables Page
const AdminOrderTablesPage = ({ functionId }: { functionId: number }) => {
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId });

  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

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
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  /// - Trạng thái
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
    data: orderTables,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "order-tables",
      filterFindType,
      filterFindValue,
      filterStatusValue,
    ],
    queryFn: async () => {
      const res = await FindAllOrderTable({
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
  const columns: ColumnsType<OrderTablesFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Thời gian đặt bàn",
      dataIndex: "timeOrder",
      key: "timeOrder",
      width: "18%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ display: "flex" }}
            value={
              selectedKeys[0]
                ? (() => {
                    const [start, end] = JSON.parse(
                      selectedKeys[0] as string
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
                  : []
              )
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
          {/* Nếu muốn nút reset thì bật lại */}
          {/* <Button
        size="small"
        style={{ width: "100%", marginTop: 4 }}
        onClick={() => {
          clearFilters?.();
          confirm();
        }}
      >
        Đặt lại
      </Button> */}
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;
        const [start, end] = JSON.parse(value as string) as [string, string];
        const date = dayjs(record.timeOrder);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) =>
        dayjs(a.timeOrder).valueOf() - dayjs(b.timeOrder).valueOf(),
      render: (val) => val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : "",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullname",
      key: "fullname",
      width: "18%",
      sorter: (a, b) => a?.fullname!.localeCompare(b?.fullname!),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
      sorter: (a, b) => a?.phone!.localeCompare(b?.phone!),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: "22%",
      className: "left",
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
      className: "buttons",
      render: (text: any, record: OrderTablesFormatType, index: number) => (
        <>
          {validActions?.includes(getActionNameVn(0)) && (
            <button
              className={"action " + getActionNameEn(0)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalDetail,
                  true,
                  "89%",
                  getActionNameEn(0) + " order-tables",
                  AdminOrderTablesModal.detail(record)
                )
              }
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </button>
          )}
          {validActions?.includes(getActionNameVn(2)) && (
            <button
              className={"action " + getActionNameEn(2)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalUpdate,
                  true,
                  "89%",
                  getActionNameEn(2) + " order-tables",
                  AdminOrderTablesModal.update(record)
                )
              }
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
          {validActions?.includes(getActionNameVn(3)) && (
            <button
              className={"action " + getActionNameEn(3)}
              onClick={() =>
                updatePropertiesModal(
                  record.status == CommonStatus["active"]
                    ? titleModalLock
                    : titleModalUnlock,
                  true,
                  "30%",
                  getActionNameEn(3) + " order-tables",
                  AdminOrderTablesModal.lock(
                    record!.id as number,
                    record!.status
                  )
                )
              }
            >
              <FontAwesomeIcon
                icon={
                  record.status == CommonStatus["active"] ? faLock : faUnlock
                }
              />
            </button>
          )}
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
    title1: "Thông tin cơ bản",
    title2: "Thông tin người đặt bàn",
    id: "Mã đơn đặt bàn",
    timeOrder: "Thời gian đặt bàn",
    timeArrive: "Thời gian đến ăn",
    employee:
      "Nhân viên xác nhận (Mã nhân viên - Họ và tên - Số điện thoại - Email)",
    note: "Ghi chú",
    fullname: "Họ và tên",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Chưa xác định !",
    timeOrder: "Thời gian đặt bàn",
    timeArrive: "Thời gian đến ăn",
    employee: "",
    fullname: "Nhập Họ và tên",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    note: "Nhập Ghi chú",
    status: "Chọn Trạng thái",
  };
  // - Mutation cho việc thêm, cập nhật và khoá dữ liệu
  const handleSubmitMutation = useMutation({
    mutationFn: async ({
      type,
      values,
      objectId,
    }: ReactQueryMutationProps<OrderTablesType>) => {
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          const res = await HandleCreateOrderTable({
            timeOrder:
              values!.timeOrder && dayjs(values!.timeOrder).isValid()
                ? dayjs(values!.timeOrder).format("YYYY-MM-DD HH:mm:ss")
                : undefined,
            timeArrive:
              values!.timeArrive && dayjs(values!.timeArrive).isValid()
                ? dayjs(values!.timeArrive).format("YYYY-MM-DD HH:mm:ss")
                : undefined,
            employeeId: 2,
            note: values!.note || undefined,
            fullname: values!.fullname || undefined,
            phone: values!.phone || undefined,
            email: values!.email || undefined,
            address: values!.address || undefined,
            status: values!.status || undefined,
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          const res = await HandleUpdateOrderTable({
            id: values!.id,
            timeOrder:
              values!.timeOrder && dayjs(values!.timeOrder).isValid()
                ? dayjs(values!.timeOrder).format("YYYY-MM-DD HH:mm:ss")
                : undefined,
            timeArrive:
              values!.timeArrive && dayjs(values!.timeArrive).isValid()
                ? dayjs(values!.timeArrive).format("YYYY-MM-DD HH:mm:ss")
                : undefined,
            note: values!.note || undefined,
            fullname: values!.fullname || undefined,
            phone: values!.phone || undefined,
            email: values!.email || undefined,
            address: values!.address || undefined,
            timeUpdate: new Date().toISOString(),
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
          const res = await HandleLockOrderTable({
            id: objectId! as number,
            status:
              (type === "lock" ? CommonStatus.active : CommonStatus.inactive) ||
              undefined,
            timeUpdate: new Date().toISOString(),
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
    onSuccess: () => {
      openNotification({
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
        queryClient.invalidateQueries({ queryKey: ["order-tables"] });
        setOpenModal(false);
      }, 1500);
    },
    onError: (error) => {
      openNotification({
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
  const DetailOrderTables = ({
    id,
    timeOrder,
    timeArrive,
    employee,
    fullname,
    phone,
    email,
    address,
    note,
    status,
  }: OrderTablesFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            timeOrder: dayjs(timeOrder!),
            timeArrive: dayjs(timeArrive!),
            employee:
              "#" +
              employee!.id +
              " - " +
              employee!.fullname +
              " - " +
              employee!.phone +
              " - " +
              employee!.email,
            note: note!,
            fullname: fullname!,
            phone: phone!,
            email: email!,
            address: address!,
            status: status!,
          }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="id"
                  label={defaultLabels["id"]}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled={true} />
                </Form.Item>
                <Form.Item
                  name="status"
                  label={defaultLabels["status"]}
                  className="modal__form-group-item"
                >
                  <Select disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                name="timeOrder"
                label={defaultLabels["timeOrder"]}
                className="modal__form-group-item"
              >
                <DatePicker showTime={true} disabled={true} />
              </Form.Item>
              <Form.Item
                name="timeArrive"
                label={defaultLabels["timeArrive"]}
                className="modal__form-group-item"
              >
                <DatePicker showTime={true} disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="employee"
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                name="note"
                label={defaultLabels["note"]}
                className="modal__form-group-item multiple-2"
              >
                <TextArea className="multiple-2" disabled={true} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="fullname"
                label={defaultLabels["fullname"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="address"
                label={defaultLabels["address"]}
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="phone"
                label={defaultLabels["phone"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
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
  const CreateOrderTables = () => {
    const [form] = Form.useForm();

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
              handleSubmitMutation.mutate({ type: "create", values: values });

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
              <div className="modal__form-group-item-warper split-2">
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
                  name="status"
                  label={defaultLabels["status"]}
                  htmlFor="create-status"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Trạng thái !")]}
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
              <Form.Item
                name="timeOrder"
                label={defaultLabels["timeOrder"]}
                htmlFor="create-timeOrder"
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Thời gian đặt bàn không được để trống !"),
                ]}
              >
                <DatePicker
                  showTime={true}
                  id="create-timeOrder"
                  placeholder={defaultInputs["timeOrder"]}
                />
              </Form.Item>
              <Form.Item
                name="timeArrive"
                label={defaultLabels["timeArrive"]}
                htmlFor="create-timeArrive"
                className="modal__form-group-item"
              >
                <DatePicker
                  showTime={true}
                  id="create-timeArrive"
                  placeholder={defaultInputs["timeArrive"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="employee"
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Select
                  placeholder={defaultInputs["employee"]}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="note"
                label={defaultLabels["note"]}
                htmlFor="create-note"
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  id="create-note"
                  className="multiple-2"
                  placeholder={defaultInputs["note"]}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
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
                label={defaultLabels["address"]}
                className="modal__form-group-item multiple-3"
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
            </div>
            <div className="modal__form-group">
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
  const UpdateOrderTables = ({
    id,
    timeOrder,
    timeArrive,
    employee,
    fullname,
    phone,
    email,
    address,
    note,
    status,
  }: OrderTablesFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            timeOrder: dayjs(timeOrder!),
            timeArrive: dayjs(timeArrive!),
            employee:
              "#" +
              employee!.id +
              " - " +
              employee!.fullname +
              " - " +
              employee!.phone +
              " - " +
              employee!.email,
            note: note!,
            fullname: fullname!,
            phone: phone!,
            email: email!,
            address: address!,
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
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              handleSubmitMutation.mutate({ type: "update", values: values });

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
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="id"
                  label={defaultLabels["id"]}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled={true} />
                </Form.Item>
                <Form.Item
                  name="status"
                  label={defaultLabels["status"]}
                  className="modal__form-group-item"
                >
                  <Select disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                name="timeOrder"
                label={defaultLabels["timeOrder"]}
                htmlFor="update-timeOrder"
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Thời gian đặt bàn không được để trống !"),
                ]}
              >
                <DatePicker
                  showTime={true}
                  id="update-timeOrder"
                  placeholder={defaultInputs["timeOrder"]}
                />
              </Form.Item>
              <Form.Item
                name="timeArrive"
                label={defaultLabels["timeArrive"]}
                htmlFor="update-timeArrive"
                className="modal__form-group-item"
              >
                <DatePicker
                  showTime={true}
                  id="update-timeArrive"
                  placeholder={defaultInputs["timeArrive"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="employee"
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                name="note"
                label={defaultLabels["note"]}
                htmlFor="update-note"
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  id="update-note"
                  className="multiple-2"
                  placeholder={defaultInputs["note"]}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
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
                label={defaultLabels["address"]}
                className="modal__form-group-item multiple-3"
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
            </div>
            <div className="modal__form-group">
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
  const LockOrderTables = ({
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
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b> nhà
              cung cấp có mã đối tượng là <b>{id}</b> ?
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
  const AdminOrderTablesModal = {
    detail: (orderTable: OrderTablesFormatType) => (
      <DetailOrderTables
        id={orderTable!.id}
        timeOrder={orderTable!.timeOrder}
        timeArrive={orderTable!.timeArrive}
        employee={orderTable!.employee}
        fullname={orderTable!.fullname}
        phone={orderTable!.phone}
        email={orderTable!.email}
        address={orderTable!.address}
        note={orderTable!.note}
        status={orderTable!.status}
      />
    ),
    create: () => <CreateOrderTables />,
    update: (orderTable: OrderTablesFormatType) => (
      <UpdateOrderTables
        id={orderTable!.id}
        timeOrder={orderTable!.timeOrder}
        timeArrive={orderTable!.timeArrive}
        employee={orderTable!.employee}
        fullname={orderTable!.fullname}
        phone={orderTable!.phone}
        email={orderTable!.email}
        address={orderTable!.address}
        note={orderTable!.note}
        status={orderTable!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockOrderTables id={id} status={status} />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">{objectName}</h2>
        </div>
        <div className="main__filter order-tables">
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
          {validActions?.includes(getActionNameVn(1)) && (
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
                  getActionNameEn(1) + " order-tables",
                  AdminOrderTablesModal.create()
                )
              }
            >
              <FontAwesomeIcon icon={faPlus} className="icon" />
              &nbsp;Thêm
            </button>
          )}
        </div>
        <div className="main__table">
          <CustomTableActions<OrderTablesFormatType>
            columns={columns}
            data={orderTables || []}
            rowKey={(record) => String(record?.id)}
            loading={isLoading}
            defaultPageSize={10}
            className="table-actions order-tables"
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

export default AdminOrderTablesPage;
