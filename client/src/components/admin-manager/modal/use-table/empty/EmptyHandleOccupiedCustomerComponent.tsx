import EmptyHandleOccupiedCustomerHasAccountComponent from "./EmptyHandleOccupiedCustomerHasAccountComponent";
import EmptyHandleOccupiedCustomerHasNotAccountComponent from "./EmptyHandleOccupiedCustomerHasNotAccountComponent";
import { useMemo } from "react";
import { Radio } from "antd";
import type { ManagerHandleUpdateStatusUseTableProps } from "../../../../../constants/props";

const EmptyHandleOccupiedCustomerComponent: React.FC<
  ManagerHandleUpdateStatusUseTableProps
> = ({
  form,
  infoRequest,
  setInfoRequest,
  customerHasAccount,
  setCustomerHasAccount,
}) => {
  useMemo(() => {
    form?.resetFields();
    setInfoRequest!({
      ...infoRequest!,
      customerId: 0,
      customerFullname: "",
      customerPhone: "",
      customerEmail: "",
      customerAdult: 0,
      customerChild: 0,
      customerGuests: 0,
    });
  }, [customerHasAccount]);

  return (
    <>
      <div className="info">
        <b>Thông tin khách hàng</b>
      </div>
      <Radio.Group
        defaultValue={true}
        buttonStyle="solid"
        style={{ width: "100%", margin: "10px 0 16px" }}
        onChange={(e) => setCustomerHasAccount!(e.target.value)}
      >
        <Radio.Button value={true}>Đã có tài khoản trên hệ thống</Radio.Button>
        <Radio.Button value={false}>
          Chưa có tài khoản trên hệ thống
        </Radio.Button>
      </Radio.Group>
      {customerHasAccount && (
        <EmptyHandleOccupiedCustomerHasAccountComponent
          form={form}
          infoRequest={infoRequest}
          setInfoRequest={setInfoRequest}
        />
      )}
      {!customerHasAccount && (
        <EmptyHandleOccupiedCustomerHasNotAccountComponent form={form} />
      )}
    </>
  );
};

export default EmptyHandleOccupiedCustomerComponent;
