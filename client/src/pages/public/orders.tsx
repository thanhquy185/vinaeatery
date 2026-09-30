// import { useState } from "react";
// import { useRouteLoaderData } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   Layout,
//   Typography,
//   Row,
//   Col,
//   Card,
//   List,
//   Button,
//   Tag,
//   Modal,
//   Divider,
//   Table,
//   Timeline,
//   Image,
//   Empty,
//   Select,
// } from "antd";

// import {
//   CheckCircleOutlined,
//   CloseCircleOutlined,
//   LoadingOutlined,
//   InfoCircleOutlined,
//   ShoppingCartOutlined,
//   ClockCircleOutlined,
//   CarOutlined,
//   FileDoneOutlined,
//   CalendarOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import {
//   ImageSourcePath,
//   OrderStatus,
//   ReactQueryGetData,
// } from "../../constants/values";
// import type { CustomerType, OrderType } from "../../common/types";
// import { openConfirmation } from "../../utils/showConfirmation";
// import { openNotification } from "../../utils/showNotification";
// import { FindAllOrder, HandleUpdateOrder } from "../../requests/orders";
// import type { ReactQueryMutationProps } from "../../common/props";
// import { vietnamMoneyFormat } from "../../utils/otherEvents";

// const { Title, Paragraph, Text } = Typography;

// //
// const notificationKey = "public-order-notification";

// //
// const getStatusTag = (status?: string) => {
//   const style = {
//     padding: "6px 12px",
//     fontSize: 14,
//   };

//   switch (status) {
//     case OrderStatus.confirm:
//       return (
//         <Tag icon={<CheckCircleOutlined />} color="success" style={style}>
//           {OrderStatus.confirm}
//         </Tag>
//       );

//     case OrderStatus.pending:
//       return (
//         <Tag icon={<LoadingOutlined />} color="processing" style={style}>
//           {OrderStatus.pending}
//         </Tag>
//       );

//     case OrderStatus.canceled:
//       return (
//         <Tag icon={<CloseCircleOutlined />} color="error" style={style}>
//           {OrderStatus.canceled}
//         </Tag>
//       );

//     default:
//       return <Tag>{status}</Tag>;
//   }
// };

// //
// const PublicOrdersPage = () => {
//   //
//   const queryClient = useQueryClient();

//   //
//   const infoLoginRouteLoaderData = useRouteLoaderData("public-info-login");

//   const infoLogin = infoLoginRouteLoaderData.infoLogin as CustomerType;

//   // Query lấy danh sách đơn hàng
//   const {
//     data: orders,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["orders"],
//     queryFn: async () => {
//       const res = await FindAllOrder({
//         findType: "customer-id",
//         findValue: String(infoLogin?.id),
//       });

//       if (res.status === 200) {
//         return res.data;
//       }

//       throw new Error(String(res.data));
//     },

//     retry: ReactQueryGetData.retry,
//     staleTime: ReactQueryGetData.staleTime,
//   });

//   // Lọc dữ liệu
//   const [filterStatus, setFilterStatus] = useState<string>("Tất cả");
//   const filteredOrderTables = orders?.filter((b) => {
//     if (filterStatus === "Tất cả") return true;
//     return b.status === filterStatus;
//   });

//   //
//   const [openDetailModal, setOpenDetailModal] = useState(false);

//   //
//   const [selectedOrder, setSelectedOrder] = useState<OrderType>();

//   //
//   const openModal = (order: OrderType) => {
//     setSelectedOrder(order);
//     setOpenDetailModal(true);
//   };

//   // Mutation hủy đơn
//   const cancelOrderMutation = useMutation({
//     mutationFn: async ({ type }: ReactQueryMutationProps<OrderType>) => {
//       if (type === "update") {
//         const res = await HandleUpdateOrder({
//           id: selectedOrder?.id,
//           status: OrderStatus.canceled,
//         });

//         if (res.status === 200) {
//           return res.data;
//         }

//         throw new Error(String(res.data));
//       }
//     },

//     onMutate: () => {
//       openNotification({
//         key: notificationKey,
//         type: "info",
//         icon: <LoadingOutlined />,
//         message: "Đang xử lý...",
//         description: "Vui lòng chờ giây lát",
//         duration: null,
//       });
//     },

//     onSuccess: () => {
//       openNotification({
//         key: notificationKey,
//         type: "success",
//         message: "Thành công",
//         description: "Hủy đơn thành công",
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["orders"],
//       });
//     },

//     onError: (error) => {
//       openNotification({
//         key: notificationKey,
//         type: "error",
//         message: "Thất bại",
//         description: error.message,
//       });
//     },
//   });

