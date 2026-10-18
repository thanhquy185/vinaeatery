import ModalComponent from "../../components/shared/ModalComponent";
import MainHeaderComponent from "../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../components/admin-manager/filters/MainFilterInfoComponent";
import DetailCustomerModalComponent from "../../components/admin-manager/modal/customer/DetailCustomerModalComponent";
import CreateCustomerModalComponent from "../../components/admin-manager/modal/customer/CreateCustomerModalComponent";
import UpdateCustomerModalComponent from "../../components/admin-manager/modal/customer/UpdateCustomerModalComponent";
import LockModalComponent from "../../components/admin-manager/modal/LockModalComponent";
import ChangePasswordModalComponent from "../../components/admin-manager/modal/ChangePasswordModalComponent";
import CustomerApiService from "../../services/api/v1/CustomerApiService";
import { useState } from "react";
import { CommonStatusValue, ModalTitleValue, ModalWidthValue } from "../../constants/values";
import useModal from "../../hooks/useModal";
import CustomersTableComponent from "../../components/pages/admin/CustomersTableComponent";
import useEntityQuery from "../../hooks/useEntityQuery2";
import { actionIndexes, getActionNameEn } from "../../utils/defaultActionsUtil";
import { getFilterSelectValueToShow } from "../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../constants/props";
import type { PageResponseType } from "../../types/PageResponseType";
import type { CustomerSummaryResponseType } from "../../types/CustomerType";

const AdminCustomersPage: React.FC<AdminManagerPageProps> = ({
  nameVN,
  nameEN,
}) => {
  // Các biến giữ giá trị từ việc lọc thông tin
  // - Key
  const [tableKey, setTableKey] = useState<number>(0);
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Họ tên", value: "fullname" },
    { label: "Tên TK", value: "username" },
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
  const { data: customerData, isLoading } = useEntityQuery<
    PageResponseType<CustomerSummaryResponseType>
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
    api: CustomerApiService.handleGetSummary,
  });
  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin tài khoản",
    id: "Mã khách hàng",
    image: "Hình ảnh",
    fullname: "Họ và tên",
    birthdate: "Ngày sinh",
    gender: "Giới tính",
    phone: "Số điện thoại",
    email: "Email",
    houseNumber: "Số nhà",
    streetName: "Tên đường",
    ward: "Phường / Xã",
    province: "Tỉnh / Thành phố",
    description: "Mô tả",
    status: "Trạng thái",
    userId: "Mã tài khoản",
    userRole: "Quyền tài khoản",
    userMethod: "Phương thức tạo tài khoản",
    userStatus: "Trạng thái tài khoản",
    userUsername: "Tên tài khoản",
    userPassword: "Mật khẩu",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Chưa xác định!",
    image: "Chọn Hình ảnh",
    fullname: "Nhập Họ và tên",
    birthdate: "Chọn Ngày sinh",
    gender: "Chọn Giới tính",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    houseNumber: "Nhập Số nhà",
    streetName: "Nhập Tên đường",
    ward: "Chọn Phường / Xã",
    province: "Chọn Tỉnh / Thành phố",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
    userId: "Chưa xác định!",
    userRole: "khách hàng",
    userMethod: "Tạo tài khoản thủ công",
    userStatus: "Hoạt động",
    userUsername: "Nhập Tên tài khoản",
    userPassword: "Nhập Mật khẩu",
  };
  // - Quản lý các modal
  const AdminCustomerModals = {
    detail: (customerSummary: CustomerSummaryResponseType) => (
      <DetailCustomerModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={customerSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateCustomerModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        closeModal={() => closeModal()}
      />
    ),
    update: (customerSummary: CustomerSummaryResponseType) => (
      <UpdateCustomerModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={customerSummary}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string) => (
      <LockModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        fieldId={id}
        fieldStatus={status}
        closeModal={() => closeModal()}
      />
    ),
    lockUser: (userId: number, userStatus: string) => (
      <LockModalComponent
        objectVN="Tài khoản khách hàng"
        objectEN="users"
        objectENPrimary={nameEN}
        fieldId={userId}
        fieldStatus={userStatus}
        closeModal={() => closeModal()}
      />
    ),
    changePasswordUser: (userId: number) => (
      <ChangePasswordModalComponent
        objectVN="Tài khoản khách hàng"
        objectEN="users"
        objectENPrimary={nameEN}
        fieldId={userId}
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
              children: AdminCustomerModals.create(),
            })
          }
        />
        <CustomersTableComponent
          tableKey={tableKey}
          nameEN={nameEN}
          nameVN={nameVN}
          managerModals={AdminCustomerModals}
          openModal={openModal}
          data={customerData}
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

export default AdminCustomersPage;
