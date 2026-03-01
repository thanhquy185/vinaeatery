import { useMemo, useState, type FC } from "react";
import { Button, InputNumber, Select, Tag } from "antd";
import type { SelectProps } from "antd";
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
import type { CategoryTableType } from "../../../common/types";
import {
  CommonStatus,
  ModalTitleValue,
  ModalWidthValue,
  CategoryTableSurchargeType,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailCategoryTable from "../../../components/admin-manager/modal/category-table/manager-detail-category-table";
import ManagerCreateCategoryTable from "../../../components/admin-manager/modal/category-table/manager-create-category-table";
import ManagerUpdateCategoryTable from "../../../components/admin-manager/modal/category-table/manager-update-category-table";
import ManagerLock from "../../../components/admin-manager/modal/manager-lock";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllCategoryTable } from "../../../requests/category-tables";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import {
  getFilterSelectValueToShow,
  vietnamMoneyFormat,
} from "../../../utils/other-events";

// Manager Category Tables Page
const ManagerCategoryTablesPage: FC<ManagerPageProps> = ({
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
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: categoryTables,
    isLoading,
    isError,
    error,
  } = useEntityQuery<CategoryTableType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllCategoryTable,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<CategoryTableType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "12%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên loại bàn ăn",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Loại phụ thu",
      dataIndex: "surchargeType",
      key: "surchargeType",
      width: "17%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại phụ thu"
            style={{ width: "100%" }}
            options={[
              {
                label: CategoryTableSurchargeType.fixed,
                value: CategoryTableSurchargeType.fixed,
              },
              {
                label: CategoryTableSurchargeType.percent,
                value: CategoryTableSurchargeType.percent,
              },
            ]}
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
      onFilter: (value, record) => record.surchargeType === value,
      sorter: (a, b) => a?.surchargeType!.localeCompare(b?.surchargeType!),
    },
    {
      title: "Giá trị phụ thu",
      dataIndex: "surchargeValue",
      key: "surchargeValue",
      width: "17%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
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
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const surchargeValue = record.surchargeValue ?? 0;
        if (min && surchargeValue < min) return false;
        if (max && surchargeValue > max) return false;
        return true;
      },
      sorter: (a, b) => a?.surchargeValue! - b?.surchargeValue!,
      render: (surchargeValue: number) =>
        vietnamMoneyFormat(surchargeValue || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
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
      width: "12%",
      className: "buttons",
      render: (text: any, record: CategoryTableType, index: number) => (
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
                  width: ModalWidthValue.split2,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: ManagerCategoryTableModals.detail(record),
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
                  width: ModalWidthValue.split2,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: ManagerCategoryTableModals.update(record),
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
                  children: ManagerCategoryTableModals.lock(
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
  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
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
  const filteredCategoryTables = useMemo(() => {
    if (!categoryTables) return [];

    return categoryTables.filter((categoryTable) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(categoryTable.id).includes(value);
        }

        if (filterFindType === "name") {
          matchFind = categoryTable.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(categoryTable.status!);
      }

      return matchFind && matchStatus;
    });
  }, [categoryTables, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã loại bàn ăn",
    name: "Tên loại bàn ăn",
    surchargeType: "Loại phụ thu",
    surchargeValue: "Giá trị phụ thu",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm!",
    name: "Nhập Tên loại bàn ăn",
    surchargeType: "Loại phụ thu",
    surchargeValue: "Giá trị phụ thu",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerCategoryTableModals = {
    detail: (categoryTable: CategoryTableType) => (
      <ManagerDetailCategoryTable
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={categoryTable}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateCategoryTable
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        closeModal={() => closeModal()}
      />
    ),
    update: (categoryTables: CategoryTableType) => (
      <ManagerUpdateCategoryTable
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={categoryTables}
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
              width: ModalWidthValue.split2,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerCategoryTableModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredCategoryTables || []}
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

export default ManagerCategoryTablesPage;
