import { useMemo, useState, type FC } from "react";
import { type SelectProps } from "antd";
import type { ManagerPageProps } from "../../../common/props";
import type { FloorType, OrderSheetType } from "../../../common/types";
import {
  CommonStatus,
  ModalTitleValue,
  ModalWidthValue,
  OrderSheetStatus,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import OrderSheetCard from "../../../components/admin-manager/common/order-sheet-card";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterActive from "../../../components/admin-manager/common/main-filter-active";
import ManagerUpdateOrderSheet from "../../../components/admin-manager/modal/order-sheet/manager-update-order-sheet";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllFloor } from "../../../requests/floors";
import { FindAllOrderSheetCurrentDate } from "../../../requests/order-sheets";
import { getFilterSelectValueToShow } from "../../../utils/other-events";

// Manager Order Sheets Page
const ManagerOrderSheetsPage: FC<ManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId }
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
  // - Phiếu gọi món (hôm nay)
  const {
    data: orderSheets,
    isLoading,
    isError,
    error,
  } = useEntityQuery<OrderSheetType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllOrderSheetCurrentDate,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Bàn", value: "table" },
  ];
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
    { label: OrderSheetStatus.serviced, value: OrderSheetStatus.serviced },
    { label: OrderSheetStatus.confirm, value: OrderSheetStatus.confirm },
    { label: OrderSheetStatus.canceled, value: OrderSheetStatus.canceled },
    { label: OrderSheetStatus.pending, value: OrderSheetStatus.pending },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    []
  );
  // - Lọc dữ liệu
  const filteredOrderSheets = useMemo(() => {
    if (!orderSheets) return [];

    return orderSheets.filter((orderSheet) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(orderSheet.id).includes(value);
        }

        if (filterFindType === "table") {
          matchFind = orderSheet?.table?.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo floor
      let matchFloor = true;
      if (filterFloorValue && filterFloorValue.length > 0) {
        matchFloor =
          Number(filterFloorValue[0]) === orderSheet?.table?.floor?.id;
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        console.log(filterStatusValue);
        matchStatus = filterStatusValue.includes(orderSheet.status!);
      }

      return matchFind && matchFloor && matchStatus;
    });
  }, [
    orderSheets,
    filterFindType,
    filterFindValue,
    filterFloorValue,
    filterStatusValue,
  ]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerOrderSheetModals = {
    update: (orderSheet: OrderSheetType) => (
      <ManagerUpdateOrderSheet
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={orderSheet}
        dataForCrud={{ infoLogin: infoLogin }}
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
        <div className="main__order-sheets call-foods">
          {filteredOrderSheets?.map((orderSheet, index) => (
            <OrderSheetCard
              key={index}
              orderSheet={orderSheet}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.handle(nameVN.toLowerCase()),
                  width: ModalWidthValue.active,
                  className: nameEN,
                  children: ManagerOrderSheetModals.update(orderSheet),
                })
              }
            />
          ))}
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

export default ManagerOrderSheetsPage;
