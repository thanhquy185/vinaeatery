import { useEffect, useState, type ReactNode } from "react";
import { Form, Input, Select, Space, type SelectProps } from "antd";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomModal from "../../../components/admin/modal";
import { ruleEmail, rulePhone, ruleRequired } from "../../../common/rules";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";
import type { CustomersFormatType, FloorsType, OrderSheetsFormatType, OrderTablesFormatType, UseTablesFormatType } from "../../../common/types";
import { FindAllCustomer, FindAllFloor, FindAllOrderTable, FindAllUseTableTimeEndIsNull, HandleUpdateUseTable } from "../../../services/api";
import CustomFindInput from "../../../components/admin/find-input";
import { CommonStatus, UseTableStatus } from "../../../common/values";
import { showCreateValidAddress } from "../../../utils/showCreateValidAddress";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";

type HandleUseTableProps = {
  id?: number;
  tableId?: number;
  employeeId?: number;
  customerId?: number;
  orderId?: number;
  orderTableId?: number;
  orderTable?: OrderTablesFormatType;
  orderSheets?: OrderSheetsFormatType[];
}

// Admin Status Tables Page
const AdminUseTablesPage = () => {
  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [floors, setFloors] = useState<FloorsType[]>([]);
  const [useTables, setUseTables] = useState<UseTablesFormatType[]>([]);

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "Bàn", value: "table" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Tầng
  const floorOptions: SelectProps["options"] = floors.map((floor) => ({ label: floor.name, value: floor.id }));
  const [filterFloorValue, setFilterFloorValue] = useState<string[] | null>([]);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: UseTableStatus.occupied, value: UseTableStatus.occupied },
    { label: UseTableStatus.reserved, value: UseTableStatus.reserved },
    { label: UseTableStatus.empty, value: UseTableStatus.empty },
    { label: UseTableStatus.repair, value: UseTableStatus.repair },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    []
  );

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [SecondModal, setSecondModal] = useState<ReactNode>();
  // - Hàm cập nhật
  const updatePropertiesModal = (
    titleModal: string,
    openModal: boolean,
    widthModal: string,
    classNameModal: string,
    SecondModal: ReactNode
  ) => {
    setTitleModal(titleModal);
    setOpenModal(openModal);
    setWidthModal(widthModal);
    setClassNameModal(classNameModal);
    setSecondModal(SecondModal);
  };
  // - Các modal tương ứng cho từng chức năng
  const OccupiedUseTables = ({
    id,
    timeStart,
    timeEnd,
    table,
    employee,
    customer,
    order,
    orderTable,
    status,
    orderSheets,
  }: UseTablesFormatType) => {
    return (
      <>
        <div className="info">
          <b>Bàn ăn:</b> {table!.name} - {table!.categoryTable!.name} - {table!.floor!.name} - Số chỗ: {table!.seats}
        </div>
        <div className="info">
          <b>Thời gian nhận bàn:</b> {timeStart!}
        </div>
        <div className="info">
          <b>Khách hàng:</b> {customer!.fullname} - {customer!.phone} - {customer!.email! ? customer!.email : "Chưa cung cấp email"} - {customer!.customerCard!.name}
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="status red">{status!}</span>
        </div>
        <div className="info">
          <b>Chi tiết phiếu gọi món:</b>
          <table>
            <colgroup>
              <col width="15%" />
              <col width="20%" />
              <col width="20%" />
              <col width="30%" />
              <col width="15%" />
            </colgroup>
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Thời gian gọi món</th>
                <th>Thời gian phục vụ</th>
                <th>Tổng tiền món ăn</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orderSheets?.map((orderSheet) => (
                <tr>
                  <td>{orderSheet!.id!}</td>
                  <td>{orderSheet!.timeCreate!}</td>
                  <td>{orderSheet!.timeService!}</td>
                  <td>{vietnamMoneyFormat(orderSheet!.totalPrice!)}</td>
                  <td>{orderSheet!.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div className="note">*Lưu ý: Khi thanh toán, các phiếu gọi món chưa được phục vụ sẽ bị huỷ !</div> */}
        <div className="modal__buttons mg-top">
          <button
            type="button"
            className="modal__button secondary btn"
            onClick={(e) =>
              callApiToUpdateUseTable({
                id: id!,
                orderSheets: orderSheets!,
                button: e.target as HTMLElement,
                value: UseTableStatus.empty
              })
            }
          >
            Thanh toán tiền bàn
          </button>
          {orderSheets!.length! == 0 &&
            (
              <button
                type="button"
                className="modal__button secondary btn green-secondary"
                onClick={(e) =>
                  callApiToUpdateUseTable({
                    id: id!,
                    button: e.target as HTMLElement,
                    value: UseTableStatus.empty
                  })
                }
              >
                Khách trả bàn
              </button>
            )
          }
        </div>
      </>
    );
  };
  const ReservedUseTables = ({
    id,
    timeStart,
    timeEnd,
    table,
    employee,
    customer,
    order,
    orderTable,
    status,
    orderSheets,
  }: UseTablesFormatType) => {
    return (
      <>
        <div className="info">
          <b>Bàn ăn:</b> {table!.name} - {table!.categoryTable!.name} - {table!.floor!.name} - Số chỗ: {table!.seats}
        </div>
        <div className="info">
          <b>Thời gian đặt bàn:</b> {orderTable!.timeOrder}
        </div>
        <div className="info">
          <b>Thời gian đến ăn:</b> {orderTable!.timeArrive! ? orderTable!.timeArrive : "Chưa cung cấp thời gian đến ăn"}
        </div>
        <div className="info">
          <b>Thông tin người đặt:</b> {orderTable!.fullname!} - {orderTable!.phone!} - {orderTable!.email! ? orderTable!.email : "Chưa cung cấp email"}
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="status yellow">{status!}</span>
        </div>
        <div className="modal__buttons mg-top">
          <button
            type="button"
            className="modal__button secondary btn red-secondary"
            onClick={() =>
              updatePropertiesSecondModal(
                "Khách hàng nhận bàn",
                true,
                "60%",
                "secondary red",
                AdminHandleUseTablesModal.HandleOccupiedFromReversed(id!, orderTable!)
              )
            }
          >
            Khách nhận bàn
          </button>
          <button
            type="button"
            className="modal__button secondary btn green-secondary"
            onClick={(e) =>
              callApiToUpdateUseTable({
                id: id!,
                button: e.target as HTMLElement,
                value: UseTableStatus.empty
              })
            }
          >
            {UseTableStatus.empty}
          </button>
        </div>
      </>
    );
  };
  const EmptyUseTables = ({
    id,
    timeStart,
    timeEnd,
    table,
    employee,
    customer,
    order,
    orderTable,
    status,
    orderSheets,
  }: UseTablesFormatType) => {
    return (
      <>
        <div className="info">
          <b>Bàn ăn:</b> {table!.name} - {table!.categoryTable!.name} - {table!.floor!.name} - Số chỗ: {table!.seats}
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="status green">{status!}</span>
        </div>
        <div className="modal__buttons mg-top">
          <button
            type="button"
            className="modal__button secondary btn red-secondary"
            onClick={() =>
              updatePropertiesSecondModal(
                "Bàn đang có khách",
                true,
                "60%",
                "secondary red",
                AdminHandleUseTablesModal.handleOccupied(id!)
              )
            }
          >
            {UseTableStatus.occupied}
          </button>
          <button
            type="button"
            className="modal__button secondary btn yellow-secondary"
            onClick={() =>
              updatePropertiesSecondModal(
                "Bàn đã được đặt",
                true,
                "60%",
                "secondary yellow",
                AdminHandleUseTablesModal.handleReserved(id!)
              )
            }
          >
            {UseTableStatus.reserved}
          </button>
          <button
            type="button"
            className="modal__button secondary btn gray-secondary"
            onClick={(e) =>
              callApiToUpdateUseTable({
                id: id!,
                button: e.target as HTMLElement,
                value: UseTableStatus.repair
              })
            }
          >
            {UseTableStatus.repair}
          </button>
        </div>
      </>
    );
  };
  const RepairUseTables = ({
    id,
    timeStart,
    timeEnd,
    table,
    employee,
    customer,
    order,
    orderTable,
    status,
    orderSheets,
  }: UseTablesFormatType) => {
    return (
      <>
        <div className="info">
          <b>Bàn ăn:</b> {table!.name} - {table!.categoryTable!.name} - {table!.floor!.name} - Số chỗ: {table!.seats}
        </div>
        <div className="info">
          <b>Trạng thái:</b> <span className="status gray">{status!}</span>
        </div>
        <div className="modal__buttons mg-top">
          <button
            type="button"
            className="modal__button secondary btn green-secondary"
            onClick={(e) =>
              callApiToUpdateUseTable({
                id: id!,
                button: e.target as HTMLElement,
                value: UseTableStatus.empty
              })
            }
          >
            {UseTableStatus.empty}
          </button>
        </div>
      </>
    );
  };
  const AdminUseTablesModal = {
    occupied: (useTable: UseTablesFormatType) => (
      <OccupiedUseTables
        id={useTable!.id!}
        timeStart={useTable!.timeStart!}
        timeEnd={useTable!.timeEnd!}
        table={useTable!.table!}
        employee={useTable!.employee!}
        customer={useTable!.customer!}
        order={useTable!.order!}
        orderTable={useTable!.orderTable!}
        status={useTable!.status!}
        orderSheets={useTable!.orderSheets!}
      />)
    ,
    reserved: (useTable: UseTablesFormatType) => (
      <ReservedUseTables
        id={useTable!.id!}
        timeStart={useTable!.timeStart!}
        timeEnd={useTable!.timeEnd!}
        table={useTable!.table!}
        employee={useTable!.employee!}
        customer={useTable!.customer!}
        order={useTable!.order!}
        orderTable={useTable!.orderTable!}
        status={useTable!.status!}
        orderSheets={useTable!.orderSheets!}
      />
    ),
    empty: (useTable: UseTablesFormatType) => (
      <EmptyUseTables
        id={useTable!.id!}
        timeStart={useTable!.timeStart!}
        timeEnd={useTable!.timeEnd!}
        table={useTable!.table!}
        employee={useTable!.employee!}
        customer={useTable!.customer!}
        order={useTable!.order!}
        orderTable={useTable!.orderTable!}
        status={useTable!.status!}
        orderSheets={useTable!.orderSheets!}
      />
    ),
    repair: (useTable: UseTablesFormatType) => (
      <RepairUseTables
        id={useTable!.id!}
        timeStart={useTable!.timeStart!}
        timeEnd={useTable!.timeEnd!}
        table={useTable!.table!}
        employee={useTable!.employee!}
        customer={useTable!.customer!}
        order={useTable!.order!}
        orderTable={useTable!.orderTable!}
        status={useTable!.status!}
        orderSheets={useTable!.orderSheets!}
      />
    ),
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
  const HandleOccupied = ({ id }: HandleUseTableProps) => {
    const [form] = Form.useForm();

    // Gọi api để truy vấn danh sách khách hàng "hoạt động"
    const [customers, setCustomers] = useState<CustomersFormatType[]>([]);
    const getAllCustomer = async () => {
      const res = await FindAllCustomer({
        statusValue: ["Hoạt động"],
      });
      if (res!.status === 200) {
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
    useEffect(() => {
      getAllCustomer();
    }, []);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          className="modal__form split-2"
          onFinish={() => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            callApiToUpdateUseTable({
              id: id!,
              customerId: form.getFieldValue("customer"),
              button: submitButton as HTMLElement,
              value: UseTableStatus.occupied
            })
          }
          }
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="customer"
                label="Khách hàng (Mã khách hàng - Tên khách hàng - Số điện thoại - Email - Thẻ khách hàng)"
                htmlFor="customer"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Khách hàng không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="customer"
                  placeholder="Chọn Khách hàng (Mã khách hàng - Tên khách hàng - Số điện thoại - Email - Thẻ khách hàng)"
                  options={customers?.map((customer) => ({
                    label: "#" + customer!.id + " - " + customer!.fullname + " - " + customer!.phone + " - " + customer!.email + " - " + customer!.customerCard!.name,
                    value: customer!.id,
                  }))}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button
              type="submit"
              className="modal__button btn red-secondary"
            >
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const HandleOccupiedFromReversed = ({ id, orderTable }: HandleUseTableProps) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={
            {
              fullname: orderTable!.fullname,
              phone: orderTable!.phone,
              email: orderTable!.email,
              address: orderTable!.address,
            }
          }
          autoComplete="off"
          className="modal__form split-2"
          onFinish={() => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            callApiToUpdateUseTable({
              id: id!,
              orderTableNewFullname: form.getFieldValue("fullname"),
              orderTableNewPhone: form.getFieldValue("phone"),
              orderTableNewEmail: form.getFieldValue("email"),
              orderTableNewAddress: form.getFieldValue("address"),
              button: submitButton as HTMLElement,
              value: UseTableStatus.occupied
            })
          }
          }
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="fullname"
                label="Tên khách hàng"
                htmlFor="fullname"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên khách hàng không được để trống !")]}
              >
                <Input
                  id="fullname"
                  placeholder="Nhập Tên khách hàng"
                />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                className="modal__form-group-item multiple-2"
              >
                <Space.Compact>
                  <Form.Item name="address" noStyle>
                    <Input
                      id="address"
                      placeholder="Nhập địa chỉ"
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
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  htmlFor="phone"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Số điện thoại không được để trống !"), rulePhone()]}
                >
                  <Input
                    id="phone"
                    placeholder="Nhập Số điện thoại"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  htmlFor="email"
                  className="modal__form-group-item"
                  rules={[ruleEmail()]}
                >
                  <Input
                    id="email"
                    placeholder="Nhập Email"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="modal__buttons">
            <button
              type="submit"
              className="modal__button btn red-secondary"
            >
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const HandleReserved = ({ id }: HandleUseTableProps) => {
    const [form] = Form.useForm();

    // Gọi api để truy vấn danh sách đơn đặt bàn "hoạt động"
    const [orderTables, setOrderTables] = useState<OrderTablesFormatType[]>([]);
    const getAllOrderTable = async () => {
      const res = await FindAllOrderTable({
        statusValue: ["Hoạt động"],
      });
      if (res!.status === 200) {
        setOrderTables(res!.data);
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });
      }
    };
    useEffect(() => {
      getAllOrderTable();
    }, []);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          className="modal__form split-2"
          onFinish={() => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            callApiToUpdateUseTable({
              id: id!,
              orderTableId: form.getFieldValue("orderTable"),
              button: submitButton as HTMLElement,
              value: UseTableStatus.reserved
            })
          }
          }
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="orderTable"
                label="Đơn đặt bàn (Mã Đơn đặt bàn - Thời gian đặt bàn - Thời gian nhận bàn - Tên khách hàng - Số điện thoại)"
                htmlFor="orderTable"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Đơn đặt bàn không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="orderTable"
                  placeholder="Chọn Đơn đặt bàn (Mã Đơn đặt bàn - Thời gian đặt bàn - Tên khách hàng - Số điện thoại)"
                  options={orderTables?.map((orderTable) => ({
                    label: "#" + orderTable!.id + " - " + orderTable!.timeOrder + " - " + orderTable!.fullname + " - " + orderTable!.phone,
                    value: orderTable.id,
                  }))}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button
              type="submit"
              className="modal__button btn yellow-secondary"
            >
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const AdminHandleUseTablesModal = {
    handleOccupied: (id?: number) => <HandleOccupied id={id} />,
    HandleOccupiedFromReversed: (id?: number, orderTable?: OrderTablesFormatType) => <HandleOccupiedFromReversed id={id} orderTable={orderTable} />,
    handleReserved: (id?: number) => <HandleReserved id={id} />,
  };

  // Hàm gọi API để cập nhật trạng thái sử dụng bàn ăn
  const callApiToUpdateUseTable = async (
    {
      id,
      customerId,
      orderTableId,
      orderTableNewFullname,
      orderTableNewPhone,
      orderTableNewEmail,
      orderTableNewAddress,
      orderSheets,
      button,
      value
    }: {
      id: number,
      customerId?: number;
      orderTableId?: number;
      orderTableNewFullname?: string;
      orderTableNewPhone?: string;
      orderTableNewEmail?: string;
      orderTableNewAddress?: string;
      orderSheets?: OrderSheetsFormatType[];
      button: HTMLElement,
      value: string
    }
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
      if (value === UseTableStatus.occupied || value === UseTableStatus.reserved || value === UseTableStatus.empty || value === UseTableStatus.repair) {
        status = value;
      }

      // Gọi api xử lý
      const res = await HandleUpdateUseTable({
        id: id!,
        timeEnd: new Date().toISOString(),
        employeeId: 2,
        customerId: value === UseTableStatus.occupied && customerId! ? customerId : undefined,
        orderTableId: value === UseTableStatus.reserved && orderTableId! ? orderTableId : undefined,
        orderTableNewFullname: value === UseTableStatus.occupied && orderTableNewFullname! ? orderTableNewFullname : undefined,
        orderTableNewPhone: value === UseTableStatus.occupied && orderTableNewPhone! ? orderTableNewPhone : undefined,
        orderTableNewEmail: value === UseTableStatus.occupied && orderTableNewEmail! ? orderTableNewEmail : undefined,
        orderTableNewAddress: value === UseTableStatus.occupied && orderTableNewAddress! ? orderTableNewAddress : undefined,
        status: status!,
        orderSheets: value === UseTableStatus.empty && orderSheets && orderSheets.length > 0 ? orderSheets! : undefined,
      });
      if (res.status === 200) {
        openNotification({
          type: "success",
          message: "Thành công",
          description: "Cập nhật thành công !",
          duration: 1.5,
        });
        setTimeout(() => {
          getAllUseTable();
          setOpenModal(false);
          setOpenSecondModal(false);
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
  // Hàm cập nhật danh sách các sử dụng bàn ăn (gọi API)
  const getAllFloor = async () => {
    const res = await FindAllFloor({
      statusValue: ["Hoạt động"],
    });
    if (res!.status === 200) {
      setFloors(res!.data);
    } else {
      openNotification({
        type: "error",
        message: "Truy vấn dữ liệu thất bại",
        description: "Lỗi phát sinh khi truy vấn dữ liệu",
        duration: 2,
      });
    }
  };
  const getAllUseTable = async () => {
    const res = await FindAllUseTableTimeEndIsNull({
      findType: filterFindType!,
      findValue: filterFindValue!,
      floorValue: filterFloorValue!,
      statusValue: filterStatusValue!,
    });
    if (res!.status === 200) {
      setUseTables(res!.data);
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
    getAllFloor();
    getAllUseTable();
  }, []);
  useEffect(() => {
    getAllUseTable();
  }, [filterFindType, filterFindValue, filterFloorValue, filterStatusValue]);

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Vận hành quán ăn - Sử dụng bàn ăn</h2>
        </div>
        <div className="main__filter use-tables">
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
            placeholder="Chọn Tầng"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-floor"
            options={floorOptions}
            setFilterSelectValue={setFilterFloorValue}
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
        </div>
        <div className="main__use-tables">
          {useTables.map((useTable) => {
            if (useTable!.table!.status !== CommonStatus.active) return null;

            return (
              <div
                className={
                  "use-table " +
                  (useTable!.status === UseTableStatus.occupied
                    ? "red"
                    : useTable!.status === UseTableStatus.reserved
                      ? "yellow"
                      : useTable!.status === UseTableStatus.empty
                        ? "green"
                        : "gray")
                }
                onClick={() =>
                  updatePropertiesModal(
                    "Thông tin bàn ăn",
                    true,
                    "80%",
                    "use-tables",
                    useTable!.status === UseTableStatus.occupied
                      ? AdminUseTablesModal.occupied(useTable)
                      : useTable!.status === UseTableStatus.reserved
                        ? AdminUseTablesModal.reserved(useTable)
                        : useTable!.status === UseTableStatus.empty
                          ? AdminUseTablesModal.empty(useTable)
                          : AdminUseTablesModal.repair(useTable)
                  )
                }
              >
                <div className="title">{useTable!.table!.name}</div>
                <div className="info">
                  <b>Tầng:</b> {useTable!.table!.floor!.name}
                </div>
                <div className="info">
                  <b>Số chỗ ngồi:</b> {useTable!.table!.seats}
                </div>
                <div className="info">
                  <b>Trạng thái:</b>{" "}
                  <span className="status">{useTable!.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main >
      {openModal && (
        <CustomModal
          title={titleModal}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
          width={widthModal}
          className={classNameModal}
          children={SecondModal}
        />
      )
      }
      {
        openSecondModal && (
          <CustomModal
            key="second-modal"
            title={titleSecondModal}
            openModal={openSecondModal}
            setOpenModal={() => setOpenSecondModal(false)}
            width={widthSecondModal}
            className={classNameSecondModal}
            children={childrenSecondModal}
          />
        )
      }
    </>
  );
};

export default AdminUseTablesPage;
