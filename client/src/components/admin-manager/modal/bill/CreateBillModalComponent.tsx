import useEntityMutation from "../../../../hooks/useEntityMutation";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import TableInputComponent from "../../TableInputComponent";
import BillApiService from "../../../../services/api/v1/BillApiService";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";
import {
  ruleEmail,
  rulePhone,
  ruleRequired,
} from "../../../../constants/rules";
import {
  BillStatusValue,
  ModalAutoComplete,
  ModalLayout,
  BillPaymentStatusValue,
} from "../../../../constants/values";
import {
  inputNumberFormatter,
  inputNumberParse,
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/otherEvents";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { TableInputComponentRowData } from "../../TableInputComponent";
import type {
  BillCreateRequestType,
  BillDetailResponseType,
} from "../../../../types/BillType";
import type { BillDetailCreateRequestType } from "../../../../types/BillDetailType";

const CreateBillModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm();
  const [totalPriceValue, setTotalPriceValue] = useState<number>(0);
  const [billDetails, setBillDetails] = useState<TableInputComponentRowData[]>(
    [],
  );

  const createMutation = useEntityMutation<
    BillCreateRequestType,
    BillDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: BillApiService.handleCreate,
  });

  // Tính toán lại tổng tiền mua khi thay đổi món ăn
  useMemo(() => {
    const totalValue =
      billDetails.reduce(
        (total, billDetail: any) =>
          total + billDetail.values.price * billDetail.values.quantity,
        0,
      ) || 0;

    setTotalPriceValue(totalValue);
  }, [billDetails]);

  return (
    <>
      {restaurantId && dataForCrud && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={{
            createAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            paymentId:
              "don-mon-an-tao-thu-cong-" +
              Math.random().toString(36).substring(2, 10),
            status: BillStatusValue.pending,
          }}
          className="modal__form split-3"
          onFinish={async () => {
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
            );

            submitButton?.classList.add("active");

            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              const values = form.getFieldsValue();

              const response = await createMutation.mutateAsync({
                values: {
                  ...values,
                  restaurantId: restaurantId,
                  employeeId: dataForCrud.infoLogin?.id,
                  customerId: 1,
                  createAt: dayjs(values.createAt).format(
                    "YYYY-MM-DDTHH:mm:ss",
                  ),
                  totalPrice: totalPriceValue,
                  paymentAt: dayjs(values.paymentAt).format(
                    "YYYY-MM-DDTHH:mm:ss",
                  ),
                  billDetails: billDetails.map(
                    (billDetail: any) =>
                      ({
                        foodId: billDetail.base.id,
                        quantity: billDetail.values.quantity,
                        price: billDetail.values.price,
                        foodNameSnapshot: billDetail.base.name,
                        foodUnitSnapshot: billDetail.base.unit,
                        foodPriceSnapshot: billDetail.base.price,
                        totalPriceDetail:
                          billDetail.values.quantity * billDetail.values.price,
                      }) as BillDetailCreateRequestType,
                  ),
                },
              });
              if (response) {
                closeModal();
              }
            }

            submitButton?.classList.remove("active");
          }}
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title1}</p>
            <div className="modal__form-group">
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
                label={defaultLabels.totalPrice}
                className="modal__form-group-item multiple-3"
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
              <Form.Item
                name="employee"
                label={defaultLabels.employee}
                className="modal__form-group-item multiple-3"
              >
                <CardInfoInModalComponent
                  hasImage={true}
                  image={dataForCrud.infoLogin?.image}
                  fullname={dataForCrud.infoLogin?.fullname!}
                  phone={dataForCrud.infoLogin?.phone!}
                  email={dataForCrud.infoLogin?.email!}
                  address={`${dataForCrud.infoLogin?.houseNumber}, ${dataForCrud.infoLogin?.streetName}, ${dataForCrud.infoLogin?.ward}, ${dataForCrud.infoLogin?.province}`}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Input disabled />
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
                label={defaultLabels.billDetails}
                className="modal__form-group-item multiple-3"
              >
                <TableInputComponent
                  object="bill"
                  base={dataForCrud.foods || []}
                  data={billDetails}
                  onChange={setBillDetails}
                  columnTitles={[
                    "Món ăn (Giá bán ban đầu)",
                    "Giá bán",
                    "Số lượng",
                    "Tổng tiền",
                  ]}
                  attributes={["price", "quantity", "totalPriceDetail"]}
                />
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
                rules={[
                  ruleRequired("Email không được để trống!"),
                  ruleEmail(),
                ]}
              >
                <Input placeholder={defaultInputs.customerEmail} />
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
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="paymentStatus"
                label={defaultLabels.paymentStatus}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Trạng thái thanh toán không được để trống!"),
                ]}
              >
                <Select
                  allowClear
                  options={[
                    {
                      label: BillPaymentStatusValue.paid,
                      value: BillPaymentStatusValue.paid,
                    },
                    {
                      label: BillPaymentStatusValue.unpaid,
                      value: BillPaymentStatusValue.unpaid,
                    },
                  ]}
                  placeholder={defaultInputs.paymentStatus}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="paymentMethodId"
                label={defaultLabels.paymentMethod}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Phương thức thanh toán không được để trống!"),
                ]}
              >
                <Select
                  allowClear
                  options={dataForCrud.paymentMethods?.map((paymentMethod) => ({
                    label: "#" + paymentMethod.id + " - " + paymentMethod.name,
                    value: paymentMethod.id,
                  }))}
                  placeholder={defaultInputs.paymentMethod}
                />
              </Form.Item>
              <Form.Item
                name="paymentTotalPrice"
                label={defaultLabels.paymentTotalPrice}
                className="modal__form-group-item multiple-2"
                rules={[
                  ruleRequired("Số tiền thanh toán không được để trống!"),
                ]}
              >
                <InputNumber
                  min={0}
                  formatter={(value) => inputNumberFormatter(value)}
                  parser={(value) => inputNumberParse(value)}
                  placeholder={defaultInputs.paymentTotalPrice}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="paymentAt"
                label={defaultLabels.paymentAt}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Thời gian thanh toán không được để trống!"),
                ]}
              >
                <DatePicker showTime placeholder={defaultInputs.paymentAt} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn create">
              Xác nhận
            </button>
          </div>
        </Form>
      )}
    </>
  );
};

export default CreateBillModalComponent;
