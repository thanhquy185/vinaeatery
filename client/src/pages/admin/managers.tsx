import { useMemo, useState, type FC } from "react";
import { Image, Tag } from "antd";
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
import type { ManagerType, UserType } from "../../common/types";
import {
  CommonStatus,
  ModalTitleValue,
  ModalWidthValue,
  UserIsUsingValue,
  UserRoleValue,
} from "../../common/values";
import CustomModal from "../../components/common/modal";
import AdminManagerMainHeader from "../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../components/admin-manager/common/main-data";
import AdminDetailManager from "../../components/admin-manager/modal/manager/admin-detail-manager";
import AdminCreateManager from "../../components/admin-manager/modal/manager/admin-create-manager";
import AdminUpdateManager from "../../components/admin-manager/modal/manager/admin-update-manager";
import ManagerLock from "../../components/admin-manager/modal/manager-lock";
import { useModal } from "../../hook/use-modal";
import { useEntityQuery } from "../../hook/use-entity-query";
import { ImageSourcePath } from "../../common/values";
import { actionIndexes, getActionNameEn } from "../../utils/default-actions";
import { FindAllUser } from "../../requests/users";
import { FindAllManager } from "../../requests/managers";
import { getFilterSelectValueToShow } from "../../utils/other-events";

// Các giá trị chung
// - Tên đối tượng
const nameVN = "Chủ nhà hàng";
const nameEN = "managers";

// Admin Managers Page
const AdminManagersPage: FC = ({}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Biến giữ dữ liệu về Tài khoản
  const { data: users } = useEntityQuery<UserType[]>({
    keys: ["users", UserRoleValue.manager, UserIsUsingValue.notUsing],
    params: {
      roleValue: [UserRoleValue.manager],
      isUsingValue: [UserIsUsingValue.notUsing],
    },
    api: FindAllUser,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: managers,
    isLoading,
    isError,
    error,
  } = useEntityQuery<ManagerType[]>({
    keys: [nameEN],
    params: {},
    api: FindAllManager,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<ManagerType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "8%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "8%",
      render: (image: string) => (
        <Image src={image! ? image : ImageSourcePath + "no-image.png"} alt="" />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      width: "26%",
      className: "left",
      sorter: (a, b) => a?.fullname!.localeCompare(b?.fullname!),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "14%",
      sorter: (a, b) => a?.phone!.localeCompare(b?.phone!),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      sorter: (a, b) => a?.email!.localeCompare(b?.email!),
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
      render: (text: any, record: ManagerType, index: number) => (
        <>
          {
            <button
              className={"action " + getActionNameEn(actionIndexes.detail)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.detail(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: AdminManagerModals.detail(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faEye} /> */}
              <Eye />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(actionIndexes.update)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.update(nameVN.toLowerCase()),
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: AdminManagerModals.update(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
              <PenBox />
            </button>
          }
          {
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
                  children: AdminManagerModals.lock(
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
          }
        </>
      ),
    },
  ];

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "fullname" },
    { label: "SĐT", value: "phone" },
    { label: "Email", value: "email" },
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
  const filteredManagers = useMemo(() => {
    if (!managers) return [];

    return managers.filter((manager) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(manager.id).includes(value);
        }

        if (filterFindType === "fullname") {
          matchFind = manager.fullname?.toLowerCase().includes(value)!;
        }

        if (filterFindType === "phone") {
          matchFind = manager.phone?.toLowerCase().includes(value)!;
        }

        if (filterFindType === "email") {
          matchFind = manager.email?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(manager.status!);
      }

      return matchFind && matchStatus;
    });
  }, [managers, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã chủ nhà hàng",
    user: "Tài khoản",
    createAt: "Thời gian tạo",
    image: "Hình ảnh",
    fullname: "Họ và tên",
    birthday: "Ngày sinh",
    gender: "Giới tính",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title: "",
    id: "Chưa xác định!",
    user: "Chọn Tài khoản",
    createAt: "",
    image: "Chọn Hình ảnh",
    fullname: "Nhập Họ và tên",
    birthday: "Chọn Ngày sinh",
    gender: "Chọn Giới tính",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const AdminManagerModals = {
    detail: (manager: ManagerType) => (
      <AdminDetailManager
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={manager}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <AdminCreateManager
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        dataForCrud={{
          users: users,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (manager: ManagerType) => (
      <AdminUpdateManager
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={manager}
        dataForCrud={{
          users: users,
        }}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <ManagerLock
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
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredManagers || []}
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

export default AdminManagersPage;
