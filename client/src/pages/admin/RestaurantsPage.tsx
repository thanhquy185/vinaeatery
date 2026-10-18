import useModal from "../../hooks/useModal";
import RestaurantsTableComponent from "../../components/pages/admin/RestaurantsTableComponent";
import useEntityQuery from "../../hooks/useEntityQuery2";
import ModalComponent from "../../components/shared/ModalComponent";
import MainHeaderComponent from "../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../components/admin-manager/filters/MainFilterInfoComponent";
import DetailRestaurantModalComponent from "../../components/admin-manager/modal/restaurant/DetailRestaurantModalComponent";
import CreateRestaurantModalComponent from "../../components/admin-manager/modal/restaurant/CreateRestaurantModalComponent";
import UpdateRestaurantModalComponent from "../../components/admin-manager/modal/restaurant/UpdateRestaurantModalComponent";
import LockModalComponent from "../../components/admin-manager/modal/LockModalComponent";
import RestaurantApiService from "../../services/api/v1/RestaurantApiService";
import ManagerApiService from "../../services/api/v1/ManagerApiService";
import { useState } from "react";
import {
  CommonStatusValue,
  ModalTitleValue,
  ModalWidthValue,
} from "../../constants/values";
import { actionIndexes, getActionNameEn } from "../../utils/defaultActionsUtil";
import { getFilterSelectValueToShow } from "../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { ManagerCrudResponseType } from "../../types/ManagerType";
import type { AdminManagerPageProps } from "../../constants/props";
import type { PageResponseType } from "../../types/PageResponseType";
import type { RestaurantSummaryResponseType } from "../../types/RestaurantType";

const AdminRestaurantsPage: React.FC<AdminManagerPageProps> = ({
  nameVN,
  nameEN,
}) => {
  // Biến giữ dữ liệu về Chủ nhà hàng
  const { data: managers } = useEntityQuery<ManagerCrudResponseType[]>({
    keys: ["managers-crud"],
    params: {},
    api: ManagerApiService.handleGetCrud,
  });

  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "name" },
    { label: "SĐT", value: "phone" },
    { label: "Email", value: "email" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value,
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatusValue.active, value: CommonStatusValue.active },
    { label: CommonStatusValue.inactive, value: CommonStatusValue.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: restaurantData, isLoading } = useEntityQuery<
    PageResponseType<RestaurantSummaryResponseType>
  >({
    keys: [
      nameEN,
      page,
      size,
      filterFindType,
      filterFindValue,
      filterStatusValue,
    ],
    params: {
      page: page,
      size: size,
      findType: filterFindType!,
      findValue: filterFindValue!,
      statusValue: filterStatusValue!,
    },
    api: RestaurantApiService.handleGetSummary,
  });
  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin quản lý",
    title3: "Thông tin địa chỉ",
    id: "Mã nhà hàng",
    manager: "Chủ nhà hàng",
    images: "Hình ảnh",
    name: "Tên nhà hàng",
    phone: "Số điện thoại",
    email: "Email",
    latitude: "Vĩ độ",
    longitude: "Kinh độ",
    houseNumber: "Số nhà",
    streetName: "Tên đường",
    ward: "Phường / Xã",
    province: "Tỉnh / Thành phố",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    title3: "",
    id: "Chưa xác định!",
    manager: "Chọn Chủ nhà hàng",
    images: "Hình ảnh",
    name: "Nhập Tên nhà hàng",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    latitude: "Nhập Vĩ độ",
    longitude: "Nhập Kinh độ",
    houseNumber: "Nhập Số nhà",
    streetName: "Nhập Tên đường",
    ward: "Chọn Phường / Xã",
    province: "Chọn Tỉnh / Thành phố",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const AdminRestaurantModals = {
    detail: (restaurantSummary: RestaurantSummaryResponseType) => (
      <DetailRestaurantModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={restaurantSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateRestaurantModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        dataForCrud={{
          managers: managers,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (restaurantSummary: RestaurantSummaryResponseType) => (
      <UpdateRestaurantModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={restaurantSummary}
        dataForCrud={{
          managers: managers,
        }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        fieldId={id}
        fieldStatus={status}
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
          isShowFilterCreate={true}
          onClickFilterCreate={() =>
            openModal({
              title: ModalTitleValue.create(nameVN.toLowerCase()),
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: AdminRestaurantModals.create(),
            })
          }
        />
        <RestaurantsTableComponent
          tableKey={tableKey}
          nameEN={nameEN}
          nameVN={nameVN}
          managers={managers}
          managerModals={AdminRestaurantModals}
          openModal={openModal}
          data={restaurantData}
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

export default AdminRestaurantsPage;
