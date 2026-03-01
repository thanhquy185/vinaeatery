import { useMemo, useState, type FC } from "react";
import { Button, Select, Tag } from "antd";
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
  CategoryIngredientType,
  IngredientType,
} from "../../../common/types";
import {
  CommonStatus,
  ModalTitleValue,
  ModalWidthValue,
} from "../../../common/values";
import CustomModal from "../../../components/common/modal";
import AdminManagerMainHeader from "../../../components/admin-manager/common/main-header";
import AdminManagerMainFilterInfo from "../../../components/admin-manager/common/main-filter-info";
import AdminManagerMainData from "../../../components/admin-manager/common/main-data";
import ManagerLock from "../../../components/admin-manager/modal/manager-lock";
import { useModal } from "../../../hook/use-modal";
import { useEntityQuery } from "../../../hook/use-entity-query";
import { useRestaurantContext } from "../../../hook/use-restaurant-context";
import { FindAllCategoryIngredient } from "../../../requests/category-ingredients";
import { FindAllIngredient } from "../../../requests/ingredients";
import { actionIndexes, getActionNameEn } from "../../../utils/default-actions";
import { hasPermission } from "../../../utils/has-permissions";
import { getFilterSelectValueToShow } from "../../../utils/other-events";
import ManagerDetailIngredient from "../../../components/admin-manager/modal/ingredient/manager-detail-ingredient";
import ManagerCreateIngredient from "../../../components/admin-manager/modal/ingredient/manager-create-ingredient";
import ManagerUpdateIngredient from "../../../components/admin-manager/modal/ingredient/manager-update-ingredient";

// Các giá trị chung
// - Đơn vị
const units = [
  "mg",
  "g",
  "Lạng",
  "kg",
  "ml",
  "l",
  "Muỗng cà phê",
  "Muỗng canh",
  "Cái",
  "Quả",
  "Miếng",
  "Lát",
  "Cây",
  "Bó",
  "Tép",
  "Nhánh",
  "Viên",
  "Gói",
  "Hộp",
  "Lon",
  "Chai",
];

