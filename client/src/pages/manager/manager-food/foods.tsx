import {
  useMemo,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import { Button, Image, InputNumber, Select, Tag } from "antd";
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
import type { ManagerPageProps } from "../../../common/props";
import type {
  CategoryFoodType,
  FoodType,
  RecipeType,
} from "../../../common/types";
import {
  CommonStatus,
  FoodStatus,
  ImageSourcePath,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerDetailFood from "../../../components/admin-manager/modal/food/manager-detail-food";
import ManagerCreateFood from "../../../components/admin-manager/modal/food/manager-create-food";
import ManagerUpdateFood from "../../../components/admin-manager/modal/food/manager-update-food";
import ManagerLock from "../../../components/admin-manager/modal/manager-lock";
import ManagerCreateRecipe from "../../../components/admin-manager/modal/recipe/manager-create-recipe";
import ManagerDeleteRecipe from "../../../components/admin-manager/modal/recipe/manager-delete-recipe";
import { useModal } from "../../../hook/use-modal";
import { useSecondModal } from "../../../hook/use-second-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllCategoryFood } from "../../../requests/category-foods";
import { FindAllFood } from "../../../requests/foods";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import {
  getFilterSelectValueToShow,
  vietnamMoneyFormat,
} from "../../../utils/other-events";

// Các giá trị chung
// - Kiểu dữ liệu của tham số khi xử lý bảng công thức
export interface RecipeTableProps {
  recipes?: RecipeType[];
  setRecipes?: Dispatch<SetStateAction<RecipeType[]>>;
}
// - Kích thước bảng công thức
const recipeTableWidth = ["14%", "29%", "19%", "38%"];
// - Tiêu đề bảng công thức
const recipeTableTitle = [
  "Mã nguyên liệu",
  "Tên nguyên liệu",
  "Số lượng",
  "Ghi chú",
];
// - Thuộc tính csdl bảng công thức
const recipeTableAttributes = [
  "ingredientId",
  "ingredientName",
  "quantity",
  "note",
];
// - Định dạng bảng công thức
const recipeTableFormat = ["", "", "", "left"];
// - Đơn vị
const units = [
  "Phần",
  "Suất",
  "Dĩa",
  "Tô",
  "Bát",
  "Chén",
  "Nồi",
  "Đĩa",
  "Thố",
  "Khẩu phần",
  "Set",
  "Combo",
  "Món",
];

// Manager Foods Page
const ManagerFoodsPage: FC<ManagerPageProps> = ({
  infoLogin,
  functionId,
  nameVN,
  nameEN,
}) => {
  // // Đối tượng query client để thực thi react-query
  // const queryClient = useQueryClient();

  // Có là chủ nhà hàng đăng nhập
  // Thông tin: có phải quản lý ?, mã nhà hàng quản lý đã chọn ?, danh sách chức năng nhân viên có thể thực hiện
  const { isManager, validActions, restaurantIdForCrud } = useRestaurantContext(
    { infoLogin, functionId },
  );
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ["category-foods"] });
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các biến giữ dữ liệu về loại món ăn
  const { data: categoryFoods } = useEntityQuery<CategoryFoodType[]>({
    keys: ["category-foods", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllCategoryFood,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: foods,
    isLoading,
    isError,
    error,
  } = useEntityQuery<FoodType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllFood,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<FoodType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "15%",
      align: "center",
      render: (image: string) => (
        <Image src={image! ? image : ImageSourcePath + "no-image.png"} alt="" />
      ),
    },
    {
      title: "Tên món ăn",
      dataIndex: "name",
      key: "name",
      width: "20%",
      className: "left",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Loại món ăn",
      key: "categoryFood",
      width: "15%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại món ăn"
            options={categoryFoods?.map((categoryFood) => ({
              label: `#${categoryFood?.id} - ${categoryFood?.name}`,
              value: categoryFood?.id,
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
      onFilter: (value, record) => record.categoryFood?.id === value,
      sorter: (a, b) => a.categoryFood?.id! - b.categoryFood?.id!,
      render: (record) =>
        `#${record.categoryFood?.id} - ${record.categoryFood?.name}`,
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
            options={units?.map((unit) => ({
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
      sorter: (a, b) => a?.unit!.localeCompare(b?.unit!),
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: "10%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
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
            {/* <Button
              size="small"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Đặt lại
            </Button> */}
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
      sorter: (a, b) => a?.price! - b?.price!,
      render: (price: number) => vietnamMoneyFormat(price || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      // sorter: true,
      width: "10%",
      render: (status: string) => (
        <Tag color={status === FoodStatus.active ? "green" : "red"}>
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
      render: (text: any, record: FoodType, index: number) => (
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
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.detail,
                  )} ${nameEN}`,
                  children: ManagerFoodModals.detail(record),
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
                  width: ModalWidthValue.split3,
                  className: `${getActionNameEn(
                    actionIndexes.update,
                  )} ${nameEN}`,
                  children: ManagerFoodModals.update(record),
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
                    record.status == FoodStatus.active
                      ? ModalTitleValue.lock(nameVN.toLowerCase())
                      : ModalTitleValue.unlock(nameVN.toLowerCase()),
                  width: ModalWidthValue.lock,
                  className: `${getActionNameEn(actionIndexes.lock)} ${nameEN}`,
                  children: ManagerFoodModals.lock(
                    record?.id as number,
                    record?.status!,
                  ),
                })
              }
            >
              {/* <FontAwesomeIcon
                icon={record.status == FoodStatus.active ? faLock : faUnlock}
              /> */}
              {record.status == FoodStatus.active ? <Lock /> : <Unlock />}
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
    { label: FoodStatus.active, value: FoodStatus.active },
    { label: FoodStatus.inactive, value: FoodStatus.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null,
  );
  // - Lọc dữ liệu
  const filteredFoods = useMemo(() => {
    if (!foods) return [];

    return foods.filter((food) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(food.id).includes(value);
        }

        if (filterFindType === "name") {
          matchFind = food.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(food.status!);
      }

      return matchFind && matchStatus;
    });
  }, [foods, filterFindType, filterFindValue, filterStatusValue]);

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
    recipe: "Công thức",
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
    recipe: "",
  };
  // - Quản lý modal
  const ManagerFoodModals = {
    detail: (food: FoodType) => (
      <ManagerDetailFood
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        data={food}
        dataForCrud={{
          recipes: food?.recipe,
        }}
        tableNoActionsFormat={{
          widths: recipeTableWidth,
          columns: recipeTableTitle,
          attributes: recipeTableAttributes,
          format: recipeTableFormat,
        }}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateFood
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          categoryFoods: categoryFoods,
          units: units,
        }}
        tableNoActionsFormat={{
          widths: recipeTableWidth,
          columns: recipeTableTitle,
          attributes: recipeTableAttributes,
          format: recipeTableFormat,
        }}
        modalForCrud={{
          recipes: {
            openModalCreate: ({ recipes, setRecipes }: RecipeTableProps) =>
              openSecondModal({
                title: "Thêm nguyên liệu",
                width: ModalWidthValue.split2,
                className: "secondary recipe",
                children: ManagerRecipeModals.create({
                  recipes: recipes,
                  setRecipes: setRecipes,
                }),
              }),
            openModalDelete: ({ recipes, setRecipes }: RecipeTableProps) =>
              openSecondModal({
                title: "Xoá nguyên liệu",
                width: ModalWidthValue.split2,
                className: "secondary recipe",
                children: ManagerRecipeModals.delete({
                  recipes: recipes,
                  setRecipes: setRecipes,
                }),
              }),
          },
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (food: FoodType) => (
      <ManagerUpdateFood
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={food}
        dataForCrud={{
          categoryFoods: categoryFoods,
          units: units,
        }}
        tableNoActionsFormat={{
          widths: recipeTableWidth,
          columns: recipeTableTitle,
          attributes: recipeTableAttributes,
          format: recipeTableFormat,
        }}
        modalForCrud={{
          recipes: {
            openModalCreate: ({ recipes, setRecipes }: RecipeTableProps) =>
              openSecondModal({
                title: "Thêm nguyên liệu",
                width: ModalWidthValue.split2,
                className: "secondary recipe",
                children: ManagerRecipeModals.create({
                  recipes: recipes,
                  setRecipes: setRecipes,
                }),
              }),
            openModalDelete: ({ recipes, setRecipes }: RecipeTableProps) =>
              openSecondModal({
                title: "Xoá nguyên liệu",
                width: ModalWidthValue.split2,
                className: "secondary recipe",
                children: ManagerRecipeModals.delete({
                  recipes: recipes,
                  setRecipes: setRecipes,
                }),
              }),
          },
        }}
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

  // Các thành phần giữ giá trị cho việc hiển thị modal thứ 2
  // - Các biến
  const { secondModal, openSecondModal, closeSecondModal } = useSecondModal();
  // - Các giá trị mặc định cho nhãn
  const defaultSecondLabels = {
    title: "Thông tin nguyên liệu",
    ingredientCreate:
      "Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Loại nguyên liệu - Định lượng & Đơn vị)",
    ingredientDelete:
      "Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Số lượng - Ghi chú)",
    quantity: "Số lượng",
    note: "Ghi chú",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultSecondInputs = {
    title: "Thông tin nguyên liệu",
    ingredientCreate:
      "Chọn Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Loại nguyên liệu - Định lượng & Đơn vị)",
    ingredientDelete:
      "Chọn Nguyên liệu (Mã nguyên liệu - Tên nguyên liệu - Số lượng - Ghi chú)",
    quantity: "Nhập Số lượng",
    note: "Nhập Ghi chú",
  };
  // - Quản lý các modal
  const ManagerRecipeModals = {
    create: ({ recipes, setRecipes }: RecipeTableProps) => (
      <ManagerCreateRecipe
        objectEN=""
        defaultLabels={defaultSecondLabels}
        defaultInputs={defaultSecondInputs}
        restaurantId={restaurantIdForCrud}
        recipes={recipes}
        setRecipes={setRecipes}
        closeModal={() => closeSecondModal()}
      />
    ),
    delete: ({ recipes, setRecipes }: RecipeTableProps) => (
      <ManagerDeleteRecipe
        objectEN=""
        defaultLabels={defaultSecondLabels}
        defaultInputs={defaultSecondInputs}
        restaurantId={restaurantIdForCrud}
        recipes={recipes}
        setRecipes={setRecipes}
        closeModal={() => closeSecondModal()}
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
              width: ModalWidthValue.split3,
              className: `${getActionNameEn(actionIndexes.create)} ${nameEN}`,
              children: ManagerFoodModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredFoods || []}
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
      {secondModal.open && (
        <CustomModal
          title={secondModal.title}
          open={secondModal.open}
          width={secondModal.width}
          className={secondModal.className}
          children={secondModal.children}
          setCloseModal={() => closeSecondModal()}
        />
      )}
    </>
  );
};

export default ManagerFoodsPage;
