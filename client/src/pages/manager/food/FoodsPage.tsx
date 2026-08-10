import useModal from "../../../hooks/useModal";
import useEntityQuery from "../../../hooks/useEntityQuery2";
import useRestaurantContext from "../../../hooks/useRestaurantContext";
import ModalComponent from "../../../components/ModalComponent";
import TableRUDActionsComponent from "../../../components/TableRUDActionsComponent";
import MainHeaderComponent from "../../../components/admin-manager/MainHeaderComponent";
import MainFilterInfoComponent from "../../../components/admin-manager/MainFilterInfoComponent";
import MainDataComponent from "../../../components/admin-manager/NewMainDataComponent";
import DetailFoodModalComponent from "../../../components/admin-manager/modal/food/DetailFoodModalComponent";
import CreateFoodModalComponent from "../../../components/admin-manager/modal/food/CreateFoodModalComponent";
import UpdateRecipeModalComponent from "../../../components/admin-manager/modal/food/UpdateRecipeModalComponent";
import LockModalComponent from "../../../components/admin-manager/modal/LockModalComponent";
import CategoryFoodApiService from "../../../services/api/v1/CategoryFoodApiService";
import IngredientApiService from "../../../services/api/v1/IngredientApiService";
import FoodApiService from "../../../services/api/v1/FoodApiService";
import { useState } from "react";
import { Button, Image, InputNumber, Select, Tag } from "antd";
import {
  FoodStatusValue,
  ImageSourcePath,
  ModalTitleValue,
  ModalWidthValue,
  FoodUnitValues,
} from "../../../constants/values";
import { actionIndexes, getActionNameEn } from "../../../utils/defaultActions";
import { hasPermission } from "../../../utils/hasPermissions";
import {
  getFilterSelectValueToShow,
  vietnamMoneyFormat,
} from "../../../utils/otherEvents";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AdminManagerPageProps } from "../../../constants/props";
import type { PageResponseType } from "../../../types/PageResponseType";
import type { CategoryFoodCrudResponseType } from "../../../types/CategoryFoodType";
import type { IngredientCrudResponseType } from "../../../types/IngredientType";
import type { FoodSummaryResponseType } from "../../../types/FoodType";

const ManagerFoodsPage: React.FC<AdminManagerPageProps> = ({
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
  // - Loại món ăn
  const { data: categoryFoods } = useEntityQuery<
    CategoryFoodCrudResponseType[]
  >({
    keys: ["category-foods-crud", restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: CategoryFoodApiService.handleGetCrud,
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
  // - Key bảng
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
    { label: FoodStatusValue.active, value: FoodStatusValue.active },
    { label: FoodStatusValue.inactive, value: FoodStatusValue.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const { data: foodData, isLoading } = useEntityQuery<
    PageResponseType<FoodSummaryResponseType>
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
    api: FoodApiService.handleGetSummary,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<FoodSummaryResponseType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "16%",
      align: "center",
      render: (image: string) => (
        <Image src={image ? image : ImageSourcePath + "no-image.png"} alt="" />
      ),
    },
    {
      title: "Tên món ăn",
      dataIndex: "name",
      key: "name",
      width: "20%",
      className: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Loại món ăn",
      key: "categoryFood",
      width: "14%",
      className: "left",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại món ăn"
            options={categoryFoods?.map((categoryFood) => ({
              label: `#${categoryFood.id} - ${categoryFood.name}`,
              value: categoryFood.id,
            }))}
            style={{ width: "100%" }}
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
      onFilter: (value, record) => record.categoryFood.id === value,
      sorter: (a, b) => a.categoryFood.id - b.categoryFood.id,
      render: (record) =>
        `#${record.categoryFood.id} - ${record.categoryFood.name}`,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: "10%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Đơn vị"
            options={FoodUnitValues?.map((unit) => ({
              label: unit,
              value: unit,
            }))}
            style={{ width: "100%" }}
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
      onFilter: (value, record) => record.unit === value,
      sorter: (a, b) => a.unit!.localeCompare(b.unit!),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: "10%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        let min = 0,
          max = 0;
        if (selectedKeys[0]) {
          try {
            [min, max] = JSON.parse(selectedKeys[0] as string) as [
              number,
              number,
            ];
          } catch {}
        }

        return (
          <div style={{ padding: 8 }}>
            <InputNumber
              placeholder="Tối thiểu"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={min || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([val ?? 0, max ?? 0])]);
              }}
            />
            <InputNumber
              placeholder="Tối đa"
              style={{ marginBottom: 8, display: "block", width: "100%" }}
              value={max || undefined}
              onChange={(val) => {
                setSelectedKeys([JSON.stringify([min ?? 0, val ?? 0])]);
              }}
            />
            <Button
              type="primary"
              size="small"
              style={{ width: "100%" }}
              onClick={() => confirm()}
            >
              Lọc
            </Button>
          </div>
        );
      },
      onFilter: (value, record) => {
        if (!value) return true;
        const [min, max] = JSON.parse(value as string) as [number, number];
        const price = record.price ?? 0;
        if (min && price < min) return false;
        if (max && price > max) return false;
        return true;
      },
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => vietnamMoneyFormat(price),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: string) => (
        <Tag
          color={status === FoodStatusValue.active ? "green" : "red"}
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
      width: "10%",
      className: "buttons",
      render: (record: FoodSummaryResponseType) => (
        <TableRUDActionsComponent
          nameEN={nameEN}
          nameVN={nameVN}
          isManager={isManager}
          restaurantIdForCrud={restaurantIdForCrud}
          validActions={validActions!}
          record={record}
          modalWidth={ModalWidthValue.split3}
          managerModals={ManagerFoodModals}
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
    title1: "Thông tin cơ bản",
    title2: "Thông tin nguyên liệu",
    id: "Mã món ăn",
    image: "Hình ảnh",
    name: "Tên món ăn",
    categoryFood: "Loại món ăn",
    unit: "Đơn vị",
    price: "Giá bán (VNĐ)",
    description: "Mô tả",
    status: "Trạng thái",
    recipes: "Công thức",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title1: "",
    title2: "",
    id: "Được xác định sau khi xác nhận thêm!",
    image: "Chọn Hình ảnh",
    name: "Nhập Tên món ăn",
    categoryFood: "Chọn Loại món ăn",
    unit: "Chọn Đơn vị",
    price: "Nhập Giá bán (VNĐ)",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
    recipes: "",
  };
  // - Quản lý modal
  const ManagerFoodModals = {
    detail: (foodSummary: FoodSummaryResponseType) => (
      <DetailFoodModalComponent
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={foodSummary}
        dataForCrud={{
          ingredients: ingredients,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <CreateFoodModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          categoryFoods: categoryFoods,
          ingredients: ingredients,
          units: FoodUnitValues,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (foodSummary: FoodSummaryResponseType) => (
      <UpdateRecipeModalComponent
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={foodSummary}
        dataForCrud={{
          categoryFoods: categoryFoods,
          ingredients: ingredients,
          units: FoodUnitValues,
        }}
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
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerFoodModals.create(),
            })
          }
        />
        <MainDataComponent<FoodSummaryResponseType>
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={foodData}
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

export default ManagerFoodsPage;
