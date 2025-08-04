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
import { Form, Tag, Image, Input, Select, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { SelectProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RcFile } from "antd/es/upload";
import type { CustomerCardsType, ReactQueryMutationProps } from "../../../common/types";
import { CommonStatus, ReactQueryGetData, TitleModalCommon } from "../../../common/values";
import { ruleRequired } from "../../../common/rules";
import { CustomPaginationProps } from "../../../common/props";
import CustomFindInput from "../../../components/admin/find-input";
import CustomFindSelect from "../../../components/admin/find-select";
import CustomUpload from "../../../components/admin/upload";
import CustomTableActions from "../../../components/admin/table-actions";
import CustomModal from "../../../components/admin/modal";
import {
  FindAllCustomerCard,
  HandleCreateCustomerCard,
  HandleLockCustomerCard,
  HandleUpdateCustomerCard,
} from "../../../services/api";
import { getActionNameEn, getActionNameVn } from "../../../services/default-actions";
import { getActionsString } from "../../../services/employee-login";
import { vietnamMoneyFormat } from "../../../utils/otherEvents";
import { openConfirmation } from "../../../utils/showConfirmation";
import { openNotification } from "../../../utils/showNotification";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Thẻ khách hàng"
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());

// Admin Customer Cards Page
const AdminCustomerCardsPage = ({ functionId }: { functionId: number }) => {
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
    data: customerCards,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'customer-cards',
      filterFindType,
      filterFindValue,
      filterStatusValue,
    ],
    queryFn: async () => {
      const res = await FindAllCustomerCard({
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
  const columns: ColumnsType<CustomerCardsType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "10%",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "16%",
      render: (image: string) => (
        <Image
          src={
            image!
              ? "/src/assets/images/customer-cards/" + image
              : "/src/assets/images/others/no-image.png"
          }
          alt=""
        />
      ),
    },
    {
      title: "Tên thẻ khách hàng",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "24%",
      // className: "left",
    },
    {
      title: "Mức tiêu (VNĐ)",
      dataIndex: "threshold",
      key: "threshold",
      sorter: true,
      width: "15%",
      render: (threshold) => vietnamMoneyFormat(threshold!),
    },
    {
      title: "Giảm giá (%)",
      dataIndex: "discount",
      key: "discount",
      sorter: true,
      width: "15%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
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
      width: "10%",
      className: "buttons",
      render: (text: any, record: CustomerCardsType, index: number) => (
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
                    getActionNameEn(0) + " customer-cards",
                    AdminCustomerCardsModal.detail(record)
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
                    getActionNameEn(2) + " customer-cards",
                    AdminCustomerCardsModal.update(record)
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
                    getActionNameEn(3) + " customer-cards",
                    AdminCustomerCardsModal.lock(record!.id as number, record!.status)
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
  } = CustomPaginationProps(customerCards || [], 4, [1, 2, 3, 4, 5]);

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
    id: "Mã thẻ khách hàng",
    image: "Hình ảnh",
    name: "Tên thẻ khách hàng",
    threshold: "Mức tiêu (VNĐ)",
    discount: "Giảm giá (%)",
    description: "Mô tả",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định cho nhập liệu
  const defaultInputs = {
    title: "",
    id: "Được xác định sau khi xác nhận thêm !",
    image: "Tải hình ảnh",
    name: "Nhập Tên khách hàng",
    threshold: "Nhập Mức tiêu (VNĐ)",
    discount: "Nhập Giảm giá (%)",
    description: "Nhập Mô tả",
    status: "Chọn Trạng thái",
  };
  // - Mutation cho việc thêm, cập nhật và khoá dữ liệu
  const handleSubmitMutation = useMutation({
    mutationFn: async ({ type, values, objectId, imageFile }: ReactQueryMutationProps<CustomerCardsType>) => {
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          const res = await HandleCreateCustomerCard({
            image: imageFile! || undefined,
            name: values!.name || undefined,
            threshold: values!.threshold || undefined,
            discount: values!.discount || undefined,
            description: values!.description || undefined,
            status: values!.status || undefined,
          });

          if (res.status === 200) {
            return res.data;
          } {
            throw new Error(String(res.data));
          }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          const res = await HandleUpdateCustomerCard({
            id: values!.id,
            image: imageFile! || undefined,
            name: values!.name || undefined,
            threshold: values!.threshold || undefined,
            discount: values!.discount || undefined,
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
          const res = await HandleLockCustomerCard({
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
        queryClient.invalidateQueries({ queryKey: ['customer-cards'] });
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
  const DetailCustomerCards = ({
    id,
    image,
    name,
    threshold,
    discount,
    description,
    status,
  }: CustomerCardsType) => {
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
            threshold: threshold!,
            discount: discount!,
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
                  imageCategoryName="customer-cards"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs["image"]}
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled={true} />
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
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="threshold"
                  label={defaultLabels["threshold"]}
                  className="modal__form-group-item"
                >
                  <InputNumber disabled={true} />
                </Form.Item>
                <Form.Item
                  name="discount"
                  label={defaultLabels["discount"]}
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
  const CreateCustomerCards = () => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();

    return (
      <>
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
                handleSubmitMutation.mutate({ type: "create", values: values, imageFile: imageFile });

                // Xoá class 'active' thể hiện nút không còn được nhấn
                submitButton?.classList.remove("active");
              }

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }}
          >
            <div className="modal__form-group-warper">
              <p className="modal__form-group-title">
                {defaultLabels["title"]}
              </p>
              <div className="modal__form-group">
                <Form.Item
                  name="image"
                  label={defaultLabels["image"]}
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
                  name="name"
                  label={defaultLabels["name"]}
                  htmlFor="create-name"
                  className="modal__form-group-item multiple-2"
                  rules={[
                    ruleRequired("Tên thẻ khách hàng không được để trống !"),
                  ]}
                >
                  <Input id="create-name" placeholder={defaultInputs["name"]} />
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
                    allowClear={true}
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
                <div className="modal__form-group-item-warper split-2">
                  <Form.Item
                    name="threshold"
                    label={defaultLabels["threshold"]}
                    htmlFor="create-threshold"
                    className="modal__form-group-item"
                    rules={[ruleRequired("Cần nhập Mức tiêu !")]}
                  >
                    <InputNumber
                      min={0}
                      id="create-threshold"
                      placeholder={defaultInputs["threshold"]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="discount"
                    label={defaultLabels["discount"]}
                    htmlFor="create-discount"
                    className="modal__form-group-item"
                    rules={[ruleRequired("Cần nhập Giảm giá !")]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      id="create-discount"
                      placeholder={defaultInputs["discount"]}
                    />
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
      </>
    );
  };
  const UpdateCustomerCards = ({
    id,
    image,
    name,
    threshold,
    discount,
    description,
    status,
  }: CustomerCardsType) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<RcFile>();

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
            threshold: threshold!,
            discount: discount!,
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
                  imageCategoryName="customer-cards"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs["image"]}
                />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels["name"]}
                htmlFor="update-name"
                className="modal__form-group-item multiple-2"
                rules={[
                  ruleRequired("Tên thẻ khách hàng không được để trống !"),
                ]}
              >
                <Input id="update-name" placeholder={defaultInputs["name"]} />
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
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="threshold"
                  label={defaultLabels["threshold"]}
                  htmlFor="update-threshold"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần nhập Mức tiêu !")]}
                >
                  <InputNumber
                    min={0}
                    id="update-threshold"
                    placeholder={defaultInputs["threshold"]}
                  />
                </Form.Item>
                <Form.Item
                  name="discount"
                  label={defaultLabels["discount"]}
                  htmlFor="update-discount"
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần nhập Giảm giá !")]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    id="update-discount"
                    placeholder={defaultInputs["discount"]}
                  />
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
  const LockCustomerCards = ({
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
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b> thẻ
              khách hàng có mã đối tượng là <b>{id}</b> ?
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
  const AdminCustomerCardsModal = {
    detail: (customerCards: CustomerCardsType) => (
      <DetailCustomerCards
        id={customerCards!.id}
        image={customerCards!.image}
        name={customerCards!.name}
        threshold={customerCards!.threshold}
        discount={customerCards!.discount}
        description={customerCards!.description}
        status={customerCards!.status}
      />
    ),
    create: () => <CreateCustomerCards />,
    update: (customerCards: CustomerCardsType) => (
      <UpdateCustomerCards
        id={customerCards!.id}
        image={customerCards!.image}
        name={customerCards!.name}
        threshold={customerCards!.threshold}
        discount={customerCards!.discount}
        description={customerCards!.description}
        status={customerCards!.status}
      />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockCustomerCards id={id} status={status} />
    ),
  };

  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">Vận hành quán ăn - {objectName}</h2>
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
                    getActionNameEn(1) + " customer-cards",
                    AdminCustomerCardsModal.create()
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
            className="table-actions customer-cards"
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

export default AdminCustomerCardsPage;
