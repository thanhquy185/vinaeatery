import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/shared/ModalComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/filters/MainFilterInfoComponent";
import MainStatisticCardsComponent from "../../../components/admin-manager/dashboard/MainStatisticsCardsComponent";
import BillsTableComponent from "../../../components/pages/manager/active/BillsTableComponent";
import DetailBillModalComponent from "../../../components/admin-manager/modal/bill/DetailBillModalComponent";
import CreateBillModalComponent from "../../../components/admin-manager/modal/bill/CreateBillModalComponent";
import UpdateBillModalComponent from "../../../components/admin-manager/modal/bill/UpdateBillModalComponent";
import PrintBillModalComponent from "../../../components/admin-manager/modal/bill/PrintBillModalComponent";
import PaymentMethodApiService from "../../../services/api/v1/PaymentMethodApiService";
import FoodApiService from "../../../services/api/v1/FoodApiService";
import BillApiService from "../../../services/api/v1/BillApiService";
import { useMemo, useState } from "react";
import { BillStatusValue, ModalTitleValue, ModalWidthValue } from "../../../constants/values";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActionsUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { FoodCrudResponseType } from "../../../types/FoodType";
import type { PaymentMethodCrudResponseType } from "../../../types/PaymentMethodType";
import type { BillSummaryResponseType } from "../../../types/BillType";

const ManagerBillsPage: React.FC<AdminManagerPageProps> = ({
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
  // - Phương thức thanh toán
  const { data: paymentMethods } = useEntityQuery<
    PaymentMethodCrudResponseType[]
  >({
    keys: ["payment-methods-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: PaymentMethodApiService.handleGetCrud,
  });
  // - Món ăn
  const { data: foods } = useEntityQuery<FoodCrudResponseType[]>({
    keys: ["foods-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FoodApiService.handleGetCrud,
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key bảng
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
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: BillStatusValue.confirmed, value: BillStatusValue.confirmed },
    { label: BillStatusValue.cancelled, value: BillStatusValue.cancelled },
    { label: BillStatusValue.pending, value: BillStatusValue.pending },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    [],
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: billData, isLoading } = useEntityQuery<
    PageResponseType<BillSummaryResponseType>
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
    api: BillApiService.handleGetSummary,
  });

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin khách hàng và món ăn",
    title3: "Thông tin thanh toán",
    id: "Mã hoá đơn",
    createAt: "Thời gian tạo đơn",
    employee: "Nhân viên xác nhận",
    customerFullname: "Họ và tên",
    customerPhone: "Số điện thoại",
    customerEmail: "Email",
    totalPrice: "Tổng thanh toán (VNĐ)",
    status: "Trạng thái hoá đơn",
    paymentId: "Mã giao dịch",
    paymentMethod: "Phương thức thanh toán",
    paymentAt: "Thời gian thanh toán",
    paymentTotalPrice: "Số tiền thanh toán",
    paymentStatus: "Trạng thái thanh toán",
    billDetails: "Chi tiết gọi món ăn",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    title3: "",
    id: "Chưa xác định!",
    createAt: "",
    employee: "",
    customerFullname: "Nhập Họ và tên",
    customerPhone: "Nhập Số điện thoại",
    customerEmail: "Nhập Email",
    totalPrice: "",
    status: "Đang chờ xác nhận",
    paymentId: "Nhập Mã giao dịch",
    paymentMethod: "Chọn Phương thức thanh toán",
    paymentAt: "Chọn Thời gian thanh toán",
    paymentTotalPrice: "Nhập Số tiền thanh toán",
    paymentStatus: "Chọn Trạng thái thanh toán",
    billDetails: "",
  };
  // - Quản lý các modal
  const ManagerBillModals = {
    detail: (bill: BillSummaryResponseType) => (
      <DetailBillModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={bill}
        dataForCrud={{
          foods: foods,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateBillModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          infoLogin: infoLogin,
          paymentMethods: paymentMethods,
          foods: foods,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (bill: BillSummaryResponseType) => (
      <UpdateBillModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={bill}
        dataForCrud={{
          infoLogin: infoLogin,
          foods: foods,
        }}
        closeModal={() => closeModal()}
      />
    ),
    print: (bill: BillSummaryResponseType) => (
      <PrintBillModalComponent
        objectEN={nameEN}
        data={bill}
        closeModal={() => closeModal()}
      />
    ),
  };

  //
  const cardValues = useMemo(() => {
    let totalPrice = 0;
    let totalBill = 0;
    let totalConfirmed = 0;
    let totalCanceled = 0;
    let totalPending = 0;

    billData?.content.forEach((bill) => {
      totalPrice += bill.totalPrice ?? 0;
      totalBill++;

      switch (bill.status) {
        case BillStatusValue.confirmed:
          totalConfirmed++;
          break;
        case BillStatusValue.cancelled:
          totalCanceled++;
          break;
        case BillStatusValue.pending:
          totalPending++;
          break;
      }
    });

    return {
      totalPrice,
      totalBill,
      totalConfirmed,
      totalCanceled,
      totalPending,
    };
  }, [billData]);

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
              children: ManagerBillModals.create(),
            })
          }
        />
        <MainStatisticCardsComponent
          titles={[
            "Tổng tiền (VNĐ)",
            "Tổng số đơn",
            BillStatusValue.confirmed,
            BillStatusValue.cancelled,
            BillStatusValue.pending,
          ]}
          values={[
            cardValues.totalPrice,
            cardValues.totalBill,
            cardValues.totalConfirmed,
            cardValues.totalCanceled,
            cardValues.totalPending,
          ]}
        />
        <BillsTableComponent
          context={{
            nameEN,
            nameVN,
            isManager,
            restaurantIdForCrud,
            validActions,
            ManagerBillModals,
            openModal,
          }}
          tableKey={tableKey}
          object={nameEN}
          data={billData}
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

export default ManagerBillsPage;
