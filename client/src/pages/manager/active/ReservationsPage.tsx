import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/shared/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/filters/MainFilterInfoComponent";
import ReservationsTableComponent from "../../../components/pages/manager/active/ReservationsTableComponent";
import DetailReservationModalComponent from "../../../components/admin-manager/modal/reservation/DetailReservationModalComponent";
import CreateReservationModalComponent from "../../../components/admin-manager/modal/reservation/CreateReservationModalComponent";
import UpdateReservationModalComponent from "../../../components/admin-manager/modal/reservation/UpdateReservationModalComponent";
import ReservationApiService from "../../../services/api/v1/ReservationApiService";
import { useState } from "react";
import { ModalTitleValue, ModalWidthValue, ReservationStatusValue } from "../../../constants/values";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActionsUtil";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { ReservationSummaryResponseType } from "../../../types/ReservationType";

const ManagerReservationsPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Họ tên", value: "customer-fullname" },
    { label: "SĐT", value: "customer-phone" },
    { label: "Email", value: "customer-email" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>("");
  /// - Trạng thái
  const statusOptions: SelectProps["options"] = [
    {
      label: ReservationStatusValue.confirmed,
      value: ReservationStatusValue.confirmed,
    },
    {
      label: ReservationStatusValue.cancelled,
      value: ReservationStatusValue.cancelled,
    },
    {
      label: ReservationStatusValue.pending,
      value: ReservationStatusValue.pending,
    },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: reservationData, isLoading } = useEntityQuery<
    PageResponseType<ReservationSummaryResponseType>
  >({
    keys: [
      nameEN,
      page,
      size,
      filterFindType,
      filterFindValue,
      filterStatusValue,
      restaurantIdForCrud,
    ],
    params: {
      page: page,
      size: size,
      findType: filterFindType!,
      findValue: filterFindValue!,
      statusValue: filterStatusValue!,
      restaurantId: restaurantIdForCrud,
    },
    api: ReservationApiService.handleGetSummary,
  });

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
    employee: "Nhân viên xác nhận",
    customerFullname: "Họ và tên",
    customerPhone: "Số điện thoại",
    customerEmail: "Email",
    customerGuests: "Số lượng khách",
    customerNote: "Ghi chú",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Chưa xác định!",
    createAt: "Chọn Thời gian đặt bàn",
    arriveAt: "Chọn Thời gian nhận bàn",
    employee: "",
    customerFullname: "Nhập Họ và tên",
    customerPhone: "Nhập Số điện thoại",
    customerEmail: "Nhập Email",
    customerGuests: "Nhập Số lượng khách",
    customerNote: "Nhập Ghi chú",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerReservationModals = {
    detail: (reservationSummary: ReservationSummaryResponseType) => (
      <DetailReservationModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={reservationSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateReservationModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{ infoLogin: infoLogin }}
        closeModal={() => closeModal()}
      />
    ),
    update: (reservationSummary: ReservationSummaryResponseType) => (
      <UpdateReservationModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={reservationSummary}
        dataForCrud={{ infoLogin: infoLogin }}
        closeModal={() => closeModal()}
      />
    ),
  };

  return (
    <>
      <main className="admin-manager-main">
        <MainHeaderComponent title={nameVN} />
        <MainFilterInfoComponent
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
              children: ManagerReservationModals.create(),
            })
          }
        />
        <ReservationsTableComponent
          context={{
            nameEN,
            nameVN,
            isManager,
            validActions,
            ManagerReservationModals,
            openModal,
          }}
          tableKey={tableKey}
          object={nameEN}
          data={reservationData}
          isLoading={isLoading}
          isScroll={true}
          onPageChange={(page, size) => {
            setPage(page);
            setSize(size);
          }}
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

export default ManagerReservationsPage;
