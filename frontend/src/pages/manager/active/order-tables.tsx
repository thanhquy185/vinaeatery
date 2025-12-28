import { useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
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
} from "../../../common/types";
import { ruleEmail, rulePhone, ruleRequired } from "../../../common/rules";
import {
  CommonStatus,
  OrderStatus,
  ReactQueryGetData,
  TitleModalCommon,
  UserRoleValue,
} from "../../../common/values";
import CustomFindInput from "../../../components/common/find-input";
import CustomTableActions from "../../../components/common/table-actions";
import CustomModal from "../../../components/common/modal";
import CustomFindSelect from "../../../components/common/find-select";
import {
  FindAllOrderTable,
  HandleCreateOrderTable,
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
import type {
  ManagerPageProps,
  ReactQueryMutationProps,
} from "../../../common/props";
import dayjs from "dayjs";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Đơn đặt bàn";
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());

// Manager Order Tables Page
const ManagerOrderTablesPage = ({
  infoLogin,
  functionId,
}: ManagerPageProps) => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Có là chủ nhà hàng đăng nhập
  const isManager = infoLogin?.user?.role === UserRoleValue.manager;
  // Mã nhà hàng được chọn (dành cho chủ nhà hàng)
  const selectedRestaurantId = Number(
    sessionStorage.getItem("selected-restaurant-id")
  );

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["order-tables"] });
  }, [selectedRestaurantId]);
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId });

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
    { label: OrderStatus.confirm, value: OrderStatus.confirm },
    { label: OrderStatus.canceled, value: OrderStatus.canceled },
    { label: OrderStatus.pending, value: OrderStatus.pending },
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
        restaurantId: isManager
          ? selectedRestaurantId
          : infoLogin?.restaurantId,
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
      dataIndex: "createAt",
      key: "createAt",
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
        const date = dayjs(record.createAt);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) =>
        dayjs(a.createAt).valueOf() - dayjs(b.createAt).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : ""),
    },
    {
      title: "Thời gian đặt bàn",
      dataIndex: "arriveAt",
      key: "arriveAt",
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
        const date = dayjs(record.arriveAt);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) =>
        dayjs(a.arriveAt).valueOf() - dayjs(b.arriveAt).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : ""),
    },
    {
      title: "Họ tên khách hàng",
      dataIndex: "customerFullname",
      key: "customerFullname",
      width: "22%",
      sorter: (a, b) =>
        a?.customerFullname!.localeCompare(b?.customerFullname!),
    },
    {
      title: "Số điện thoại",
      dataIndex: "customerPhone",
      key: "customerPhone",
      width: "12%",
      sorter: (a, b) => a?.customerPhone!.localeCompare(b?.customerPhone!),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "14%",
      render: (status: string) => (
        <Tag
          color={
            status === OrderStatus.confirm
              ? "green"
              : status === OrderStatus.canceled
              ? "red"
              : "default"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "6%",
      className: "buttons",
      render: (text: any, record: OrderTablesFormatType, index: number) => (
        <>
          {((isManager && selectedRestaurantId) ||
            validActions?.includes(getActionNameVn(0))) && (
            <button
              className={"action " + getActionNameEn(0)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalDetail,
                  true,
                  "89%",
                  getActionNameEn(0) + " order-tables",
                  ManagerOrderTablesModal.detail(record)
                )
              }
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </button>
          )}
          {((isManager && selectedRestaurantId) ||
            validActions?.includes(getActionNameVn(2))) && (
            <button
              className={"action " + getActionNameEn(2)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalUpdate,
                  true,
                  "89%",
                  getActionNameEn(2) + " order-tables",
                  ManagerOrderTablesModal.update(record)
                )
              }
            >
              <FontAwesomeIcon icon={faPenToSquare} />
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
    createAt: "Thời gian đặt bàn",
    arriveAt: "Thời gian dự kiến",
    employee:
      "Nhân viên xác nhận (Mã nhân viên - Họ và tên - Số điện thoại - Email)",
    customerFullname: "Họ và tên",
    customerPhone: "Số điện thoại",
    customerEmail: "Email",
    customerNote: "Ghi chú",
    guests: "Số lượng khách",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Chưa xác định!",
    createAt: "Thời gian đặt bàn",
    arriveAt: "Thời gian dự kiến",
    employee: "Khi mới tạo đơn đặt bàn thì nhân viên chưa thể xác nhận !",
    customerFullname: "Nhập Họ và tên",
    customerPhone: "Nhập Số điện thoại",
    customerEmail: "Nhập Email",
    customerNote: "Nhập Ghi chú",
    guests: "Nhập Số lượng khách",
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
          // const res = await HandleCreateOrderTable({
          //   restaurantId: isManager
          //     ? selectedRestaurantId!
          //     : infoLogin?.restaurantId!,
          //   createAt:
          //     values!.createAt && dayjs(values!.createAt).isValid()
          //       ? dayjs(values!.createAt).format("YYYY-MM-DD HH:mm:ss")
          //       : undefined,
          //   arriveAt:
          //     values!.arriveAt && dayjs(values!.arriveAt).isValid()
          //       ? dayjs(values!.arriveAt).format("YYYY-MM-DD HH:mm:ss")
          //       : undefined,
          //   employeeId: infoLogin?.id,
          //   note: values!.note || undefined,
          //   fullname: values!.fullname || undefined,
          //   phone: values!.phone || undefined,
          //   email: values!.email || undefined,
          //   address: values!.address || undefined,
          //   status: values!.status || undefined,
          // });
          // if (res.status === 200) {
          //   return res.data;
          // }
          // {
          //   throw new Error(String(res.data));
          // }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          // const res = await HandleUpdateOrderTable({
          //   id: values!.id,
          //   createAt:
          //     values!.createAt && dayjs(values!.createAt).isValid()
          //       ? dayjs(values!.createAt).format("YYYY-MM-DD HH:mm:ss")
          //       : undefined,
          //   arriveAt:
          //     values!.arriveAt && dayjs(values!.arriveAt).isValid()
          //       ? dayjs(values!.arriveAt).format("YYYY-MM-DD HH:mm:ss")
          //       : undefined,
          //   note: values!.note || undefined,
          //   fullname: values!.fullname || undefined,
          //   phone: values!.phone || undefined,
          //   email: values!.email || undefined,
          //   address: values!.address || undefined,
          //   updateAt: new Date().toISOString(),
          // });
          // if (res.status === 200) {
          //   return res.data;
          // }
          // {
          //   throw new Error(String(res.data));
          // }
        } else if (
          (type === "lock" && titleModal === titleModalLock) ||
          (type === "unlock" && titleModal === titleModalUnlock)
        ) {
          // const res = await HandleLockOrderTable({
          //   id: objectId! as number,
          //   status:
          //     (type === "lock" ? CommonStatus.active : CommonStatus.inactive) ||
          //     undefined,
          //   updateAt: new Date().toISOString(),
          // });
          // if (res.status === 200) {
          //   return res.data;
          // }
          // {
          //   throw new Error(String(res.data));
          // }
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
    createAt,
    arriveAt,
    employee,
    customerFullname,
    customerPhone,
    customerEmail,
    customerNote,
    guests,
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
            createAt: dayjs(createAt!),
            arriveAt: dayjs(arriveAt!),
            employee: employee
              ? "#" +
                employee!.id +
                " - " +
                employee!.fullname +
                " - " +
                employee!.phone +
                " - " +
                employee!.email
              : "Chưa có nhân viên xác nhận",
            customerFullname: customerFullname!,
            customerPhone: customerPhone!,
            customerEmail: customerEmail!,
            customerNote: customerNote!,
            guests: guests!,
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
                  <Input className="text-center" disabled />
                </Form.Item>
                <Form.Item
                  name="status"
                  label={defaultLabels["status"]}
                  className="modal__form-group-item"
                >
                  <Select disabled />
                </Form.Item>
              </div>
              <Form.Item
                name="createAt"
                label={defaultLabels["createAt"]}
                className="modal__form-group-item"
              >
                <DatePicker
                  showTime={true}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabled
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="employee"
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item
                name="arriveAt"
                label={defaultLabels["arriveAt"]}
                className="modal__form-group-item"
              >
                <DatePicker
                  showTime={true}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabled
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="guests"
                label={defaultLabels["guests"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="customerFullname"
                label={defaultLabels["customerFullname"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="customerPhone"
                label={defaultLabels["customerPhone"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="customerEmail"
                label={defaultLabels["customerEmail"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerNote"
                label={defaultLabels["customerNote"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <TextArea className="multiple-2" disabled />
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
          initialValues={{
            createAt: dayjs(),
            arriveAt: undefined,
            employee: undefined,
            customerFullname: undefined,
            customerPhone: undefined,
            customerEmail: undefined,
            customerNote: undefined,
            guests: undefined,
            status: OrderStatus.pending,
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

              // Kiểm tra thời gian dự kiến
              if (dayjs(values.arriveAt).isBefore(values.createAt)) {
                openNotification({
                  type: "warning",
                  message: "Thời gian dự kiến không hợp lệ",
                  description:
                    "Thời gian dự kiến không được nhỏ hơn thời gian đặt bàn !",
                });
                submitButton?.classList.remove("active");

                return;
              }

              // Gọi api xử lý
              const res = await HandleCreateOrderTable({
                restaurantId: isManager
                  ? selectedRestaurantId
                  : infoLogin?.restaurantId!,
                createAt:
                  values!.createAt && dayjs(values!.createAt).isValid()
                    ? dayjs(values!.createAt).format("YYYY-MM-DD HH:mm:ss")
                    : undefined,
                arriveAt:
                  values!.arriveAt && dayjs(values!.arriveAt).isValid()
                    ? dayjs(values!.arriveAt).format("YYYY-MM-DD HH:mm:ss")
                    : undefined,
                customerId: 1 || undefined,
                customerFullname: values!.customerFullname || undefined,
                customerPhone: values!.customerPhone || undefined,
                customerEmail: values!.customerEmail || undefined,
                customerNote: values!.customerNote || undefined,
                guests: values!.guests || undefined,
                status: OrderStatus.pending,
              });
              if (res.status === 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Thêm thành công!",
                  duration: 1.5,
                });

                setTimeout(() => {
                  queryClient.invalidateQueries({ queryKey: ["order-tables"] });
                  setOpenModal(false);
                }, 1500);
              } else {
                openNotification({
                  type: "error",
                  message: "Thất bại",
                  description: "Thêm thất bại!",
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
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  label={defaultLabels["id"]}
                  className="modal__form-group-item"
                >
                  <Input
                    placeholder={defaultInputs.id}
                    className="text-center"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="status"
                  label={defaultLabels["status"]}
                  className="modal__form-group-item"
                >
                  <Input disabled />
                </Form.Item>
              </div>
              <Form.Item
                name="createAt"
                label={defaultLabels["createAt"]}
                className="modal__form-group-item"
              >
                <DatePicker
                  showTime={true}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabled
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Select placeholder={defaultInputs.employee} disabled />
              </Form.Item>
              <Form.Item
                name="arriveAt"
                label={defaultLabels["arriveAt"]}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Thời gian dự kiến không được để trống !"),
                ]}
              >
                <DatePicker
                  showTime={true}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={defaultInputs.arriveAt}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="guests"
                label={defaultLabels["guests"]}
                className="modal__form-group-item"
                rules={[ruleRequired("Số lượng khách không được để trống !")]}
              >
                <InputNumber min={1} placeholder={defaultInputs.guests} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="customerFullname"
                label={defaultLabels["customerFullname"]}
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Họ và tên không được để trống !")]}
              >
                <Input placeholder={defaultInputs.customerFullname} />
              </Form.Item>
              <Form.Item
                name="customerPhone"
                label={defaultLabels["customerPhone"]}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống !"),
                  rulePhone(),
                ]}
              >
                <Input placeholder={defaultInputs.customerPhone} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="customerEmail"
                label={defaultLabels["customerEmail"]}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Email không được để trống !"),
                  ruleEmail(),
                ]}
              >
                <Input placeholder={defaultInputs.customerEmail} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerNote"
                label={defaultLabels["customerNote"]}
                className="modal__form-group-item"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.customerNote}
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
  const UpdateOrderTables = ({
    id,
    createAt,
    arriveAt,
    employee,
    customerFullname,
    customerPhone,
    customerEmail,
    customerNote,
    guests,
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
            createAt: dayjs(createAt!),
            arriveAt: dayjs(arriveAt!),
            employee: employee
              ? "#" +
                employee!.id +
                " - " +
                employee!.fullname +
                " - " +
                employee!.phone +
                " - " +
                employee!.email
              : "Chưa có nhân viên xác nhận",
            customerFullname: customerFullname!,
            customerPhone: customerPhone!,
            customerEmail: customerEmail!,
            customerNote: customerNote!,
            guests: guests!,
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
                  <Input className="text-center" disabled />
                </Form.Item>
                <Form.Item
                  name="status"
                  label={defaultLabels["status"]}
                  className="modal__form-group-item"
                >
                  <Select disabled />
                </Form.Item>
              </div>
              <Form.Item
                name="createAt"
                label={defaultLabels["createAt"]}
                className="modal__form-group-item"
              >
                <DatePicker
                  showTime={true}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabled
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="employee"
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item
                name="arriveAt"
                label={defaultLabels["arriveAt"]}
                className="modal__form-group-item"
              >
                <DatePicker
                  showTime={true}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabled
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="guests"
                label={defaultLabels["guests"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="customerFullname"
                label={defaultLabels["customerFullname"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="customerPhone"
                label={defaultLabels["customerPhone"]}
                className={
                  "modal__form-group-item " +
                  (status !== OrderStatus.pending ? "margin-bottom-0" : "")
                }
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="customerEmail"
                label={defaultLabels["customerEmail"]}
                className={
                  "modal__form-group-item " +
                  (status !== OrderStatus.pending ? "margin-bottom-0" : "")
                }
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerNote"
                label={defaultLabels["customerNote"]}
                className={
                  "modal__form-group-item " +
                  (status !== OrderStatus.pending ? "margin-bottom-0" : "")
                }
              >
                <TextArea className="multiple-2" disabled />
              </Form.Item>
            </div>
          </div>
          {status === OrderStatus.pending && (
            <div className="modal__buttons">
              <>
                <button
                  className="modal__button secondary btn green-secondary"
                  onClick={(e) =>
                    callApiToUpdateOrderTable(
                      id!,
                      e.target as HTMLElement,
                      OrderStatus.confirm
                    )
                  }
                >
                  {OrderStatus.confirm}
                </button>
                <button
                  className="modal__button secondary btn red-secondary"
                  onClick={(e) =>
                    callApiToUpdateOrderTable(
                      id!,
                      e.target as HTMLElement,
                      OrderStatus.canceled
                    )
                  }
                >
                  {OrderStatus.canceled}
                </button>
              </>
            </div>
          )}
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
    const statusValue = status == CommonStatus.active ? true : false;

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
  const ManagerOrderTablesModal = {
    detail: (orderTable: OrderTablesFormatType) => (
      <DetailOrderTables
        id={orderTable!.id}
        createAt={orderTable!.createAt}
        arriveAt={orderTable!.arriveAt}
        employee={orderTable!.employee}
        customerFullname={orderTable!.customerFullname}
        customerPhone={orderTable!.customerPhone}
        customerEmail={orderTable!.customerEmail}
        customerNote={orderTable!.customerNote}
        guests={orderTable!.guests}
        status={orderTable!.status}
      />
    ),
    create: () => <CreateOrderTables />,
    update: (orderTable: OrderTablesFormatType) => (
      <UpdateOrderTables
        id={orderTable!.id}
        createAt={orderTable!.createAt}
        arriveAt={orderTable!.arriveAt}
        employee={orderTable!.employee}
        customerFullname={orderTable!.customerFullname}
        customerPhone={orderTable!.customerPhone}
        customerEmail={orderTable!.customerEmail}
        customerNote={orderTable!.customerNote}
        guests={orderTable!.guests}
        status={orderTable!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockOrderTables id={id} status={status} />
    ),
  };
  // Hàm gọi API để cập nhật trạng thái đơn món ăn
  const callApiToUpdateOrderTable = async (
    id: number,
    button: HTMLElement,
    value: string
  ) => {
    // Thêm class 'active' thể hiện là nút được nhấn
    button.classList.add("active");

    // Hỏi trước khi xử khi xử lý ?
    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      // Biến giữ giá trị tương ứng với "trạng thái" cần thay đổi
      let status = null;
      if (value === OrderStatus.confirm || value === OrderStatus.canceled) {
        status = value;
      }

      // Gọi api xử lý
      const res = await HandleUpdateOrderTable({
        id: id,
        status: status!,
      });
      if (res.status === 200) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: "Cập nhật thành công!",
          duration: 1.5,
        });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["order-tables"] });
          setOpenModal(false);
        }, 1500);
      } else {
        openNotification({
          type: "error",
          message: "Thất bại",
          description:
            res.status === 400
              ? String(res.data)
                  .split("|")
                  .map((line, index) => (
                    <div key={index}>
                      {line}
                      <br />
                    </div>
                  ))
              : "Cập nhật thất bại!",
          duration: 1.5,
        });
        setTimeout(() => {
          button.classList.remove("active");
        }, 1500);
      }
    } else {
      // Xoá class 'active' thể hiện là nút không còn được nhấn
      button.classList.remove("active");
    }
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
          {((isManager && selectedRestaurantId) ||
            validActions?.includes(getActionNameVn(1))) && (
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
                  ManagerOrderTablesModal.create()
                )
              }
            >
              <FontAwesomeIcon icon={faPlus} className="icon" />
              &nbsp;Thêm&nbsp;{objectName.toLowerCase()}
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

export default ManagerOrderTablesPage;
