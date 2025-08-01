import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faFileArrowDown,
  faPenToSquare,
  faPlus,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Input, InputNumber, Select, Tag, type SelectProps } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type {
  InputTicketDetailsFormatType,
  InputTicketsFormatType,
} from "../../../common/types";
import { CustomPaginationProps } from "../../../common/props";
import { CommonStatus, InputTicketStatus, PayStatus, ReactQueryGetData, TitleModalCommon } from "../../../common/values";
import { ruleRequired } from "../../../common/rules";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomDateRangePicker from "../../../components/admin/date-ranger-picker";
import CustomCardStatic from "../../../components/admin/card-static";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomTableNoActions from "../../../components/admin/table-no-actions";
import CustomModal from "../../../components/admin/modal";
import {
  FindAllIngredient,
  FindAllInputTicket,
  FindAllSupplier,
  HandleCreateInputTicket,
  HandleUpdateInputTicket,
} from "../../../services/api";
import { getVietnamCurrentDatetime } from "../../../services/dayjs";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../utils/otherEvents";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";
import { handlePrintTicket } from "../../../utils/printTicket";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Phiếu nhập"
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalPrint = TitleModalCommon.print(objectName.toLowerCase());
// - Chi tiết phiếu nhập
interface InputTicketDetailsTableProps {
  inputTicketDetails?: InputTicketDetailsFormatType[];
  setInputTicketDetails?: Dispatch<
    SetStateAction<InputTicketDetailsFormatType[]>
  >;
}
const IPDetailsColumnWidths = ["14%", "30%", "17%", "17%", "22%"];
const IPDetailsColumnTitles = [
  "Mã nguyên liệu",
  "Tên nguyên liệu",
  "Giá nhập (VNĐ)",
  "Số lượng",
  "Thành tiền (VNĐ)",
];
const IPDetailsAttributes = [
  "ingredient.id",
  "ingredient.name",
  "price",
  "quantity",
  "price*quantity",
];
const IPDetailsFormat = ["", "", "price", "", "price"];

