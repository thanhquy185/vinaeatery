import { useMemo, useState, type FC } from "react";
import { type SelectProps } from "antd";
import {
  CommonStatus,
  ModalTitleValue,
  ModalWidthValue,
  UseTableStatus,
} from "../../../common/values";
import type { ManagerPageProps } from "../../../common/props";
import type {
  FloorType,
  OrderSheetType,
  OrderTableType,
  UseTableType,
} from "../../../common/types";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainFilterActive from "../../../components/admin-manager/common/main-filter-active";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import ManagerOccupiedUseTable from "../../../components/admin-manager/modal/use-table/manager-occupied-use-table";
import ManagerReservedUseTable from "../../../components/admin-manager/modal/use-table/manager-reserved-use-table";
import ManagerEmptyUseTable from "../../../components/admin-manager/modal/use-table/manager-empty-use-table";
import ManagerRepairUseTable from "../../../components/admin-manager/modal/use-table/manager-repair-use-table";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useEntityMutation } from "../../../hook/use-entity-mutation";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllFloor } from "../../../requests/floors";
import {
  FindAllUseTableTimeEndIsNull,
  HandleUpdateUseTable,
} from "../../../requests/use-tables";
import { getFilterSelectValueToShow } from "../../../utils/other-events";
import { openConfirmation } from "../../../utils/show-confirmation";

// Kiểu dữ liệu các tham số truyền vào của 1 đối tượng sử dụng bàn ăn
export type HandleUseTableProps = {
  id?: number;
  tableId?: number;
  employeeId?: number;
  customerId?: number;
  customerFullname?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderId?: number;
  orderTableId?: number;
  orderTable?: OrderTableType;
  orderSheets?: OrderSheetType[];
  button: HTMLElement;
  value: string;
};

