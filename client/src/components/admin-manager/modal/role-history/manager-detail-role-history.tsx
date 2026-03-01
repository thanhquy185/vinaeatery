import { Form } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import CustomTableNoActions from "../../common/table-no-actions";

// Manager Detail Role History
const ManagerDetailRoleHistory: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  restaurantId,
  roleHistories,
  closeModal,
}) => {
  return (
    <>
      <Form.Item
        // label="Danh sách chức vụ"
        className="modal__form-group-item margin-bottom-0"
      >
        <CustomTableNoActions
          className="recipe"
          columnWidths={["10", "24%", "18", "18", "15%", "15%"]}
          columnTitles={[
            "Mã chức vụ",
            "Tên chức vụ",
            "Cách tính lương",
            "Tiền lương",
            "Thời gian bắt đầu",
            "Thời gian kết thúc",
          ]}
          data={roleHistories!}
          attributes={[
            "roleId",
            "roleName",
            "roleSalaryType",
            "roleSalaryValue",
            "dateStart",
            "dateEnd",
          ]}
          format={["", "", "", "", "", ""]}
        />
      </Form.Item>
    </>
  );
};

export default ManagerDetailRoleHistory;