// Admin Input Tickets Page
const AdminInputTicketsPage = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "NCC", value: "supplier" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Thời gian bắt đầu / Thời gian kết thúc
  const [filterTimeValue, setFilterTimeValue] = useState<[string, string]>();
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: InputTicketStatus.giveback, value: InputTicketStatus.giveback },
    { label: InputTicketStatus.confirm, value: InputTicketStatus.confirm },
    { label: InputTicketStatus.canceled, value: InputTicketStatus.canceled },
    { label: InputTicketStatus.pending, value: InputTicketStatus.pending },
    { label: PayStatus.pay, value: PayStatus.pay },
    { label: PayStatus.notPay, value: PayStatus.notPay },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: inputTickets,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'input-tickets',
      filterFindType,
      filterFindValue,
      filterStatusValue,
    ],
    queryFn: async () => {
      const res = await FindAllInputTicket({
        findType: filterFindType!,
        findValue: filterFindValue!,
        timeValue: filterTimeValue!,
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
  const columns: ColumnsType<InputTicketsFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "8%",
    },
    {
      title: "Thời gian tạo phiếu",
      dataIndex: "timeCreate",
      key: "timeCreate",
      sorter: true,
      width: "16%",
    },
    {
      title: "Nhà cung cấp",
      key: "supplier",
      sorter: (a, b) => {
        const idA = a.supplier?.id ?? 0;
        const idB = b.supplier?.id ?? 0;
        return idA - idB;
      },
      width: "24%",
      render: (record) => `#${record.supplier?.id} - ${record.supplier?.name}`,
    },
    {
      title: "Tổng thanh toán (VNĐ)",
      key: "totalPrice",
      sorter: (a, b) => (a.totalPrice as number) - (b.totalPrice as number),
      width: "16%",
      render: (record) => vietnamMoneyFormat(record.totalPrice),
    },
    {
      title: "Thanh toán",
      dataIndex: "payStatus",
      key: "payStatus",
      width: "12%",
      render: (status: string) => (
        <Tag color={status === PayStatus.pay ? "volcano" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: string) => (
        <Tag
          color={
            status === InputTicketStatus.giveback
              ? "purple"
              : status === InputTicketStatus.confirm
                ? "green"
                : status === InputTicketStatus.canceled
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
      width: "12%",
      render: (text: any, record: InputTicketsFormatType, index: number) => (
        <>
          <button
            className="info action"
            onClick={() =>
              updatePropertiesModal(
                titleModalDetail,
                true,
                "89%",
                "info input-tickets",
                AdminInputTicketsModal.detail(record)
              )
            }
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </button>
          <button
            className="update action margin-lr"
            onClick={() =>
              updatePropertiesModal(
                titleModalUpdate,
                true,
                "89%",
                "update input-tickets",
                AdminInputTicketsModal.update(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="print action"
            onClick={() =>
              updatePropertiesModal(
                titleModalPrint,
                true,
                "80%",
                "print input-tickets",
                AdminInputTicketsModal.print(record)
              )
            }
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
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
  } = CustomPaginationProps(inputTickets || [], 8, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // Các biến giữ giá trị cho việc hiển thị thông số trên card
  const [totalPriceCardValue, setTotalPriceCardValue] = useState<number>(0);
  const [giveBackCardValue, setGiveBackCardValue] = useState<number>(0);
  const [confirmCardValue, setConfirmCardValue] = useState<number>(0);
  const [cancelCardValue, setCancelCardValue] = useState<number>(0);
  const [pendingCardValue, setPendingCardValue] = useState<number>(0);

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
    title2: "Thông tin nhập hàng",
    id: "Mã phiếu nhập",
    timeCreate: "Thời gian tạo phiếu",
    employee:
      "Nhân viên xác nhận  (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
    supplier:
      "Nhà cung cấp (Mã nhà cung cấp - Tên nhà cung cấp - Số điện thoại - Email - Địa chỉ)",
    totalPrice: "Tổng thanh toán (VNĐ)",
    status: "Trạng thái phiếu nhập",
    inputTicketDetails: "Chi tiết phiếu nhập",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Chưa xác định !",
    timeCreate: "",
    employee: "",
    supplier:
      "Chọn Nhà cung cấp (Mã nhà cung cấp - Tên nhà cung cấp - Số điện thoại - Email - Địa chỉ)",
    totalPrice: "",
    status: "Đang chờ xác nhận (Chưa thanh toán)",
    inputTicketDetails: "",
  };
  // - Các modal tương ứng cho từng chức năng
  const DetailInputTickets = ({
    id,
    timeCreate,
    employee,
    supplier,
    totalPrice,
    payStatus,
    status,
    inputTicketDetails,
  }: InputTicketsFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            timeCreate: timeCreate!,
            employee:
              "#" +
              employee!.id +
              " - " +
              employee!.fullname +
              " - " +
              employee!.phone +
              " - " +
              employee!.email,
            supplier:
              "#" +
              supplier!.id +
              " - " +
              supplier!.name +
              " - " +
              supplier!.phone +
              " - " +
              supplier!.email +
              " - " +
              supplier!.address,
            totalPrice:
              vietnamMoneyFormat(totalPrice!) +
              " (" +
              numberToVietnamWords(totalPrice!) +
              ")",
            status: status! + " (" + payStatus! + ")",
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
                  name="timeCreate"
                  label={defaultLabels["timeCreate"]}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="employee"
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="totalPrice"
                label={defaultLabels["totalPrice"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="supplier"
                label={defaultLabels["supplier"]}
                className="modal__form-group-item multiple-3"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["inputTicketDetails"]}
                htmlFor="create-inputTicketDetails"
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <CustomTableNoActions
                  id="create-inputTicketDetails"
                  className="input-ticket-details"
                  columnWidths={IPDetailsColumnWidths}
                  columnTitles={IPDetailsColumnTitles}
                  attributes={IPDetailsAttributes}
                  data={inputTicketDetails}
                  format={IPDetailsFormat}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateInputTickets = () => {
    //
    const [form] = Form.useForm();
    const timeCreateValue = getVietnamCurrentDatetime();
    const [totalPriceValue, setTotalPriceValue] = useState<number>(0);
    const [inputTicketDetails, setInputTicketDetails] = useState<
      InputTicketDetailsFormatType[]
    >([]);

    // Truy vấn dữ liệu nhà cung cấp đang "hoạt động"
    const {
      data: suppliers,
    } = useQuery({
      queryKey: [
        'suppliers',
      ],
      queryFn: async () => {
        const res = await FindAllSupplier({ statusValue: [CommonStatus.active] });
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

    // Tính toán lại tổng tiền nhập khi thay đổi nguyên liệu
    useMemo(() => {
      const totalValue = inputTicketDetails.reduce(
        (total, inputTicketDetail) =>
          total + inputTicketDetail.price * inputTicketDetail.quantity,
        0
      );
      setTotalPriceValue(totalValue);
    }, [inputTicketDetails]);

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

              // Gọi api xử lý
              const res = await HandleCreateInputTicket({
                timeCreate: new Date().toISOString(),
                employeeId: 5, // Mặc định là Quản lý kho hàng (sau xử lý đăng nhập)
                supplierId: values!.supplier || undefined,
                totalPrice: totalPriceValue,
                payStatus: PayStatus.notPay,
                status: InputTicketStatus.pending,
                inputTicketDetails: inputTicketDetails.map(
                  (inputTicketDetail) => ({
                    ingredientId: inputTicketDetail.ingredient.id!,
                    price: inputTicketDetail.price,
                    quantity: inputTicketDetail.quantity,
                  })
                ),
              });
              if (res.status === 200) {
                openNotification({
                  type: "success",
                  message: "Thành công",
                  description: "Thêm thành công !",
                  duration: 1.5,
                });

                setTimeout(() => {
                  queryClient.invalidateQueries({ queryKey: ['input-tickets'] });
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
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
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
                  label={defaultLabels["timeCreate"]}
                  className="modal__form-group-item"
                >
                  <Input
                    className="text-center"
                    value={timeCreateValue}
                    disabled={true}
                  />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Input value={defaultInputs["status"]} disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["employee"]}
                className="modal__form-group-item multiple-2"
              >
                <Select
                  className="employees"
                  placeholder={defaultInputs["employee"]}
                  options={[
                    {
                      label: "Xử lý khi đăng nhập",
                      value: 5,
                    },
                  ]}
                  value={5}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["totalPrice"]}
                className="modal__form-group-item multiple-2"
              >
                <Input
                  placeholder={defaultInputs["totalPrice"]}
                  value={
                    vietnamMoneyFormat(totalPriceValue) +
                    " (" +
                    numberToVietnamWords(totalPriceValue) +
                    ")"
                  }
                  disabled={true}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="supplier"
                label={defaultLabels["supplier"]}
                htmlFor="create-supplier"
                className="modal__form-group-item multiple-3"
                rules={[ruleRequired("Nhà cung cấp không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="create-supplier"
                  placeholder={defaultInputs["supplier"]}
                  options={suppliers?.map((supplier) => ({
                    label:
                      "#" +
                      supplier!.id +
                      " - " +
                      supplier!.name +
                      " - " +
                      supplier!.phone +
                      " - " +
                      supplier!.email +
                      " - " +
                      supplier!.address,
                    value: supplier!.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels["inputTicketDetails"]}
                htmlFor="create-inputTicketDetails"
                className="modal__form-group-item multiple-3"
              >
                <CustomTableNoActions
                  id="create-inputTicketDetails"
                  className="inputTicketDetails"
                  columnWidths={IPDetailsColumnWidths}
                  columnTitles={IPDetailsColumnTitles}
                  data={inputTicketDetails}
                  attributes={IPDetailsAttributes}
                  format={IPDetailsFormat}
                />
                <div className="buttons">
                  <button
                    type="button"
                    className="btn secondary-btn margin-r"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Xoá nguyên liệu",
                        true,
                        "60%",
                        "secondary inputTicketDetails",
                        AdminInputTicketDetailsModal.delete({
                          inputTicketDetails,
                          setInputTicketDetails,
                        })
                      )
                    }
                  >
                    Xoá nguyên liệu
                  </button>
                  <button
                    type="button"
                    className="btn secondary-btn"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Thêm nguyên liệu",
                        true,
                        "60%",
                        "secondary inputTicketDetails",
                        AdminInputTicketDetailsModal.create({
                          inputTicketDetails,
                          setInputTicketDetails,
                        })
                      )
                    }
                  >
                    Thêm nguyên liệu
                  </button>
                </div>
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
  const UpdateInputTickets = ({
    id,
    timeCreate,
    supplier,
    employee,
    totalPrice,
    payStatus,
    status,
    inputTicketDetails,
  }: InputTicketsFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            timeCreate: timeCreate!,
            employee:
              "#" +
              employee!.id +
              " - " +
              employee!.fullname +
              " - " +
              employee!.phone +
              " - " +
              employee!.email,
            supplier:
              "#" +
              supplier!.id +
              " - " +
              supplier!.name +
              " - " +
              supplier!.phone +
              " - " +
              supplier!.email +
              " - " +
              supplier!.address,
            totalPrice:
              vietnamMoneyFormat(totalPrice!) +
              " (" +
              numberToVietnamWords(totalPrice!) +
              ")",
            status: status! + " (" + payStatus! + ")",
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
                  name="timeCreate"
                  label={defaultLabels["timeCreate"]}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
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
                name="totalPrice"
                label={defaultLabels["totalPrice"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="supplier"
                label={defaultLabels["supplier"]}
                className="modal__form-group-item multiple-3"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                label={defaultLabels["inputTicketDetails"]}
                className="modal__form-group-item multiple-3"
              >
                <CustomTableNoActions
                  columnWidths={IPDetailsColumnWidths}
                  columnTitles={IPDetailsColumnTitles}
                  attributes={IPDetailsAttributes}
                  data={inputTicketDetails}
                  format={IPDetailsFormat}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            {status === InputTicketStatus.confirm && (
              <button
                className="modal__button secondary btn purple-secondary"
                onClick={(e) =>
                  callApiToUpdateInputTicket(
                    id!,
                    e.target as HTMLElement,
                    InputTicketStatus.giveback
                  )
                }
              >
                {InputTicketStatus.giveback}
              </button>
            )}
            {status === InputTicketStatus.pending && (
              <>
                <button
                  className="modal__button secondary btn green-secondary"
                  onClick={(e) =>
                    callApiToUpdateInputTicket(
                      id!,
                      e.target as HTMLElement,
                      InputTicketStatus.confirm
                    )
                  }
                >
                  {InputTicketStatus.confirm}
                </button>
                <button
                  className="modal__button secondary btn red-secondary"
                  onClick={(e) =>
                    callApiToUpdateInputTicket(
                      id!,
                      e.target as HTMLElement,
                      InputTicketStatus.canceled
                    )
                  }
                >
                  {InputTicketStatus.canceled}
                </button>
              </>
            )}
            <button
              className="modal__button secondary btn"
              onClick={(e) =>
                callApiToUpdateInputTicket(
                  id!,
                  e.target as HTMLElement,
                  payStatus! === PayStatus.pay ? PayStatus.notPay : PayStatus.pay
                )
              }
            >
              {payStatus === PayStatus.pay ? PayStatus.notPay : PayStatus.pay}
            </button>
          </div>
        </Form>
      </>
    );
  };
  const PrintInputTickets = ({
    id,
    timeCreate,
    employee,
    supplier,
    totalPrice,
    payStatus,
    status,
    inputTicketDetails,
  }: InputTicketsFormatType) => {
    // Ngày hiện tại
    const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();
    const dateTime = today.replace("T", "__").slice(0, -5);
    const day = today.slice(8, 10);
    const month = today.slice(5, 7);
    const year = today.slice(0, 4);

    return (
      <>
        <div id="content-print" className="ticket__content">
          <header className="ticket__header">
            <img
              src="/src/assets/images/others/brand-image.png"
              alt="Logo Web"
              className="ticket__logo"
            />
            <div className="ticket__contact">
              <p>Nhà hàng VINAEATERY</p>
              <p>273 An Đ. Vương, Phường 2, Quận 5, Hồ Chí Minh 700000</p>
              <p>123456789 - 0987654321</p>
              <p>vinaeatery@gmail.com.vn</p>
            </div>
          </header>
          <main className="ticket__body input_ticket">
            <h1 className="ticket__title">PHIẾU NHẬP HÀNG</h1>
            <p className="ticket__date">
              Thời gian lập phiếu:{" "}
              <span className="date-start">{timeCreate}</span>
            </p>
            <p className="ticket__info">
              <b>Mã phiếu nhập:</b> #{id}
            </p>
            <p className="ticket__info">
              <b>Nhà cung cấp:</b> {supplier!.name} - {supplier!.phone} -{" "}
              {supplier!.email}
            </p>
            <p className="ticket__info">
              <b>Tổng thanh toán (VNĐ):</b> {vietnamMoneyFormat(totalPrice!)}
              <u>đ</u> ({numberToVietnamWords(totalPrice!)})
            </p>
            <p className="ticket__info">
              <b>Trạng thái phiếu nhập:</b> {status} ({payStatus})
            </p>
            <p className="ticket__info">
              <b>Chi tiết phiếu nhập:</b>
            </p>
            <CustomTableNoActions
              className="ticket__table input_ticket-details"
              columnWidths={IPDetailsColumnWidths}
              columnTitles={IPDetailsColumnTitles}
              data={inputTicketDetails}
              attributes={IPDetailsAttributes}
              format={IPDetailsFormat}
            />
          </main>
          <footer className="ticket__footer input_ticket">
            <p className="ticket__customer">
              Ngày {day} tháng {month} năm {year}
              <b>Nhân viên lập phiếu</b>
              (Ký tên, ghi rõ họ tên)
            </p>
            <p className="ticket__customer">
              Ngày {day} tháng {month} năm {year}
              <b>Thủ kho</b>
              (Ký tên, ghi rõ họ tên)
            </p>
            <p className="ticket__customer">
              Ngày {day} tháng {month} năm {year}
              <b>Thủ quỹ</b>
              (Ký tên, ghi rõ họ tên)
            </p>
            <p className="ticket__customer">
              Ngày {day} tháng {month} năm {year}
              <b>Giám đốc</b>
              (Ký tên, ghi rõ họ tên)
            </p>
          </footer>
        </div>
        <button
          id="print-ticket-button"
          className="ticket__print-btn"
          onClick={(e) => {
            handlePrintTicket({
              contentPrint: "content-print",
              dateTime: dateTime,
              title: "PHNHAPHANG",
              id: id,
            });
          }}
        >
          <FontAwesomeIcon icon={faFileArrowDown} /> &nbsp;&nbsp;Tải xuống phiếu
        </button>
      </>
    );
  };
  const AdminInputTicketsModal = {
    detail: (inputTicket: InputTicketsFormatType) => (
      <DetailInputTickets
        id={inputTicket!.id}
        timeCreate={inputTicket!.timeCreate}
        employee={inputTicket!.employee}
        supplier={inputTicket!.supplier}
        totalPrice={inputTicket!.totalPrice}
        payStatus={inputTicket!.payStatus}
        status={inputTicket!.status}
        inputTicketDetails={inputTicket!.inputTicketDetails}
      />
    ),
    create: () => <CreateInputTickets />,
    update: (inputTicket: InputTicketsFormatType) => (
      <UpdateInputTickets
        id={inputTicket!.id}
        timeCreate={inputTicket!.timeCreate}
        employee={inputTicket!.employee}
        supplier={inputTicket!.supplier}
        totalPrice={inputTicket!.totalPrice}
        payStatus={inputTicket!.payStatus}
        status={inputTicket!.status}
        inputTicketDetails={inputTicket!.inputTicketDetails}
      />
    ),
    print: (inputTicket: InputTicketsFormatType) => (
      <PrintInputTickets
        id={inputTicket!.id}
        timeCreate={inputTicket!.timeCreate}
        employee={inputTicket!.employee}
        supplier={inputTicket!.supplier}
        totalPrice={inputTicket!.totalPrice}
        payStatus={inputTicket!.payStatus}
        status={inputTicket!.status}
        inputTicketDetails={inputTicket!.inputTicketDetails}
      />
    ),
  };
  // Hàm gọi API để cập nhật trạng thái phiếu nhập
  const callApiToUpdateInputTicket = async (
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
      let payStatus = null,
        status = null;
      if (value === InputTicketStatus.giveback || value === InputTicketStatus.confirm || value === InputTicketStatus.canceled) {
        status = value;
      } else if (value === PayStatus.pay || value === PayStatus.notPay) {
        payStatus = value;
      }

      // Gọi api xử lý
      const res = await HandleUpdateInputTicket({
        id: id,
        payStatus: payStatus!,
        status: status!,
      });
      if (res.status === 200) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: "Cập nhật thành công !",
          duration: 1.5,
        });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["input-tickets"], })
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
              : "Cập nhật thất bại !",
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

  // Các thành phần giữ giá trị cho việc hiển thị modal thứ 2
  // - Các biến
  const [titleSecondModal, setTitleSecondModal] = useState<string>("");
  const [openSecondModal, setOpenSecondModal] = useState<boolean>(false);
  const [widthSecondModal, setWidthSecondModal] = useState<string>("");
  const [classNameSecondModal, setClassNameSecondModal] = useState<string>("");
  const [childrenSecondModal, setChildrenSecondModal] = useState<ReactNode>();
  // - Các giá trị mặc định cho nhãn
  const defaultSecondLabels = {
    title: "Thông tin nguyên liệu",
    ingredientCreate:
      "Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Loại nguyên liệu - Định lượng & Đơn vị - Giá nhập)",
    ingredientDelete:
      "Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Số lượng - Giá nhập)",
    price: "Giá nhập",
    quantity: "Số lượng",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultSecondInputs = {
    title: "Thông tin nguyên liệu",
    ingredientCreate:
      "Chọn Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Loại nguyên liệu - Định lượng & Đơn vị - Giá nhập)",
    ingredientDelete:
      "Chọn Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Số lượng - Giá nhập)",
    price: "Nhập Giá nhập",
    quantity: "Nhập Số lượng",
  };
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
  const CreateInputTicketDetails = ({
    inputTicketDetails,
    setInputTicketDetails,
  }: InputTicketDetailsTableProps) => {
    //
    const [form] = Form.useForm();

    // Truy vấn dữ liệu nguyên liệu đang "hoạt động"
    const {
      data: ingredients,
    } = useQuery({
      queryKey: [
        'ingredients',
      ],
      queryFn: async () => {
        const res = await FindAllIngredient({ statusValue: [CommonStatus.active] });
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

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form secondary split-2"
          autoComplete="off"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form.secondary button[type='submit']"
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

              // Định dạng dữ liệu
              const newInputTicketDetail: InputTicketDetailsFormatType = {
                ingredient: JSON.parse(values!.ingredient) || undefined,
                price: values!.price || undefined,
                quantity: values!.quantity || undefined,
              };

              // Cập nhật danh sách nguyên liệu mới
              let newInputTicketDetails: InputTicketDetailsFormatType[] = [
                ...inputTicketDetails!,
              ];
              // - Kiểm tra nguyên liệu đã có tồn tại trong công thức hay chưa ?
              let isExists = false;
              for (let i = 0; i < inputTicketDetails!.length; i++) {
                if (
                  inputTicketDetails![i].ingredient.id ===
                  newInputTicketDetail.ingredient.id
                ) {
                  inputTicketDetails![i].price = newInputTicketDetail.price;
                  inputTicketDetails![i].quantity =
                    newInputTicketDetail.quantity;
                  isExists = true;
                }
              }
              if (!isExists) {
                newInputTicketDetails.push(newInputTicketDetail);
              }
              // - Sắp xếp theo mã nguyên liệu tăng dần
              newInputTicketDetails.sort(
                (a, b) =>
                  (a!.ingredient.id as number) - (b!.ingredient.id as number)
              );
              // - Cập nhật
              setInputTicketDetails!(newInputTicketDetails!);

              // Thành công thì thông báo
              setOpenSecondModal(false);
              openNotification({
                type: "success",
                message: "Thành công",
                description: "Thêm thành công !",
                duration: 1.5,
              });
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">
              {defaultSecondLabels["title"]}
            </p>
            <div className="modal__form-group">
              <Form.Item
                name="ingredient"
                label={defaultSecondLabels["ingredientCreate"]}
                htmlFor="create-ingredient"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Nguyên liệu không được để trống !")]}
              >
                <Select
                  mode={undefined}
                  showSearch={true}
                  allowClear={true}
                  id="create-ingredient"
                  placeholder={defaultSecondInputs["ingredientCreate"]}
                  options={ingredients?.map((ingredient) => ({
                    label:
                      "#" +
                      ingredient!.id +
                      " - " +
                      ingredient!.name +
                      " - " +
                      ingredient!.categoryIngredient!.name +
                      " (#" +
                      ingredient!.categoryIngredient!.id +
                      ")" +
                      " - " +
                      ingredient!.capacity +
                      " " +
                      ingredient!.unit +
                      " - " +
                      ingredient!.inputPrice,
                    value: JSON.stringify(ingredient!),
                  }))}
                  onChange={(value) => {
                    if (!value) {
                      form.setFieldsValue({ price: undefined });
                      return;
                    }
                    try {
                      const selectedIngredient = JSON.parse(value);
                      if (selectedIngredient && selectedIngredient.inputPrice) {
                        form.setFieldsValue({
                          price: selectedIngredient.inputPrice,
                        });
                      }
                    } catch (err) {
                      console.error("Parse ingredient failed:", err);
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                name="price"
                label={defaultSecondLabels["price"]}
                htmlFor="create-price"
                className="modal__form-group-item"
                rules={[ruleRequired("Giá nhập không được để trống !")]}
              >
                <InputNumber
                  min={1}
                  id="create-price"
                  placeholder={defaultSecondInputs["price"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="quantity"
                label={defaultSecondLabels["quantity"]}
                htmlFor="create-quantity"
                className="modal__form-group-item"
                rules={[ruleRequired("Số lượng không được để trống !")]}
              >
                <InputNumber
                  min={1}
                  id="create-quantity"
                  placeholder={defaultSecondInputs["quantity"]}
                />
              </Form.Item>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn secondary-btn">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const DeleteInputTicketDetails = ({
    inputTicketDetails,
    setInputTicketDetails,
  }: InputTicketDetailsTableProps) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form secondary split-2"
          autoComplete="off"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form.secondary button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn xoá ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Nguyên liệu cần xoá
              const ingredient = JSON.parse(form.getFieldValue("ingredient"));

              // Cập nhật danh sách nguyên liệu mới
              let newInputTicketDetails: InputTicketDetailsFormatType[] = [];
              for (let i = 0; i < inputTicketDetails!.length; i++) {
                if (
                  inputTicketDetails![i].ingredient.id !==
                  ingredient.ingredient.id
                ) {
                  newInputTicketDetails.push(inputTicketDetails![i]);
                }
              }
              setInputTicketDetails!(newInputTicketDetails);

              // Thành công thì thông báo
              setOpenSecondModal(false);
              openNotification({
                type: "success",
                message: "Thành công",
                description: "Xoá thành công !",
                duration: 1.5,
              });
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">
              {defaultSecondLabels["title"]}
            </p>
            <div className="modal__form-group">
              <Form.Item
                name="ingredient"
                label={defaultSecondLabels["ingredientDelete"]}
                htmlFor="delete-ingredient"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Nguyên liệu không được để trống !")]}
              >
                <Select
                  mode={undefined}
                  showSearch={true}
                  allowClear={true}
                  id="delete-ingredient"
                  placeholder={defaultSecondInputs["ingredientDelete"]}
                  options={inputTicketDetails?.map((inputTicketDetail) => ({
                    label:
                      "#" +
                      inputTicketDetail!.ingredient!.id +
                      " - " +
                      inputTicketDetail!.ingredient!.name +
                      " - " +
                      inputTicketDetail!.price +
                      " - " +
                      inputTicketDetail!.quantity,
                    value: JSON.stringify(inputTicketDetail!),
                  }))}
                  onChange={(value) => {
                    if (!value) {
                      form.setFieldsValue({
                        price: undefined,
                        quantity: undefined,
                      });
                      return;
                    }
                    try {
                      const inputTicketDetail = JSON.parse(value);
                      if (inputTicketDetail) {
                        form.setFieldsValue({
                          price: inputTicketDetail!.price,
                          quantity: inputTicketDetail!.quantity,
                        });
                      }
                    } catch (err) {
                      console.error("Parse ingredient failed:", err);
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                name="price"
                label={defaultSecondLabels["price"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="quantity"
                label={defaultSecondLabels["quantity"]}
                className="modal__form-group-item"
              >
                <InputNumber disabled={true} />
              </Form.Item>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn secondary-btn">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const AdminInputTicketDetailsModal = {
    create: ({
      inputTicketDetails,
      setInputTicketDetails,
    }: InputTicketDetailsTableProps) => (
      <CreateInputTicketDetails
        inputTicketDetails={inputTicketDetails}
        setInputTicketDetails={setInputTicketDetails}
      />
    ),
    delete: ({
      inputTicketDetails,
      setInputTicketDetails,
    }: InputTicketDetailsTableProps) => (
      <DeleteInputTicketDetails
        inputTicketDetails={inputTicketDetails}
        setInputTicketDetails={setInputTicketDetails}
      />
    ),
  };

  // Hàm cập nhật số liệu cho các thẻ
  const updateCards = () => {
    let totalPrice = 0,
      totalGiveBack = 0,
      totalConfirm = 0,
      totalCancel = 0,
      totalPending = 0;
    inputTickets?.forEach((inputTicket) => {
      totalPrice += inputTicket.totalPrice!;
      if (inputTicket.status! === InputTicketStatus.giveback) {
        totalGiveBack += 1;
      }
      if (inputTicket.status! === InputTicketStatus.confirm) {
        totalConfirm += 1;
      }
      if (inputTicket.status! === InputTicketStatus.canceled) {
        totalCancel += 1;
      }
      if (inputTicket.status! === InputTicketStatus.pending) {
        totalPending += 1;
      }
    });

    setTotalPriceCardValue(totalPrice);
    setGiveBackCardValue(totalGiveBack);
    setConfirmCardValue(totalConfirm);
    setCancelCardValue(totalCancel);
    setPendingCardValue(totalPending);
  };
  // Cập nhật mỗi khi danh sách phiếu nhập thay đổi
  useEffect(() => { updateCards(); }, [inputTickets])

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Quản lý món ăn - {objectName}</h2>
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
          <CustomDateRangePicker
            showTime={true}
            placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
            className="main__filter-select filter-time big"
            setDateRangeValue={setFilterTimeValue}
          />
          <CustomFindSelect
            mode="tags"
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
              (openModal && titleModal === titleModalCreate
                ? " active"
                : "")
            }
            onClick={() =>
              updatePropertiesModal(
                titleModalCreate,
                true,
                "89%",
                "create input-tickets",
                AdminInputTicketsModal.create()
              )
            }
          >
            <FontAwesomeIcon icon={faPlus} className="icon" />
            &nbsp;Thêm
          </button>
        </div>
        <div className="main__cards">
          <CustomCardStatic
            title={"Tổng thanh toán (VNĐ)"}
            value={totalPriceCardValue}
            prefix={<DollarOutlined />}
            separator="."
            valueStyle={{ color: "#d2a016" }}
          />
          <CustomCardStatic
            title={InputTicketStatus.giveback}
            value={giveBackCardValue}
            prefix={<IssuesCloseOutlined />}
            valueStyle={{ color: "#7b13cf" }}
          />
          <CustomCardStatic
            title={InputTicketStatus.confirm}
            value={confirmCardValue}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#3f8600" }}
          />
          <CustomCardStatic
            title={InputTicketStatus.canceled}
            value={cancelCardValue}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: "#cf1322" }}
          />
          <CustomCardStatic
            title={InputTicketStatus.pending}
            value={pendingCardValue}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#676767" }}
          />
        </div>
        <div className="main__table">
          <CustomTableActions
            columns={columns}
            rowKey={(record) => record!.id as number}
            data={currentItems}
            loading={isLoading}
            pagination={paginationProps}
            className="table-actions input-tickets"
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
          key="second-modal"
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

export default AdminInputTicketsPage;
