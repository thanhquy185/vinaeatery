import { useMemo, useState, type FC } from "react";
import { Button, DatePicker, Tag } from "antd";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye, PenBox } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faPenToSquare,
// } from "@fortawesome/free-solid-svg-icons";
import type { ManagerPageProps } from "../../../common/props";
import type { OrderTableType } from "../../../common/types";
import {
  ModalTitleValue,
  ModalWidthValue,
  OrderStatus,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllOrderTable } from "../../../requests/order-tables";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { getFilterSelectValueToShow } from "../../../utils/other-events";
import dayjs from "dayjs";
import ManagerDetailOrderTable from "../../../components/admin-manager/modal/order-table/manager-detail-order-table";
import ManagerCreateOrderTable from "../../../components/admin-manager/modal/order-table/manager-create-order-table";
import ManagerUpdateOrderTable from "../../../components/admin-manager/modal/order-table/manager-update-order-table";

// Manager Order Tables Page
const ManagerOrderTablesPage: FC<ManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: orderTables,
    isLoading,
    isError,
    error,
  } = useEntityQuery<OrderTableType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllOrderTable,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<OrderTableType> = [
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
      width: "17%",
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
                      selectedKeys[0] as string,
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
                  : [],
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
      title: "Thời gian nhận bàn",
      dataIndex: "arriveAt",
      key: "arriveAt",
      width: "17%",
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
                      selectedKeys[0] as string,
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
                  : [],
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
      width: "8%",
      className: "buttons",
      render: (text: any, record: OrderTableType, index: number) => (
        <>
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.detail,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.detail)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.detail(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: ManagerOrderTableModals.detail(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faEye} /> */}
              <Eye />
            </button>
          )}
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.update,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.update)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.update(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: ManagerOrderTableModals.update(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
              <PenBox />
            </button>
          )}
        </>
      ),
    },
  ];

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "fullname" },
    { label: "SĐT", value: "phone" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  /// - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: OrderStatus.confirm, value: OrderStatus.confirm },
    { label: OrderStatus.canceled, value: OrderStatus.canceled },
    { label: OrderStatus.pending, value: OrderStatus.pending },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );
  // - Lọc dữ liệu
  const filteredOrderTables = useMemo(() => {
    if (!orderTables) return [];

    return orderTables.filter((orderTable) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(orderTable.id).includes(value);
        }

        if (filterFindType === "fullname") {
          matchFind = orderTable.customerFullname
            ?.toLowerCase()
            .includes(value)!;
        }

        if (filterFindType === "phone") {
          matchFind = orderTable.customerPhone?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(orderTable.status!);
      }

      return matchFind && matchStatus;
    });
  }, [orderTables, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin người đặt bàn",
    id: "Mã đơn đặt bàn",
    createAt: "Thời gian đặt bàn",
    arriveAt: "Thời gian nhận bàn",
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
    arriveAt: "Thời gian nhận bàn",
    employee: "",
    customerFullname: "Nhập Họ và tên",
    customerPhone: "Nhập Số điện thoại",
    customerEmail: "Nhập Email",
    customerNote: "Nhập Ghi chú",
    guests: "Nhập Số lượng khách",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerOrderTableModals = {
    detail: (orderTable: OrderTableType) => (
      <ManagerDetailOrderTable
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={orderTable}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateOrderTable
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{ infoLogin: infoLogin }}
        closeModal={() => closeModal()}
      />
    ),
    update: (orderTable: OrderTableType) => (
      <ManagerUpdateOrderTable
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={orderTable}
        dataForCrud={{ infoLogin: infoLogin }}
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
          isShowFilterCreate={hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.create,
          })}
          onClickFilterCreate={() =>
            openModal({
              title: ModalTitleValue.create(nameVN.toLowerCase()),
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerOrderTableModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredOrderTables || []}
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

export default ManagerOrderTablesPage;
