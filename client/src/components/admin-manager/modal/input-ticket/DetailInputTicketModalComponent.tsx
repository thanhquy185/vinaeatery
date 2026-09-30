import useEntityQuery from "../../../../hooks/useEntityQuery2";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import TableInputComponent from "../../TableInputComponent";
import InputTicketApiService from "../../../../services/api/v1/InputTicketApiService";
import { Form, Input, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import {
  vietnamMoneyFormat,
  numberToVietnamWords,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { TableInputComponentRowData } from "../../TableInputComponent";
import type { InputTicketDetailResponseType } from "../../../../types/InputTicketType";

const DetailInputTicketModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
  dataForCrud,
}) => {
  const { data: inputTicketDetail, isLoading } =
    useEntityQuery<InputTicketDetailResponseType>({
      keys: ["input-ticket", data.id],
      params: { id: data.id },
      api: InputTicketApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<InputTicketDetailResponseType>();

  return (
    <Spin spinning={!inputTicketDetail || isLoading}>
      {dataForCrud && inputTicketDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={{
            ...inputTicketDetail,
            createAt: inputTicketDetail.createAt,
            totalInputPrice: `${vietnamMoneyFormat(inputTicketDetail.totalInputPrice)} (${numberToVietnamWords(inputTicketDetail.totalInputPrice)})`,
          }}
          className="modal__form split-3"
          disabled
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title1}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="id"
                  label={defaultLabels.id}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" />
                </Form.Item>
                <Form.Item
                  name="createAt"
                  label={defaultLabels.createAt}
                  className="modal__form-group-item"
                >
                  <Input className="text-center" />
                </Form.Item>
              </div>
              <Form.Item
                name="totalInputPrice"
                label={defaultLabels.totalInputPrice}
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
                  image={inputTicketDetail.employee.imageUrl}
                  fullname={inputTicketDetail.employee.fullname}
                  phone={inputTicketDetail.employee.phone}
                  email={inputTicketDetail.employee.email}
                  address={`${inputTicketDetail.employee.houseNumber}, ${inputTicketDetail.employee.streetName}, ${inputTicketDetail.employee.ward}, ${inputTicketDetail.employee.province}`}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="paymentStatus"
                label={defaultLabels.paymentStatus}
                className="modal__form-group-item"
              >
                <Input />
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
                name="supplier"
                label={defaultLabels.supplier}
                className="modal__form-group-item multiple-3"
              >
                <CardInfoInModalComponent
                  fullname={inputTicketDetail.supplier.fullname}
                  phone={inputTicketDetail.supplier.phone}
                  email={inputTicketDetail.supplier.email}
                  address={`${inputTicketDetail.supplier.houseNumber}, ${inputTicketDetail.supplier.streetName}, ${inputTicketDetail.supplier.ward}, ${inputTicketDetail.supplier.province}`}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels.inputTicketDetails}
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <TableInputComponent
                  type="detail"
                  base={dataForCrud.ingredients || []}
                  data={inputTicketDetail.inputTicketDetails.map(
                    (inputTicketDetail) =>
                      ({
                        key: inputTicketDetail.ingredient.id,
                        baseId: inputTicketDetail.ingredient.id,
                        values: {
                          inputPrice: inputTicketDetail.inputPrice,
                          quantity: inputTicketDetail.quantity,
                          totalInputPriceDetail:
                            inputTicketDetail.totalInputPriceDetail,
                        },
                      }) as unknown as TableInputComponentRowData,
                  )}
                  columnTitles={[
                    "Nguyên liệu (Giá nhập ban đầu, Tồn kho)",
                    "Giá nhập",
                    "Số lượng",
                    "Tổng tiền",
                  ]}
                  attributes={[
                    "inputPrice",
                    "quantity",
                    "totalInputPriceDetail",
                  ]}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailInputTicketModalComponent;
