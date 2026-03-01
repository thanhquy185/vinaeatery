import { useState, type FC } from "react";
import { DatePicker, Form, Input, Select, Space } from "antd";
import type { RcFile } from "antd/es/upload";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleEmail, rulePhone, ruleRequired } from "../../../../common/rules";
import type { EmployeeType } from "../../../../common/types";
import {
  CommonGender,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import CustomImageUpload from "../../../common/image-upload";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateEmployee } from "../../../../requests/employees";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { showCreateValidAddress } from "../../../../services/showCreateValidAddress";
import dayjs from "dayjs";

// Manager Change Info
const ManagerChangeInfo: FC<CrudObjectModalProps> = ({
  restaurantId,
  data,
  closeModal,
}) => {
  const [form] = Form.useForm<EmployeeType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const updateMutation = useEntityMutation<EmployeeType>({
    messages: {
      success: `Chỉnh sửa thông tin thành công!`,
      error: `Chỉnh sửa thông tin thất bại!`,
    },
    invalidateKeys: [],
    api: HandleUpdateEmployee,
  });

  console.log(data);

  return (
    <Form
      form={form}
      layout={ModalLayout}
      autoComplete={ModalAutoComplete}
      initialValues={{
        id: data?.id! || undefined,
        // image: data?.image! || undefined,
        fullname: data?.fullname! || undefined,
        birthday: data?.birthday
          ? dayjs(data?.birthday, "YYYY-MM-DD")
          : undefined,
        gender: data?.gender! || undefined,
        phone: data?.phone! || undefined,
        email: data?.email! || undefined,
        address: data?.address! || undefined,
      }}
      className="modal__form split-2"
      onFinish={async () => {
        // Nút để submit form
        const submitButton = document.querySelector(
          ".modal__form button[type='submit']",
        );

        // Thêm class 'active' thể hiện nút đang được nhấn
        submitButton?.classList.add("active");

        // Hỏi trước khi xử khi xử lý ?
        const answer = await openConfirmation({
          title: `Bạn có chắc chắn cập nhật ?`,
          content: "Hành động này không thể hoàn tác.",
        });
        if (answer) {
          // Danh sách dữ liệu
          const values = form.getFieldsValue();

          // Thực thi mutation
          const response = await updateMutation.mutateAsync({
            values: {
              ...values,
              restaurantId: restaurantId,
              roleId: data.currentRole.id,
              permissionId: data.permission.id,
              image: imageFile! || undefined,
              birthday:
                values!.birthday && dayjs(values!.birthday).isValid()
                  ? dayjs(values!.birthday).format("YYYY-MM-DD")
                  : undefined,
              // updateAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
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
        <div className="modal__form-group">
          <Form.Item
            label="Hình ảnh"
            htmlFor="update-image"
            className="modal__form-group-item"
          >
            <CustomImageUpload
              defaultSrc={data?.image!}
              imageFile={imageFile}
              setImageFile={setImageFile}
              alt="image-preview"
              htmlFor="update-image"
              imageClassName="image-preview"
              uploadClassName="image-uploader"
              imageCategoryName="employees"
              labelButton="Tải hỉnh ảnh"
            />
          </Form.Item>
          <Form.Item
            name="id"
            label="."
            className="modal__form-group-item hidden"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            className="modal__form-group-item multiple-2"
          >
            <Space.Compact>
              <Form.Item name="address" noStyle>
                <Input id="update-address" placeholder="Nhập địa chỉ" />
              </Form.Item>
              <button
                type="button"
                className="btn secondary-btn"
                onClick={async () => {
                  const result = await showCreateValidAddress();
                  if (result) {
                    const { houseNumberAndStreetName, province, ward } = result;

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
          <Form.Item
            name="fullname"
            label="Họ và tên"
            htmlFor="update-fullname"
            className="modal__form-group-item"
            rules={[ruleRequired("Họ và tên không được để trống!")]}
          >
            <Input id="update-fullname" placeholder="Nhập Họ và tên" />
          </Form.Item>
          <div className="modal__form-group-item-warper split-2">
            <Form.Item
              name="birthday"
              label="Ngày sinh"
              htmlFor="update-birthday"
              className="modal__form-group-item"
            >
              <DatePicker id="update-birthday" placeholder="Chọn Ngày sinh" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Giới tính"
              htmlFor="update-gender"
              className="modal__form-group-item"
            >
              <Select
                allowClear
                id="update-gender"
                placeholder="Chọn Giới tính"
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
            name="phone"
            label="Số điện thoại"
            htmlFor="update-phone"
            className="modal__form-group-item"
            rules={[
              ruleRequired("Số điện thoại không được để trống!"),
              rulePhone(),
            ]}
          >
            <Input id="update-phone" placeholder="Nhập Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            htmlFor="update-email"
            className="modal__form-group-item"
            rules={[ruleRequired("Email không được để trống!"), ruleEmail()]}
          >
            <Input id="update-email" placeholder="Nhập Email" />
          </Form.Item>
        </div>
      </div>
      <div className="modal__buttons">
        <button type="submit" className="modal__button btn">
          Xác nhận
        </button>
      </div>
    </Form>
  );
};

export default ManagerChangeInfo;
