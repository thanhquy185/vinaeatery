import { useMemo, useState, type FC } from "react";
import { Eye, PenBox } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faPenToSquare,
// } from "@fortawesome/free-solid-svg-icons";
import { Button, DatePicker, Select, Tag, type SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ManagerPageProps } from "../../../common/props";
import type {
  CategoryPermissionTicketType,
  EmployeeType,
  PermissionTicketType,
} from "../../../common/types";
import {
  CommonStatus,
  EmployeeStatus,
  ModalTitleValue,
  ModalWidthValue,
  PermissionTicketStatus,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailPermissionTicket from "../../../components/admin-manager/modal/permission-ticket/manager-detail-permission-ticket";
import ManagerCreatePermissionTicket from "../../../components/admin-manager/modal/permission-ticket/manager-create-permission-ticket";
import ManagerUpdatePermissionTicket from "../../../components/admin-manager/modal/permission-ticket/manager-update-permission-ticket";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllEmployee } from "../../../requests/employees";
import { FindAllCategoryPermissionTicket } from "../../../requests/category-permission-tickets";
import { FindAllPermissionTicket } from "../../../requests/permission-tickets";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { getFilterSelectValueToShow } from "../../../utils/other-events";
import dayjs from "dayjs";

// Manager Permission Tickets Page
const ManagerPermissionTicketsPage: FC<ManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Có là chủ nhà hàng đăng nhập
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các biến giữ dữ liệu
  // - Loại đơn xin phép
  const { data: categoryPermissionTickets } = useEntityQuery<
    CategoryPermissionTicketType[]
  >({
    keys: [
      "category-permission-tickets",
      restaurantIdForCrud,
      CommonStatus.active,
    ],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllCategoryPermissionTicket,
  });
  // - Nhân viên
  const { data: employees } = useEntityQuery<EmployeeType[]>({
    keys: ["employees", restaurantIdForCrud, EmployeeStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [EmployeeStatus.active],
    },
    api: FindAllEmployee,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: permissionTickets,
    isLoading,
    isError,
    error,
  } = useEntityQuery<PermissionTicketType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllPermissionTicket,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<PermissionTicketType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Thời gian tạo đơn",
      dataIndex: "createAt",
      key: "createAt",
      width: "16%",
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
      title: "Nhân viên xin phép",
      key: "employeeMain",
      width: "24%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 600, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Nhân viên"
            style={{ width: "100%" }}
            options={employees?.map((employee) => ({
              label: `#${employee?.id} - ${employee?.fullname} - ${employee?.phone} - ${employee?.email}`,
              value: employee?.id,
            }))}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          ></Select>
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
      onFilter: (value, record) => record.employeeMain?.id === value,
      sorter: (a, b) => a.employeeMain?.id! - b.employeeMain?.id!,
      render: (record) =>
        `#${record.employeeMain?.id} - ${record.employeeMain?.fullname} - ${record.employeeMain?.phone} - ${record.employeeMain?.email}`,
    },
    {
      title: "Loại đơn",
      key: "categoryPermissionTicket",
      width: "16%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 400, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại đơn"
            style={{ width: "100%" }}
            options={categoryPermissionTickets?.map(
              (categoryPermissionTicket) => ({
                label: `#${categoryPermissionTicket.id} - ${categoryPermissionTicket.name}`,
                value: categoryPermissionTicket.id,
              }),
            )}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          ></Select>
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
      onFilter: (value, record) =>
        record.categoryPermissionTicket?.id === value,
      sorter: (a, b) =>
        a.categoryPermissionTicket?.id! - b.categoryPermissionTicket?.id!,
      render: (record) =>
        `#${record.categoryPermissionTicket?.id} - ${record.categoryPermissionTicket?.name}`,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: "10%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            value={
              selectedKeys[0]
                ? (() => {
                    const [start, end] = JSON.parse(selectedKeys[0] as string);
                    return [dayjs(start), dayjs(end)];
                  })()
                : null
            }
            onChange={(dates) =>
              setSelectedKeys(
                dates
                  ? [
                      JSON.stringify([
                        dates[0]?.format("YYYY-MM-DD"),
                        dates[1]?.format("YYYY-MM-DD"),
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
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;

        const [start, end] = JSON.parse(value as string);

        const date = dayjs(record.date);
        const startDate = dayjs(start);
        const endDate = dayjs(end);

        return (
          date.isSame(startDate, "day") ||
          date.isSame(endDate, "day") ||
          (date.isAfter(startDate, "day") && date.isBefore(endDate, "day"))
        );
      },
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "14%",
      render: (status: string) => (
        <Tag
          color={
            status === PermissionTicketStatus.confirm
              ? "green"
              : status === PermissionTicketStatus.canceled
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
      width: "10%",
      className: "buttons",
      render: (text: any, record: PermissionTicketType, index: number) => (
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
                  children: ManagerPermissionTicketModals.detail(record),
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
                  children: ManagerPermissionTicketModals.update(record),
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
    // { label: "Khách", value: "customer" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    {
      label: PermissionTicketStatus.confirm,
      value: PermissionTicketStatus.confirm,
    },
    {
      label: PermissionTicketStatus.canceled,
      value: PermissionTicketStatus.canceled,
    },
    {
      label: PermissionTicketStatus.pending,
      value: PermissionTicketStatus.pending,
    },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );
  // - Lọc dữ liệu
  const filteredPermissionTickets = useMemo(() => {
    if (!permissionTickets) return [];

    return permissionTickets.filter((permissionTicket) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(permissionTicket.id).includes(value);
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(permissionTicket.status!);
      }

      return matchFind && matchStatus;
    });
  }, [permissionTickets, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã đơn xin phép",
    createAt: "Thời gian tạo đơn",
    employeeHandle:
      "Nhân viên xác nhận (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
    employeeMain:
      "Nhân viên xin phép (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
    categoryPermissionTicket: "Loại đơn xin phép",
    date: "Ngày xin phép",
    reason: "Lý do",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Chưa xác định!",
    createAt: "",
    employeeHandle: "",
    employeeMain:
      "Chọn Nhân viên xin phép (Mã nhân viên - Tên nhân viên - Số điện thoại - Email)",
    categoryPermissionTicket: "Chọn Loại đơn xin phép",
    date: "Chọn Ngày xin phép",
    reason: "Nhập Lý do",
    status: "",
  };
  // - Quản lý các modal
  const ManagerPermissionTicketModals = {
    detail: (permissionTicket: PermissionTicketType) => (
      <ManagerDetailPermissionTicket
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={permissionTicket}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreatePermissionTicket
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          infoLogin: infoLogin,
          categoryPermissionTickets: categoryPermissionTickets,
          employees: employees,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (permissionTicket: PermissionTicketType) => (
      <ManagerUpdatePermissionTicket
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={permissionTicket}
        dataForCrud={{
          infoLogin: infoLogin,
        }}
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
              children: ManagerPermissionTicketModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredPermissionTickets || []}
          //   isLoading={isLoading}
          isLoading={false}
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

export default ManagerPermissionTicketsPage;
