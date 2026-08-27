import useProvinces from "../../../../hooks/useProvinces";
import useWards from "../../../../hooks/useWards";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import ImageUploadComponent from "../../../ImageUploadComponent";
import EmployeeApiService from "../../../../services/api/v1/EmployeeApiService";
import dayjs from "dayjs";
import { useState } from "react";
import { DatePicker, Form, Input, Select } from "antd";
import {
  ruleEmail,
  rulePhone,
  ruleRequired,
} from "../../../../constants/rules";
import {
  CommonGenderValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import type { RcFile } from "antd/es/upload";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  EmployeeDetailResponseType,
  EmployeeUpdateRequestType,
} from "../../../../types/EmployeeType";

const ChangeInfoModalComponent: React.FC<CrudObjectModalProps> = ({
  data,
  closeModal,
}) => {
  const [form] = Form.useForm<EmployeeDetailResponseType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const [provinceCode, setProvinceCode] = useState<number>(0);

  const provinces = useProvinces();
  const wards = useWards(provinceCode);

  const updateMutation = useEntityMutation<
    EmployeeUpdateRequestType,
    EmployeeDetailResponseType
  >({
    messages: {
      success: `Chỉnh sửa thông tin thành công!`,
      error: `Chỉnh sửa thông tin thất bại!`,
    },
    invalidateKeys: [],
    api: EmployeeApiService.handleUpdate,
  });

  return (
    <Form
      form={form}
      layout={ModalLayout}
      autoComplete={ModalAutoComplete}
      initialValues={{
        id: data.id,
        fullname: data.fullname,
        birthdate: dayjs(data.birthdate, "YYYY-MM-DD"),
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        houseNumber: data.houseNumber,
        streetName: data.streetName,
        ward: data.ward,
        province: data.province,
      }}
      className="modal__form split-2"
      onFinish={async () => {
        const submitButton = document.querySelector(
          ".modal__form button[type='submit']",
        );

        submitButton?.classList.add("active");

        const answer = await openConfirmation({
          title: `Bạn có chắc chắn cập nhật ?`,
          content: "Hành động này không thể hoàn tác.",
        });
        if (answer) {
          const values = form.getFieldsValue();

          const response = await updateMutation.mutateAsync({
            values: {
              ...values,
              roleId: data.currentRole.id,
              permissionId: data.permission.id,
              image: imageFile ?? undefined,
              birthdate:
                values!.birthdate && dayjs(values!.birthdate).isValid()
                  ? dayjs(values!.birthdate).format("YYYY-MM-DD")
                  : dayjs().format("YYYY-MM-DD"),
            },
          });
          if (response) {
            closeModal();
          }
        }

        submitButton?.classList.remove("active");
      }}
    >
      <div className="modal__form-group-warper">
        <div className="modal__form-group">
          <Form.Item label="Hình ảnh" className="modal__form-group-item">
            <ImageUploadComponent
              defaultSrc={data.image!}
              imageFile={imageFile}
              setImageFile={setImageFile}
              alt="image-preview"
              imageClassName="image-preview"
              uploadClassName="image-uploader"
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
            name="province"
            label="Tỉnh / Thành phố"
            className="modal__form-group-item"
            rules={[ruleRequired("Tỉnh / Thành phố không được để trống!")]}
          >
            <Select
              allowClear
              showSearch
              options={provinces.map((province) => ({
                code: (province as any).code,
                label: (province as any).name,
                value: (province as any).name,
              }))}
              placeholder="Chọn Tỉnh / Thành phố"
              onChange={(_value, option) => {
                setProvinceCode((option as any).code);

                form.setFieldValue("ward", undefined);
              }}
            />
          </Form.Item>
          <Form.Item
            name="streetName"
            label="Tên đường"
            className="modal__form-group-item"
            rules={[ruleRequired("Tên đường không được để trống!")]}
          >
            <Input placeholder="Nhập Tên đường" />
          </Form.Item>
        </div>
        <div className="modal__form-group">
          <Form.Item
            name="fullname"
            label="Họ và tên"
            className="modal__form-group-item"
            rules={[ruleRequired("Họ và tên không được để trống!")]}
          >
            <Input placeholder="Nhập Họ và tên" />
          </Form.Item>
          <div className="modal__form-group-item-warper split-2">
            <Form.Item
              name="birthdate"
              label="Ngày sinh"
              className="modal__form-group-item"
              rules={[ruleRequired("Ngày sinh không được để trống!")]}
            >
              <DatePicker placeholder="Chọn Ngày sinh" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Giới tính"
              className="modal__form-group-item"
              rules={[ruleRequired("Giới tính không được để trống!")]}
            >
              <Select
                allowClear
                placeholder="Chọn Giới tính"
                options={[
                  {
                    label: CommonGenderValue.male,
                    value: CommonGenderValue.male,
                  },
                  {
                    label: CommonGenderValue.female,
                    value: CommonGenderValue.female,
                  },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            className="modal__form-group-item"
            rules={[
              ruleRequired("Số điện thoại không được để trống!"),
              rulePhone(),
            ]}
          >
            <Input placeholder="Nhập Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            className="modal__form-group-item"
            rules={[ruleRequired("Email không được để trống!"), ruleEmail()]}
          >
            <Input placeholder="Nhập Email" />
          </Form.Item>
          <Form.Item
            name="ward"
            label="Phường / Xã"
            className="modal__form-group-item"
            rules={[ruleRequired("Phường / Xã không được để trống!")]}
          >
            <Select
              allowClear
              showSearch
              options={wards.map((ward) => ({
                label: (ward as any).name,
                value: (ward as any).name,
              }))}
              placeholder="Chọn Phường / Xã"
            />
          </Form.Item>
          <Form.Item
            name="houseNumber"
            label="Số nhà"
            className="modal__form-group-item"
            rules={[ruleRequired("Số nhà không được để trống!")]}
          >
            <Input placeholder="Nhập Số nhà" />
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

export default ChangeInfoModalComponent;
