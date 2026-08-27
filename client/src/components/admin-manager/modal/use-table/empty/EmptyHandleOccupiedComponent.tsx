import EmptyHandleOccupiedMenuComponent from "./EmptyHandleOccupiedMenuComponent";
import EmptyHandleOccupiedCustomerComponent from "./EmptyHandleOccupiedCustomerComponent";
import { Form } from "antd";
import { useState } from "react";
import { UseTableStatusValue } from "../../../../../constants/values";
import { openNotification } from "../../../../../utils/showNotificationUtil";
import type { ManagerHandleUpdateStatusUseTableProps } from "../../../../../constants/props";
import type { UseTableOccupiedInfoRequestType } from "../../../../../types/UseTableType";

const EmptyHandleOccupiedComponent: React.FC<
  ManagerHandleUpdateStatusUseTableProps
> = ({
  restaurantId,
  useTableId,
  setTableIsOccupied,
  callApiToUpdateUseTable,
}) => {
  // Thông tin cần gửi
  const [infoRequest, setInfoRequest] =
    useState<UseTableOccupiedInfoRequestType | null>(null);
  // Khách hàng chọn gọi tự do ?
  const [menuAlaCarte, setMenuAlaCarted] = useState<boolean>(true);
  // Khách hàng đã đăng ký tài khoản trên hệ thống ?
  const [customerHasAccount, setCustomerHasAccount] = useState<boolean>(true);
  // Form
  const [form] = Form.useForm();

  return (
    <div className="info diff">
      <b>Bàn đang có khách</b>
      <EmptyHandleOccupiedCustomerComponent
        useTableId={useTableId}
        form={form}
        infoRequest={infoRequest}
        setInfoRequest={setInfoRequest}
        customerHasAccount={customerHasAccount}
        setCustomerHasAccount={setCustomerHasAccount}
      />
      <EmptyHandleOccupiedMenuComponent
        restaurantId={restaurantId}
        infoRequest={infoRequest}
        setInfoRequest={setInfoRequest}
        menuAlaCarte={menuAlaCarte}
        setMenuAlaCarte={setMenuAlaCarted}
      />
      <div className="modal__buttons mg-top">
        <button
          type="button"
          className="modal__button secondary btn"
          onClick={(e) => {
            form.validateFields();
            const infoReq: UseTableOccupiedInfoRequestType = customerHasAccount
              ? {
                  ...infoRequest,
                  customerAdult: form.getFieldValue("customerAdult"),
                  customerChild: form.getFieldValue("customerChild"),
                }
              : {
                  ...form.getFieldsValue(),
                  menuId: infoRequest?.menuId,
                  customerId: 1,
                };

            const customerIsInvalid =
              !infoReq.customerId ||
              !infoReq.customerFullname ||
              !infoReq.customerPhone ||
              !infoReq.customerEmail ||
              !infoReq.customerAdult ||
              !infoReq.customerChild;
            if (!infoReq.menuId) {
              openNotification({
                type: "warning",
                message: "Cảnh báo!",
                description: `Bạn chưa có thông tin thực đơn. Hãy chọn một thực đơn!`,
              });
            }
            if (customerIsInvalid) {
              openNotification({
                type: "warning",
                message: "Cảnh báo!",
                description: `Bạn chưa có thông tin khách hàng. Hãy ${customerHasAccount ? "chọn" : "nhập"} một khách hàng!`,
              });
            }
            if (!infoReq.menuId || customerIsInvalid) {
              return;
            }

            callApiToUpdateUseTable!({
              ...infoReq,
              id: useTableId,
              customerGuests: infoReq.customerAdult + infoReq.customerChild,
              button: e.target as HTMLElement,
              value: UseTableStatusValue.occupied,
            });
          }}
        >
          Xác nhận
        </button>
        <button
          type="button"
          className="modal__button secondary btn"
          onClick={() => setTableIsOccupied!(false)}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default EmptyHandleOccupiedComponent;
