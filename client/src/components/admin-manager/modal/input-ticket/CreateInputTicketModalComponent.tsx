import useEntityMutation from "../../../../hooks/useEntityMutation";
import TableInputComponent from "../../TableInputComponent";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import InputTicketApiService from "../../../../services/api/v1/InputTicketApiService";
import { useMemo, useState } from "react";
import { Form, Input, Select } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
  InputTicketPaymentStatusValue,
  InputTicketStatusValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import { getVietnamCurrentDatetime } from "../../../../utils/dayjs";
import { openConfirmation } from "../../../../utils/showConfirmation";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { TableInputComponentRowData } from "../../TableInputComponent";
import type { SupplierCrudResponseType } from "../../../../types/SupplierType";
import type {
  InputTicketCreateRequestType,
  InputTicketDetailResponseType,
} from "../../../../types/InputTicketType";

const CreateInputTicketModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<InputTicketCreateRequestType>();
  const [totalInputPriceValue, setTotalInputPriceValue] = useState<number>(0);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierCrudResponseType | null>(null);
  const [inputTicketDetails, setInputTicketDetails] = useState<
    TableInputComponentRowData[]
  >([]);

  const createMutation = useEntityMutation<
    InputTicketCreateRequestType,
    InputTicketDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: InputTicketApiService.handleCreate,
  });

  // Tính toán lại tổng tiền nhập khi thay đổi nguyên liệu
  useMemo(() => {
    const totalValue =
      inputTicketDetails.reduce(
        (total, inputTicketDetail: any) =>
          total +
          inputTicketDetail.values.inputPrice *
            inputTicketDetail.values.quantity,
        0,
      ) || 0;

    setTotalInputPriceValue(totalValue);
  }, [inputTicketDetails]);

  return (
    <>
      {restaurantId && dataForCrud && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={{
            createAt: getVietnamCurrentDatetime(),
            paymentStatus: InputTicketPaymentStatusValue.unpaid,
            status: InputTicketStatusValue.pending,
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
                  employeeId: dataForCrud.infoLogin?.id!,
                  totalInputPrice: totalInputPriceValue,
                  inputTicketDetails: inputTicketDetails.map(
                    (inputTicketDetail: any) => ({
                      ingredientId: inputTicketDetail.base.id,
                      quantity: inputTicketDetail.values.quantity,
                      inputPrice: inputTicketDetail.values.inputPrice,
                      ingredientNameSnapshot: inputTicketDetail.base.name,
                      ingredientInputPriceSnapshot:
                        inputTicketDetail.base.inputPrice,
                      totalInputPriceDetail:
                        inputTicketDetail.values.quantity *
                        inputTicketDetail.values.inputPrice,
                    }),
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
              <div className="modal__form-group-item-warper split-2">
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
                  <Input className="text-center" disabled />
                </Form.Item>
              </div>
              <Form.Item
                label={defaultLabels.totalInputPrice}
                className="modal__form-group-item multiple-3"
              >
                <Input
                  value={`${vietnamMoneyFormat(totalInputPriceValue)} (${numberToVietnamWords(totalInputPriceValue)})`}
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
                name="paymentStatus"
                label={defaultLabels.paymentStatus}
                className="modal__form-group-item"
              >
                <Input disabled />
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
                name="supplierId"
                label={defaultLabels.supplier}
                className="modal__form-group-item multiple-3"
                rules={[ruleRequired("Nhà cung cấp không được để trống!")]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={defaultInputs.supplier}
                  options={(dataForCrud.suppliers || []).map((supplier) => ({
                    label:
                      "#" +
                      supplier.id +
                      " - " +
                      supplier.fullname +
                      " - " +
                      supplier.phone +
                      " - " +
                      supplier.email,
                    value: supplier.id,
                    object: supplier,
                  }))}
                  onChange={(value, option) => {
                    form.setFieldValue("supplierId", value);
                    setSelectedSupplier(value ? (option as any).object : null);
                  }}
                />
                {selectedSupplier && (
                  <CardInfoInModalComponent
                    fullname={selectedSupplier.fullname}
                    phone={selectedSupplier.phone}
                    email={selectedSupplier.email}
                    address={`${selectedSupplier.houseNumber}, ${selectedSupplier.streetName}, ${selectedSupplier.ward}, ${selectedSupplier.province}`}
                  />
                )}
              </Form.Item>
              <Form.Item
                label={defaultLabels.inputTicketDetails}
                className="modal__form-group-item multiple-3"
              >
                <TableInputComponent
                  object="input-ticket"
                  base={dataForCrud.ingredients || []}
                  data={inputTicketDetails}
                  onChange={setInputTicketDetails}
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

export default CreateInputTicketModalComponent;