//   //
//   return (
//     <>
//       <Layout
//         style={{
//           minHeight: "calc(100vh - 90px)",
//           background: "#f4f6fa",
//         }}
//       >
//         <div className="container mx-auto sm:px-6 lg:px-8 py-8 py-14!">
//           <Card
//             style={{
//               borderRadius: 12,
//               boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
//             }}
//             bodyStyle={{ padding: 40 }}
//           >
//             <Title level={3} style={{ fontWeight: 700, color: "#333" }}>
//               Lịch sử hóa đơn
//             </Title>
//             {/* {isLoading && (
//               <div className="py-20 text-center">
//                 <LoadingOutlined
//                   style={{
//                     fontSize: 36,
//                   }}
//                 />
//               </div>
//             )}
//             {isError && (
//               <Empty
//                 description={
//                   error instanceof Error ? error.message : "Lỗi tải dữ liệu"
//                 }
//               />
//             )}
//             {!isLoading && !isError && orders?.length === 0 && (
//               <Empty description="Bạn chưa có đơn hàng nào" />
//             )} */}
//             <div
//               style={{
//                 background: "#fff",
//                 padding: 24,
//                 border: "1px solid #eee",
//                 borderRadius: 16,
//                 marginTop: 20,
//               }}
//             >
//               <Row gutter={[16, 16]}>
//                 <Col xs={24} sm={12} lg={6}>
//                   <p className="text-2xl font-semibold">Trạng thái</p>
//                   <Select
//                     defaultValue="Tất cả"
//                     onChange={setFilterStatus}
//                     style={{
//                       width: "100%",
//                       height: 40,
//                       marginTop: 6,
//                       borderRadius: 8,
//                     }}
//                     options={[
//                       { value: "Tất cả", label: "Tất cả" },
//                       {
//                         value: OrderStatus.confirm,
//                         label: OrderStatus.confirm,
//                       },
//                       {
//                         value: OrderStatus.canceled,
//                         label: OrderStatus.canceled,
//                       },
//                       {
//                         value: OrderStatus.pending,
//                         label: OrderStatus.pending,
//                       },
//                     ]}
//                   />
//                 </Col>
//               </Row>
//             </div>
//             <List
//               dataSource={orders}
//               pagination={{
//                 pageSize: 4,
//               }}
//               renderItem={(item: OrderType) => (
//                 <List.Item
//                   style={{
//                     padding: 0,
//                     border: "none",
//                   }}
//                 >
//                   <Row
//                     gutter={24}
//                     style={{ width: "100%", alignItems: "center" }}
//                     className="public-order-restaurant"
//                   >
//                     {/* Left */}
//                     <Col xs={24} md={10}>
//                       <div className="flex items-center gap-3">
//                         {/* <ShoppingCartOutlined
//                           style={{
//                             fontSize: 28,
//                             color: "#1677ff",
//                           }}
//                         /> */}
//                         <div>
//                           <Title
//                             level={4}
//                             style={{
//                               margin: 0,
//                             }}
//                           >
//                             Hoá đơn #{item.id}
//                           </Title>
//                           <Paragraph
//                             style={{
//                               margin: "8px 0 0 0",
//                               color: "#555",
//                               fontSize: 16,
//                             }}
//                           >
//                             <CalendarOutlined style={{ marginRight: 8 }} />
//                             {dayjs(item.createAt).format("DD/MM/YYYY HH:mm")}
//                           </Paragraph>
//                         </div>
//                       </div>
//                     </Col>
//                     {/* Total */}
//                     <Col xs={12} md={5}>
//                       <Text strong>Tổng tiền</Text>
//                       <Title
//                         level={4}
//                         style={{
//                           color: "#e53935",
//                           margin: 0,
//                         }}
//                       >
//                         {item.totalPrice?.toLocaleString("vi-VN")}đ
//                       </Title>
//                     </Col>
//                     {/* Status */}
//                     <Col xs={12} md={4}>
//                       {getStatusTag(item.status)}
//                     </Col>
//                     {/* Action */}
//                     <Col
//                       xs={24}
//                       md={5}
//                       style={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         gap: 10,
//                       }}
//                     >
//                       <Button
//                         variant="solid"
//                         color="blue"
//                         icon={<InfoCircleOutlined />}
//                         onClick={() => openModal(item)}
//                       >
//                         Chi tiết
//                       </Button>

//                       {item.status === OrderStatus.pending && (
//                         <Button
//                           danger
//                           icon={<CloseCircleOutlined />}
//                           onClick={async () => {
//                             const answer = await openConfirmation({
//                               title: "Bạn có chắc muốn hủy đơn?",
//                               content: "Hành động này không thể hoàn tác",
//                             });

//                             if (answer) {
//                               setSelectedOrder(item);

//                               cancelOrderMutation.mutate({
//                                 type: "update",
//                               });
//                             }
//                           }}
//                         >
//                           Hủy
//                         </Button>
//                       )}
//                     </Col>
//                   </Row>
//                 </List.Item>
//               )}
//             />
//           </Card>
//         </div>
//       </Layout>

//       {/* Modal chi tiết */}
//       <Modal
//         open={openDetailModal}
//         footer={null}
//         width={900}
//         centered
//         onCancel={() => setOpenDetailModal(false)}
//       >
//         {selectedOrder && (
//           <>
//             {/* Header */}
//             <div className="mb-4">
//               <Title level={3}>Chi tiết hóa đơn</Title>
//               <Paragraph>Mã hóa đơn: #{selectedOrder.id}</Paragraph>
//               <Paragraph>
//                 Thời gian đặt:{" "}
//                 {dayjs(selectedOrder.createAt).format("DD/MM/YYYY HH:mm")}
//               </Paragraph>

