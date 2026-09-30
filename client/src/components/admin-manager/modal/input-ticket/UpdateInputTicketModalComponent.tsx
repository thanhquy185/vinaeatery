import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TableInputComponent from "../../TableInputComponent";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import InputTicketApiService from "../../../../services/api/v1/InputTicketApiService";
import { Form, Input, Spin } from "antd";
import {
  InputTicketPaymentStatusValue,
  InputTicketStatusValue,
  ModalLayout,
} from "../../../../constants/values";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/otherEvents";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import { openNotification } from "../../../../utils/showNotificationUtil";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  InputTicketPaymentStatusEnum,
  InputTicketStatusEnum,
} from "../../../../constants/enums";
import type { TableInputComponentRowData } from "../../TableInputComponent";
import type {
  InputTicketDetailResponseType,
  InputTicketUpdatePaymentStatusRequestType,
  InputTicketUpdateStatusRequestType,
} from "../../../../types/InputTicketType";

const UpdateInputTicketModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: inputTicketDetail, isLoading } =
    useEntityQuery<InputTicketDetailResponseType>({
      keys: ["input-ticket", data.id],
      params: { id: data.id },
      api: InputTicketApiService.handleGetDetailById,
    });

  const [form] = Form.useForm();

  const updatePaymentStatusMutation = useEntityMutation<
    InputTicketUpdatePaymentStatusRequestType,
    InputTicketDetailResponseType
  >({
    messages: {
      success: `Cập nhật thanh toán ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật thanh toán ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["input-ticket", data.id]],
    api: InputTicketApiService.handleUpdatePaymentStatus,
  });
  const updateStatusMutation = useEntityMutation<
    InputTicketUpdateStatusRequestType,
    InputTicketDetailResponseType
  >({
    messages: {
      success: `Cập nhật trạng thái ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật trạng thái ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["input-ticket", data.id]],
    api: InputTicketApiService.handleUpdateStatus,
  });

  // Hàm gọi API để cập nhật trạng thái phiếu nhập
  const callApiToUpdateInputTicket = async (
    id: number,
    button: HTMLElement,
    value: string,
  ) => {
    // Thêm class 'active' thể hiện là nút được nhấn
    button.classList.add("active");

    // Hỏi trước khi xử khi xử lý ?
    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      // Kiểm tra người dùng hiện tại
      if (
        Number(inputTicketDetail?.employee.id) !== dataForCrud?.infoLogin?.id
      ) {
        openNotification({
          type: "warning",
          message: "Cảnh báo",
          description:
            "Bạn không phải người tạo đơn này nên không thể cập nhật trạng thái!",
        });

        return;
      }

      // Thực thi mutation
      const response =
        value === InputTicketPaymentStatusValue.paid ||
        value === InputTicketPaymentStatusValue.unpaid
          ? await updatePaymentStatusMutation.mutateAsync({
              values: {
                id: id,
                paymentStatus: value as InputTicketPaymentStatusEnum,
              },
            })
          : await updateStatusMutation.mutateAsync({
              values: {
                id: id,
                status: value as InputTicketStatusEnum,
              },
            });
      if (response) {
        closeModal();
      }
    }

    button.classList.remove("active");
  };

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
                className={
                  "modal__form-group-item multiple-3" +
                  (inputTicketDetail.status === InputTicketStatusValue.cancelled
                    ? " margin-bottom-0"
                    : "")
                }
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
          {data.status === InputTicketStatusValue.pending && (
            <div className="modal__buttons">
              <button
                className="modal__button secondary btn green-secondary"
                onClick={(e) =>
                  callApiToUpdateInputTicket(
                    data.id,
                    e.target as HTMLElement,
                    InputTicketStatusValue.confirmed,
                  )
                }
              >
                {InputTicketStatusValue.confirmed}
              </button>
              <button
                className="modal__button secondary btn red-secondary"
                onClick={(e) =>
                  callApiToUpdateInputTicket(
                    data.id,
                    e.target as HTMLElement,
                    InputTicketStatusValue.cancelled,
                  )
                }
              >
                {InputTicketStatusValue.cancelled}
              </button>
            </div>
          )}
          {data.status === InputTicketStatusValue.confirmed && (
            <div className="modal__buttons">
              <button
                className="modal__button secondary btn"
                onClick={(e) =>
                  callApiToUpdateInputTicket(
                    data.id,
                    e.target as HTMLElement,
                    data.paymentStatus! === InputTicketPaymentStatusValue.paid
                      ? InputTicketPaymentStatusValue.unpaid
                      : InputTicketPaymentStatusValue.paid,
                  )
                }
              >
                {data.paymentStatus === InputTicketPaymentStatusValue.paid
                  ? InputTicketPaymentStatusValue.unpaid
                  : InputTicketPaymentStatusValue.paid}
              </button>
            </div>
          )}
        </Form>
      )}
    </Spin>
  );
};

export default UpdateInputTicketModalComponent;