// Manager Ingredients Page
const ManagerIngredientsPage: FC<ManagerPageProps> = ({
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
  //   queryClient.invalidateQueries({ queryKey: ["category-ingredients"] });
  //   queryClient.invalidateQueries({ queryKey: [nameEN] });
  // }, [selectedRestaurantId]);

  // Các biến giữ dữ liệu về loại nguyên liệu
  const { data: categoryIngredients } = useEntityQuery<
    CategoryIngredientType[]
  >({
    keys: ["category-ingredients", restaurantIdForCrud, CommonStatus.active],
    params: {
      restaurantId: restaurantIdForCrud,
      statusValue: [CommonStatus.active],
    },
    api: FindAllCategoryIngredient,
  });

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Key bảng
  const [tableKey, setTableKey] = useState<number>(0);
  // - Truy vấn dữ liệu
  const {
    data: ingredients,
    isLoading,
    isError,
    error,
  } = useEntityQuery<IngredientType[]>({
    keys: [nameEN, restaurantIdForCrud],
    params: {
      restaurantId: restaurantIdForCrud,
    },
    api: FindAllIngredient,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<IngredientType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "10%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
      width: "24%",
      className: "left",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Loại nguyên liệu",
      key: "categoryIngredient",
      width: "14%",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ width: 250, padding: 8 }}>
          <Select
            allowClear
            value={selectedKeys[0]}
            placeholder="Chọn Loại nguyên liệu"
            style={{ width: "100%" }}
            options={categoryIngredients?.map((categoryIngredient) => ({
              label: `#${categoryIngredient.id} - ${categoryIngredient.name}`,
              value: categoryIngredient.id,
            }))}
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
      onFilter: (value, record) => record.categoryIngredient?.id === value,
      sorter: (a, b) => a.categoryIngredient?.id! - b.categoryIngredient?.id!,
      render: (record) =>
        `#${record.categoryIngredient?.id} - ${record.categoryIngredient?.name}`,
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
            style={{ width: "100%" }}
            options={units?.map((unit) => ({
              label: unit,
              value: unit,
            }))}
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
      title: "Định lượng",
      dataIndex: "capacity",
      key: "capacity",
      width: "10%",
      sorter: (a, b) => a?.capacity! - b?.capacity!,
    },
    {
      title: "Tồn kho",
      dataIndex: "inventory",
      key: "inventory",
      width: "12%",
      sorter: (a, b) => a?.inventory! - b?.inventory!,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      // sorter: true,
      width: "10%",
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
      width: "10%",
      className: "buttons",
      render: (text: any, record: IngredientType, index: number) => (
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
                  children: ManagerIngredientModals.detail(record),
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
                  children: ManagerIngredientModals.update(record),
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
                  children: ManagerIngredientModals.lock(
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
  const filteredIngredients = useMemo(() => {
    if (!ingredients) return [];

    return ingredients.filter((ingredient) => {
      // Theo find
      let matchFind = true;
      if (filterFindValue && filterFindValue.trim() !== "") {
        const value = filterFindValue.toLowerCase();

        if (filterFindType === "id") {
          matchFind = String(ingredient.id).includes(value);
        }

        if (filterFindType === "name") {
          matchFind = ingredient.name?.toLowerCase().includes(value)!;
        }
      }

      // Theo status
      let matchStatus = true;
      if (filterStatusValue && filterStatusValue.length > 0) {
        matchStatus = filterStatusValue.includes(ingredient.status!);
      }

      return matchFind && matchStatus;
    });
  }, [ingredients, filterFindType, filterFindValue, filterStatusValue]);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const { modal, openModal, closeModal } = useModal();
  // - Các giá trị mặc định cho nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã nguyên liệu",
    name: "Tên nguyên liệu",
    categoryIngredient: "Loại nguyên liệu",
    unit: "Đơn vị",
    capacity: "Định lượng",
    dateCreate: "Ngày sản xuất",
    dateRemove: "Hạn sử dụng",
    inputPrice: "Giá nhập (VNĐ)",
    inventory: "Tồn kho",
    note: "Ghi chú",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "Thông tin cơ bản",
    id: "Được xác định sau khi xác nhận thêm!",
    name: "Nhập Tên nguyên liệu",
    categoryIngredient: "Chọn Loại nguyên liệu",
    unit: "Chọn Đơn vị",
    capacity: "Nhập Định lượng",
    dateCreate: "Chọn Ngày sản xuất",
    dateRemove: "Chọn Hạn sử dụng",
    inputPrice: "Nhập Giá nhập (VNĐ)",
    inventory: "Chọn Tồn kho",
    note: "Nhập Ghi chú",
    status: "Chọn Trạng thái",
  };
  // - Quản lý các modal
  const ManagerIngredientModals = {
    detail: (ingredient: IngredientType) => (
      <ManagerDetailIngredient
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        data={ingredient}
        closeModal={() => closeModal()}
      />
    ),
    create: () => (
      <ManagerCreateIngredient
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        dataForCrud={{
          categoryIngredients: categoryIngredients,
          units: units,
        }}
        closeModal={() => closeModal()}
      />
    ),
    update: (ingredient: IngredientType) => (
      <ManagerUpdateIngredient
        objectVN={nameVN}
        objectEN={nameEN}
        defaultLabels={defaultLabels}
        defaultInputs={defaultInputs}
        restaurantId={restaurantIdForCrud}
        data={ingredient}
        dataForCrud={{
          categoryIngredients: categoryIngredients,
          units: units,
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
              children: ManagerIngredientModals.create(),
            })
          }
        />
        <AdminManagerMainData
          tableKey={tableKey}
          object={nameEN}
          columns={columns}
          data={filteredIngredients || []}
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

export default ManagerIngredientsPage;
