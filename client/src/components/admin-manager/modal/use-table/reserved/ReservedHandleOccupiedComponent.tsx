import ReservedHandleOccupiedMenuComponent from "./ReservedHandleOccupiedMenuComponent";
import ReservedHandleOccupiedCustomerComponent from "./ReservedHandleOccupiedCustomerComponent";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { UseTableStatusValue } from "../../../../../constants/values";
import { openNotification } from "../../../../../utils/showNotification";
import type { ManagerHandleUpdateStatusUseTableProps } from "../../../../../constants/props";
import type { UseTableOccupiedInfoRequestType } from "../../../../../types/UseTableType";

const ReservedHandleOccupiedComponent: React.FC<
  ManagerHandleUpdateStatusUseTableProps
> = ({
  restaurantId,
  useTableId,
  useTable,
  setTableIsOccupied,
  callApiToUpdateUseTable,
}) => {
  // Thông tin cần gửi
  const [infoRequest, setInfoRequest] =
    useState<UseTableOccupiedInfoRequestType | null>(null);
  // Khách hàng chọn gọi tự do ?
  const [menuAlaCarte, setMenuAlaCarted] = useState<boolean>(true);
  // Form
  const [form] = Form.useForm();

  useEffect(() => {
    setInfoRequest({
      ...infoRequest!,
      customerId: useTable?.reservation.customerId!,
      customerFullname: useTable?.reservation.customerFullname!,
      customerPhone: useTable?.reservation.customerPhone!,
      customerEmail: useTable?.reservation.customerEmail!,
    });

    form.setFieldValue(
      "customerFullname",
      useTable?.reservation.customerFullname!,
    );
    form.setFieldValue("customerPhone", useTable?.reservation.customerPhone!);
    form.setFieldValue("customerEmail", useTable?.reservation.customerEmail!);
  }, [useTable]);

  return (
    <div className="info diff">
      <b>Bàn đang có khách</b>
      <ReservedHandleOccupiedCustomerComponent form={form} />
      <ReservedHandleOccupiedMenuComponent
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
            const infoReq: UseTableOccupiedInfoRequestType = {
              ...form.getFieldsValue(),
              menuId: infoRequest?.menuId,
              customerId: infoRequest?.customerId,
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
                description: `Bạn chưa có thông tin khách hàng. Hãy nhập một khách hàng!`,
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

export default ReservedHandleOccupiedComponent;
