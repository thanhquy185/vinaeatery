import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/ModalComponent";
import TableRUDActionsComponent from "../../../components/TableRUDActionsComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/MainFilterInfoComponent";
import MainDataComponent from "../../../components/admin-manager/NewMainDataComponent";
import DetailCategoryFoodModalComponent from "../../../components/admin-manager/modal/category-food/DetailCategoryFoodModalComponent";
import CreateCategoryFoodModalComponent from "../../../components/admin-manager/modal/category-food/CreateCategoryFoodModalComponent";
import UpdateCategoryFoodModalComponent from "../../../components/admin-manager/modal/category-food/UpdateCategoryFoodModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import CategoryFoodApiService from "../../../services/api/v1/CategoryFoodApiService";
import { useState } from "react";
import { Image, Tag } from "antd";
import {
  CommonStatusValue,
  ImageSourcePath,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../constants/values";
import {
  actionIndexes,
  getActionNameEn,
} from "../../../utils/defaultActionsUtil";
import { hasPermission } from "../../../utils/hasPermissionsUtil";
import { getFilterSelectValueToShow } from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { CategoryFoodSummaryResponseType } from "../../../types/CategoryFoodType";

const ManagerCategoryFoodsPage: React.FC<AdminManagerPageProps> = ({
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
    { label: "Tên", value: "name" },
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
  const { data: categoryFoodData, isLoading } = useEntityQuery<
    PageResponseType<CategoryFoodSummaryResponseType>
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
    api: CategoryFoodApiService.handleGetSummary,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<CategoryFoodSummaryResponseType> = [
    {
      title: "",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: "20%",
      render: (imageUrl: string) => (
        <Image src={imageUrl ?? ImageSourcePath + "no-image.png"} alt="" />
      ),
    },
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "14%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên loại món ăn",
      dataIndex: "name",
      key: "name",
      width: "40%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status: string) => (
        <Tag
          color={status === CommonStatusValue.active ? "green" : "red"}
          bordered={false}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "16%",
      className: "buttons",
      render: (record: CategoryFoodSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split2}
          managerModals={ManagerCategoryFoodModals}
          openModal={openModal}
        />
      ),
    },
  ];

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã loại món ăn",
    image: "Hình ảnh",
    name: "Tên loại món ăn",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm!",
    image: "Chọn Hình ảnh",
    name: "Nhập Tên loại món ăn",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerCategoryFoodModals = {
    detail: (categoryFoodSummary: CategoryFoodSummaryResponseType) => (
      <DetailCategoryFoodModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={categoryFoodSummary}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateCategoryFoodModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        closeModal={() => closeModal()}
      />
    ),
    update: (categoryFoodSummary: CategoryFoodSummaryResponseType) => (
      <UpdateCategoryFoodModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={categoryFoodSummary}
        closeModal={() => closeModal()}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockModalComponent
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
              width: ModalWidthValue.split2,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerCategoryFoodModals.create(),
            })
          }
        />
        <MainDataComponent<CategoryFoodSummaryResponseType>
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={categoryFoodData}
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

export default ManagerCategoryFoodsPage;
