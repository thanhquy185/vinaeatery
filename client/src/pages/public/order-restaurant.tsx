import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  List,
  Button,
  Tag,
  Select,
  Divider,
  Modal,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { OrderStatus, ReactQueryGetData } from "../../common/values";
import type { ReactQueryMutationProps } from "../../common/props";
import type { CustomerType, OrderTableType } from "../../common/types";
import { openConfirmation } from "../../utils/show-confirmation";
import { openNotification } from "../../utils/show-notification";
import dayjs from "dayjs";
import {
  FindAllOrderTable,
  HandleUpdateOrderTable,
} from "../../requests/order-tables";

const { Title, Paragraph } = Typography;

//
const notificationKey = "public-order-restaurant-notification";

//
const getStatusTag = (status: any) => {
  const statusStyle = {
    padding: "6px 10px",
    fontSize: 14,
  };

  switch (status) {
    case OrderStatus.confirm:
      return (
        <Tag icon={<CheckCircleOutlined />} color="success" style={statusStyle}>
          {OrderStatus.confirm}
        </Tag>
      );
    case OrderStatus.canceled:
      return (
        <Tag icon={<CloseCircleOutlined />} color="error" style={statusStyle}>
          {OrderStatus.canceled}
        </Tag>
      );
    case OrderStatus.pending:
      return (
        <Tag icon={<LoadingOutlined />} color="default" style={statusStyle}>
          {OrderStatus.pending}
        </Tag>
      );
  }
};

