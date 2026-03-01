import { useMemo, useState, type FC } from "react";
import { Button, Select, Tag, type SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye, Lock, PenBox, Unlock } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faLock,
//   faPenToSquare,
//   faUnlock,
// } from "@fortawesome/free-solid-svg-icons";
import type { ManagerPageProps } from "../../../common/props";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import type { CategoryRewardPunishType } from "../../../common/types";
import {
  CategoryRewardPunishHandle,
  CommonStatus,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailCategoryRewardPunish from "../../../components/admin-manager/modal/category-reward-punish/manager-detail-category-reward-punish";
import ManagerCreateCategoryRewardPunish from "../../../components/admin-manager/modal/category-reward-punish/manager-create-category-reward-punish";
import ManagerUpdateCategoryRewardPunish from "../../../components/admin-manager/modal/category-reward-punish/manager-update-category-reward";
import ManagerLock from "../../../components/admin-manager/modal/manager-lock";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllCategoryRewardPunish } from "../../../requests/category-reward-punishes";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { getFilterSelectValueToShow } from "../../../utils/other-events";

// Manager Category Reward Punishes Page
const ManagerCategoryRewardPunishesPage: FC<ManagerPageProps> = ({
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
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: categoryRewardPunishes,
    isLoading,
    isError,
    error,
  } = useEntityQuery<CategoryRewardPunishType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllCategoryRewardPunish,
  });
  // - Các thuộc tính
  const columns: ColumnsType<CategoryRewardPunishType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "14%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên loại thưởng - phạt",
      dataIndex: "name",
      key: "name",
      width: "40%",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Xử lý",
      dataIndex: "handle",
      key: "handle",
      width: "18%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Đơn vị"
            style={{ width: "100%" }}
            options={[
              {
                label: CategoryRewardPunishHandle.reward,
                value: CategoryRewardPunishHandle.reward,
              },
              {
                label: CategoryRewardPunishHandle.punish,
                value: CategoryRewardPunishHandle.punish,
              },
            ]}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          ></Select>
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => confirm()}
          >
            Lọc
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.handle === value,
      sorter: (a, b) => a?.handle!.localeCompare(b?.handle!),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "14%",
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
      width: "14%",
      className: "buttons",
      render: (text: any, record: CategoryRewardPunishType, index: number) => (
        <>
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.detail,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.detail)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.detail(nameVN.toLowerCase()),
                  width: ModalWidthValue.split2,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: ManagerCategoryRewardPunishModals.detail(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faEye} /> */}
              <Eye />
            </button>
          )}
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.update,
          }) && (
            <button
              className={"action " + getActionNameEn(actionIndexes.update)}
              onClick={() =>
                openModal({
                  title: ModalTitleValue.update(nameVN.toLowerCase()),
                  width: ModalWidthValue.split2,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: ManagerCategoryRewardPunishModals.update(record),
                })
              }
            >
              {/* <FontAwesomeIcon icon={faPenToSquare} /> */}
              <PenBox />
            </button>
          )}
          {hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.lock,
          }) && (
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
                  children: ManagerCategoryRewardPunishModals.lock(
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
          )}
        </>
      ),
    },
  ];

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "name" },
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
  const filteredCategoryRewardPunishes = useMemo(() => {
    if (!categoryRewardPunishes) return [];

    return categoryRewardPunishes.filter((categoryRewardPunish) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(categoryRewardPunish.id).includes(value);
        }

        if (filterFindType === "name") {
          matchFind = categoryRewardPunish.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(categoryRewardPunish.status!);
      }

      return matchFind && matchStatus;
    });
  }, [
    categoryRewardPunishes,
    filterFindType,
    filterFindValue,
    filterStatusValue,
  ]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã loại thưởng - phạt",
    name: "Tên loại thưởng - phạt",
    handle: "Xử lý",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm!",
    name: "Nhập Tên loại thưởng - phạt",
    handle: "Chọn Xử lý",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerCategoryRewardPunishModals = {
    detail: (categoryRewardPunish: CategoryRewardPunishType) => (
      <ManagerDetailCategoryRewardPunish
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={categoryRewardPunish}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateCategoryRewardPunish
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        closeModal={() => closeModal()}
      />
    ),
    update: (categoryRewardPunish: CategoryRewardPunishType) => (
      <ManagerUpdateCategoryRewardPunish
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={categoryRewardPunish}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <ManagerLock
        objectVN={nameVN}
        objectEN={nameEN}
        restaurantId={restaurantIdForCrud}
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
          isShowFilterCreate={hasPermission({
            isManager,
            restaurantIdForCrud,
            validActions,
            requiredActionId: actionIndexes.create,
          })}
          onClickFilterCreate={() =>
            openModal({
              title: ModalTitleValue.create(nameVN.toLowerCase()),
              width: ModalWidthValue.split2,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerCategoryRewardPunishModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredCategoryRewardPunishes || []}
          //   isLoading={isLoading}
          isLoading={false}
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

export default ManagerCategoryRewardPunishesPage;
