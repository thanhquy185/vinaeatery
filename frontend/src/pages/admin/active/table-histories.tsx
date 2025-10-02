import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faFileArrowDown,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { Button, DatePicker, Select, Tag, type SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UseTablesFormatType } from "../../../common/types";
import {
  CommonStatus,
  OrderSheetStatus,
  ReactQueryGetData,
  TitleModalCommon,
  UseTableStatus,
} from "../../../common/values";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomModal from "../../../components/admin/modal";
import {
  FindAllFloor,
  FindAllTable,
  FindAllUseTable,
} from "../../../services/api";
import {
  getActionNameEn,
  getActionNameVn,
} from "../../../services/default-actions";
import { getActionsString } from "../../../services/employee-login";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import { openNotification } from "../../../utils/showNotification";
import { handlePrintTicket } from "../../../utils/printTicket";
import dayjs from "dayjs";

const { Option } = Select;

// Các giá trị chung
// - Tên đối tượng
const objectName = "Lịch sử bàn ăn";
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());

// Admin Status Tables Page
const AdminTableHistoriesPage = ({ functionId }: { functionId: number }) => {
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId });

  // Các biến giữ dữ liệu về tầng và bàn ăn
  const { data: floors } = useQuery({
    queryKey: ["floors"],
    queryFn: async () => {
      const res = await FindAllFloor({ statusValue: [CommonStatus.active] });
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
  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await FindAllTable({ statusValue: [CommonStatus.active] });
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
  const findOptions = [{ label: "Bàn", value: "table" }];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Tầng
  const floorOptions: SelectProps["options"] = floors?.map((floor) => ({
    label: floor.name,
    value: floor.id,
  }));
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

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: useTables,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "use-tables",
      filterFindType!,
      filterFindValue!,
      filterFloorValue!,
      filterStatusValue!,
    ],
    queryFn: async () => {
      const res = await FindAllUseTable({
        findType: filterFindType!,
        findValue: filterFindValue!,
        floorValue: filterFloorValue!,
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
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<UseTablesFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "timeStart",
      key: "timeStart",
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
        const date = dayjs(record.timeStart);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) =>
        dayjs(a.timeStart).valueOf() - dayjs(b.timeStart).valueOf(),
      render: (val) => val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : "",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "timeEnd",
      key: "timeEnd",
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
        const date = dayjs(record.timeEnd);

        return (
          date.isSame(dayjs(start)) ||
          date.isSame(dayjs(end)) ||
          (date.isAfter(dayjs(start)) && date.isBefore(dayjs(end)))
        );
      },
      sorter: (a, b) => dayjs(a.timeEnd).valueOf() - dayjs(b.timeEnd).valueOf(),
      render: (val) => val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : "",
    },
    {
      title: "Bàn ăn",
      key: "table",
      width: "36%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 500, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Bàn ăn"
            style={{ width: "100%" }}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          >
            {tables?.map((table) => (
              <Option key={table.id} value={table.id}>
                #{table.id} - {table.name} - {table?.floor?.name} -{" "}
                {table?.categoryTable?.name} - Số chỗ: {table?.seats}
              </Option>
            ))}
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
      onFilter: (value, record) => record.table?.id === value,
      sorter: (a, b) => a.table?.id! - b.table?.id!,
      render: (record) =>
        `#${record.table?.id} - ${record.table?.name} - ${record.table?.floor?.name} - ${record.table?.categoryTable?.name} - Số chỗ: ${record.table?.seats}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: string) => (
        <Tag
          color={
            status === UseTableStatus.occupied
              ? "red"
              : status === UseTableStatus.reserved
              ? "yellow"
              : status === UseTableStatus.empty
              ? "green"
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
      render: (text: any, record: UseTablesFormatType, index: number) => (
        <>
          {validActions!.includes(getActionNameVn(0)) && (
            <button
              className={"action " + getActionNameEn(0)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalDetail,
                  true,
                  "89%",
                  "table-histories",
                  AdminTableHistoriesModal.handle(record)
                )
              }
            >
              <FontAwesomeIcon icon={faBars} />
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
  // - Các modal tương ứng cho từng chức năng
  const HandleTableHistories = ({
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
        <div id="content-print">
          <div className="info">
            <b>Mã lịch sử bàn ăn:</b> #{id}
          </div>
          <div className="info">
            <b>Thời gian bắt đầu:</b> {timeStart}
          </div>
          <div className="info">
            <b>Thời gian kết thúc:</b> {timeEnd}
          </div>
          <div className="info">
            <b>Bàn ăn:</b> {table!.name} - {table!.categoryTable!.name} -{" "}
            {table!.floor!.name} - Số chỗ: {table!.seats} - {table!.status}
          </div>
          {orderTable && (
            <div className="info">
              <b>Đơn đặt bàn:</b> #{orderTable!.id} - {orderTable!.timeOrder} -{" "}
              {orderTable!.fullname} - {orderTable!.phone}
            </div>
          )}
          {status === UseTableStatus.occupied && orderSheets && (
            <div className="info">
              <b>Khách hàng:</b> {customer!.fullname} - {customer!.phone} -{" "}
              {customer!.email} - {customer!.address}
            </div>
          )}
          <div className="info">
            <b>Trạng thái:</b>{" "}
            <span
              className={
                "status " +
                (status === UseTableStatus.occupied
                  ? "red"
                  : status === UseTableStatus.reserved
                  ? "yellow"
                  : status === UseTableStatus.empty
                  ? "green"
                  : "gray")
              }
            >
              {status!}
            </span>
          </div>
          {status === UseTableStatus.occupied && orderSheets && (
            <div className="info">
              <b>Danh sách phiếu gọi món:</b>
              {orderSheets?.map((orderSheet) => (
                <>
                  <div className="sub-info">
                    <p>
                      <b>- Mã phiếu gọi:</b> #{orderSheet!.id}
                    </p>
                    <p>
                      <b>- Thời gian tạo phiếu:</b> {orderSheet!.timeCreate}
                    </p>
                    <p>
                      <b>- Thời gian phục vụ:</b> {orderSheet!.timeService}
                    </p>
                    <p>
                      <b>- Tổng tiền món ăn:</b>{" "}
                      {vietnamMoneyFormat(orderSheet!.totalPrice!)}
                    </p>
                    <p>
                      <b>- Trạng thái:</b>{" "}
                      <span
                        className={
                          "status " +
                          (orderSheet!.status === OrderSheetStatus.serviced
                            ? "purple"
                            : orderSheet!.status === OrderSheetStatus.confirm
                            ? "green"
                            : orderSheet!.status === OrderSheetStatus.canceled
                            ? "red"
                            : "gray")
                        }
                      >
                        {orderSheet!.status}
                      </span>
                    </p>
                    <table>
                      <colgroup>
                        <col width="12%" />
                        <col width="36%" />
                        <col width="12%" />
                        <col width="20%" />
                        <col width="20%" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Mã món ăn</th>
                          <th>Tên món ăn</th>
                          <th>Đơn vị</th>
                          <th>Giá bán</th>
                          <th>Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderSheet!.orderSheetDetails?.map(
                          (orderSheetDetail) => (
                            <tr>
                              <td>{orderSheetDetail!.food!.id}</td>
                              <td className="left">
                                {orderSheetDetail!.food!.name}
                              </td>
                              <td>{orderSheetDetail!.food!.unit}</td>
                              <td>
                                {vietnamMoneyFormat(orderSheetDetail!.price!)}
                              </td>
                              <td>{orderSheetDetail!.quantity}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
        {/* <button
                    id="print-ticket-button"
                    className="ticket__print-btn"
                    onClick={() => {
                        handlePrintTicket({
                            contentPrint: "content-print",
                            // dateTime: dateTime,
                            // title: "PHDONHANG",
                            id: id,
                        });
                    }}
                >
                    <FontAwesomeIcon icon={faFileArrowDown} /> &nbsp;&nbsp;Tải xuống phiếu
                </button> */}
      </>
    );
  };
  const AdminTableHistoriesModal = {
    handle: (useTable: UseTablesFormatType) => (
      <HandleTableHistories
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

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">{objectName}</h2>
        </div>
        <div className="main__filter table-histories">
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
        <div className="main__table">
          <CustomTableActions<UseTablesFormatType>
            columns={columns}
            data={useTables || []}
            rowKey={(record) => String(record?.id)}
            loading={isLoading}
            defaultPageSize={10}
            className="table-actions use-tables"
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

export default AdminTableHistoriesPage;
