import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainOrderSheetListComponent from "../../../components/admin-manager/MainOrderSheetListComponent";
import MainFilterActiveComponent from "../../../components/admin-manager/MainFilterActiveComponent";
import UpdateOrderSheetModalComponent from "../../../components/admin-manager/modal/order-sheet/UpdateOrderSheetModalComponent";
import FloorApiService from "../../../services/api/v1/FloorApiService";
import OrderSheetApiService from "../../../services/api/v1/OrderSheetApiService";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client, over } from "stompjs";
import { OrderSheetStatusValue } from "../../../constants/values";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import { getVietnamCurrentDate } from "../../../utils/dayjsUtil";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { FloorCrudResponseType } from "../../../types/FloorType";
import type { OrderSheetSummaryResponseType } from "../../../types/OrderSheetType";

const ManagerOrderSheetsPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Query Client
  const queryClient = useQueryClient();

  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

  // Các biến giữ dữ liệu
  // - Tầng
  const { data: floors } = useEntityQuery<FloorCrudResponseType[]>({
    keys: ["floors-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FloorApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Bàn", value: "table" },
  ];
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
    {
      label: OrderSheetStatusValue.serviced,
      value: OrderSheetStatusValue.serviced,
    },
    {
      label: OrderSheetStatusValue.confirmed,
      value: OrderSheetStatusValue.confirmed,
    },
    {
      label: OrderSheetStatusValue.cancelled,
      value: OrderSheetStatusValue.cancelled,
    },
    {
      label: OrderSheetStatusValue.pending,
      value: OrderSheetStatusValue.pending,
    },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );

  // Dữ liệu Phiếu gọi món
  const { data: orderSheetData, isLoading } = useEntityQuery<
    PageResponseType<OrderSheetSummaryResponseType>
  >({
    keys: [
      nameEN,
      page,
      size,
      filterFindType,
      filterFindValue,
      filterFloorValue,
      filterStatusValue,
      restaurantIdForCrud,
    ],
    params: {
      page: page,
      size: size,
      findType: filterFindType!,
      findValue: filterFindValue!,
      timeValue: [getVietnamCurrentDate(), ""],
      floorValue: filterFloorValue!,
      statusValue: filterStatusValue!,
      restaurantId: restaurantIdForCrud,
    },
    api: OrderSheetApiService.handleGetSummary,
  });

  // Kết nối socket
  const stompClientRef = useRef<Client | null>(null);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Quản lý các modal
  const ManagerOrderSheetModals = {
    update: (orderSheetSummary: OrderSheetSummaryResponseType) => (
      <UpdateOrderSheetModalComponent
        stomp={stompClientRef}
        objectVN={nameVN}
        objectEN={nameEN}
        isManager={isManager}
        restaurantId={restaurantIdForCrud}
        validActions={validActions}
        data={orderSheetSummary}
        dataForCrud={{ infoLogin: infoLogin }}
        closeModal={() => closeModal()}
      />
    ),
  };

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/websocket");
    const client = over(socket);
    stompClientRef.current = client;

    client.connect({}, () => {
      console.log("WebSocket connected");

      client.subscribe("/topic/customer-call-food", () => {
        queryClient.invalidateQueries({
          queryKey: [
            nameEN,
            page,
            size,
            filterFindType,
            filterFindValue,
            filterFloorValue,
            filterStatusValue,
            restaurantIdForCrud,
          ],
        });
      });

      client.subscribe("/topic/customer-cancel-order-sheet", () => {
        queryClient.invalidateQueries({
          queryKey: [
            nameEN,
            page,
            size,
            filterFindType,
            filterFindValue,
            filterFloorValue,
            filterStatusValue,
            restaurantIdForCrud,
          ],
        });
      });
    });

    return () => {
      if (client.connected) {
        client.disconnect(() => console.log("WebSocket disconnected"));
      }
    };
  }, []);

  return (
    <>
      <main className="admin-manager-main">
        <MainHeaderComponent title={nameVN} />
        <MainFilterActiveComponent
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
        <MainOrderSheetListComponent
          nameEN={nameEN}
          nameVN={nameVN}
          orderSheetData={orderSheetData!}
          isLoading={isLoading}
          ManagerOrderSheetModals={ManagerOrderSheetModals}
          openModal={openModal}
          setPage={setPage}
          setSize={setSize}
        />
      </main>
      {modal.open && (
        <ModalComponent
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