// Manager Status Tables Page
const ManagerUseTablesPage: FC<ManagerPageProps> = ({
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
  //   queryClient.invalidateQueries({ queryKey: ["floors"] });
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các biến giữ dữ liệu
  // - Tầng
  const { data: floors } = useEntityQuery<FloorType[]>({
    keys: ["floors", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllFloor,
  });
  // - Sử dụng bàn ăn (mới nhất)
  const {
    data: useTables,
    isLoading,
    isError,
    error,
  } = useEntityQuery<UseTableType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllUseTableTimeEndIsNull,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [{ label: "Bàn", value: "table" }];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
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
    [],
  );
  // - Lọc dữ liệu
  const filteredUseTables = useMemo(() => {
    if (!useTables) return [];

    return useTables.filter((useTable) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        // if (filterFindType === "id") {
        //   matchFind = String(useTable.id).includes(value);
        // }

        if (filterFindType === "table") {
          matchFind = useTable?.table?.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo floor
      let matchFloor = true;
      if (filterFloorValue && filterFloorValue.length > 0) {
        matchFloor = Number(filterFloorValue[0]) === useTable?.table?.floor?.id;
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        console.log(filterStatusValue);
        matchStatus = filterStatusValue.includes(useTable.status!);
      }

      return matchFind && matchFloor && matchStatus;
    });
  }, [
    useTables,
    filterFindType,
    filterFindValue,
    filterFloorValue,
    filterStatusValue,
  ]);

  // Các thành phần xử lý sự kiện cập nhật sử dụng bàn ăn
  // - Mutation
  const updateMutation = useEntityMutation<UseTableType>({
    messages: {
      success: `Cập nhật trạng thái ${nameVN?.toLowerCase()} thành công!`,
      error: `Cập nhật trạng thái ${nameVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[nameEN]],
    api: HandleUpdateUseTable,
  });
  // - Sự kiện
  const callApiToUpdateUseTable = async ({
    id,
    customerId,
    customerFullname,
    customerPhone,
    customerEmail,
    orderTableId,
    button,
    value,
  }: HandleUseTableProps) => {
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
      if (
        value === UseTableStatus.occupied ||
        value === UseTableStatus.reserved ||
        value === UseTableStatus.empty ||
        value === UseTableStatus.repair
      ) {
        status = value;
      }

      // console.log(customerId);
      // console.log(customerFullname);
      // console.log(customerPhone);
      // console.log(customerEmail);

      // Thực thi mutation
      const response = await updateMutation.mutateAsync({
        values: {
          restaurantId: restaurantIdForCrud,
          id: id,
          timeEnd: new Date().toISOString(),
          employeeId: infoLogin?.id,
          customerId:
            value === UseTableStatus.occupied && customerId!
              ? customerId
              : undefined,
          customerFullname:
            value === UseTableStatus.occupied && customerFullname!
              ? customerFullname
              : undefined,
          customerPhone:
            value === UseTableStatus.occupied && customerPhone!
              ? customerPhone
              : undefined,
          customerEmail:
            value === UseTableStatus.occupied && customerEmail!
              ? customerEmail
              : undefined,
          orderTableId:
            value === UseTableStatus.reserved && orderTableId!
              ? orderTableId
              : undefined,
          status: status! || undefined,
        },
      });
      if (response) {
        closeModal();
      }
    } else {
      // Xoá class 'active' thể hiện là nút không còn được nhấn
      button.classList.remove("active");
    }
  };

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerUseTableModals = {
    occupied: (useTable: UseTableType) => (
      <ManagerOccupiedUseTable
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useTable}
        dataForCrud={{ infoLogin: infoLogin }}
        callApiToUpdateUseTable={callApiToUpdateUseTable}
        closeModal={() => closeModal()}
      />
    ),
    reserved: (useTable: UseTableType) => (
      <ManagerReservedUseTable
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useTable}
        dataForCrud={{ infoLogin: infoLogin }}
        callApiToUpdateUseTable={callApiToUpdateUseTable}
        closeModal={() => closeModal()}
      />
    ),
    empty: (useTable: UseTableType) => (
      <ManagerEmptyUseTable
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useTable}
        dataForCrud={{ infoLogin: infoLogin }}
        callApiToUpdateUseTable={callApiToUpdateUseTable}
        closeModal={() => closeModal()}
      />
    ),
    repair: (useTable: UseTableType) => (
      <ManagerRepairUseTable
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={useTable}
        dataForCrud={{ infoLogin: infoLogin }}
        callApiToUpdateUseTable={callApiToUpdateUseTable}
        closeModal={() => closeModal()}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <AdminManagerMainHeader title={nameVN} />
        <AdminManagerMainFilterActive
          findOptions={findOptions}
          filterFindType={filterFindType}
          filterFindValue={filterFindValue}
          setFilterFindType={setFilterFindType}
          setFilterFindValue={setFilterFindValue}
          floorOptions={floorOptions}
          filterFloorValue={getFilterSelectValueToShow({
            options: floorOptions,
            filterSelectValue: filterFloorValue,
          })}
          setFilterFloorValue={setFilterFloorValue}
          statusOptions={statusOptions}
          filterStatusValue={getFilterSelectValueToShow({
            options: statusOptions,
            filterSelectValue: filterStatusValue,
          })}
          setFilterStatusValue={setFilterStatusValue}
          onClickFilterReset={() => {
            setFilterFindType(findOptions[0].value);
            setFilterFindValue(null);
            setFilterFloorValue(null);
            setFilterStatusValue(null);
          }}
        />
        <div className="main__use-tables">
          {filteredUseTables?.map((useTable) => {
            if (useTable!.table!.status !== CommonStatus.active) return null;

            return (
              <div
                key={useTable?.id}
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
                  openModal({
                    title: ModalTitleValue.handle(nameVN.toLowerCase()),
                    width: ModalWidthValue.active,
                    className: nameEN,
                    children:
                      useTable!.status === UseTableStatus.occupied
                        ? ManagerUseTableModals.occupied(useTable)
                        : useTable!.status === UseTableStatus.reserved
                          ? ManagerUseTableModals.reserved(useTable)
                          : useTable!.status === UseTableStatus.empty
                            ? ManagerUseTableModals.empty(useTable)
                            : ManagerUseTableModals.repair(useTable),
                  })
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

export default ManagerUseTablesPage;
