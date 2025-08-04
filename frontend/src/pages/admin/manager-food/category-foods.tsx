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
import { Form, Image, Input, Select, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { RcFile } from "antd/es/upload";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CategoryFoodsType, ReactQueryMutationProps } from "../../../common/types";
import { CommonStatus, ReactQueryGetData, TitleModalCommon } from "../../../common/values";
import { CustomPaginationProps } from "../../../common/props";
import { ruleRequired } from "../../../common/rules";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomUpload from "../../../components/admin/upload";
import CustomModal from "../../../components/admin/modal";
import {
  FindAllCategoryFood,
  HandleCreateCategoryFood,
  HandleLockCategoryFood,
  HandleUpdateCategoryFood,
} from "../../../services/api";
import { getActionNameEn, getActionNameVn } from "../../../services/default-actions";
import { getActionsString } from "../../../services/employee-login";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Loại món ăn"
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());

// Admin Category Foods Page
const AdminCategoryFoodsPage = ({ functionId }: { functionId: number }) => {
  // Danh sách tác vụ mà nhân viên có thể thực hiện theo mã chức năng
  const validActions = getActionsString({ currentFunctionId: functionId })

  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

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
    { label: CommonStatus["active"], value: CommonStatus["active"] },
    { label: CommonStatus["inactive"], value: CommonStatus["inactive"] },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: categoryFoods,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'category-foods',
      filterFindType,
      filterFindValue,
      filterStatusValue,
    ],
    queryFn: async () => {
      const res = await FindAllCategoryFood({
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
    enabled: !!filterFindType,  //
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });
  // - Cột thuộc tính
  const columns: ColumnsType<CategoryFoodsType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "14%",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "20%",
      render: (image: string) => (
        <Image
          src={
            image!
              ? "/src/assets/images/category-foods/" + image
              : "/src/assets/images/others/no-image.png"
          }
          alt=""
        />
      ),
    },
    {
      title: "Tên loại món ăn",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "40%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status: string) => (
        <Tag color={status === CommonStatus["active"] ? "green" : "red"}>
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
      render: (text: any, record: CategoryFoodsType, index: number) => (
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
                    getActionNameEn(0) + " category-foods",
                    AdminCategoryFoodsModal.detail(record)
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
                    getActionNameEn(2) + " category-foods",
                    AdminCategoryFoodsModal.update(record)
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
                    getActionNameEn(3) + " category-foods",
                    AdminCategoryFoodsModal.lock(record!.id as number, record!.status)
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
  } = CustomPaginationProps(categoryFoods || [], 4, [1, 2, 3, 4, 5]);

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
    id: "Mã loại món ăn",
    image: "Hình ảnh",
    name: "Tên loại món ăn",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm !",
    image: "Chọn Hình ảnh",
    name: "Nhập Tên loại món ăn",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Mutation cho việc thêm, cập nhật và khoá dữ liệu
  const handleSubmitMutation = useMutation({
    mutationFn: async ({ type, values, objectId, imageFile }: ReactQueryMutationProps<CategoryFoodsType>) => {
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          const res = await HandleCreateCategoryFood({
            name: values!.name || undefined,
            image: imageFile! || undefined,
            description: values!.description || undefined,
            status: values!.status || undefined,
          })

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          const res = await HandleUpdateCategoryFood({
            id: values!.id,
            name: values!.name || undefined,
            image: imageFile! || undefined,
            description: values!.description || undefined,
            timeUpdate: new Date().toISOString(),
          });

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        } else if ((type === "lock" && titleModal === titleModalLock)
          || (type === "unlock" && titleModal === titleModalUnlock)) {
          const res = await HandleLockCategoryFood({
            id: objectId! as number,
            status: (type === "lock" ? CommonStatus.active : CommonStatus.inactive) || undefined,
            timeUpdate: new Date().toISOString(),
          })

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
        queryClient.invalidateQueries({ queryKey: ['category-foods'] });
        setOpenModal(false);
      }, 1500);
    },
    onError: (error) => {
      openNotification({
        type: "error",
        message: "Thất bại",
        description: (error ? error.message : (openModal ? (titleModal === titleModalCreate ? "Thêm" : titleModal === titleModalUpdate ? "Cập nhật" : titleModal === titleModalLock ? "Khoá" : "Mở khoá") : "") + " thất bại!"),
        duration: 1.5,
      });

      setTimeout(() => {
      }, 1500);
    },
  });
  // - Các modal tương ứng cho từng chức năng
  const DetailCategoryFoods = ({
    id,
    image,
    name,
    description,
    status,
  }: CategoryFoodsType) => {
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
            //   (image! ? "category-foods/" + image! : "others/no-image.png"),
            name: name!,
            description: description!,
            status: status!,
          }}
          className="modal__form split-2"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels["title"]}</p>
            <div className="modal__form-group">
              <Form.Item
                name="image"
                label={defaultLabels["image"]}
                className="modal__form-group-item"
              >
                <CustomUpload
                  defaultSrc={image! as string}
                  alt="image-preview"
                  imageClassName="image-preview"
                  imageCategoryName="category-foods"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs["image"]}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <TextArea className="multiple-2" disabled={true} />
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
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                className="modal__form-group-item"
              >
                <Input disabled={true} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateCategoryFoods = ({ }) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();

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
              handleSubmitMutation.mutate({ type: "create", values: values, imageFile: imageFile });

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
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                htmlFor="create-description"
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  id="create-description"
                  className="multiple-2"
                  placeholder={defaultInputs["description"]}
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
                name="status"
                label={defaultLabels["status"]}
                htmlFor="create-status"
                className="modal__form-group-item"
                rules={[ruleRequired("Trạng thái không được để trống !")]}
              >
                <Select
                  id="create-status"
                  placeholder={defaultInputs["status"]}
                  options={[
                    {
                      label: CommonStatus["active"],
                      value: CommonStatus["active"],
                    },
                    {
                      label: CommonStatus["inactive"],
                      value: CommonStatus["inactive"],
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="create-name"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên nguyên liệu không được để trống !")]}
              >
                <Input id="create-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type='submit' className="modal__button btn create">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const UpdateCategoryFoods = ({
    id,
    image,
    name,
    description,
    status,
  }: CategoryFoodsType) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();

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
            //   (image! ? "category-foods/" + image! : "others/no-image.png"),
            name: name!,
            description: description!,
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
              handleSubmitMutation.mutate({ type: "update", values: values, imageFile: imageFile });

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
                label={defaultLabels["image"]}
                htmlFor="update-image"
                className="modal__form-group-item"
              >
                <CustomUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  defaultSrc={image! as string}
                  alt="image-preview"
                  htmlFor="update-image"
                  imageClassName="image-preview"
                  imageCategoryName="category-foods"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs["image"]}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels["description"]}
                htmlFor="update-description"
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  id="update-description"
                  className="multiple-2"
                  placeholder={defaultInputs["description"]}
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
                name="status"
                label={defaultLabels["status"]}
                className="modal__form-group-item"
              >
                <Select disabled={true} />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="update-name"
                className="modal__form-group-item"
                rules={[ruleRequired("Tên nguyên liệu không được để trống !")]}
              >
                <Input id="update-name" placeholder={defaultInputs["name"]} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type='submit' className="modal__button btn update">Xác nhận</button>
          </div>
        </Form>
      </>
    );
  };
  const LockCategoryFoods = ({
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
              loại món ăn có mã đối tượng là <b>{id}</b> ?
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
  const AdminCategoryFoodsModal = {
    detail: (categoryFoods: CategoryFoodsType) => (
      <DetailCategoryFoods
        id={categoryFoods!.id}
        image={categoryFoods!.image}
        name={categoryFoods!.name}
        description={categoryFoods!.description}
        status={categoryFoods!.status}
      />
    ),
    create: () => <CreateCategoryFoods />,
    update: (categoryFoods: CategoryFoodsType) => (
      <UpdateCategoryFoods
        id={categoryFoods!.id}
        image={categoryFoods!.image}
        name={categoryFoods!.name}
        description={categoryFoods!.description}
        status={categoryFoods!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockCategoryFoods id={id} status={status} />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h1 className="main__title">Quản lý món ăn - {objectName}</h1>
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
                    getActionNameEn(1) + " category-foods",
                    AdminCategoryFoodsModal.create()
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
            className="table-actions category-foods"
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

export default AdminCategoryFoodsPage;
