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
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import type {
  CategoryInsuranceType,
  EmployeeType,
  InsuranceType,
} from "../../../common/types";
import {
  CommonStatus,
  EmployeeStatus,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailInsurance from "../../../components/admin-manager/modal/insurance/manager-detail-insurance";
import ManagerCreateInsurance from "../../../components/admin-manager/modal/insurance/manager-create-insurance";
import ManagerUpdateInsurance from "../../../components/admin-manager/modal/insurance/manager-update-insurance";
import ManagerLock from "../../../components/admin-manager/modal/manager-lock";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllCategoryInsurance } from "../../../requests/category-insurances";
import { FindAllEmployee } from "../../../requests/employees";
import { FindAllInsurance } from "../../../requests/insurances";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { getFilterSelectValueToShow } from "../../../utils/other-events";
import dayjs from "dayjs";

// Manager Insurances Page
const ManagerInsurancesPage: FC<ManagerPageProps> = ({
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
  // - Loại bảo hiểm
  const { data: categoryInsurances } = useEntityQuery<CategoryInsuranceType[]>({
    keys: ["category-insurances", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllCategoryInsurance,
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
    data: insurances,
    isLoading,
    isError,
    error,
  } = useEntityQuery<InsuranceType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllInsurance,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<InsuranceType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "15%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên bảo hiểm",
      dataIndex: "name",
      key: "name",
      width: "40%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      width: "15%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            picker="month"
            format="YYYY-MM"
            placeholder={["Bắt đầu", "Kết thúc"]}
            style={{ display: "flex" }}
            value={
              selectedKeys[0]
                ? (() => {
                    const [start, end] = JSON.parse(
                      selectedKeys[0] as string,
                    ) as [string, string];
                    return [dayjs(start, "YYYY-MM"), dayjs(end, "YYYY-MM")];
                  })()
                : null
            }
            onChange={(dates) =>
              setSelectedKeys(
                dates
                  ? [
                      JSON.stringify([
                        dates[0]?.format("YYYY-MM"),
                        dates[1]?.format("YYYY-MM"),
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

          {/* Reset nếu cần */}
          {/* 
      <Button
        size="small"
        style={{ width: "100%", marginTop: 4 }}
        onClick={() => {
          clearFilters?.();
          confirm();
        }}
      >
        Đặt lại
      </Button> 
      */}
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;

        const [start, end] = JSON.parse(value as string) as [string, string];

        const recordMonth = dayjs(record.month, "YYYY-MM");
        const startMonth = dayjs(start, "YYYY-MM");
        const endMonth = dayjs(end, "YYYY-MM");

        return (
          recordMonth.isSame(startMonth, "month") ||
          recordMonth.isSame(endMonth, "month") ||
          (recordMonth.isAfter(startMonth, "month") &&
            recordMonth.isBefore(endMonth, "month"))
        );
      },
      sorter: (a, b) =>
        dayjs(a.month, "YYYY-MM").valueOf() -
        dayjs(b.month, "YYYY-MM").valueOf(),
      render: (val) => (val ? dayjs(val, "YYYY-MM").format("YYYY-MM") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
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
      width: "15%",
      className: "buttons",
      render: (text: any, record: InsuranceType, index: number) => (
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
                  children: ManagerInsuranceModals.detail(record),
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
                  children: ManagerInsuranceModals.update(record),
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
                  children: ManagerInsuranceModals.lock(
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
  const filteredInsurances = useMemo(() => {
    if (!insurances) return [];

    return insurances.filter((insurance) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(insurance.id).includes(value);
        }

        if (filterFindType === "name") {
          matchFind = insurance.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(insurance.status!);
      }

      return matchFind && matchStatus;
    });
  }, [insurances, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    id: "Mã bảo hiểm",
    name: "Tên bảo hiểm",
    month: "Tháng",
    note: "Ghi chú",
    status: "Trạng thái",
    insuranceDetails: "Chi tiết bảo hiểm",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    id: "Chưa xác định!",
    name: "Nhập Tên bảo hiểm",
    month: "Chọn Tháng",
    note: "Nhập Ghi chú",
    status: "Chọn Trạng thái",
    insuranceDetails: "",
  };
  // - Quản lý các modal
  const ManagerInsuranceModals = {
    detail: (insurance: InsuranceType) => (
      <ManagerDetailInsurance
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={insurance}
        dataForCrud={{
          categoryInsurances: categoryInsurances,
          employees: employees,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateInsurance
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          categoryInsurances: categoryInsurances,
          insuranceMonthIsActives:
            insurances
              ?.filter((insurance) => insurance.status === CommonStatus.active)
              ?.map((insurance) => insurance.month || "") || [],
          employees: employees,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (insurance: InsuranceType) => (
      <ManagerUpdateInsurance
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={insurance}
        dataForCrud={{
          categoryInsurances: categoryInsurances,
          insuranceMonthIsActives:
            insurances
              ?.filter((insurance) => insurance.status === CommonStatus.active)
              ?.map((insurance) => insurance.month || "") || [],
          employees: employees,
        }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
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
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerInsuranceModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredInsurances || []}
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

// Manager Permissions Page
export default ManagerInsurancesPage;
