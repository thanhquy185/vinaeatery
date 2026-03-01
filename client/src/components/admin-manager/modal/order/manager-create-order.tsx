import { useMemo, useState, type FC } from "react";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleEmail, rulePhone, ruleRequired } from "../../../../common/rules";
import type {
  OrderDetailType,
  OrderType,
  PayMethodType,
} from "../../../../common/types";
import {
  OrderStatus,
  ModalAutoComplete,
  ModalLayout,
  PayStatus,
} from "../../../../common/values";
import CustomTableNoActions from "../../common/table-no-actions";
import { FindAllPayMethod } from "../../../../requests/pay-methods";
import { HandleCreateOrder } from "../../../../requests/orders";
import { useEntityQuery } from "../../../../hook/use-entity-query";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/other-events";
import { openConfirmation } from "../../../../utils/show-confirmation";

// Manager Create Order
const ManagerCreateOrder: FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  dataForCrud,
  tableNoActionsFormat,
  modalForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm();
  // const createAtValue = getVietnamCurrentDatetime();
  const [payIdValue, setPayIdValue] = useState<string>(
    "don-mon-an-tao-thu-cong-" + Math.random().toString(36).substring(2, 10),
  );
  const [totalPriceValue, setTotalPriceValue] = useState<number>(0);
  const [orderDetails, setOrderDetails] = useState<OrderDetailType[]>([]);
  const createMutation = useEntityMutation<OrderType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateOrder,
  });

  // Dữ liệu phương thức thanh toán
  const { data: payMethods } = useEntityQuery<PayMethodType[]>({
    keys: ["pay-methods-"],
    params: {},
    api: FindAllPayMethod,
  });

  // Tính toán lại tổng tiền nhập khi thay đổi nguyên liệu
  useMemo(() => {
    const totalValue = orderDetails.reduce(
      (total, orderDetail) =>
        total + orderDetail?.price! * orderDetail?.quantity!,
      0,
    );
    setTotalPriceValue(totalValue);
  }, [orderDetails]);

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          // createAt: dayjs(),
          //   arriveAt: undefined,
          employee:
            "#" +
            dataForCrud?.infoLogin!.id +
            " - " +
            dataForCrud?.infoLogin!.fullname +
            " - " +
            dataForCrud?.infoLogin!.phone +
            " - " +
            dataForCrud?.infoLogin!.email,
          //   customerFullname: undefined,
          //   customerPhone: undefined,
          //   customerEmail: undefined,
          //   customerNote: undefined,
          //   guests: undefined,
          // status: OrderStatus.pending,
        }}
        className="modal__form split-3"
        onFinish={async () => {
          // Nút để submit form
          const submitButton = document.querySelector(
            ".modal__form button[type='submit']",
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
            const response = await createMutation.mutateAsync({
              values: {
                ...values,
                restaurantId: restaurantId,
                createAt: new Date().toISOString(),
                employeeId: dataForCrud?.infoLogin?.id,
                customerId: 1, // Mặc định vì đây là khách hàng ảo (Chưa có tài khoản trên hệ thống)
                totalPrice: totalPriceValue,
                payId: payIdValue,
                status: OrderStatus.pending,
                orderDetails: orderDetails.map((orderDetail) => ({
                  foodId: orderDetail?.food?.id!,
                  price: orderDetail.price,
                  quantity: orderDetail.quantity,
                })),
              },
            });
            if (response) {
              closeModal();
            }

            // Xoá class 'active' thể hiện nút không còn được nhấn
            submitButton?.classList.remove("active");
          }

          // Xoá class 'active' thể hiện nút không còn được nhấn
          submitButton?.classList.remove("active");
        }}
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title1}</p>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input
                  className="text-center"
                  placeholder={defaultInputs.id}
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled />
              </Form.Item>
            </div>
            <Form.Item
              label={defaultLabels.status}
              className="modal__form-group-item"
            >
              <Input placeholder={defaultInputs.status} disabled />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="employee"
              label={defaultLabels.employee}
              className="modal__form-group-item multiple-2"
            >
              <Input className="employees" disabled />
            </Form.Item>
            <Form.Item
              label={defaultLabels.totalPrice}
              className="modal__form-group-item multiple-2"
            >
              <Input
                value={
                  vietnamMoneyFormat(totalPriceValue) +
                  " (" +
                  numberToVietnamWords(totalPriceValue) +
                  ")"
                }
                disabled
              />
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
              rules={[ruleRequired("Họ và tên không được để trống!")]}
            >
              <Input placeholder={defaultInputs.customerFullname} />
            </Form.Item>
            <Form.Item
              label={defaultLabels["orderDetails"]}
              className="modal__form-group-item multiple-3"
            >
              <CustomTableNoActions
                className="orderDetails"
                columnWidths={tableNoActionsFormat?.widths}
                columnTitles={tableNoActionsFormat?.columns}
                data={orderDetails}
                attributes={tableNoActionsFormat?.attributes}
                format={tableNoActionsFormat?.format}
              />
              <div className="buttons">
                <button
                  type="button"
                  className="btn secondary-btn margin-r"
                  onClick={() =>
                    modalForCrud?.orderDetails?.openModalCreate?.({
                      orderDetails: orderDetails,
                      setOrderDetails: setOrderDetails,
                    })
                  }
                >
                  Thêm món ăn
                </button>
                <button
                  type="button"
                  className="btn secondary-btn"
                  onClick={() =>
                    modalForCrud?.orderDetails?.openModalDelete?.({
                      orderDetails: orderDetails,
                      setOrderDetails: setOrderDetails,
                    })
                  }
                >
                  Xoá món ăn
                </button>
              </div>
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="customerPhone"
              label={defaultLabels.customerPhone}
              className="modal__form-group-item"
              rules={[
                ruleRequired("Số điện thoại không được để trống!"),
                rulePhone(),
              ]}
            >
              <Input placeholder={defaultInputs.customerPhone} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="customerEmail"
              label={defaultLabels.customerEmail}
              className="modal__form-group-item"
              rules={[ruleRequired("Email không được để trống!"), ruleEmail()]}
            >
              <Input placeholder={defaultInputs.customerEmail} />
            </Form.Item>
          </div>
        </div>
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title3}</p>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.payId}
              className="modal__form-group-item"
            >
              <Input value={payIdValue} disabled />
            </Form.Item>
            <Form.Item
              name="payStatus"
              label={defaultLabels.payStatus}
              className="modal__form-group-item"
              rules={[
                ruleRequired("Trạng thái thanh toán không được để trống!"),
              ]}
            >
              <Select
                allowClear
                options={[
                  {
                    label: PayStatus.pay,
                    value: PayStatus.pay,
                  },
                  {
                    label: PayStatus.notPay,
                    value: PayStatus.notPay,
                  },
                ]}
                placeholder={defaultInputs.payStatus}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="payMethodId"
              label={defaultLabels.payMethod}
              className="modal__form-group-item"
              rules={[
                ruleRequired("Phương thức thanh toán không được để trống!"),
              ]}
            >
              <Select
                allowClear
                options={payMethods?.map((payMethod) => ({
                  label: "#" + payMethod?.id + " - " + payMethod?.name,
                  value: payMethod?.id,
                }))}
                placeholder={defaultInputs.payMethod}
              />
            </Form.Item>
            <Form.Item
              name="payTotalPrice"
              label={defaultLabels.payTotalPrice}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Số tiền thanh toán không được để trống!")]}
            >
              <InputNumber min={0} placeholder={defaultInputs.payTotalPrice} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="payTime"
              label={defaultLabels.payTime}
              className="modal__form-group-item"
              rules={[
                ruleRequired("Thời gian thanh toán không được để trống!"),
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={defaultInputs.payTime}
              />
            </Form.Item>
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

export default ManagerCreateOrder;
