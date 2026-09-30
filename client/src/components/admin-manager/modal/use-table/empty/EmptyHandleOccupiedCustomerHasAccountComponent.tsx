import useEntityQuery from "../../../../../hooks/useEntityQuery2";
import CustomerApiService from "../../../../../services/api/v1/CustomerApiService";
import { useState } from "react";
import { Col, Form, InputNumber, List, Row } from "antd";
import { Mail, Phone, User } from "lucide-react";
import { ruleRequired } from "../../../../../constants/rules";
import {
  ImageSourcePath,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../../constants/values";
import type { ManagerHandleUpdateStatusUseTableProps } from "../../../../../constants/props";
import type { PageResponseType } from "../../../../../types/PageResponseType";
import type { CustomerSummaryResponseType } from "../../../../../types/CustomerType";

const EmptyHandleOccupiedCustomerHasAccountComponent: React.FC<
  ManagerHandleUpdateStatusUseTableProps
> = ({ form, infoRequest, setInfoRequest }) => {
  // Các biến để lọc dữ liệu
  // - Phân trang
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(3);

  // Dữ liệu về khách hàng
  const { data: customerData, isLoading } = useEntityQuery<
    PageResponseType<CustomerSummaryResponseType>
  >({
    keys: ["customers", page, size],
    params: {
      page: page,
      size: size,
    },
    api: CustomerApiService.handleGetSummary,
  });

  return (
    <Row gutter={[16, 16]} style={{ width: "100%" }}>
      <Col span={6}>
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          className="modal__form split-1"
        >
          <div className="modal__form-group-warper">
            <div className="modal__form-group">
              <Form.Item
                name="customerAdult"
                label="Số lượng người lớn"
                className="modal__form-group-item"
                rules={[ruleRequired("Cần nhập Số lượng người lớn!")]}
              >
                <InputNumber min={0} placeholder="Nhập Số lượng người lớn" />
              </Form.Item>
              <Form.Item
                name="customerChild"
                label="Số lượng trẻ em"
                className="modal__form-group-item"
                rules={[ruleRequired("Cần nhập Số lượng trẻ em!")]}
              >
                <InputNumber min={0} placeholder="Nhập Số lượng trẻ em" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Col>
      <Col span={18}>
        <List
          itemLayout="horizontal"
          grid={{
            gutter: [16, 16],
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3,
          }}
          pagination={{
            current: (customerData?.number ?? 0) + 1,
            pageSize: customerData?.size ?? 4,
            total: customerData?.totalElements ?? 0,

            showSizeChanger: true,
            pageSizeOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng số ${total} bản ghi`,
            onChange: (page, pageSize) => {
              setPage(page);
              setSize(pageSize);
            },
          }}
          dataSource={customerData?.content || []}
          loading={isLoading}
          renderItem={(customer) => {
            return (
              <List.Item
                onClick={() => {
                  if (customer.id !== infoRequest?.customerId) {
                    setInfoRequest!({
                      ...infoRequest!,
                      customerId: customer.id,
                      customerFullname: customer.fullname,
                      customerPhone: customer.phone,
                      customerEmail: customer.email,
                    });
                  } else {
                    setInfoRequest!({
                      ...infoRequest!,
                      customerId: 0,
                      customerFullname: "",
                      customerPhone: "",
                      customerEmail: "",
                    });
                  }
                }}
                className={`${infoRequest?.customerId === customer.id ? "active" : ""}`}
              >
                <List.Item.Meta
                  description={
                    <>
                      <img
                        src={
                          customer.imageUrl ?? ImageSourcePath + "no-image.png"
                        }
                        alt={"avatar-customer-" + customer.id}
                        style={{ width: 80, height: 80 }}
                      />
                      <h5>Thông tin cơ bản</h5>
                      <p>
                        <User />
                        <b>{customer.fullname}</b>
                      </p>
                      <p>
                        <Phone />
                        <b>{customer.phone}</b>
                      </p>
                      <p>
                        <Mail />
                        <b>{customer.email}</b>
                      </p>
                    </>
                  }
                />
              </List.Item>
            );
          }}
          locale={{
            emptyText: (
              <div className="empty">
                <img
                  src={ImageSourcePath + "empty-customer-icon.png"}
                  alt="empty-customer"
                />
                <h3>Không có khách hàng</h3>
                <p>
                  Hệ thống chưa có khách hàng nào đăng ký tài khoản hoặc không
                  tồn tại khách hàng có thông tin như vậy
                </p>
              </div>
            ),
          }}
        />
      </Col>
    </Row>
  );
};

export default EmptyHandleOccupiedCustomerHasAccountComponent;
