import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faLock,
  faPenToSquare,
  faPlus,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import {
  Image,
  DatePicker,
  Form,
  Input,
  Select,
  Tag,
  type SelectProps,
  Rate,
  Space,
  Carousel,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import type { ColumnsType } from "antd/es/table";
import type { ReactQueryMutationProps } from "../../common/props.tsx";
import type {
  CustomersFormatType,
  RestaurantsType,
  RestaurantsFormatType,
  RestaurantImagesFormatType,
} from "../../common/types.tsx";
import { ruleEmail, rulePhone, ruleRequired } from "../../common/rules.tsx";
import {
  CommonGender,
  CommonStatus,
  ReactQueryGetData,
  TitleModalCommon,
  UserIsUsingValue,
  UserRoleValue,
} from "../../common/values.tsx";
import CustomFindInput from "../../components/common/find-input.tsx";
import CustomFindSelect from "../../components/common/find-select.tsx";
import CustomImageUpload from "../../components/common/image-upload.tsx";
import CustomTableActions from "../../components/common/table-actions.tsx";
import CustomModal from "../../components/common/modal.tsx";
import {
  FindAllCustomer,
  FindAllManager,
  FindAllRestaurantForPublicPage,
  FindAllUser,
  HandleCreateRestaurant,
  HandleLockRestaurant,
  HandleUpdateRestaurant,
} from "../../services/api.tsx";
import { getActionNameEn } from "../../services/default-actions.tsx";
import { openConfirmation } from "../../utils/showConfirmation.ts";
import { openNotification } from "../../utils/showNotification.ts";
import dayjs from "dayjs";
import CustomImagesUpload from "../../components/common/images-upload.tsx";
import { convertUrlsToUploadFiles } from "../../utils/otherEvents.ts";
import { showCreateValidAddress } from "../../utils/showCreateValidAddress.tsx";

// Các giá trị chung
// - Tên đối tượng
const objectName = "Nhà hàng";
// - Tiêu đề modal
const titleModalDetail = TitleModalCommon.detail(objectName.toLowerCase());
const titleModalCreate = TitleModalCommon.create(objectName.toLowerCase());
const titleModalUpdate = TitleModalCommon.update(objectName.toLowerCase());
const titleModalLock = TitleModalCommon.lock(objectName.toLowerCase());
const titleModalUnlock = TitleModalCommon.unlock(objectName.toLowerCase());
// - Key của notification
const notificationKey = "restaurants-notification";

// Admin Restaurants Page
const AdminRestaurantsPage = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Biến giữ dữ liệu về chức vụ
  const { data: managers } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const res = await FindAllManager({
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
    { label: CommonStatus.active, value: CommonStatus.active },
    { label: CommonStatus.inactive, value: CommonStatus.inactive },
  ];
  const [filterStatusValue, setFilterStatusValue] = useState<string[] | null>(
    null
  );

  // Các thành phần giữ giá trị cho việc hiển thị bảng dữ liệu
  // - Truy vấn dữ liệu
  const {
    data: restaurants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "restaurants",
      filterFindType,
      filterFindValue,
      filterStatusValue,
    ],
    queryFn: async () => {
      const res = await FindAllRestaurantForPublicPage({
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
  const columns: ColumnsType<RestaurantsFormatType> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: "8%",
      sorter: (a, b) => a?.id! - b?.id!,
    },
    {
      title: "Hình ảnh",
      dataIndex: "restaurantImages",
      key: "restaurantImages",
      width: "18%",
      render: (restaurantImages: RestaurantImagesFormatType[]) => {
        const list = restaurantImages?.length
          ? restaurantImages
          : [{ image: "/src/assets/images/others/no-image.png" }];

        return (
          <Carousel dots={false} autoplay>
            {list.map((item, i) => (
              <Image key={i} src={item.image} />
            ))}
          </Carousel>
        );
      },
    },
    {
      title: "Tên nhà hàng",
      dataIndex: "name",
      key: "name",
      width: "24%",
      className: "left",
      sorter: (a, b) => a?.name!.localeCompare(b?.name!),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
      sorter: (a, b) => a?.phone!.localeCompare(b?.phone!),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "18%",
      sorter: (a, b) => a?.email!.localeCompare(b?.email!),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
      render: (text: any, record: CustomersFormatType, index: number) => (
        <>
          {
            <button
              className={"action " + getActionNameEn(0)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalDetail,
                  true,
                  "89%",
                  getActionNameEn(0) + " restaurants",
                  AdminRestaurantsModal.detail(record)
                )
              }
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(2)}
              onClick={() =>
                updatePropertiesModal(
                  titleModalUpdate,
                  true,
                  "89%",
                  getActionNameEn(2) + " restaurants",
                  AdminRestaurantsModal.update(record)
                )
              }
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          }
          {
            <button
              className={"action " + getActionNameEn(3)}
              onClick={() =>
                updatePropertiesModal(
                  record.status == CommonStatus.active
                    ? titleModalLock
                    : titleModalUnlock,
                  true,
                  "30%",
                  getActionNameEn(3) + " restaurants",
                  AdminRestaurantsModal.lock(
                    record!.id as number,
                    record!.status
                  )
                )
              }
            >
              <FontAwesomeIcon
                icon={record.status == CommonStatus.active ? faLock : faUnlock}
              />
            </button>
          }
        </>
      ),
    },
  ];

  console.log(restaurants);

  // Các thành phần giữ giá trị cho việc hiển thị modal
  // - Các biến
  const [titleModal, setTitleModal] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [widthModal, setWidthModal] = useState<string>("");
  const [classNameModal, setClassNameModal] = useState<string>("");
  const [childrenModal, setChildrenModal] = useState<ReactNode>();
  // - Các giá trị mặc định của nhãn
  const defaultLabels = {
    title: "Thông tin cơ bản",
    id: "Mã nhà hàng",
    manager: "Chủ nhà hàng",
    createAt: "Thời gian tạo",
    images: "Hình ảnh",
    name: "Tên nhà hàng",
    phone: "Số điện thoại",
    email: "Email",
    address: "Địa chỉ",
    description: "Mô tả",
    rating: "Đánh giá",
    status: "Trạng thái",
  };
  // - Các giá trị mặc định của nhập liệu
  const defaultInputs = {
    title: "",
    id: "Chưa xác định !",
    manager: "Chọn Chủ nhà hàng",
    createAt: "",
    images: "Hình ảnh",
    name: "Nhập Tên nhà hàng",
    phone: "Nhập Số điện thoại",
    email: "Nhập Email",
    address: "Nhập Địa chỉ",
    description: "Nhập Mô tả",
    rating: "",
    status: "Chọn Trạng thái",
  };
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
  // - Mutation cho việc thêm, cập nhật và khoá dữ liệu
  const handleSubmitMutation = useMutation({
    mutationFn: async ({
      type,
      values,
      objectId,
      imageFiles,
    }: ReactQueryMutationProps<RestaurantsType>) => {
      console.log(imageFiles);
      if (openModal) {
        if (type === "create" && titleModal === titleModalCreate) {
          const res = await HandleCreateRestaurant({
            managerId: values!.managerId || undefined,
            createAt:
              values!.createAt && dayjs(values!.createAt).isValid()
                ? dayjs(values!.createAt).format("YYYY-MM-DD HH:mm:ss")
                : undefined,
            restaurantImages: imageFiles! || undefined,
            name: values!.name || undefined,
            phone: values!.phone || undefined,
            email: values!.email || undefined,
            address: values!.address || undefined,
            description: values!.description || undefined,
            rating: values!.rating || undefined,
            status: values!.status || undefined,
          });

          if (res.status === 200) {
            return res.data;
          }
          {
            throw new Error(String(res.data));
          }
        } else if (type === "update" && titleModal === titleModalUpdate) {
          const res = await HandleUpdateRestaurant({
            id: values!.id,
            managerId: values!.managerId || undefined,
            restaurantImages: imageFiles! || undefined,
            name: values!.name || undefined,
            phone: values!.phone || undefined,
            email: values!.email || undefined,
            address: values!.address || undefined,
            description: values!.description || undefined,
            rating: values!.rating || undefined,
            updateAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
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
          const res = await HandleLockRestaurant({
            id: objectId! as number,
            status:
              (type === "lock" ? CommonStatus.active : CommonStatus.inactive) ||
              undefined,
            updateAt: new Date().toISOString(),
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
    onMutate: () => {
      openNotification({
        key: notificationKey,
        type: "info",
        icon: <LoadingOutlined />,
        message: "Đang xử lý...",
        description: "Vui lòng chờ giây lát",
        duration: null,
      });
    },
    onSuccess: () => {
      openNotification({
        key: notificationKey,
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
        queryClient.invalidateQueries({ queryKey: ["managers"] });
        queryClient.invalidateQueries({ queryKey: ["restaurants"] });
        setOpenModal(false);
      }, 1500);
    },
    onError: (error) => {
      openNotification({
        key: notificationKey,
        type: "error",
        message: "Thất bại",
        description: error
          ? error.message
          : (openModal
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
  const DetailRestaurants = ({
    restaurant,
  }: {
    restaurant: RestaurantsFormatType;
  }) => {
    const [form] = Form.useForm();
    const [images, setImages] = useState<UploadFile[]>([]);

    useEffect(() => {
      const load = async () => {
        const files = await convertUrlsToUploadFiles(
          restaurant?.restaurantImages?.map(
            (restaurantImage) => restaurantImage.image!
          ) || []
        );
        setImages(files);
      };
      load();
    }, [restaurant]);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: restaurant?.id,
            manager:
              "#" +
              restaurant?.manager?.id +
              " - " +
              restaurant?.manager?.fullname,
            createAt: restaurant?.createAt
              ? dayjs(restaurant?.createAt)
              : undefined,
            name: restaurant?.name,
            phone: restaurant?.phone,
            email: restaurant?.email,
            address: restaurant?.address,
            description: restaurant?.description,
            rating: restaurant?.rating,
            status: restaurant?.status,
          }}
          className="modal__form split-3"
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" disabled />
                </Form.Item>
                <Form.Item
                  name="createAt"
                  label={defaultLabels.createAt}
                  className="modal__form-group-item"
                >
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    className="text-center"
                    disabled
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="address"
                label={defaultLabels.address}
                className="modal__form-group-item multiple-2"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <TextArea className="multiple-2" disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="status"
                  label={defaultLabels.status}
                  className="modal__form-group-item"
                >
                  <Select disabled />
                </Form.Item>
                <Form.Item
                  name="rating"
                  label={defaultLabels.rating}
                  className="modal__form-group-item"
                >
                  <Rate allowHalf disabled />
                </Form.Item>
              </div>
              <Form.Item
                name="manager"
                label={defaultLabels.manager}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item
                name="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              {restaurant?.restaurantImages?.length! > 0 ? (
                <Form.Item
                  label={
                    defaultLabels.images +
                    " (Tổng số ảnh: " +
                    restaurant?.restaurantImages?.length +
                    ")"
                  }
                >
                  <CustomImagesUpload
                    initialImages={images}
                    disabled={true}
                  />
                </Form.Item>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <img
                      src="/src/assets/images/others/image-question-icon.png"
                      alt=""
                      style={{ width: 200, height: 200 }}
                    />
                    <p style={{ fontSize: 22, fontWeight: 600 }}>
                      Nhà hàng này chưa cập nhật ảnh.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Form>
      </>
    );
  };
  const CreateRestaurants = () => {
    const [form] = Form.useForm();
    const [images, setImages] = useState<UploadFile[]>([]);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [images]);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          initialValues={{
            createAt: dayjs(),
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
                imageFiles: images?.map((image) => image.originFileObj!) || [],
              });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="modal__form-group-item"
                >
                  <Input
                    placeholder={defaultInputs.id}
                    className="text-center"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="createAt"
                  label={defaultLabels.createAt}
                  className="modal__form-group-item"
                >
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    className="text-center"
                    disabled
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item"
                rules={[ruleRequired("Tên nhà hàng không được để trống")]}
              >
                <Input placeholder={defaultInputs.name} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống"),
                  rulePhone(),
                ]}
              >
                <Input placeholder={defaultInputs.phone} />
              </Form.Item>
              <Form.Item
                label={defaultLabels.address}
                className="modal__form-group-item multiple-2"
                required
              >
                <Space.Compact>
                  <Form.Item
                    name="address"
                    noStyle
                    rules={[ruleRequired("Địa chỉ không được để trống")]}
                  >
                    <Input
                      id="update-address"
                      placeholder={defaultInputs.address}
                    />
                  </Form.Item>
                  <button
                    type="button"
                    className="btn secondary-btn"
                    onClick={async () => {
                      const result = await showCreateValidAddress();
                      if (result) {
                        const { houseNumberAndStreetName, province, ward } =
                          result;

                        form.setFieldsValue({
                          address: `${houseNumberAndStreetName}, ${ward}, ${province}`,
                        });
                      }
                    }}
                  >
                    Tạo địa chỉ
                  </button>
                </Space.Compact>
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.description}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="status"
                  htmlFor="status"
                  label={defaultLabels.status}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Trạng thái !")]}
                >
                  <Select
                    id="status"
                    allowClear
                    options={[
                      {
                        label: CommonStatus.active,
                        value: CommonStatus.active,
                      },
                      {
                        label: CommonStatus.inactive,
                        value: CommonStatus.inactive,
                      },
                    ]}
                    placeholder={defaultInputs.status}
                  />
                </Form.Item>
                <Form.Item
                  name="rating"
                  label={defaultLabels.rating}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Đánh giá !")]}
                >
                  <Rate allowHalf />
                </Form.Item>
              </div>
              <Form.Item
                name="managerId"
                label={defaultLabels.manager}
                className="modal__form-group-item"
                rules={[ruleRequired("Chủ nhà hàng không được để trống !")]}
              >
                <Select
                  options={managers?.map((manager) => ({
                    label: "#" + manager?.id + " - " + manager?.fullname,
                    value: manager?.id,
                  }))}
                  placeholder={defaultInputs.manager}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
                rules={[ruleRequired("Email không được để trống"), ruleEmail()]}
              >
                <Input placeholder={defaultInputs.email} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={
                  defaultLabels.images +
                  " (Tổng số ảnh: " +
                  images?.length +
                  ")"
                }
              >
                <div ref={scrollRef} className="images-upload-warper">
                  <CustomImagesUpload initialImages={images} onChange={(list) => setImages(list)} />
                </div>
              </Form.Item>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn create">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const UpdateRestaurants = ({
    restaurant,
  }: {
    restaurant: RestaurantsFormatType;
  }) => {
    const [form] = Form.useForm();
    const [images, setImages] = useState<UploadFile[]>();
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const load = async () => {
        const files = await convertUrlsToUploadFiles(
          restaurant?.restaurantImages?.map(
            (restaurantImage) => restaurantImage.image!
          ) || []
        );
        setImages(files);
      };
      load();
    }, [restaurant]);
    useEffect(() => {
      console.log(images);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [images]);

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            id: restaurant?.id || undefined,
            managerId: restaurant?.manager?.id || undefined,
            createAt: restaurant?.createAt
              ? dayjs(restaurant?.createAt)
              : undefined,
            name: restaurant?.name || undefined,
            phone: restaurant?.phone || undefined,
            email: restaurant?.email || undefined,
            address: restaurant?.address || undefined,
            description: restaurant?.description || undefined,
            rating: restaurant?.rating || undefined,
            status: restaurant?.status || undefined,
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
              // Danh sách dữ liệu
              const values = form.getFieldsValue();

              // Thực thi mutation
              handleSubmitMutation.mutate({
                type: "update",
                values: values,
                imageFiles:
                  images?.map((image) =>
                    image.originFileObj
                      ? image.originFileObj
                      : (image as RcFile)
                  ) || [],
                objectId: restaurant?.id,
              });

              // Xoá class 'active' thể hiện nút không còn được nhấn
              submitButton?.classList.remove("active");
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="modal__form-group-item"
                >
                  <Input
                    placeholder={defaultInputs.id}
                    className="text-center"
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  name="createAt"
                  label={defaultLabels.createAt}
                  className="modal__form-group-item"
                >
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    className="text-center"
                    disabled
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item"
                rules={[ruleRequired("Tên nhà hàng không được để trống")]}
              >
                <Input placeholder={defaultInputs.name} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống"),
                  rulePhone(),
                ]}
              >
                <Input placeholder={defaultInputs.phone} />
              </Form.Item>
              <Form.Item
                label={defaultLabels.address}
                className="modal__form-group-item multiple-2"
                required
              >
                <Space.Compact>
                  <Form.Item
                    name="address"
                    noStyle
                    rules={[ruleRequired("Địa chỉ không được để trống")]}
                  >
                    <Input
                      id="update-address"
                      placeholder={defaultInputs.address}
                    />
                  </Form.Item>
                  <button
                    type="button"
                    className="btn secondary-btn"
                    onClick={async () => {
                      const result = await showCreateValidAddress();
                      if (result) {
                        const { houseNumberAndStreetName, province, ward } =
                          result;

                        form.setFieldsValue({
                          address: `${houseNumberAndStreetName}, ${ward}, ${province}`,
                        });
                      }
                    }}
                  >
                    Tạo địa chỉ
                  </button>
                </Space.Compact>
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.description}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="status"
                  htmlFor="status"
                  label={defaultLabels.status}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Trạng thái !")]}
                >
                  <Select
                    id="status"
                    allowClear
                    options={[
                      {
                        label: CommonStatus.active,
                        value: CommonStatus.active,
                      },
                      {
                        label: CommonStatus.inactive,
                        value: CommonStatus.inactive,
                      },
                    ]}
                    placeholder={defaultInputs.status}
                  />
                </Form.Item>
                <Form.Item
                  name="rating"
                  label={defaultLabels.rating}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Đánh giá !")]}
                >
                  <Rate allowHalf />
                </Form.Item>
              </div>
              <Form.Item
                name="managerId"
                label={defaultLabels.manager}
                className="modal__form-group-item"
                rules={[ruleRequired("Chủ nhà hàng không được để trống !")]}
              >
                <Select
                  options={managers?.map((manager) => ({
                    label: "#" + manager?.id + " - " + manager?.fullname,
                    value: manager?.id,
                  }))}
                  placeholder={defaultInputs.manager}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
                rules={[ruleRequired("Email không được để trống"), ruleEmail()]}
              >
                <Input placeholder={defaultInputs.email} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={
                  defaultLabels.images +
                  " (Tổng số ảnh: " +
                  images?.length +
                  ")"
                }
              >
                <div ref={scrollRef} className="images-upload-warper">
                  <CustomImagesUpload
                    initialImages={images}
                    onChange={(list) => setImages(list)}
                  />
                </div>
              </Form.Item>
            </div>
            <div className="modal__buttons">
              <button type="submit" className="modal__button btn update">
                Xác nhận
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };
  const LockRestaurants = ({
    id,
    status,
  }: {
    id: number;
    status: string | undefined;
  }) => {
    const [form] = Form.useForm();
    const statusValue = status == CommonStatus.active ? true : false;

    return (
      <>
        <Form
          layout="vertical"
          form={form}
          className="modal__form"
          onFinish={async (e) => {
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
              Bạn có xác nhận rằng <b>{statusValue ? "khoá" : "mở khoá"}</b> nhà
              hàng có mã đối tượng là <b>{id}</b> ?
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
  const AdminRestaurantsModal = {
    detail: (restaurant: RestaurantsFormatType) => (
      <DetailRestaurants restaurant={restaurant} />
    ),
    create: () => <CreateRestaurants />,
    update: (restaurant: RestaurantsFormatType) => (
      <UpdateRestaurants restaurant={restaurant} />
    ),
    lock: (id: number, status: string | undefined) => (
      <LockRestaurants id={id} status={status} />
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
          {
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
                  getActionNameEn(1) + " restaurants",
                  AdminRestaurantsModal.create()
                )
              }
            >
              <FontAwesomeIcon icon={faPlus} className="icon" />
              &nbsp;Thêm&nbsp;{objectName.toLowerCase()}
            </button>
          }
        </div>
        <div className="main__table">
          <CustomTableActions<RestaurantsFormatType>
            columns={columns}
            data={restaurants || []}
            rowKey={(record) => String(record?.id)}
            loading={isLoading}
            defaultPageSize={10}
            className="table-actions restaurants"
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

export default AdminRestaurantsPage;