const PublicOrderRestaurantPage = () => {
  // Đối tượng query client để thực thi react-query
  const queryClient = useQueryClient();

  // Load dữ liệu khách hàng đang đăng nhập
  const infoLoginRouteLoaderData = useRouteLoaderData("public-info-login");
  const infoLogin = infoLoginRouteLoaderData.infoLogin as CustomerType;

  // Dữ liệu đơn đặt nhà hàng
  const {
    data: orderTables,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["order-tables"],
    queryFn: async () => {
      const res = await FindAllOrderTable({
        findType: "customer-id",
        findValue: String(infoLogin?.id),
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

  // Lọc dữ liệu
  const [filterStatus, setFilterStatus] = useState<string>("Tất cả");
  const filteredOrderTables = orderTables?.filter((b) => {
    if (filterStatus === "Tất cả") return true;
    return b.status === filterStatus;
  });

  // Modal chi tiết đơn đặt bàn
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedOrderTable, setSelectedOrderTable] =
    useState<OrderTableType>();
  const openModal = (orderTable: OrderTableType) => {
    setSelectedOrderTable(orderTable);
    setOpenDetailModal(true);
  };

  // Mutation cho việc huỷ đặt bàn
  const handleCancelOrderTableMutation = useMutation({
    mutationFn: async ({ type }: ReactQueryMutationProps<OrderTableType>) => {
      if (type === "update") {
        const res = await HandleUpdateOrderTable({
          id: selectedOrderTable?.id || undefined,
          status: OrderStatus.canceled || undefined,
          updateAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
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
        description: "Huỷ đặt bàn thành công!",
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["order-tables"] });
      }, 1500);
    },
    onError: (error) => {
      openNotification({
        key: notificationKey,
        type: "error",
        message: "Thất bại",
        description: error ? error.message : "Huỷ đặt bàn thất bại!",
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
            <Title level={2} style={{ fontWeight: 700, color: "#333" }}>
              Lịch sử đặt bàn
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
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <p className="text-2xl font-semibold">Trạng thái</p>
                  <Select
                    defaultValue="Tất cả"
                    onChange={setFilterStatus}
                    style={{
                      width: "100%",
                      height: 40,
                      marginTop: 6,
                      borderRadius: 8,
                    }}
                    options={[
                      { value: "Tất cả", label: "Tất cả" },
                      {
                        value: OrderStatus.confirm,
                        label: OrderStatus.confirm,
                      },
                      {
                        value: OrderStatus.canceled,
                        label: OrderStatus.canceled,
                      },
                      {
                        value: OrderStatus.pending,
                        label: OrderStatus.pending,
                      },
                    ]}
                  />
                </Col>
              </Row>
            </div>
            <List
              dataSource={filteredOrderTables}
              pagination={{ pageSize: 3 }}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: 0,
                    border: "none",
                  }}
                >
                  <Row
                    gutter={24}
                    style={{ width: "100%", alignItems: "center" }}
                    className="public-order-restaurant"
                  >
                    <Col xs={24} md={10}>
                      <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                        {item.restaurant?.name}
                      </Title>
                      <Paragraph
                        style={{
                          margin: "8px 0 0 0",
                          color: "#555",
                          fontSize: 16,
                        }}
                      >
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        {item.arriveAt?.split(" ")[0]} lúc{" "}
                        {item.arriveAt?.split(" ")[1]} ({item.guests} Khách)
                      </Paragraph>
                    </Col>
                    <Col xs={12} md={6} style={{ textAlign: "center" }}>
                      <div style={{ marginBottom: 4 }}>
                        {getStatusTag(item.status)}
                      </div>
                    </Col>
                    <Col xs={12} md={8} style={{ display: "flex", gap: 10 }}>
                      <Button
                        variant="solid"
                        color="blue"
                        icon={<InfoCircleOutlined />}
                        style={{ marginLeft: "auto" }}
                        onClick={() => openModal(item)}
                      >
                        Chi tiết
                      </Button>
                      {item.status === OrderStatus.pending && (
                        <Button
                          variant="outlined"
                          color="red"
                          icon={<CloseCircleOutlined />}
                          onClick={async () => {
                            // Hỏi trước khi xử khi xử lý ?
                            const answer = await openConfirmation({
                              title: `Bạn có chắc chắn huỷ đặt bàn ?`,
                              content: "Hành động này không thể hoàn tác.",
                            });
                            if (answer) {
                              // Gán giá trị đơn đặt bàn đã chọn
                              setSelectedOrderTable(item);

                              // Thực thi mutation
                              handleCancelOrderTableMutation.mutate({
                                type: "update",
                              });
                            }
                          }}
                        >
                          Hủy đặt
                        </Button>
                      )}
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </Layout>
      <Modal
        open={openDetailModal}
        title={<p className="text-4xl">Chi tiết đơn đặt bàn</p>}
        onCancel={() => setOpenDetailModal(false)}
        footer={null}
        centered
        width={600}
        style={{ borderRadius: 12 }}
      >
        {selectedOrderTable && (
          <>
            <Divider />
            <Row style={{ marginBottom: 14 }}>
              <Col className="flex-1">
                <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                  Thời gian đặt bàn
                </Paragraph>
                <Paragraph style={{ fontSize: 15 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {selectedOrderTable.arriveAt?.split(" ")[0]} •{" "}
                  {selectedOrderTable.arriveAt?.split(" ")[1]}
                </Paragraph>
              </Col>
              <Col className="flex-1">
                <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                  Thời gian dự kiến
                </Paragraph>
                <Paragraph style={{ fontSize: 15 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {selectedOrderTable.arriveAt?.split(" ")[0]} •{" "}
                  {selectedOrderTable.arriveAt?.split(" ")[1]}
                </Paragraph>
              </Col>
            </Row>
            <Row style={{ marginBottom: 14 }}>
              <Col className="flex-1">
                <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                  Số lượng khách
                </Paragraph>
                <Paragraph style={{ fontSize: 15 }}>
                  {selectedOrderTable.guests} khách
                </Paragraph>
              </Col>
              <Col className="flex-1">
                <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                  Trạng thái
                </Paragraph>
                <Paragraph style={{ fontSize: 15 }}>
                  {getStatusTag(selectedOrderTable.status)}
                </Paragraph>
              </Col>
            </Row>
            <div style={{ marginBottom: 14 }}>
              <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                Nhà hàng đã đặt
              </Paragraph>
              <Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
                Tên nhà hàng: {selectedOrderTable.restaurant?.name}
              </Paragraph>
              <Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
                Số điện thoại: {selectedOrderTable.restaurant?.phone}
              </Paragraph>
              <Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
                Email: {selectedOrderTable.restaurant?.email}
              </Paragraph>
              <Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
                Địa chỉ: {selectedOrderTable.restaurant?.address}
              </Paragraph>
            </div>
            <div style={{ marginBottom: 14 }}>
              <Paragraph strong style={{ marginBottom: 0, fontSize: 16 }}>
                Thông tin bạn gửi
              </Paragraph>
              <Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
                Họ và tên: {selectedOrderTable?.customerFullname}
              </Paragraph>
              <Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
                Số điện thoại: {selectedOrderTable?.customerPhone}
              </Paragraph>
              <Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
                Email: {selectedOrderTable?.customerEmail}
              </Paragraph>
              <Paragraph style={{ marginBottom: 0, fontSize: 15 }}>
                Ghi chú: {selectedOrderTable?.customerNote}
              </Paragraph>
            </div>
            <Divider />
            <div style={{ textAlign: "right", marginTop: 6 }}>
              <Button onClick={() => setOpenDetailModal(false)} type="primary">
                Đóng
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default PublicOrderRestaurantPage;
