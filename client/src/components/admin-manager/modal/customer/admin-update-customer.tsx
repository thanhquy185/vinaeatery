import { useState } from "react";
import { DatePicker, Form, Input, Select, Space } from "antd";
import type { RcFile } from "antd/es/upload";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleEmail, rulePhone, ruleRequired } from "../../../../common/rules";
import type { CustomerType } from "../../../../common/types";
import {
  CommonGender,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../common/values";
import CustomImageUpload from "../../../common/image-upload";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateCustomer } from "../../../../requests/customers";
import { showCreateValidAddress } from "../../../../services/showCreateValidAddress";
import { openConfirmation } from "../../../../utils/show-confirmation";
import dayjs from "dayjs";

// Admin Update Customer
const AdminUpdateCustomer: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<CustomerType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const updateMutation = useEntityMutation<CustomerType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["users"]],
    api: HandleUpdateCustomer,
  });

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id || undefined,
          userId:
            "#" + data?.user?.id + " - " + data?.user?.username || undefined,
          createAt: data?.createAt! ? dayjs(data?.createAt!) : undefined,
          fullname: data?.fullname! || undefined,
          birthday: data?.birthday! ? dayjs(data?.birthday!) : undefined,
          gender: data?.gender! || undefined,
          phone: data?.phone! || undefined,
          email: data?.email! || undefined,
          address: data?.address! || undefined,
          description: data?.description! || undefined,
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
                userId: String(values?.userId).includes("#")
                  ? Number(
                      String(values?.userId).split(" - ")[0].replace("#", ""),
                    )
                  : values?.userId,
                image: imageFile! || undefined,
                birthday:
                  values?.birthday && dayjs(values?.birthday).isValid()
                    ? dayjs(values?.birthday).format("YYYY-MM-DD")
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
          <p className="modal__form-group-title">{defaultLabels.title}</p>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.image}
              htmlFor="update-image"
              className="modal__form-group-item"
            >
              <CustomImageUpload
                defaultSrc={data?.image}
                imageFile={imageFile}
                setImageFile={setImageFile}
                alt="image-preview"
                htmlFor="update-image"
                imageClassName="image-preview"
                uploadClassName="image-uploader"
                labelButton={defaultInputs.image}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label={defaultLabels.description}
              className="modal__form-group-item"
            >
              <TextArea
                className="multiple-2"
                placeholder={defaultInputs.description}
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input
                  placeholder={defaultInputs.id}
                  className="text-center"
                  disabled
                />
              </Form.Item>
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  className="text-center"
                  disabled
                />
              </Form.Item>
            </div>
            <Form.Item
              name="fullname"
              label={defaultLabels.fullname}
              className="modal__form-group-item multiple-2"
              rules={[ruleRequired("Họ và tên không được để trống!")]}
            >
              <Input placeholder={defaultInputs.fullname} />
            </Form.Item>
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="birthday"
                label={defaultLabels.birthday}
                className="modal__form-group-item"
              >
                <DatePicker
                  allowClear
                  format="YYYY-MM-DD"
                  placeholder={defaultInputs.birthday}
                />
              </Form.Item>
              <Form.Item
                name="gender"
                label={defaultLabels.gender}
                className="modal__form-group-item"
              >
                <Select
                  allowClear
                  options={[
                    {
                      label: CommonGender.male,
                      value: CommonGender.male,
                    },
                    {
                      label: CommonGender.female,
                      value: CommonGender.female,
                    },
                  ]}
                  placeholder={defaultInputs.gender}
                />
              </Form.Item>
            </div>
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
            <Form.Item
              name="status"
              label={defaultLabels.status}
              className="modal__form-group-item"
            >
              <Select disabled />
            </Form.Item>
            <Form.Item label="." className="modal__form-group-item hidden">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="userId"
              label={defaultLabels.user}
              className="modal__form-group-item"
              rules={[ruleRequired("Tài khoản không được để trống!")]}
            >
              <Select
                allowClear
                options={dataForCrud?.users?.map((user) => ({
                  label: "#" + user?.id + " - " + user?.username,
                  value: user?.id,
                }))}
                placeholder={defaultInputs.user}
              />
            </Form.Item>
            <Form.Item
              name="email"
              htmlFor="email"
              label={defaultLabels.email}
              className="modal__form-group-item"
              rules={[ruleRequired("Email không được để trống"), ruleEmail()]}
            >
              <Input id="email" placeholder={defaultInputs.email} />
            </Form.Item>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default AdminUpdateCustomer;
