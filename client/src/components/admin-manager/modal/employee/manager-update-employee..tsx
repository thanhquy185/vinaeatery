import { useState } from "react";
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
import { showCreateValidAddress } from "../../../../services/showCreateValidAddress";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Manager Update Employee
const ManagerUpdateEmployee: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  data,
  dataForCrud,
  modalForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<EmployeeType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const updateMutation = useEntityMutation<EmployeeType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateEmployee,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id! || undefined,
          // image: data?.image! || undefined,
          fullname: data?.fullname! || undefined,
          birthday: dayjs(data?.birthday!) || undefined,
          gender: data?.gender! || undefined,
          phone: data?.phone! || undefined,
          email: data?.email! || undefined,
          address: data?.address! || undefined,
          roleId: data?.currentRole?.id! || undefined,
          username: data?.user?.username! || undefined,
          permissionId: data?.permission?.id! || undefined,
          status: data?.status! || undefined,
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
                image: imageFile! || undefined,
                birthday:
                  values!.birthday && dayjs(values!.birthday).isValid()
                    ? dayjs(values!.birthday).format("YYYY-MM-DD")
                    : undefined,
                updateAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
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
              name="id"
              label={defaultLabels.id}
              className="modal__form-group-item"
            >
              <Input className="text-center" disabled />
            </Form.Item>
            <Form.Item
              name="username"
              label={defaultLabels.username}
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
              <Select disabled />
            </Form.Item>
            <Form.Item
              label={defaultLabels.password}
              className="modal__form-group-item"
            >
              <Input
                className="text-center"
                value="Mật khẩu đã được mã hoá!"
                disabled
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.currentRole}
              className="modal__form-group-item"
              required
            >
              <Space.Compact>
                <Form.Item
                  name="roleId"
                  noStyle
                  rules={[ruleRequired("Chức vụ không được để trống!")]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder={defaultInputs.currentRole}
                    options={dataForCrud?.roles?.map((role) => ({
                      label: "#" + role!.id + " - " + role!.name,
                      value: role!.id,
                    }))}
                  />
                </Form.Item>
                <button
                  type="button"
                  className="btn secondary-btn diff"
                  onClick={() =>
                    modalForCrud?.roleHistories?.openModalDetail?.({
                      roleHistories: data?.roleHistories,
                    })
                  }
                >
                  Chi tiết
                </button>
              </Space.Compact>
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
          <button type="submit" className="modal__button btn update">
            Xác nhận
          </button>
        </div>
      </Form>
    </>
  );
};

export default ManagerUpdateEmployee;
