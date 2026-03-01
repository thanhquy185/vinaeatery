import { useMemo, useState, type FC } from "react";
import { Button, DatePicker, Tag, type SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye, Lock, PenBox, Unlock } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faLock,
//   faPenToSquare,
//   faUnlock,
// } from "@fortawesome/free-solid-svg-icons";
import type { ManagerPageProps } from "../../../common/props";
import {
  CommonStatus,
  EmployeeStatus,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../common/values";
import type {
  EmployeeType,
  ScheduleType,
  ShiftType,
} from "../../../common/types";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailSchedule from "../../../components/admin-manager/modal/schedule/manager-detail-schedule";
import ManagerCreateSchedule from "../../../components/admin-manager/modal/schedule/manager-create-schedule";
import ManagerUpdateSchedule from "../../../components/admin-manager/modal/schedule/manager-update-schedule";
import ManagerLock from "../../../components/admin-manager/modal/manager-lock";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllShift } from "../../../requests/shifts";
import { FindAllEmployee } from "../../../requests/employees";
import { FindAllSchedule } from "../../../requests/schedule";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { getFilterSelectValueToShow } from "../../../utils/other-events";
import dayjs from "dayjs";

// Manager Schedule Page
const ManagerSchedulePage: FC<ManagerPageProps> = ({
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

  // Các biến giữ dữ liệu
  // - Nhân viên
  const { data: employees } = useEntityQuery<EmployeeType[]>({
    keys: ["employees", restaurantIdForCrud, EmployeeStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [EmployeeStatus.active],
    },
    api: FindAllEmployee,
  });
  // - Ca làm
  const { data: shifts } = useEntityQuery<ShiftType[]>({
    keys: ["shifts", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllShift,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: schedules,
    isLoading,
    isError,
    error,
  } = useEntityQuery<ScheduleType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllSchedule,
  });
  // const schedules: ScheduleType[] = [
  //   {
  //     id: 1,
  //     name: "Lịch làm tháng 2",
  //     dateStart: "2026-02-01",
  //     dateEnd: "2026-02-28",
  //     note: "Lịch cố định tháng 02/2026",
  //     status: "Tạm dừng",
  //     scheduleEmployees: [
  //       {
  //         // employee: {
  //         //   id: 1,
  //         // },
  //         employeeId: 1,
  //       },
  //       {
  //         // employee: {
  //         //   id: 2,
  //         // },
  //         employeeId: 2,
  //       },
  //     ],
  //     scheduleShifts: [
  //       {
  //         // shiftId: 1,
  //         shift: {
  //           id: 1,
  //           name: "Ca sáng nguyên tuần",
  //           shiftDetails: [
  //             {
  //               shiftId: 1,
  //               dayOfWeek: 1,
  //               timeStart: "07:00",
  //               timeEnd: "12:00",
  //             },
  //             {
  //               shiftId: 1,
  //               dayOfWeek: 2,
  //               timeStart: "07:00",
  //               timeEnd: "12:00",
  //             },
  //             {
  //               shiftId: 1,
  //               dayOfWeek: 3,
  //               timeStart: "07:00",
  //               timeEnd: "12:00",
  //             },
  //             {
  //               shiftId: 1,
  //               dayOfWeek: 4,
  //               timeStart: "07:00",
  //               timeEnd: "12:00",
  //             },
  //             {
  //               shiftId: 1,
  //               dayOfWeek: 5,
  //               timeStart: "07:00",
  //               timeEnd: "12:00",
  //             },
  //             {
  //               shiftId: 1,
  //               dayOfWeek: 6,
  //               timeStart: "07:00",
  //               timeEnd: "12:00",
  //             },
  //             {
  //               shiftId: 1,
  //               dayOfWeek: 7,
  //               timeStart: "07:00",
  //               timeEnd: "12:00",
  //             },
  //           ],
  //         },
  //       },
  //     ],
  //   },
  // ];
  // - Cột thuộc tính
  const columns: ColumnsType<ScheduleType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên lịch làm",
      dataIndex: "name",
      key: "name",
      width: "40%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "dateStart",
      key: "dateStart",
      width: "15%",
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

        const date = dayjs(record.dateStart);
        const startDate = dayjs(start);
        const endDate = dayjs(end);

        return (
          date.isSame(startDate, "day") ||
          date.isSame(endDate, "day") ||
          (date.isAfter(startDate, "day") && date.isBefore(endDate, "day"))
        );
      },
      sorter: (a, b) =>
        dayjs(a.dateStart).valueOf() - dayjs(b.dateStart).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "dateEnd",
      key: "dateEnd",
      width: "15%",
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

        const date = dayjs(record.dateEnd);
        const startDate = dayjs(start);
        const endDate = dayjs(end);

        return (
          date.isSame(startDate, "day") ||
          date.isSame(endDate, "day") ||
          (date.isAfter(startDate, "day") && date.isBefore(endDate, "day"))
        );
      },
      sorter: (a, b) => dayjs(a.dateEnd).valueOf() - dayjs(b.dateEnd).valueOf(),
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
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
      width: "10%",
      className: "buttons",
      render: (text: any, record: ScheduleType, index: number) => (
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
                  width: ModalWidthValue.split3B,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: ManagerScheduleModals.detail(record),
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
                  width: ModalWidthValue.split3B,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: ManagerScheduleModals.update(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
              <PenBox />
            </button>
          )}
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.lock,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.lock)}
              onClick={() =>
                openModal({
                  title:
                    record.status == CommonStatus.active
                      ? ModalTitleValue.lock(nameVN.toLowerCase())
                      : ModalTitleValue.unlock(nameVN.toLowerCase()),
                  width: ModalWidthValue.lock,
                  className: `${getActionNameEn(actionIndexes.lock)} ${nameEN}`,
                  children: ManagerScheduleModals.lock(
                    record?.id as number,
                    record?.status!,
                  ),
                })
              }
            >
              {/* <FontAwesomeIcon
                icon={record.status == CommonStatus.active ? faLock : faUnlock}
              /> */}
              {record.status == CommonStatus.active ? <Lock /> : <Unlock />}
            </button>
          )}
        </>
      ),
    },
  ];

  // Các biến giữ giá trị từ việc lọc dữ liệu
  // - Tìm kiếm
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "name" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatus.active, value: CommonStatus.active },
    { label: CommonStatus.inactive, value: CommonStatus.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );
  // - Lọc dữ liệu
  const filteredSchedule = useMemo(() => {
    if (!schedules) return [];

    return schedules.filter((schedule) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(schedule.id).includes(value);
        }

        if (filterFindType === "name") {
          matchFind = schedule.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(schedule.status!);
      }

      return matchFind && matchStatus;
    });
  }, [schedules, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin ca làm",
    title3: "Thông tin nhân viên",
    id: "Mã lịch làm",
    name: "Tên lịch làm",
    dateStart: "Ngày bắt đầu",
    dateEnd: "Ngày kết thúc",
    note: "Ghi chú",
    status: "Trạng thái",
    scheduleEmployees: "Chi tiết nhân viên",
    scheduleShifts: "Chi tiết ca làm",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    title3: "",
    id: "Chưa xác định!",
    name: "Nhập Tên lịch làm",
    dateStart: "Chọn Ngày bắt đầu",
    dateEnd: "Chọn Ngày kết thúc",
    note: "Nhập Ghi chú",
    status: "Chọn Trạng thái",
    scheduleEmployees: "",
    scheduleShifts: "",
  };
  // - Quản lý các modal
  const ManagerScheduleModals = {
    detail: (schedule: ScheduleType) => (
      <ManagerDetailSchedule
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={schedule}
        dataForCrud={{
          shifts: shifts,
          employees: employees,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateSchedule
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          schedules: schedules,
          shifts: shifts,
          employees: employees,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (schedule: ScheduleType) => (
      <ManagerUpdateSchedule
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={schedule}
        dataForCrud={{
          schedules: schedules,
          shifts: shifts,
          employees: employees,
        }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string) => (
      <ManagerLock
        objectVN={nameVN}
        objectEN={nameEN}
        restaurantId={restaurantIdForCrud}
        fieldId={id}
        fieldStatus={status}
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
              width: ModalWidthValue.split3B,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerScheduleModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredSchedule || []}
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

export default ManagerSchedulePage;
