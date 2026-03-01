import { useMemo, useState } from "react";
import { Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleRequired } from "../../../../common/rules";
import type {
  InputTicketDetailType,
  InputTicketType,
} from "../../../../common/types";
import {
  InputTicketStatus,
  ModalAutoComplete,
  ModalLayout,
  PayStatus,
} from "../../../../common/values";
import CustomTableNoActions from "../../common/table-no-actions";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateInputTicket } from "../../../../requests/input-tickets";
import { getVietnamCurrentDatetime } from "../../../../services/dayjs";
import { openConfirmation } from "../../../../utils/show-confirmation";
import {
  numberToVietnamWords,
  vietnamMoneyFormat,
} from "../../../../utils/other-events";

// Manager Create Input Ticket
const ManagerCreateInputTicket: React.FC<CrudObjectModalProps> = ({
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
  const [form] = Form.useForm<InputTicketType>();
  const createAtValue = getVietnamCurrentDatetime();
  const [totalPriceValue, setTotalPriceValue] = useState<number>(0);
  const [inputTicketDetails, setInputTicketDetails] = useState<
    InputTicketDetailType[]
  >([]);
  const createMutation = useEntityMutation<InputTicketType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateInputTicket,
  });

  // Tính toán lại tổng tiền nhập khi thay đổi nguyên liệu
  useMemo(() => {
    const totalValue = inputTicketDetails.reduce(
      (total, inputTicketDetail) =>
        total + inputTicketDetail?.price! * inputTicketDetail?.quantity!,
      0,
    );
    setTotalPriceValue(totalValue);
  }, [inputTicketDetails]);

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          employee:
            "#" +
            dataForCrud?.infoLogin!.id +
            " - " +
            dataForCrud?.infoLogin!.fullname +
            " - " +
            dataForCrud?.infoLogin!.phone +
            " - " +
            dataForCrud?.infoLogin!.email,
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
                employeeId: dataForCrud?.infoLogin?.id,
                totalPrice: totalPriceValue,
                payStatus: PayStatus.notPay,
                status: InputTicketStatus.pending,
                inputTicketDetails: inputTicketDetails.map(
                  (inputTicketDetail) => ({
                    ingredientId: inputTicketDetail?.ingredient?.id!,
                    price: inputTicketDetail.price,
                    quantity: inputTicketDetail.quantity,
                  }),
                ),
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
                  value={defaultInputs.id}
                  disabled
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <Input className="text-center" value={createAtValue} disabled />
              </Form.Item>
            </div>
            <Form.Item
              label={defaultLabels.status}
              className="modal__form-group-item"
            >
              <Input value={defaultInputs.status} disabled />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
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
                placeholder={defaultInputs.totalPrice}
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
              name="supplierId"
              label={defaultLabels.supplier}
              className="modal__form-group-item multiple-3"
              rules={[ruleRequired("Nhà cung cấp không được để trống!")]}
            >
              <Select
                showSearch
                allowClear
                placeholder={defaultInputs.supplier}
                options={dataForCrud?.suppliers?.map((supplier) => ({
                  label:
                    "#" +
                    supplier!.id +
                    " - " +
                    supplier!.name +
                    " - " +
                    supplier!.phone +
                    " - " +
                    supplier!.email +
                    " - " +
                    supplier!.address,
                  value: supplier!.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              label={defaultLabels.inputTicketDetails}
              className="modal__form-group-item multiple-3"
            >
              <CustomTableNoActions
                className="inputTicketDetails"
                columnWidths={tableNoActionsFormat?.widths}
                columnTitles={tableNoActionsFormat?.columns}
                data={inputTicketDetails}
                attributes={tableNoActionsFormat?.attributes}
                format={tableNoActionsFormat?.format}
              />
              <div className="buttons">
                <button
                  type="button"
                  className="btn secondary-btn margin-r"
                  onClick={() =>
                    modalForCrud?.inputTicketDetails?.openModalCreate?.({
                      inputTicketDetails: inputTicketDetails,
                      setInputTicketDetails: setInputTicketDetails,
                    })
                  }
                >
                  Thêm nguyên liệu
                </button>
                <button
                  type="button"
                  className="btn secondary-btn"
                  onClick={() =>
                    modalForCrud?.inputTicketDetails?.openModalDelete?.({
                      inputTicketDetails: inputTicketDetails,
                      setInputTicketDetails: setInputTicketDetails,
                    })
                  }
                >
                  Xoá nguyên liệu
                </button>
              </div>
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

export default ManagerCreateInputTicket;
