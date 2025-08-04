import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { DatePicker, Form, Input, InputNumber, Select, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CustomPaginationProps } from "../../../common/props";
import type {
  IngredientsFormatType,
  IngredientsType,
  ReactQueryMutationProps,
} from "../../../common/types";
import { CommonStatus, ReactQueryGetData, TitleModalCommon } from "../../../common/values";
import { ruleRequired } from "../../../common/rules";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomModal from "../../../components/admin/modal";
import {
  FindAllCategoryIngredient,
  FindAllIngredient,
  HandleCreateIngredient,
  HandleLockIngredient,
  HandleUpdateIngredient,
} from "../../../services/api";
import { getActionNameEn, getActionNameVn } from "../../../services/default-actions";
import { getActionsString } from "../../../services/employee-login";
import { openNotification } from "../../../utils/showNotification";
import { openConfirmation } from "../../../utils/showConfirmation";
import dayjs from "dayjs";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Nguyên liệu"
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());
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

// Admin Ingredients Page
const AdminIngredientsPage = ({ functionId }: { functionId: number }) => {
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId })

  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Các biến giữ dữ liệu về loại nguyên liệu
  const {
    data: categoryIngredients,
  } = useQuery({
    queryKey: [
      'category-ingredients',
    ],
    queryFn: async () => {
      const res = await FindAllCategoryIngredient({ statusValue: [CommonStatus.active] });
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
  // - Loại món ăn
  const categoryOptions: SelectProps["options"] = categoryIngredients?.map(
    (categoryIngredient) => ({
      label: `#${categoryIngredient.id} - ${categoryIngredient.name}`,
      value: categoryIngredient.id,
    })
  );
  const [filterCategoryValue, setFilterCategoryValue] = useState<
    string[] | null
  >(null);
  // - Trạng thái
  const statusOptions: SelectProps["options"] = [
    { label: CommonStatus["active"], value: CommonStatus["active"] },
    { label: CommonStatus["inactive"], value: CommonStatus["inactive"] },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: ingredients,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'ingredients',
      filterFindType,
      filterFindValue,
      filterCategoryValue,
      filterStatusValue,
    ],
    queryFn: async () => {
      const res = await FindAllIngredient({
        findType: filterFindType!,
        findValue: filterFindValue!,
        categoryValue: filterCategoryValue!,
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
    enabled: !!filterFindType,  //
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<IngredientsFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "10%",
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "24%",
      className: "left",
    },
    {
      title: "Loại nguyên liệu",
      key: "categoryIngredient",
      width: "13%",
      render: (record) =>
        `#${record.categoryIngredient?.id} - ${record.categoryIngredient?.name}`,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      sorter: true,
      width: "10%",
    },
    {
      title: "Định lượng",
      dataIndex: "capacity",
      key: "capacity",
      sorter: true,
      width: "10%",
    },
    {
      title: "Tồn kho",
      dataIndex: "inventory",
      key: "inventory",
      sorter: true,
      width: "13%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      // sorter: true,
      width: "10%",
      render: (status: string) => (
        <Tag color={status === CommonStatus["active"] ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      width: "10%",
      className: "buttons",
      render: (text: any, record: IngredientsFormatType, index: number) => (
        <>
          {
            validActions?.includes(getActionNameVn(0)) && (
              <button
                className={"action " + getActionNameEn(0)}
                onClick={() =>
                  updatePropertiesModal(
                    titleModalDetail,
                    true,
                    "60%",
                    getActionNameEn(0) + " ingredients",
                    AdminIngredientsModal.detail(record)
                  )
                }
              >
                <FontAwesomeIcon icon={faCircleInfo} />
              </button>
            )
          }
          {
            validActions?.includes(getActionNameVn(2)) && (
              <button
                className={"action " + getActionNameEn(2)}
                onClick={() =>
                  updatePropertiesModal(
                    titleModalUpdate,
                    true,
                    "60%",
                    getActionNameEn(2) + " ingredients",
                    AdminIngredientsModal.update(record)
                  )
                }
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            )
          }
          {
            validActions?.includes(getActionNameVn(3)) && (
              <button
                className={"action " + getActionNameEn(3)}
                onClick={() =>
                  updatePropertiesModal(
                    (record.status == CommonStatus["active"] ? titleModalLock : titleModalUnlock),
                    true,
                    "30%",
                    getActionNameEn(3) + " ingredients",
                    AdminIngredientsModal.lock(record!.id as number, record!.status)
                  )
                }
              >
                <FontAwesomeIcon
                  icon={record.status == CommonStatus["active"] ? faLock : faUnlock}
                />
              </button>
            )
          }
        </>
      ),
    },
  ];
  // - Các thành phần
  const {
    currentItems,
    handleTableChange,
    paginationProps,
    sortField,
    sortOrder,
  } = CustomPaginationProps(ingredients || [], 10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

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
    id: "Được xác định sau khi xác nhận thêm !",
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
  // - Mutation cho việc thêm, cập nhật và khoá dữ liệu
  const handleSubmitMutation = useMutation({
    mutationFn: async ({ type, values, objectId }: ReactQueryMutationProps<IngredientsType>) => {
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          const res = await HandleCreateIngredient({
            name: values!.name || undefined,
            categoryIngredientId: values!.categoryIngredientId || undefined,
            unit: values!.unit || undefined,
            capacity: values!.capacity || undefined,
            dateCreate:
              values!.dateCreate && dayjs(values!.dateCreate).isValid()
                ? dayjs(values!.dateCreate).format("YYYY-MM-DD")
                : undefined,
            dateRemove:
              values!.dateRemove && dayjs(values!.dateRemove).isValid()
                ? dayjs(values!.dateRemove).format("YYYY-MM-DD")
                : undefined,
            inputPrice: values!.inputPrice || undefined,
            inventory: values!.inventory || 0,
            note: values!.note || undefined,
            status: values!.status || undefined,
          });

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          const res = await HandleUpdateIngredient({
            id: values!.id,
            name: values!.name || undefined,
            categoryIngredientId: values!.categoryIngredientId || undefined,
            unit: values!.unit || undefined,
            capacity: values!.capacity || undefined,
            dateCreate:
              values!.dateCreate && dayjs(values!.dateCreate).isValid()
                ? dayjs(values!.dateCreate).format("YYYY-MM-DD")
                : undefined,
            dateRemove:
              values!.dateRemove && dayjs(values!.dateRemove).isValid()
                ? dayjs(values!.dateRemove).format("YYYY-MM-DD")
                : undefined,
            inputPrice: values!.inputPrice || undefined,
            note: values!.note || undefined,
            timeUpdate: new Date().toISOString(),
          });

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        } else if ((type === "lock" && titleModal === titleModalLock)
          || (type === "unlock" && titleModal === titleModalUnlock)) {
          const res = await HandleLockIngredient({
            id: objectId! as number,
            status: (type === "lock" ? CommonStatus.active : CommonStatus.inactive) || undefined,
            timeUpdate: new Date().toISOString(),
          });

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        }
      }
    },
    onSuccess: () => {
      openNotification({
        type: "success",
        message: "Thành công",
        description: (openModal ? (titleModal === titleModalCreate ? "Thêm" : titleModal === titleModalUpdate ? "Cập nhật" : titleModal === titleModalLock ? "Khoá" : "Mở khoá") : "") + " thành công!",
        duration: 1.5,
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['ingredients'] });
        setOpenModal(false);
      }, 1500);
    },
    onError: () => {
      openNotification({
        type: "error",
        message: "Thất bại",
        description: (openModal ? (titleModal === titleModalCreate ? "Thêm" : titleModal === titleModalUpdate ? "Cập nhật" : titleModal === titleModalLock ? "Khoá" : "Mở khoá") : "") + " thất bại!",
        duration: 1.5,
      });

      setTimeout(() => {
      }, 1500);
    },
  });
  // - Các modal tương ứng cho từng chức năng
  const DetailIngredients = ({
    id,
    name,
    categoryIngredient,
    unit,
    capacity,
    dateCreate,
    dateRemove,
    inputPrice,
    inventory,
    note,
    status,
  }: IngredientsFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: id!,
            name: name!,
            categoryIngredient: categoryIngredient!.id,
            unit: unit!,
            capacity: capacity!,
            dateCreate: dayjs(dateCreate!),
            dateRemove: dayjs(dateRemove!),
            inputPrice: inputPrice!,
            inventory: inventory!,
            note: note!,
            status: status!,
          }}
          className="modal__form split-2"
          autoComplete="off"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
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
                name="categoryIngredient"
                label={defaultLabels["categoryIngredient"]}
                className="modal__form-group-item"
              >
                <Select
                  options={[
                    {
                      label:
                        "#" +
                        categoryIngredient!.id +
                        " - " +
                        categoryIngredient!.name,
                      value: categoryIngredient!.id,
                    },
                  ]}
                  disabled={true}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="dateCreate"
                  label={defaultLabels["dateCreate"]}
                  className="modal__form-group-item"
                >
                  <DatePicker disabled={true} />
                </Form.Item>
                <Form.Item
                  name="dateRemove"
                  label={defaultLabels["dateRemove"]}
                  className="modal__form-group-item"
                >
                  <DatePicker disabled={true} />
                </Form.Item>
              </div>
              <Form.Item
                name="note"
                label={defaultLabels["note"]}
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <TextArea className="multiple-2" disabled={true} />
              </Form.Item>
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
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="unit"
                  label={defaultLabels["unit"]}
                  className="modal__form-group-item"
                >
                  <Select
                    options={[{ label: unit!, value: unit! }]}
                    disabled={true}
                  />
                </Form.Item>
                <Form.Item
                  name="capacity"
                  label={defaultLabels["capacity"]}
                  className="modal__form-group-item"
                >
                  <InputNumber disabled={true} />
                </Form.Item>
              </div>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="inputPrice"
                  label={defaultLabels["inputPrice"]}
                  className="modal__form-group-item"
                >
                  <InputNumber disabled={true} />
                </Form.Item>
                <Form.Item
                  name="inventory"
                  label={defaultLabels["inventory"]}
                  className="modal__form-group-item"
                >
                  <InputNumber disabled={true} />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateIngredients = () => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          className="modal__form split-2"
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
              handleSubmitMutation.mutate({ type: "create", values: values });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels["id"]}
                className="modal__form-group-item"
              >
                <Input
                  value={defaultInputs["id"]}
                  className="text-center"
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="create-name"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Tên nguyên liệu không được để trống !")]}
              >
                <Input id="create-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
              <Form.Item
                name="categoryIngredientId"
                label={defaultLabels["categoryIngredient"]}
                htmlFor="create-categoryIngredient"
                className="modal__form-group-item"
                rules={[ruleRequired("Loại nguyên liệu không được để trống !")]}
              >
                <Select
                  allowClear={true}
                  showSearch={true}
                  id="create-categoryIngredient"
                  className="category-ingredients"
                  placeholder={defaultInputs["categoryIngredient"]}
                  options={categoryIngredients!.map((categoryIngredient) => ({
                    label: `#${categoryIngredient.id} - ${categoryIngredient.name}`,
                    value: categoryIngredient.id,
                  }))}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="dateCreate"
                  label={defaultLabels["dateCreate"]}
                  htmlFor="create-dateCreate"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="create-dateCreate"
                    placeholder={defaultInputs["dateCreate"]}
                  />
                </Form.Item>
                <Form.Item
                  name="dateRemove"
                  label={defaultLabels["dateRemove"]}
                  htmlFor="create-dateRemove"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="create-dateRemove"
                    placeholder={defaultInputs["dateRemove"]}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="note"
                label={defaultLabels["note"]}
                htmlFor="create-note"
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  id="create-note"
                  className="multiple-2"
                  placeholder={defaultInputs["note"]}
                />
              </Form.Item>
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
                  allowClear={true}
                  id="create-status"
                  placeholder={defaultInputs["status"]}
                  options={[
                    { label: CommonStatus["active"], value: CommonStatus["active"] },
                    { label: CommonStatus["inactive"], value: CommonStatus["inactive"] },
                  ]}
                />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
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
                  name="capacity"
                  label={defaultLabels["capacity"]}
                  htmlFor="create-capacity"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần nhập Định lượng !")]}
                >
                  <InputNumber
                    min={0}
                    id="create-capacity"
                    placeholder={defaultInputs["capacity"]}
                  />
                </Form.Item>
              </div>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="inputPrice"
                  label={defaultLabels["inputPrice"]}
                  htmlFor="create-inputPrice"
                  className="modal__form-group-item"
                >
                  <InputNumber
                    min={0}
                    id="create-inputPrice"
                    placeholder={defaultInputs["inputPrice"]}
                  />
                </Form.Item>
                <Form.Item
                  name="inventory"
                  label={defaultLabels["inventory"]}
                  className="modal__form-group-item"
                >
                  <InputNumber disabled={true} />
                </Form.Item>
              </div>
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
  const UpdateIngredients = ({
    id,
    name,
    categoryIngredient,
    unit,
    capacity,
    dateCreate,
    dateRemove,
    inputPrice,
    inventory,
    note,
    status,
  }: IngredientsFormatType) => {
    const [form] = Form.useForm();

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={{
            id: id!,
            name: name!,
            categoryIngredientId: categoryIngredient!.id,
            unit: unit!,
            capacity: capacity!,
            dateCreate: dayjs(dateCreate!),
            dateRemove: dayjs(dateRemove!),
            inputPrice: inputPrice!,
            inventory: inventory!,
            note: note!,
            status: status!,
          }}
          className="modal__form split-2"
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
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              handleSubmitMutation.mutate({ type: "update", values: values });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
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
                rules={[ruleRequired("Tên nguyên liệu không được để trống !")]}
              >
                <Input id="update-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
              <Form.Item
                name="categoryIngredientId"
                label={defaultLabels["categoryIngredient"]}
                htmlFor="update-categoryIngredient"
                className="modal__form-group-item"
                rules={[ruleRequired("Loại nguyên liệu không được để trống !")]}
              >
                <Select
                  showSearch={true}
                  allowClear={true}
                  id="update-categoryIngredient"
                  className="category-ingredients"
                  placeholder={defaultInputs["categoryIngredient"]}
                  options={categoryIngredients!.map((categoryIngredient) => ({
                    label: `#${categoryIngredient.id} - ${categoryIngredient.name}`,
                    value: categoryIngredient.id,
                  }))}
                />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="dateCreate"
                  label={defaultLabels["dateCreate"]}
                  htmlFor="update-dateCreate"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="update-dateCreate"
                    placeholder={defaultInputs["dateCreate"]}
                  />
                </Form.Item>
                <Form.Item
                  name="dateRemove"
                  label={defaultLabels["dateRemove"]}
                  htmlFor="update-dateRemove"
                  className="modal__form-group-item"
                >
                  <DatePicker
                    id="update-dateRemove"
                    placeholder={defaultInputs["dateRemove"]}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="note"
                label={defaultLabels["note"]}
                htmlFor="update-note"
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  id="update-note"
                  className="multiple-2"
                  placeholder={defaultInputs["note"]}
                />
              </Form.Item>
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
                    options={units!.map((unit) => ({
                      label: unit,
                      value: unit,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="capacity"
                  label={defaultLabels["capacity"]}
                  htmlFor="update-capacity"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần nhập Định lượng !")]}
                >
                  <InputNumber
                    min={0}
                    id="update-capacity"
                    placeholder={defaultInputs["capacity"]}
                  />
                </Form.Item>
              </div>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="inputPrice"
                  label={defaultLabels["inputPrice"]}
                  htmlFor="update-inputPrice"
                  className="modal__form-group-item"
                >
                  <InputNumber
                    min={0}
                    id="update-inputPrice"
                    placeholder={defaultInputs["inputPrice"]}
                  />
                </Form.Item>
                <Form.Item
                  name="inventory"
                  label={defaultLabels["inventory"]}
                  className="modal__form-group-item"
                >
                  <InputNumber disabled={true} />
                </Form.Item>
              </div>
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
  const LockIngredients = ({
    id,
    status,
  }: {
    id: number;
    status: string | undefined;
  }) => {
    const [form] = Form.useForm();
    const statusValue = status == CommonStatus["active"] ? true : false;

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
              handleSubmitMutation.mutate({ type: (statusValue ? "lock" : "unlock"), objectId: id! });

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
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b>{" "}
              nguyên liệu có mã đối tượng là <b>{id}</b> ?
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
  const AdminIngredientsModal = {
    detail: (ingredient: IngredientsFormatType) => (
      <DetailIngredients
        id={ingredient!.id}
        name={ingredient!.name}
        categoryIngredient={ingredient!.categoryIngredient}
        unit={ingredient!.unit}
        capacity={ingredient!.capacity}
        dateCreate={ingredient!.dateCreate}
        dateRemove={ingredient!.dateRemove}
        inputPrice={ingredient!.inputPrice}
        inventory={ingredient!.inventory}
        note={ingredient!.note}
        status={ingredient!.status}
      />
    ),
    create: () => <CreateIngredients />,
    update: (ingredient: IngredientsFormatType) => (
      <UpdateIngredients
        id={ingredient!.id}
        name={ingredient!.name}
        categoryIngredient={ingredient!.categoryIngredient}
        unit={ingredient!.unit}
        capacity={ingredient!.capacity}
        dateCreate={ingredient!.dateCreate}
        dateRemove={ingredient!.dateRemove}
        inputPrice={ingredient!.inputPrice}
        inventory={ingredient!.inventory}
        note={ingredient!.note}
        status={ingredient!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockIngredients id={id} status={status} />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Quản lý món ăn - {objectName}</h2>
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
            mode="tags"
            placeholder="Chọn Loại món ăn"
            optionFilterProp="label"
            maxTagCount="responsive"
            className="main__filter-select filter-category"
            options={categoryOptions}
            setFilterSelectValue={setFilterCategoryValue}
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
          {
            validActions?.includes(getActionNameVn(1)) && (
              <button
                className={
                  "main__filter-button btn " + getActionNameEn(1) +
                  (openModal && titleModal === titleModalCreate
                    ? " active"
                    : "")
                }
                onClick={() =>
                  updatePropertiesModal(
                    titleModalCreate,
                    true,
                    "60%",
                    getActionNameEn(1) + " ingredients",
                    AdminIngredientsModal.create()
                  )
                }
              >
                <FontAwesomeIcon icon={faPlus} className="icon" />
                &nbsp;Thêm
              </button>
            )
          }
        </div>
        <div className="main__table">
          <CustomTableActions
            columns={columns}
            rowKey={(record) => record!.id as number}
            data={currentItems}
            loading={isLoading}
            pagination={paginationProps}
            className="table-actions ingredients"
            onChange={handleTableChange}
          />
        </div>
      </main>
      {openModal && (
        <CustomModal
          title={titleModal}
          openModal={openModal}
          setOpenModal={() => setOpenModal(false)}
          width={widthModal}
          className={classNameModal}
          children={childrenModal}
        />
      )}
    </>
  );
};

export default AdminIngredientsPage;
