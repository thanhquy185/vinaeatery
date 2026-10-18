import useModal from "../../hooks/useModal";
import ManagersTableComponent from "../../components/pages/admin/ManagersTableComponent";
import useEntityQuery from "../../hooks/useEntityQuery2";
import ModalComponent from "../../components/shared/ModalComponent";
import MainHeaderComponent from "../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../components/admin-manager/filters/MainFilterInfoComponent";
import DetailManagerModalComponent from "../../components/admin-manager/modal/manager/DetailManagerModalComponent";
import CreateManagerModalComponent from "../../components/admin-manager/modal/manager/CreateManagerModalComponent";
import UpdateManagerModalComponent from "../../components/admin-manager/modal/manager/UpdateManagerModalComponent";
import LockModalComponent from "../../components/admin-manager/modal/LockModalComponent";
import ChangePasswordModalComponent from "../../components/admin-manager/modal/ChangePasswordModalComponent";
import ManagerApiService from "../../services/api/v1/ManagerApiService";
import { useState } from "react";
import { CommonStatusValue, ModalTitleValue, ModalWidthValue } from "../../constants/values";
import { getFilterSelectValueToShow } from "../../utils/otherEvents";
import { actionIndexes, getActionNameEn } from "../../utils/defaultActionsUtil";
import type { SelectProps } from "antd";
import type { AdminManagerPageProps } from "../../constants/props";
import type { PageResponseType } from "../../types/PageResponseType";
import type { ManagerSummaryResponseType } from "../../types/ManagerType";

const AdminManagersPage: React.FC<AdminManagerPageProps> = ({
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
  const { data: managerData, isLoading } = useEntityQuery<
    PageResponseType<ManagerSummaryResponseType>
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
    api: ManagerApiService.handleGetSummary,
  });
  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title1: "Thông tin cơ bản",
    title2: "Thông tin tài khoản",
    id: "Mã chủ nhà hàng",
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
    userRole: "Chủ nhà hàng",
    userMethod: "Tạo tài khoản thủ công",
    userStatus: "Hoạt động",
    userUsername: "Nhập Tên tài khoản",
    userPassword: "Nhập Mật khẩu",
  };
  // - Quản lý các modal
  const AdminManagerModals = {
    detail: (managerSummary: ManagerSummaryResponseType) => (
      <DetailManagerModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={managerSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateManagerModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        closeModal={() => closeModal()}
      />
    ),
    update: (managerSummary: ManagerSummaryResponseType) => (
      <UpdateManagerModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={managerSummary}
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
        objectVN="Tài khoản chủ nhà hàng"
        objectEN="users"
        objectENPrimary={nameEN}
        fieldId={userId}
        fieldStatus={userStatus}
        closeModal={() => closeModal()}
      />
    ),
    changePasswordUser: (userId: number) => (
      <ChangePasswordModalComponent
        objectVN="Tài khoản chủ nhà hàng"
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
              children: AdminManagerModals.create(),
            })
          }
        />
        <ManagersTableComponent
          tableKey={tableKey}
          nameEN={nameEN}
          nameVN={nameVN}
          managerModals={AdminManagerModals}
          openModal={openModal}
          data={managerData}
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

export default AdminManagersPage;
