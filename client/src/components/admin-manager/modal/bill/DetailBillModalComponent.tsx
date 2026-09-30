import useEntityQuery from "../../../../hooks/useEntityQuery2";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import TableInputComponent from "../../TableInputComponent";
import BillApiService from "../../../../services/api/v1/BillApiService";
import dayjs from "dayjs";
import { DatePicker, Form, Input, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { TableInputComponentRowData } from "../../TableInputComponent";
import type { BillDetailResponseType } from "../../../../types/BillType";
import type { BillDetailCreateRequestType } from "../../../../types/BillDetailType";

const DetailBillModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
  dataForCrud,
}) => {
  const { data: billDetail, isLoading } =
    useEntityQuery<BillDetailResponseType>({
      keys: ["bill", data.id],
      params: { id: data.id },
      api: BillApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<BillDetailCreateRequestType>();

  return (
    <Spin spinning={!billDetail || isLoading}>
      {dataForCrud && billDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={{
            ...billDetail,
            createAt: dayjs(billDetail.createAt),
            totalPrice:
              vietnamMoneyFormat(billDetail.totalPrice) +
              " (" +
              numberToVietnamWords(billDetail.totalPrice) +
              ")",
            paymentMethod: `#${billDetail.paymentMethod.id} - ${billDetail.paymentMethod.name}`,
            paymentAt: dayjs(billDetail.paymentAt),
            paymentTotalPrice:
              vietnamMoneyFormat(data?.paymentTotalPrice!) +
              " (" +
              numberToVietnamWords(data?.paymentTotalPrice!) +
              ")",
          }}
          className="modal__form split-3"
          disabled
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title1}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="totalPrice"
                label={defaultLabels.totalPrice}
                className="modal__form-group-item multiple-3"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="employee"
                label={defaultLabels.employee}
                className="modal__form-group-item multiple-3"
              >
                <CardInfoInModalComponent
                  hasImage={true}
                  image={billDetail.employee.imageUrl}
                  fullname={billDetail.employee.fullname}
                  phone={billDetail.employee.phone}
                  email={billDetail.employee.email}
                  address={`${billDetail.employee.houseNumber}, ${billDetail.employee.streetName}, ${billDetail.employee.ward}, ${billDetail.employee.province}`}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <DatePicker showTime />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title2}</p>
            <div className="modal__form-group">
              <Form.Item
                name="customerFullname"
                label={defaultLabels.customerFullname}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={defaultLabels.billDetails}
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <TableInputComponent
                  type="detail"
                  base={dataForCrud.foods || []}
                  data={billDetail.billDetails.map(
                    (billDetail) =>
                      ({
                        key: billDetail.food.id,
                        baseId: billDetail.food.id,
                        values: {
                          price: billDetail.price,
                          quantity: billDetail.quantity,
                          totalPriceDetail: billDetail.totalPriceDetail,
                        },
                      }) as unknown as TableInputComponentRowData,
                  )}
                  columnTitles={["Món ăn", "Giá bán", "Số lượng", "Tổng tiền"]}
                  attributes={["price", "quantity", "totalPriceDetail"]}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerPhone"
                label={defaultLabels.customerPhone}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="customerEmail"
                label={defaultLabels.customerEmail}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title3}</p>
            <div className="modal__form-group">
              <Form.Item
                name="paymentId"
                label={defaultLabels.paymentId}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="paymentStatus"
                label={defaultLabels.paymentStatus}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="paymentMethod"
                label={defaultLabels.paymentMethod}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="paymentTotalPrice"
                label={defaultLabels.paymentTotalPrice}
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="paymentAt"
                label={defaultLabels.paymentAt}
                className="modal__form-group-item"
              >
                <DatePicker showTime />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailBillModalComponent;
