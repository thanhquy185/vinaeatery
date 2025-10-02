import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Image, Input, InputNumber, Select, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { SelectProps } from "antd";
import type { RcFile } from "antd/es/upload";
import type { ColumnsType } from "antd/es/table";
import type {
  FoodsFormatType,
  FoodsType,
  ReactQueryMutationProps,
  RecipesFormatType,
} from "../../../common/types";
import {
  CommonStatus,
  FoodStatus,
  ReactQueryGetData,
  TitleModalCommon,
} from "../../../common/values";
import { ruleRequired } from "../../../common/rules";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomUpload from "../../../components/admin/upload";
import CustomTableNoActions from "../../../components/admin/table-no-actions";
import CustomModal from "../../../components/admin/modal";
import {
  FindAllCategoryFood,
  FindAllFood,
  FindAllIngredient,
  HandleCreateFood,
  HandleLockFood,
  HandleUpdateFood,
} from "../../../services/api";
import { getActionsString } from "../../../services/employee-login";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";
import {
  getActionNameEn,
  getActionNameVn,
} from "../../../services/default-actions";

const { Option } = Select;

// Các giá trị chung
// - Tên đối tượng
const objectName = "Món ăn";
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());
// - Kiểu dữ liệu của tham số khi xử lý bảng công thức
interface RecipeTableProps {
  recipe?: RecipesFormatType[];
  setRecipe?: Dispatch<SetStateAction<RecipesFormatType[]>>;
}
// - Kích thước bảng công thức
const recipeTableWidth = ["10%", "25%", "15%", "35%", "15%"];
// - Tiêu đề bảng công thức
const recipeTableTitle = [
  "Mã nguyên liệu",
  "Tên nguyên liệu",
  "Số lượng",
  "Ghi chú",
  "Tồn kho",
];
// - Thuộc tính csdl bảng công thức
const recipeTableAttributes = [
  "ingredientId",
  "ingredientName",
  "quantity",
  "note",
  "ingredientInventory",
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

// Admin Foods Page
const AdminFoodsPage = ({ functionId }: { functionId: number }) => {
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId });

  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Các biến giữ dữ liệu về loại món ăn
  const { data: categoryFoods } = useQuery({
    queryKey: ["category-foods"],
    queryFn: async () => {
      const res = await FindAllCategoryFood({
        statusValue: [CommonStatus.active],
      });
      if (res.status === 200) {
        return res.data;
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw res;
      }
    },
  });

  // Các biến giữ giá trị từ việc lọc thông tin
  // - Tìm kiếm thông tin
  const findOptions = [
    { label: "#", value: "id" },
    { label: "Tên", value: "name" },
  ];
  const [filterFindType, setFilterFindType] = useState<string | null>(
    findOptions[0].value
  );
  const [filterFindValue, setFilterFindValue] = useState<string | null>(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: FoodStatus["active"], value: FoodStatus["active"] },
    { label: FoodStatus["inactive"], value: FoodStatus["inactive"] },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: foods,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["foods", filterFindType, filterFindValue, filterStatusValue],
    queryFn: async () => {
      const res = await FindAllFood({
        findType: filterFindType!,
        findValue: filterFindValue!,
        statusValue: filterStatusValue!,
      });
      if (res.status === 200) {
        return res.data;
      } else {
        openNotification({
          type: "error",
          message: "Truy vấn dữ liệu thất bại",
          description: String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
          duration: 2,
        });

        throw res;
      }
    },
    enabled: !!filterFindType, //
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<FoodsFormatType> = [
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
        <Image
          src={
            image!
              ? "/src/assets/images/foods/" + image
              : "/src/assets/images/others/no-image.png"
          }
          alt=""
        />
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
            style={{ width: "100%" }}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          >
            {categoryFoods?.map((categoryFood) => (
              <Option key={categoryFood.id} value={categoryFood.id}>
                #{categoryFood.id} - {categoryFood.name}
              </Option>
            ))}
          </Select>
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
            style={{ width: "100%" }}
            onChange={(val) => setSelectedKeys(val ? [val] : [])}
          >
            {units?.map((unit) => (
              <Option key={unit} value={unit}>
                {unit}
              </Option>
            ))}
          </Select>
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
              number
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
        <Tag color={status === FoodStatus["active"] ? "green" : "red"}>
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
      render: (text: any, record: FoodsFormatType, index: number) => (
        <>
          {validActions?.includes(getActionNameVn(0)) && (
            <button
              className={"action " + getActionNameEn(0)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalDetail,
                  true,
                  "89%",
                  getActionNameEn(0) + " foods",
                  AdminFoodsModal.detail(record)
                )
              }
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </button>
          )}
          {validActions?.includes(getActionNameVn(2)) && (
            <button
              className={"action " + getActionNameEn(2)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalUpdate,
                  true,
                  "89%",
                  getActionNameEn(2) + " foods",
                  AdminFoodsModal.update(record)
                )
              }
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
          {validActions?.includes(getActionNameVn(3)) && (
            <button
              className={"action " + getActionNameEn(3)}
              onClick={() =>
                updatePropertiesModal(
                  record.status == CommonStatus["active"]
                    ? titleModalLock
                    : titleModalUnlock,
                  true,
                  "30%",
                  getActionNameEn(3) + " foods",
                  AdminFoodsModal.lock(record!.id as number, record!.status)
                )
              }
            >
              <FontAwesomeIcon
                icon={
                  record.status == CommonStatus["active"] ? faLock : faUnlock
                }
              />
            </button>
          )}
        </>
      ),
    },
  ];

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [childrenModal, setChildrenModal] = useState<ReactNode>();
  // - Hàm cập nhật
  const updatePropertiesModal = (
    titleModal: string,
    openModal: boolean,
    widthModal: string,
    classNameModal: string,
    childrenModal: ReactNode
  ) => {
    setTitleModal(titleModal);
    setOpenModal(openModal);
    setWidthModal(widthModal);
    setClassNameModal(classNameModal);
    setChildrenModal(childrenModal);
  };
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
    id: "Được xác định sau khi xác nhận thêm !",
    image: "Chọn Hình ảnh",
    name: "Nhập Tên món ăn",
    categoryFood: "Chọn Loại món ăn",
    unit: "Chọn Đơn vị",
    price: "Nhập Giá bán (VNĐ)",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
    recipe: "",
  };
  // - Mutation cho việc thêm, cập nhật và khoá dữ liệu
  const handleSubmitMutation = useMutation({
    mutationFn: async ({
      type,
      values,
      objectId,
      imageFile,
      details,
    }: ReactQueryMutationProps<FoodsType>) => {
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          const res = await HandleCreateFood({
            name: values!.name || undefined,
            image: imageFile! || undefined,
            categoryFoodId: values!.categoryFoodId || undefined,
            unit: values!.unit || undefined,
            price: values!.price || undefined,
            description: values!.description || undefined,
            status: values!.status || undefined,
            recipe: details || [],
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          const res = await HandleUpdateFood({
            id: values!.id,
            name: values!.name || undefined,
            image: imageFile! || undefined,
            categoryFoodId: values!.categoryFoodId || undefined,
            unit: values!.unit || undefined,
            price: values!.price || undefined,
            description: values!.description || undefined,
            timeUpdate: new Date().toISOString(),
            recipe: details! || [],
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        } else if (
          (type === "lock" && titleModal === titleModalLock) ||
          (type === "unlock" && titleModal === titleModalUnlock)
        ) {
          const res = await HandleLockFood({
            id: objectId! as number,
            status:
              (type === "lock" ? FoodStatus.active : FoodStatus.inactive) ||
              undefined,
            timeUpdate: new Date().toISOString(),
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        }
      }
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Thành công",
        description:
          (openModal
            ? titleModal === titleModalCreate
              ? "Thêm"
              : titleModal === titleModalUpdate
              ? "Cập nhật"
              : titleModal === titleModalLock
              ? "Khoá"
              : "Mở khoá"
            : "") + " thành công!",
        duration: 1.5,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["foods"] });
        setOpenModal(false);
      }, 1500);
    },
    onError: () => {
      openNotification({
        type: "error",
        message: "Thất bại",
        description:
          (openModal
            ? titleModal === titleModalCreate
              ? "Thêm"
              : titleModal === titleModalUpdate
              ? "Cập nhật"
              : titleModal === titleModalLock
              ? "Khoá"
              : "Mở khoá"
            : "") + " thất bại!",
        duration: 1.5,
      });

      setTimeout(() => {}, 1500);
    },
  });
  // - Các modal tương ứng cho từng chức năng
  const DetailFoods = ({
    id,
    image,
    name,
    categoryFood,
    unit,
    price,
    description,
    status,
    recipe,
  }: FoodsFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            // image:
            //   "/src/assets/images/" +
            //   (image! ? "foods/" + image! : "others/no-image.png"),
            name: name!,
            categoryFood: "#" + categoryFood!.id + " - " + categoryFood!.name,
            unit: unit!,
            price: price!,
            description: description!,
            status: status!,
          }}
          className="modal__form split-3"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["image"]}
                className="modal__form-group-item margin-bottom-0"
              >
                <CustomUpload
                  defaultSrc={image! as string}
                  alt="image-preview"
                  imageClassName="image-preview"
                  imageCategoryName="foods"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs["image"]}
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="categoryFood"
                label={defaultLabels["categoryFood"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="unit"
                  label={defaultLabels["unit"]}
                  className="modal__form-group-item"
                >
                  <Select disabled={true} />
                </Form.Item>
                <Form.Item
                  name="price"
                  label={defaultLabels["price"]}
                  className="modal__form-group-item"
                >
                  <InputNumber value={price!} disabled={true} />
                </Form.Item>
              </div>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                className="modal__form-group-item"
              >
                <TextArea className="multiple-2" disabled={true} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["recipe"]}
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <CustomTableNoActions
                  className="recipe"
                  columnWidths={recipeTableWidth}
                  columnTitles={recipeTableTitle}
                  data={recipe!}
                  attributes={recipeTableAttributes}
                  format={recipeTableFormat}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateFoods = () => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();
    const [recipe, setRecipe] = useState<RecipesFormatType[]>([]);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form split-3"
          autoComplete="off"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              handleSubmitMutation.mutate({
                type: "create",
                values: values,
                imageFile: imageFile,
                details: recipe,
              });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["image"]}
                htmlFor="create-image"
                className="modal__form-group-item"
              >
                <CustomUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  htmlFor="create-image"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs["image"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input
                  className="text-center"
                  placeholder={defaultInputs["id"]}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="create-name"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Tên món ăn không được để trống !")]}
              >
                <Input id="create-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
              <Form.Item
                name="categoryFoodId"
                label={defaultLabels["categoryFood"]}
                htmlFor="create-category"
                className="modal__form-group-item"
                rules={[ruleRequired("Loại món ăn không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="create-category"
                  placeholder={defaultInputs["categoryFood"]}
                  options={categoryFoods!.map((categoryFood) => ({
                    label: `#${categoryFood.id} - ${categoryFood.name}`,
                    value: categoryFood.id,
                  }))}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="unit"
                  label={defaultLabels["unit"]}
                  htmlFor="create-unit"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Đơn vị !")]}
                >
                  <Select
                    showSearch={true}
                    allowClear={true}
                    id="create-unit"
                    placeholder={defaultInputs["unit"]}
                    options={units!.map((unit) => ({
                      label: unit,
                      value: unit,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="price"
                  label={defaultLabels["price"]}
                  htmlFor="create-price"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần nhập Giá bán !")]}
                >
                  <InputNumber
                    min={1}
                    id="create-price"
                    placeholder={defaultInputs["price"]}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                htmlFor="create-status"
                className="modal__form-group-item"
                rules={[ruleRequired("Trạng thái không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="create-status"
                  placeholder={defaultInputs["status"]}
                  options={[
                    {
                      label: FoodStatus["active"],
                      value: FoodStatus["active"],
                    },
                    {
                      label: FoodStatus["inactive"],
                      value: FoodStatus["inactive"],
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                htmlFor="create-description"
                className="modal__form-group-item"
              >
                <TextArea
                  id="create-description"
                  className="multiple-2"
                  placeholder={defaultInputs["description"]}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["recipe"]}
                htmlFor="create-recipe"
                className="modal__form-group-item multiple-3"
              >
                <CustomTableNoActions
                  id="create-recipe"
                  className="recipe"
                  columnWidths={recipeTableWidth}
                  columnTitles={recipeTableTitle}
                  data={recipe}
                  attributes={recipeTableAttributes}
                  format={recipeTableFormat}
                />
                <div className="buttons">
                  <button
                    type="button"
                    className="btn secondary-btn margin-r"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Xoá nguyên liệu",
                        true,
                        "60%",
                        "secondary recipes",
                        AdminRecipesModal.delete({
                          recipe,
                          setRecipe,
                        })
                      )
                    }
                  >
                    Xoá nguyên liệu
                  </button>
                  <button
                    type="button"
                    className="btn secondary-btn"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Thêm nguyên liệu",
                        true,
                        "60%",
                        "secondary recipes",
                        AdminRecipesModal.create({
                          recipe,
                          setRecipe,
                        })
                      )
                    }
                  >
                    Thêm nguyên liệu
                  </button>
                </div>
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn create">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const UpdateFoods = ({
    id,
    image,
    name,
    categoryFood,
    unit,
    price,
    description,
    status,
    recipe,
  }: FoodsFormatType) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();
    const [recipeState, setRecipeState] = useState<RecipesFormatType[]>(
      recipe!
    );

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={{
            id: id!,
            // image:
            //   "/src/assets/images/" +
            //   (image! ? "foods/" + image! : "others/no-image.png"),
            name: name!,
            categoryFoodId: categoryFood!.id,
            unit: unit!,
            price: price!,
            description: description!,
            status: status!,
          }}
          className="modal__form split-3"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn cập nhật ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              console.log(imageFile);
              console.log(image);
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              handleSubmitMutation.mutate({
                type: "update",
                values: values,
                imageFile: imageFile,
                details: recipeState,
              });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title1"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["image"]}
                htmlFor="update-image"
                className="modal__form-group-item"
              >
                <CustomUpload
                  defaultSrc={image! as string}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  htmlFor="update-image"
                  imageClassName="image-preview"
                  imageCategoryName="foods"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs["image"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled={true} />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="update-name"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Tên món ăn không được để trống !")]}
              >
                <Input id="update-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
              <Form.Item
                name="categoryFoodId"
                label={defaultLabels["categoryFood"]}
                htmlFor="update-category"
                className="modal__form-group-item"
                rules={[ruleRequired("Loại món ăn không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="update-category"
                  placeholder={defaultInputs["categoryFood"]}
                  options={categoryFoods?.map((categoryFood) => ({
                    label: "#" + categoryFood.id + " - " + categoryFood.name,
                    value: categoryFood.id,
                  }))}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="unit"
                  label={defaultLabels["unit"]}
                  htmlFor="update-unit"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Đơn vị !")]}
                >
                  <Select
                    showSearch={true}
                    allowClear={true}
                    id="update-unit"
                    placeholder={defaultInputs["unit"]}
                    options={units?.map((unit) => ({
                      label: unit,
                      value: unit,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="price"
                  label={defaultLabels["price"]}
                  htmlFor="update-price"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần nhập Giá bán !")]}
                >
                  <InputNumber
                    min={1}
                    id="update-price"
                    placeholder={defaultInputs["price"]}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                htmlFor="update-description"
                className="modal__form-group-item"
              >
                <TextArea
                  id="update-description"
                  className="multiple-2"
                  placeholder={defaultInputs["description"]}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title2"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["recipe"]}
                htmlFor="update-recipe"
                className="modal__form-group-item multiple-3"
              >
                <CustomTableNoActions
                  id="update-recipe"
                  className="recipe"
                  columnWidths={recipeTableWidth}
                  columnTitles={recipeTableTitle}
                  data={recipeState}
                  attributes={recipeTableAttributes}
                  format={recipeTableFormat}
                />
                <div className="buttons">
                  <button
                    type="button"
                    className="btn secondary-btn margin-r"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Xoá nguyên liệu",
                        true,
                        "60%",
                        "secondary recipes",
                        AdminRecipesModal.delete({
                          recipe: recipeState,
                          setRecipe: setRecipeState,
                        })
                      )
                    }
                  >
                    Xoá nguyên liệu
                  </button>
                  <button
                    type="button"
                    className="btn secondary-btn"
                    onClick={() =>
                      updatePropertiesSecondModal(
                        "Thêm nguyên liệu",
                        true,
                        "60%",
                        "secondary recipes",
                        AdminRecipesModal.create({
                          recipe: recipeState,
                          setRecipe: setRecipeState,
                        })
                      )
                    }
                  >
                    Thêm nguyên liệu
                  </button>
                </div>
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const LockFoods = ({
    id,
    status,
  }: {
    id: number;
    status: string | undefined;
  }) => {
    const [form] = Form.useForm();
    const statusValue = status == FoodStatus["active"] ? true : false;

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn ${statusValue ? "khoá" : "mở khoá"} ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Thực thi mutation
              handleSubmitMutation.mutate({
                type: statusValue ? "lock" : "unlock",
                objectId: id!,
              });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-image">
            <img
              src={
                statusValue
                  ? "/src/assets/images/others/lock-icon.png"
                  : "/src/assets/images/others/unlock-icon.png"
              }
              alt=""
            />
          </div>
          <div className="modal__form-content">
            <p>
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b> món
              ăn có mã đối tượng là <b>{id}</b> ?
            </p>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn lock">
              Xác nhận
            </button>
          </div>
        </Form>
      </>
    );
  };
  const AdminFoodsModal = {
    detail: (food: FoodsFormatType) => (
      <DetailFoods
        id={food!.id}
        image={food!.image}
        name={food!.name}
        categoryFood={food!.categoryFood}
        unit={food!.unit}
        price={food!.price}
        description={food!.description}
        status={food!.status}
        recipe={food!.recipe}
      />
    ),
    create: () => <CreateFoods />,
    update: (food: FoodsFormatType) => (
      <UpdateFoods
        id={food!.id}
        image={food!.image}
        name={food!.name}
        categoryFood={food!.categoryFood}
        unit={food!.unit}
        price={food!.price}
        description={food!.description}
        status={food!.status}
        recipe={food!.recipe}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockFoods id={id} status={status} />
    ),
  };

  // Các thành phần giữ giá trị cho việc hiển thị modal thứ 2
  // - Các biến
  const [titleSecondModal, setTitleSecondModal] = useState<string>("");
  const [openSecondModal, setOpenSecondModal] = useState<boolean>(false);
  const [widthSecondModal, setWidthSecondModal] = useState<string>("");
  const [classNameSecondModal, setClassNameSecondModal] = useState<string>("");
  const [childrenSecondModal, setChildrenSecondModal] = useState<ReactNode>();
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
  // - Hàm cập nhật
  const updatePropertiesSecondModal = (
    titleSecondModal: string,
    openSecondModal: boolean,
    widthSecondModal: string,
    classNameSecondModal: string,
    childrenSecondModal: ReactNode
  ) => {
    setTitleSecondModal(titleSecondModal);
    setOpenSecondModal(openSecondModal);
    setWidthSecondModal(widthSecondModal);
    setClassNameSecondModal(classNameSecondModal);
    setChildrenSecondModal(childrenSecondModal);
  };
  // - Các modal tương ứng cho từng chức năng
  const CreateRecipes = ({ recipe, setRecipe }: RecipeTableProps) => {
    const [form] = Form.useForm();

    // Truy vấn dữ liệu nguyên liệu
    const { data: ingredients } = useQuery({
      queryKey: ["ingredients"],
      queryFn: async () => {
        const res = await FindAllIngredient({
          statusValue: [CommonStatus.active],
        });
        if (res.status === 200) {
          return res.data;
        } else {
          openNotification({
            type: "error",
            message: "Truy vấn dữ liệu thất bại",
            description:
              String(res.data) || "Lỗi phát sinh khi truy vấn dữ liệu",
            duration: 2,
          });

          throw res;
        }
      },
    });

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form secondary split-2"
          autoComplete="off"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form.secondary button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Định dạng dữ liệu
              const newIngredient: RecipesFormatType = {
                ingredientId: JSON.parse(values!.ingredient)!.id || undefined,
                ingredientName:
                  JSON.parse(values!.ingredient)!.name || undefined,
                ingredientInventory:
                  JSON.parse(values!.ingredient)!.inventory || undefined,
                quantity: values!.quantity || undefined,
                note: values!.note || undefined,
              };

              // Cập nhật danh sách nguyên liệu mới
              let newRecipe: RecipesFormatType[] = [...recipe!];
              // - Kiểm tra nguyên liệu đã có tồn tại trong công thức hay chưa ?
              let isExists = false;
              for (let i = 0; i < newRecipe.length; i++) {
                if (newRecipe[i].ingredientId === newIngredient.ingredientId) {
                  newRecipe[i].quantity = newIngredient.quantity;
                  newRecipe[i].note = newIngredient.note;
                  isExists = true;
                }
              }
              if (!isExists) {
                newRecipe.push(newIngredient);
              }
              // - Sắp xếp theo mã nguyên liệu tăng dần
              newRecipe.sort(
                (a, b) =>
                  (a!.ingredientId as number) - (b!.ingredientId as number)
              );
              // - Cập nhật
              setRecipe!(newRecipe!);

              // Thành công thì thông báo
              setOpenSecondModal(false);
              openNotification({
                type: "success",
                message: "Thành công",
                description: "Thêm thành công !",
                duration: 1.5,
              });
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">
              {defaultSecondLabels["title"]}
            </p>
            <div className="modal__form-group">
              <Form.Item
                name="ingredient"
                label={defaultSecondLabels["ingredientCreate"]}
                htmlFor="create-ingredient"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Nguyên liệu không được để trống !")]}
              >
                <Select
                  mode={undefined}
                  showSearch={true}
                  allowClear={true}
                  id="create-ingredient"
                  placeholder={defaultSecondInputs["ingredientCreate"]}
                  options={ingredients?.map((ingredient) => ({
                    label:
                      "#" +
                      ingredient!.id +
                      " - " +
                      ingredient!.name +
                      " - " +
                      ingredient!.categoryIngredient!.name +
                      " (#" +
                      ingredient!.categoryIngredient!.id +
                      ")" +
                      " - " +
                      ingredient!.capacity +
                      " " +
                      ingredient!.unit,
                    value: JSON.stringify(ingredient!),
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="quantity"
                label={defaultSecondLabels["quantity"]}
                htmlFor="create-quantity"
                className="modal__form-group-item"
                rules={[ruleRequired("Số lượng không được để trống !")]}
              >
                <InputNumber
                  min={1}
                  id="create-quantity"
                  placeholder={defaultSecondInputs["quantity"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="note"
                label={defaultSecondLabels["note"]}
                htmlFor="create-note"
                className="modal__form-group-item"
              >
                <TextArea
                  id="create-note"
                  className="multiple-2"
                  placeholder={defaultSecondInputs["note"]}
                />
              </Form.Item>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn secondary-btn">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const DeleteRecipes = ({ recipe, setRecipe }: RecipeTableProps) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form split-2"
          autoComplete="off"
          onFinish={async () => {
            // Nút để submit form
            const submitButton = document.querySelector(
              ".modal__form.secondary button[type='submit']"
            );

            // Thêm class 'active' thể hiện nút đang được nhấn
            submitButton?.classList.add("active");

            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn xoá ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Nguyên liệu cần xoá
              const ingredient = JSON.parse(form.getFieldValue("ingredient"));

              // Cập nhật danh sách nguyên liệu mới
              let newRecipe: RecipesFormatType[] = [];
              for (let i = 0; i < recipe!.length; i++) {
                if (recipe![i].ingredientId !== ingredient.ingredientId) {
                  newRecipe.push(recipe![i]);
                }
              }
              setRecipe!(newRecipe!);

              // Thành công thì thông báo
              setOpenSecondModal(false);
              openNotification({
                type: "success",
                message: "Thành công",
                description: "Xoá thành công !",
                duration: 1.5,
              });
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">
              {defaultSecondLabels["title"]}
            </p>
            <div className="modal__form-group">
              <Form.Item
                name="ingredient"
                label={defaultSecondLabels["ingredientDelete"]}
                htmlFor="update-ingredient"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Nguyên liệu không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="update-ingredient"
                  placeholder={defaultSecondInputs["ingredientDelete"]}
                  options={recipe?.map((ingredient) => ({
                    label:
                      "#" +
                      ingredient.ingredientId +
                      " - " +
                      ingredient.ingredientName +
                      " - " +
                      ingredient.quantity +
                      " - " +
                      ingredient.note,
                    value: JSON.stringify(ingredient),
                  }))}
                />
              </Form.Item>
              {/* <Form.Item
                name="quantity"
                label={defaultSecondLabels["quantity"]}
                htmlFor="update-quantity"
                className="modal__form-group-item"
              >
                <InputNumber id="update-quantity" disabled={true} />
              </Form.Item> */}
            </div>
            <div className="modal__form-group">
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              {/* <Form.Item
                name="note"
                label={defaultSecondLabels["note"]}
                htmlFor="update-note"
                className="modal__form-group-item"
              >
                <TextArea
                  id="update-note"
                  className="multiple-2"
                  disabled={true}
                />
              </Form.Item> */}
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn secondary-btn">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const AdminRecipesModal = {
    create: ({ recipe, setRecipe }: RecipeTableProps) => (
      <CreateRecipes recipe={recipe} setRecipe={setRecipe} />
    ),
    delete: ({ recipe, setRecipe }: RecipeTableProps) => (
      <DeleteRecipes recipe={recipe} setRecipe={setRecipe} />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h1 className="main__title">{objectName}</h1>
        </div>
        <div className="main__filter">
          <CustomFindInput
            selectItems={findOptions}
            placeholder="Nhập thông tin cần tìm kiếm"
            defaultValue=""
            className="main__filter-find"
            setFilterFindType={setFilterFindType}
            setFilterFindValue={setFilterFindValue}
          />
          <CustomFindSelect
            mode={undefined}
            placeholder="Chọn Trạng thái"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-status"
            options={statusOptions}
            setFilterSelectValue={setFilterStatusValue}
          />
          {validActions?.includes(getActionNameVn(1)) && (
            <button
              className={
                "main__filter-button btn " +
                getActionNameEn(1) +
                (openModal && titleModal === titleModalCreate ? " active" : "")
              }
              onClick={() =>
                updatePropertiesModal(
                  titleModalCreate,
                  true,
                  "89%",
                  getActionNameEn(1) + " foods",
                  AdminFoodsModal.create()
                )
              }
            >
              <FontAwesomeIcon icon={faPlus} className="icon" />
              &nbsp;Thêm
            </button>
          )}
        </div>
        <div className="main__table">
          <CustomTableActions<FoodsFormatType>
            columns={columns}
            data={foods || []}
            rowKey={(record) => String(record?.id)}
            loading={isLoading}
            defaultPageSize={10}
            className="table-actions foods"
          />
        </div>
      </main>
      {openModal && (
        <CustomModal
          key="modal"
          title={titleModal}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
          width={widthModal}
          className={classNameModal}
          children={childrenModal}
        />
      )}
      {openSecondModal && (
        <CustomModal
          key="second-modal"
          title={titleSecondModal}
          openModal={openSecondModal}
          setOpenModal={() => setOpenSecondModal(false)}
          width={widthSecondModal}
          className={classNameSecondModal}
          children={childrenSecondModal}
        />
      )}
    </>
  );
};

export default AdminFoodsPage;
