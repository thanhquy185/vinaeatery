import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Mail, MapPin, Phone, Utensils } from "lucide-react";
import {
  Carousel,
  Input,
  Select,
  Rate,
  Button,
  Card,
  Modal,
  Form,
  Row,
  Col,
  InputNumber,
  DatePicker,
  Layout,
  Divider,
} from "antd";
import {
  HeartOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { useForm } from "antd/es/form/Form";
import type { ReactQueryMutationProps } from "../../common/props";
import type {
  CustomerType,
  OrderTableType,
  RestaurantType,
} from "../../common/types";
import { ruleEmail, rulePhone, ruleRequired } from "../../common/rules";
import {
  CommonStatus,
  ImageSourcePath,
  OrderStatus,
  ReactQueryGetData,
  UserRoleValue,
} from "../../common/values";
import { openConfirmation } from "../../utils/show-confirmation";
import { openNotification } from "../../utils/show-notification";
import { vietnamMoneyFormat } from "../../utils/other-events";
import dayjs from "dayjs";
import { HandleCreateOrderTable } from "../../requests/order-tables";
import { FindAllRestaurantForPublicPage } from "../../requests/restaurants";

//
const notificationKey = "public-restaurant-notification";

const PublicRestaurantPage = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Load dữ liệu khách hàng đang đăng nhập
  const infoLoginRouteLoaderData =
    useRouteLoaderData("public-info-login") || {};
  const infoLogin = infoLoginRouteLoaderData.infoLogin
    ? (infoLoginRouteLoaderData.infoLogin as CustomerType)
    : undefined;
  const isCustomerLogin =
    infoLogin && infoLogin?.user?.role == UserRoleValue.customer;

  // Dữ liệu nhà hàng
  const {
    data: restaurants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await FindAllRestaurantForPublicPage({
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
    // enabled: !!filterFindType, //
    retry: ReactQueryGetData.retry,
    staleTime: ReactQueryGetData.staleTime,
  });

  // Trạng thái nhà hàng được chọn để xem chi tiết
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantType | null>(null);

  // Giới hạn số món hiển thị mặc định
  const maxVisible = 3;
  const [showAllFoods, setShowAllFoods] = useState<boolean>(false);
  const foodsToShow = showAllFoods
    ? selectedRestaurant?.restaurantFoods
    : selectedRestaurant?.restaurantFoods?.slice(0, maxVisible);
  // Xử lý khi mở modal chi tiết nhà hàng
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const openRestaurantModal = (rest: RestaurantType) => {
    setSelectedRestaurant(rest);
    setOpenDetail(true);
  };
  // Xử lý khi khách hàng đặt bàn nhà hàng
  const [openBooking, setOpenBooking] = useState<boolean>(false);
  const [formBooking] = useForm();
  //
  useEffect(() => {
    setShowAllFoods(false);
    formBooking.resetFields();
  }, [openDetail, openBooking]);

  // Mutation cho việc huỷ đặt bàn
  const handleCreateOrderTableMutation = useMutation({
    mutationFn: async ({
      type,
      values,
    }: ReactQueryMutationProps<OrderTableType>) => {
      if (type === "create") {
        console.log(values);
        const res = await HandleCreateOrderTable({
          restaurantId: selectedRestaurant?.id,
          customerId: infoLogin?.id,
          createAt: values?.createAt
            ? dayjs(values?.createAt).format("YYYY-MM-DD HH:mm:ss")
            : undefined,
          arriveAt: values?.arriveAt
            ? dayjs(values?.arriveAt).format("YYYY-MM-DD HH:mm:ss")
            : undefined,
          customerFullname: values?.customerFullname || undefined,
          customerPhone: values?.customerPhone || undefined,
          customerEmail: values?.customerEmail || undefined,
          customerNote: values?.customerNote || undefined,
          guests: values?.guests || undefined,
          status: OrderStatus.pending || undefined,
        });

        if (res.status === 200) {
          return res.data;
        }
        {
          throw new Error(String(res.data));
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
        description: "Đặt bàn nhà hàng thành công!",
      });

      setTimeout(() => {
        // queryClient.invalidateQueries({ queryKey: ["restaurants"] });
        setOpenDetail(false);
        setOpenBooking(false);
      }, 1500);
    },
    onError: (error) => {
      openNotification({
        key: notificationKey,
        type: "error",
        message: "Thất bại",
        description: error ? error.message : "Đặt bàn nhà hàng thất bại!",
      });

      setTimeout(() => {}, 1500);
    },
  });

  return (
    <>
      <Layout
        style={{ minHeight: "calc(100vh - 90px)", backgroundColor: "#f4f6fa" }}
      >
        <div className="container mx-auto sm:px-6 lg:px-8 py-8 py-14!">
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
            bodyStyle={{ padding: 40 }}
          >
            <Title
              level={2}
              style={{ fontWeight: 700, color: "#333", marginBottom: 20 }}
            >
              Danh sách Nhà hàng
            </Title>
            <div
              style={{
                background: "#fff",
                padding: 24,
                border: "1px solid #eee",
                borderRadius: 16,
                marginTop: 20,
              }}
            >
              <Row gutter={[20, 20]}>
                <Col xs={36} sm={18} lg={9}>
                  <p className="text-2xl font-semibold">
                    Tìm kiếm theo tên nhà hàng
                  </p>
                  <Input
                    size="large"
                    placeholder="Nhập tên nhà hàng..."
                    prefix={<SearchOutlined />}
                    style={{ marginTop: 4, borderRadius: 8 }}
                    // value={searchName}
                    // onChange={(e) => setSearchName(e.target.value)}
                  />
                </Col>
                <Col xs={20} sm={10} lg={5}>
                  <p className="text-2xl font-semibold">Sắp xếp</p>
                  <Select
                    size="large"
                    placeholder="Sắp xếp theo"
                    options={[
                      { label: "Mặc định", value: "default" },
                      { label: "Đánh giá cao → thấp", value: "rating-desc" },
                      { label: "Tên A → Z", value: "name-asc" },
                    ]}
                    // value={sortOption}
                    // onChange={(v) => setSortOption(v)}
                    style={{ width: "100%", marginTop: 4, borderRadius: 8 }}
                  />
                </Col>
                <Col xs={20} sm={10} lg={5}>
                  <p className="text-2xl font-semibold">Khu vực</p>
                  <Select
                    size="large"
                    placeholder="Chọn Khu vực"
                    options={[
                      { label: "Tất cả khu vực", value: "tat-ca" },
                      { label: "TP. HCM", value: "hcm" },
                      { label: "Hà Nội", value: "hn" },
                    ]}
                    // value={selectedRestaurantArea}
                    // onChange={(v) => setSelectedRestaurantArea(v)}
                    style={{ width: "100%", marginTop: 4, borderRadius: 8 }}
                  />
                </Col>
                <Col xs={20} sm={10} lg={5}>
                  <p className="text-2xl font-semibold">Đánh giá</p>
                  <Rate
                    allowClear
                    allowHalf
                    style={{ width: "100%", marginTop: 10 }}
                  />
                </Col>
              </Row>
            </div>
            <div style={{ marginTop: 16 }}>
              <Row gutter={[16, 16]}>
                {restaurants &&
                  restaurants.map((restaurant) => (
                    <Col key={restaurant.id} className="public-restaurant">
                      <Card
                        onClick={() => openRestaurantModal(restaurant)}
                        bordered
                        cover={
                          <img
                            src={
                              restaurant?.restaurantImages?.length! > 0
                                ? restaurant?.restaurantImages![0].image
                                : ImageSourcePath + "no-image.png"
                            }
                            alt={"image-" + restaurant?.id}
                          />
                        }
                      >
                        <h3>{restaurant.name}</h3>
                        {/* <p>
                          <User />
                          {restaurant.manager?.fullname}
                        </p> */}
                        <p>
                          <Phone />
                          {restaurant.phone}
                        </p>
                        <p>
                          <Mail />
                          {restaurant.email}
                        </p>
                        <p>
                          <MapPin />
                          {restaurant.address}
                        </p>
                        <div className="footer">
                          <Rate disabled value={restaurant?.rating} />
                          <div className="numbers">
                            <span className="number-of-foods">
                              {restaurant?.restaurantFoods?.length}
                              <Utensils />
                            </span>
                            <span className="number-of-favorites">
                              0<Heart />
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </div>
          </Card>
        </div>
      </Layout>
      <Modal
        centered
        title={
          <div className="flex justify-between items-center mb-4!">
            <p className="text-4xl">{selectedRestaurant?.name}</p>
            <Rate disabled value={selectedRestaurant?.rating} />
          </div>
        }
        open={openDetail}
        onCancel={() => setOpenDetail(false)}
        width="64%"
        footer={[
          <Button
            type="primary"
            className="w-80 rounded-xl font-bold mt-6!"
            disabled={!selectedRestaurant || !infoLogin || !isCustomerLogin}
            style={{ height: 35, fontWeight: 600 }}
            onClick={async () => {
              setOpenBooking(true);
            }}
          >
            Đặt bàn
          </Button>,
          <Button
            variant="solid"
            color="magenta"
            icon={<HeartOutlined />}
            className="rounded-xl font-bold mt-6!"
            disabled={!selectedRestaurant || !infoLogin || !isCustomerLogin}
            style={{ height: 35, fontWeight: 600 }}
            onClick={async () => {}}
          ></Button>,
        ]}
      >
        {selectedRestaurant && (
          <div className="space-y-6">
            <Divider />
            {selectedRestaurant?.restaurantImages?.length! > 1 ? (
              <Carousel autoplay className="rounded-2xl overflow-hidden">
                {selectedRestaurant?.restaurantImages?.map((img, i) => (
                  <img
                    key={i}
                    src={img.image}
                    className="h-160 w-full object-cover"
                  />
                ))}
              </Carousel>
            ) : (
              <img
                src={
                  selectedRestaurant?.restaurantImages![0]?.image
                    ? selectedRestaurant?.restaurantImages![0]?.image
                    : ImageSourcePath + "no-image.png"
                }
                className="h-160 w-full object-cover rounded-2xl"
              />
            )}
            <div className="mt-4!">
              {/* <h3 className="text-lg font-semibold mb-3">Thông tin cơ bản</h3> */}
              <div className="grid md:grid-cols-2 gap-6 p-4 rounded-2xl">
                <div>
                  <p className="text-2xl text-gray-700">
                    <strong>Điện thoại:</strong> {selectedRestaurant?.phone}
                  </p>
                  <p className="text-2xl text-gray-700">
                    <strong>Email:</strong> {selectedRestaurant?.email}
                  </p>
                  <p className="text-2xl text-gray-700">
                    <strong>Địa chỉ:</strong> {selectedRestaurant?.address}
                  </p>
                </div>
                <div
                // className="bg-gray-50 p-4! text-2xl text-gray-700 rounded-xl"
                >
                  {selectedRestaurant?.description}
                </div>
              </div>
            </div>
            <div className="mt-6!">
              <h3 className="text-xl font-semibold">Chủ nhà hàng</h3>
              <div className="flex gap-4 items-center bg-red-50 p-4! rounded-xl">
                <img
                  src={
                    selectedRestaurant?.manager?.image
                      ? (selectedRestaurant?.manager?.image as string)
                      : ImageSourcePath + "no-image.png"
                  }
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <p className="text-2xl font-semibold text-gray-800">
                    {selectedRestaurant?.manager?.fullname}
                  </p>
                  <p className="text-xl text-gray-500">
                    Điện thoại: {selectedRestaurant?.manager?.phone}
                  </p>
                  <p className="text-xl text-gray-500">
                    Email: {selectedRestaurant?.manager?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6!">
              <h3 className="text-xl font-semibold mb-2!">Danh sách món ăn</h3>
              {foodsToShow?.length! > 0 ? (
                <>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {foodsToShow?.map((food, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl shadow transition overflow-hidden"
                      >
                        <img
                          src={
                            food.image
                              ? (food.image as string)
                              : ImageSourcePath + "no-image.png"
                          }
                          className="w-full h-60"
                        />
                        <div className="p-4!">
                          <div className="text-2xl font-medium truncate">
                            {food.name}
                          </div>
                          <div className="text-xl text-gray-500 truncate">
                            {food.categoryFood?.name}
                          </div>
                          <div className="text-2xl text-right text-yellow-500 font-semibold mt-1">
                            {vietnamMoneyFormat(food.price || 0)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedRestaurant?.restaurantFoods?.length! >
                    maxVisible && (
                    <div className="text-center mt-5!">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setShowAllFoods(!showAllFoods)}
                      >
                        {showAllFoods ? "Thu gọn" : "Xem thêm"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center items-center flex-col h-60">
                  <img
                    src={ImageSourcePath + "cooking-icon.png"}
                    alt=""
                    className="w-35 h-35"
                  />
                  <p className="text-2xl font-bold mt-6!">
                    Hiện tại phía nhà hàng chưa cập nhật danh sách món ăn.
                  </p>
                </div>
              )}
            </div>
            <Divider />
          </div>
        )}
      </Modal>
      <Modal
        centered
        title={<p className="text-4xl">Đặt bàn {selectedRestaurant?.name}</p>}
        open={openBooking}
        width={660}
        onCancel={() => setOpenBooking(false)}
        footer={null}
      >
        <Form
          form={formBooking}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            createAt: dayjs(),
            arriveAt: undefined,
            customerFullname: infoLogin?.fullname || undefined,
            customerPhone: infoLogin?.phone || undefined,
            customerEmail: infoLogin?.email || undefined,
            guests: undefined,
            note: undefined,
          }}
          onFinish={async () => {
            // Hỏi trước khi xử khi xử lý ?
            const answer = await openConfirmation({
              title: `Bạn có chắc chắn cập nhật thông tin ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              // Danh sách dữ liệu
              const values = formBooking.getFieldsValue();

              // Thực thi mutation
              handleCreateOrderTableMutation.mutate({
                type: "create",
                values: values,
              });
            }
          }}
        >
          <Divider />
          <Row className="gap-6 mt-6!">
            <Col className="flex-1">
              <Form.Item
                name="createAt"
                label={
                  <span style={{ fontWeight: 600 }}>Thời gian đặt bàn</span>
                }
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%", height: 40 }}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col className="flex-1">
              <Form.Item
                hasFeedback
                name="arriveAt"
                htmlFor="arriveAt"
                label={
                  <span style={{ fontWeight: 600 }}>Thời gian dự kiến</span>
                }
                rules={[ruleRequired("Thời gian dự kiến không được để trống!")]}
              >
                <DatePicker
                  showTime
                  id="arriveAt"
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Chọn Thời gian dự kiến"
                  style={{ width: "100%", height: 40 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row className="gap-6 mt-6!">
            <Col className="flex-1">
              <Form.Item
                hasFeedback
                name="customerFullname"
                htmlFor="customerFullname"
                label={<span style={{ fontWeight: 600 }}>Họ và tên</span>}
                rules={[ruleRequired("Họ và tên không được để trống!")]}
              >
                <Input
                  id="customerFullname"
                  placeholder="Nhập Họ và tên"
                  style={{ height: 40 }}
                />
              </Form.Item>
            </Col>
            <Col className="flex-1">
              <Form.Item
                hasFeedback
                name="guests"
                htmlFor="guests"
                label={<span style={{ fontWeight: 600 }}>Số lượng khách</span>}
                rules={[ruleRequired("Số lượng khách không được để trống!")]}
              >
                <InputNumber
                  id="guests"
                  min={1}
                  placeholder="Nhập Số lượng khách"
                  style={{ width: "100%", height: 40 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row className="gap-6 mt-6!">
            <Col className="flex-1">
              <Form.Item
                hasFeedback
                name="customerPhone"
                htmlFor="customerPhone"
                label={<span style={{ fontWeight: 600 }}>Số điện thoại</span>}
                rules={[
                  ruleRequired("Số điện thoại không được để trống!"),
                  rulePhone(),
                ]}
              >
                <Input
                  id="customerPhone"
                  placeholder="Nhập Số điện thoại"
                  style={{ height: 40 }}
                />
              </Form.Item>
            </Col>
            <Col className="flex-1">
              <Form.Item
                hasFeedback
                name="customerEmail"
                htmlFor="customerEmail"
                label={<span style={{ fontWeight: 600 }}>Email</span>}
                rules={[
                  ruleRequired("Email không được để trống!"),
                  ruleEmail(),
                ]}
              >
                <Input
                  id="customerEmail"
                  placeholder="Nhập Email"
                  style={{ height: 40 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="customerNote"
            htmlFor="customerNote"
            label={<span style={{ fontWeight: 600 }}>Ghi chú</span>}
            className="mt-6!"
          >
            <Input.TextArea
              id="customerNote"
              rows={5}
              placeholder="Nhập Ghi chú"
            />
          </Form.Item>
          <Divider />
          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-6"
            style={{ height: 35, fontWeight: 600 }}
          >
            Xác nhận đặt bàn
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default PublicRestaurantPage;
