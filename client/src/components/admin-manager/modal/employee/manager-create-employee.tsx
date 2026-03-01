import { useState } from "react";
import { DatePicker, Form, Input, Select, Space } from "antd";
import type { RcFile } from "antd/es/upload";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleEmail, rulePhone, ruleRequired } from "../../../../common/rules";
import type { EmployeeType } from "../../../../common/types";
import {
  CommonGender,
  CommonStatus,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import CustomImageUpload from "../../../common/image-upload";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleCreateEmployee } from "../../../../requests/employees";
import { showCreateValidAddress } from "../../../../services/showCreateValidAddress";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Create Employee
const ManagerCreateEmployee: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  dataForCrud,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<EmployeeType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const createMutation = useEntityMutation<EmployeeType>({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleCreateEmployee,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
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
                createAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                image: imageFile! || undefined,
                birthday:
                  values!.birthday && dayjs(values!.birthday).isValid()
                    ? dayjs(values!.birthday).format("YYYY-MM-DD")
                    : undefined,
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
              name="username"
              label={defaultLabels.username}
              className="modal__form-group-item"
              rules={[ruleRequired("Tên tài khoản không được để trống!")]}
            >
              <Input placeholder={defaultInputs.username} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
              rules={[ruleRequired("Trạng thái không được để trống!")]}
            >
              <Select
                allowClear
                placeholder={defaultInputs.status}
                options={[
                  {
                    label: CommonStatus.active,
                    value: CommonStatus.active,
                  },
                  {
                    label: CommonStatus.inactive,
                    value: CommonStatus.inactive,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={defaultLabels.password}
              className="modal__form-group-item"
              rules={[ruleRequired("Mật khẩu không được để trống!")]}
            >
              <Input placeholder={defaultInputs.password} />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="roleId"
              label={defaultLabels.currentRole}
              className="modal__form-group-item"
              rules={[ruleRequired("Chức vụ không được để trống!")]}
            >
              <Select
                allowClear
                showSearch
                placeholder={defaultInputs.currentRole}
                options={dataForCrud?.roles?.map((role) => ({
                  label: "#" + role?.id + " - " + role?.name,
                  value: role?.id,
                }))}
              />
            </Form.Item>
            <Form.Item
              name="permissionId"
              label={defaultLabels.permission}
              className="modal__form-group-item"
              rules={[ruleRequired("Quyền hạn không được để trống!")]}
            >
              <Select
                allowClear
                showSearch
                placeholder={defaultInputs.permission}
                options={dataForCrud?.permissions?.map((permission) => ({
                  label: "#" + permission?.id + " - " + permission?.name,
                  value: permission?.id,
                }))}
              />
            </Form.Item>
          </div>
        </div>
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title2}</p>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.image}
              htmlFor="create-image"
              className="modal__form-group-item"
            >
              <CustomImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                alt="image-preview"
                htmlFor="create-image"
                imageClassName="image-preview"
                uploadClassName="image-uploader"
                labelButton={defaultInputs.image}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              name="fullname"
              label={defaultLabels.fullname}
              className="modal__form-group-item"
              rules={[ruleRequired("Họ và tên không được để trống!")]}
            >
              <Input placeholder={defaultInputs.fullname} />
            </Form.Item>
            <Form.Item
              name="phone"
              label={defaultLabels.phone}
              className="modal__form-group-item"
              rules={[
                ruleRequired("Số điện thoại không được để trống!"),
                rulePhone(),
              ]}
            >
              <Input placeholder={defaultInputs.phone} />
            </Form.Item>
            <Form.Item
              label={defaultLabels.address}
              className="modal__form-group-item multiple-2"
            >
              <Space.Compact>
                <Form.Item name="address" noStyle>
                  <Input placeholder={defaultInputs.address} />
                </Form.Item>
                <button
                  type="button"
                  className="btn secondary-btn"
                  onClick={async () => {
                    const result = await showCreateValidAddress();
                    if (result) {
                      const { houseNumberAndStreetName, province, ward } =
                        result;

                      form.setFieldsValue({
                        address: `${houseNumberAndStreetName}, ${ward}, ${province}`,
                      });
                    }
                  }}
                >
                  Tạo địa chỉ
                </button>
              </Space.Compact>
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="birthday"
                label={defaultLabels.birthday}
                className="modal__form-group-item"
              >
                <DatePicker placeholder={defaultInputs.birthday} />
              </Form.Item>
              <Form.Item
                name="gender"
                label={defaultLabels.gender}
                className="modal__form-group-item"
              >
                <Select
                  allowClear
                  placeholder={defaultInputs.gender}
                  options={[
                    { label: CommonGender.male, value: CommonGender.male },
                    {
                      label: CommonGender.female,
                      value: CommonGender.female,
                    },
                  ]}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="email"
              label={defaultLabels.email}
              className="modal__form-group-item"
              rules={[ruleRequired("Email không được để trống!"), ruleEmail()]}
            >
              <Input placeholder={defaultInputs.email} />
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

export default ManagerCreateEmployee;