//               <div>{getStatusTag(selectedOrder.status)}</div>
//             </div>
//             <Divider />
//             {/* Customer + Payment */}
//             <Row gutter={[30, 20]}>
//               {/* Customer */}
//               <Col xs={24} md={12}>
//                 <Card
//                   style={{
//                     borderRadius: 14,
//                   }}
//                 >
//                   <Title level={5}>Thông tin khách hàng</Title>
//                   <Paragraph>
//                     Họ tên: {selectedOrder.customerFullname}
//                   </Paragraph>
//                   <Paragraph>
//                     Số điện thoại: {selectedOrder.customerPhone}
//                   </Paragraph>
//                   <Paragraph>Email: {selectedOrder.customerEmail}</Paragraph>
//                 </Card>
//               </Col>
//               {/* Payment */}
//               <Col xs={24} md={12}>
//                 <Card
//                   style={{
//                     borderRadius: 14,
//                   }}
//                 >
//                   <Title level={5}>Thanh toán</Title>
//                   <Paragraph>
//                     Phương thức: {selectedOrder.payMethod?.name}
//                   </Paragraph>
//                   <Paragraph>Trạng thái: {selectedOrder.payStatus}</Paragraph>
//                   <Paragraph>
//                     Thời gian thanh toán:{" "}
//                     {selectedOrder.payTime
//                       ? dayjs(selectedOrder.payTime).format("DD/MM/YYYY HH:mm")
//                       : "Chưa thanh toán"}
//                   </Paragraph>
//                 </Card>
//               </Col>
//             </Row>
//             <Divider />
//             {/* Timeline */}
//             <Title level={5}>Trạng thái đơn hàng</Title>
//             <Timeline
//               items={[
//                 {
//                   color: "green",
//                   dot: <CheckCircleOutlined />,
//                   children: "Đặt đơn thành công",
//                 },
//                 {
//                   color:
//                     selectedOrder.status === OrderStatus.confirm
//                       ? "green"
//                       : "gray",

//                   dot: <ClockCircleOutlined />,

//                   children: "Nhà hàng xác nhận",
//                 },
//                 {
//                   color:
//                     selectedOrder.status === OrderStatus.confirm
//                       ? "blue"
//                       : "gray",

//                   dot: <CarOutlined />,

//                   children: "Đang chuẩn bị món",
//                 },
//                 {
//                   color:
//                     selectedOrder.status === OrderStatus.confirm
//                       ? "green"
//                       : "gray",

//                   dot: <FileDoneOutlined />,
//                   children: "Hoàn thành đơn hàng",
//                 },
//               ]}
//             />

//             <Divider />
//             {/* Food list */}
//             <Title level={5}>Danh sách món ăn</Title>
//             <Table
//               pagination={false}
//               dataSource={selectedOrder.orderDetails}
//               rowKey={(record) => String(record.foodId)}
//               columns={[
//                 {
//                   title: "Món ăn",
//                   align: "center",
//                   render: (_, record) => (
//                     <div className="flex  gap-3">
//                       <Image
//                         src={
//                           record.food?.image
//                             ? (record.food.imageUrl as string)
//                             : ImageSourcePath + "no-image.png"
//                         }
//                         width={100}
//                         height={70}
//                         style={{
//                           borderRadius: 12,
//                           objectFit: "cover",
//                         }}
//                       />
//                       <div style={{ textAlign: "left" }}>
//                         <Text strong>{record.food?.name}</Text>
//                         <div>
//                           <Text type="secondary">
//                             {record.food?.categoryFood?.name}
//                           </Text>
//                         </div>
//                       </div>
//                     </div>
//                   ),
//                 },
//                 {
//                   title: "Đơn giá",
//                   align: "center",
//                   render: (_, record) => (
//                     <Text>{vietnamMoneyFormat(record.price || 0)}</Text>
//                   ),
//                 },
//                 {
//                   title: "Số lượng",
//                   align: "center",
//                   dataIndex: "quantity",
//                 },
//                 {
//                   title: "Thành tiền",
//                   align: "center",
//                   render: (_, record) => (
//                     <Text strong>
//                       {(record.price * record.quantity).toLocaleString("vi-VN")}
//                       đ
//                     </Text>
//                   ),
//                 },
//               ]}
//             />
//             <Divider />
//             {/* Footer */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div>
//                 <Text type="secondary">Cảm ơn bạn đã sử dụng dịch vụ ❤️</Text>
//               </div>
//               <div
//                 style={{
//                   textAlign: "right",
//                 }}
//               >
//                 <Text>Tổng thanh toán</Text>
//                 <Title
//                   level={2}
//                   style={{
//                     margin: 0,
//                     color: "#e53935",
//                   }}
//                 >
//                   {selectedOrder.totalPrice?.toLocaleString("vi-VN")}đ
//                 </Title>
//               </div>
//             </div>
//           </>
//         )}
//       </Modal>
//     </>
//   );
// };

// export default PublicOrdersPage;
