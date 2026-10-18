import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/shared/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/filters/MainFilterInfoComponent";
import MainStatisticCardsComponent from "../../../components/admin-manager/dashboard/MainStatisticsCardsComponent";
import DetailInputTicketModalComponent from "../../../components/admin-manager/modal/input-ticket/DetailInputTicketModalComponent";
import CreateInputTicketModalComponent from "../../../components/admin-manager/modal/input-ticket/CreateInputTicketModalComponent";
import UpdateInputTicketModalComponent from "../../../components/admin-manager/modal/input-ticket/UpdateInputTicketModalComponent";
import PrintInputTicketModalComponent from "../../../components/admin-manager/modal/input-ticket/PrintInputTicketModalComponent";
import SupplierApiService from "../../../services/api/v1/SupplierApiService";
import InputTicketApiService from "../../../services/api/v1/InputTicketApiService";
import IngredientApiService from "../../../services/api/v1/IngredientApiService";
import { useMemo, useState } from "react";
import { type SelectProps } from "antd";
import {
  InputTicketStatusValue,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../constants/values";
import {
  actionIndexes,
  getActionNameEn,
} from "../../../utils/defaultActionsUtil";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import {
  getFilterSelectValueToShow,
} from "../../../utils/otherEvents";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { SupplierCrudResponseType } from "../../../types/SupplierType";
import InputTicketsTableComponent from "../../../components/pages/manager/food/InputTicketsTableComponent";
import type { IngredientCrudResponseType } from "../../../types/IngredientType";
import type { InputTicketSummaryResponseType } from "../../../types/InputTicketType";

const ManagerInputTicketsPage: React.FC<AdminManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );

  // Các biến giữ dữ liệu
  // - Nhà cung cấp
  const { data: suppliers } = useEntityQuery<SupplierCrudResponseType[]>({
    keys: ["suppliers-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: SupplierApiService.handleGetCrud,
  });
  // - Nguyên liệu
  const { data: ingredients } = useEntityQuery<IngredientCrudResponseType[]>({
    keys: ["ingredients-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: IngredientApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [{ label: "#", value: "id" }];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    {
      label: InputTicketStatusValue.pending,
      value: InputTicketStatusValue.pending,
    },
    {
      label: InputTicketStatusValue.cancelled,
      value: InputTicketStatusValue.cancelled,
    },
    {
      label: InputTicketStatusValue.confirmed,
      value: InputTicketStatusValue.confirmed,
    },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: inputTicketData, isLoading } = useEntityQuery<
    PageResponseType<InputTicketSummaryResponseType>
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
    api: InputTicketApiService.handleGetSummary,
  });
  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin nhập hàng",
    id: "Mã phiếu nhập",
    createAt: "Thời gian tạo phiếu",
    employee: "Nhân viên tạo phiếu",
    supplier: "Nhà cung cấp",
    totalInputPrice: "Tổng tiền nguyên liệu (VNĐ)",
    paymentStatus: "Thanh toán",
    status: "Trạng thái",
    inputTicketDetails: "Chi tiết phiếu nhập",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Chưa xác định!",
    createAt: "",
    employee: "",
    supplier: "Chọn Nhà cung cấp",
    totalInputPrice: "",
    paymentStatus: "",
    status: "",
    inputTicketDetails: "",
  };
  // - Quản lý các modal
  const ManagerInputTicketModals = {
    detail: (inputTicketSummary: InputTicketSummaryResponseType) => (
      <DetailInputTicketModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={inputTicketSummary}
        dataForCrud={{
          ingredients: ingredients,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateInputTicketModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          infoLogin: infoLogin,
          suppliers: suppliers,
          ingredients: ingredients,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (inputTicketSummary: InputTicketSummaryResponseType) => (
      <UpdateInputTicketModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={inputTicketSummary}
        dataForCrud={{
          infoLogin: infoLogin,
          ingredients: ingredients,
        }}
        closeModal={() => closeModal()}
      />
    ),
    print: (inputTicketSummary: InputTicketSummaryResponseType) => (
      <PrintInputTicketModalComponent
        objectEN={nameEN}
        data={inputTicketSummary}
        closeModal={() => closeModal()}
      />
    ),
  };

  //
  const cardValues = useMemo(() => {
    let totalInputPrice = 0;
    let totalTicket = 0;
    let totalConfirmed = 0;
    let totalCanceled = 0;
    let totalPending = 0;

    inputTicketData?.content.forEach((inputTicket) => {
      totalInputPrice += inputTicket.totalInputPrice ?? 0;
      totalTicket++;

      switch (inputTicket.status) {
        case InputTicketStatusValue.confirmed:
          totalConfirmed++;
          break;
        case InputTicketStatusValue.cancelled:
          totalCanceled++;
          break;
        case InputTicketStatusValue.pending:
          totalPending++;
          break;
      }
    });

    return {
      totalInputPrice,
      totalTicket,
      totalConfirmed,
      totalCanceled,
      totalPending,
    };
  }, [inputTicketData]);

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
              children: ManagerInputTicketModals.create(),
            })
          }
        />
        <MainStatisticCardsComponent
          titles={[
            "Tổng tiền (VNĐ)",
            "Tổng số phiếu",
            InputTicketStatusValue.confirmed,
            InputTicketStatusValue.cancelled,
            InputTicketStatusValue.pending,
          ]}
          values={[
            cardValues.totalInputPrice,
            cardValues.totalTicket,
            cardValues.totalConfirmed,
            cardValues.totalCanceled,
            cardValues.totalPending,
          ]}
        />
        <InputTicketsTableComponent
          tableKey={tableKey}
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          suppliers={suppliers}
          managerModals={ManagerInputTicketModals}
          openModal={openModal}
          data={inputTicketData}
          isLoading={isLoading}
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

export default ManagerInputTicketsPage;
