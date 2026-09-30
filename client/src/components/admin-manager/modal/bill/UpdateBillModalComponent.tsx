import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import TableInputComponent from "../../TableInputComponent";
import BillApiService from "../../../../services/api/v1/BillApiService";
import dayjs from "dayjs";
import { DatePicker, Form, Input, Spin } from "antd";
import {
  BillStatusValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/otherEvents";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import { openNotification } from "../../../../utils/showNotificationUtil";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { BillStatusEnum } from "../../../../constants/enums";
import type { TableInputComponentRowData } from "../../TableInputComponent";
import type {
  BillDetailResponseType,
  BillUpdateStatusRequestType,
} from "../../../../types/BillType";

const UpdateBillModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: billDetail, isLoading } =
    useEntityQuery<BillDetailResponseType>({
      keys: ["bill", data.id],
      params: { id: data.id },
      api: BillApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<BillUpdateStatusRequestType>();

  const updateMutation = useEntityMutation<
    BillUpdateStatusRequestType,
    BillDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["bill", data.id]],
    api: BillApiService.handleUpdateStatus,
  });

  const callApiToUpdateOrder = async (
    id: number,
    button: HTMLElement,
    value: string,
  ) => {
    button.classList.add("active");

    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      // Kiểm tra người dùng hiện tại
      if (Number(billDetail?.employee.id) !== dataForCrud?.infoLogin?.id) {
        openNotification({
          type: "warning",
          message: "Cảnh báo",
          description:
            "Bạn không phải người tạo đơn này nên không thể cập nhật trạng thái!",
        });

        return;
      }

      let status = null;
      if (
        value === BillStatusValue.confirmed ||
        value === BillStatusValue.cancelled
      ) {
        status = value;
      }

      const response = await updateMutation.mutateAsync({
        values: {
          id: id,
          status: status as BillStatusEnum,
        },
      });
      if (response) {
        closeModal();
      }
    }

    button.classList.remove("active");
  };

  return (
    <Spin spinning={!billDetail || isLoading}>
      {dataForCrud && billDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
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
                className="modal__form-group-item multiple-3"
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
                className="modal__form-group-item"
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
                className="modal__form-group-item multiple-2"
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
          {data?.status === BillStatusValue.pending && (
            <div className="modal__buttons">
              <button
                className="modal__button secondary btn green-secondary"
                onClick={(e) =>
                  callApiToUpdateOrder(
                    data?.id!,
                    e.target as HTMLElement,
                    BillStatusValue.confirmed,
                  )
                }
              >
                {BillStatusValue.confirmed}
              </button>
              <button
                className="modal__button secondary btn red-secondary"
                onClick={(e) =>
                  callApiToUpdateOrder(
                    data?.id!,
                    e.target as HTMLElement,
                    BillStatusValue.cancelled,
                  )
                }
              >
                {BillStatusValue.cancelled}
              </button>
            </div>
          )}
        </Form>
      )}
    </Spin>
  );
};

export default UpdateBillModalComponent;
