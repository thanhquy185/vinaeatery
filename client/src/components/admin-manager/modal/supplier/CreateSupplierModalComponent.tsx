import useWards from "../../../../hooks/useWards";
import useProvinces from "../../../../hooks/useProvinces";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import SupplierApiService from "../../../../services/api/v1/SupplierApiService";
import { useState } from "react";
import { Form, Input, Select } from "antd";
import {
  ruleEmail,
  rulePhone,
  ruleRequired,
} from "../../../../constants/rules";
import {
  CommonStatusValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmation";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  SupplierCreateRequestType,
  SupplierDetailResponseType,
} from "../../../../types/SupplierType";

const CreateSupplierModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  closeModal,
}) => {
  const [form] = Form.useForm<SupplierCreateRequestType>();
  const [provinceCode, setProvinceCode] = useState<number>(0);

  const provinces = useProvinces();
  const wards = useWards(provinceCode);

  const createMutation = useEntityMutation<
    SupplierCreateRequestType,
    SupplierDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: SupplierApiService.handleCreate,
  });

  return (
    <>
      {restaurantId && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          className="modal__form split-2"
          onFinish={async () => {
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
            );

            submitButton?.classList.add("active");

            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              const values = form.getFieldsValue();

              const response = await createMutation.mutateAsync({
                values: {
                  ...values,
                  restaurantId: restaurantId,
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
            <p className="modal__form-group-title">{defaultLabels.title}</p>
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
                name="fullname"
                label={defaultLabels.fullname}
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Họ và tên không được để trống!")]}
              >
                <Input placeholder={defaultInputs.fullname} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
                rules={[
                  rulePhone(),
                  ruleRequired("Số điện thoại không được để trống!"),
                ]}
              >
                <Input placeholder={defaultInputs.phone} />
              </Form.Item>
              <Form.Item
                name="province"
                label={defaultLabels.province}
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
                  placeholder={defaultInputs.province}
                  onChange={(_value, option) => {
                    setProvinceCode((option as any).code);

                    form.setFieldValue("ward", undefined);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="streetName"
                label={defaultLabels.streetName}
                className="modal__form-group-item"
                rules={[ruleRequired("Tên đường không được để trống!")]}
              >
                <Input placeholder={defaultInputs.streetName} />
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
                      label: CommonStatusValue.active,
                      value: CommonStatusValue.active,
                    },
                    {
                      label: CommonStatusValue.inactive,
                      value: CommonStatusValue.inactive,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
                rules={[
                  ruleEmail(),
                  ruleRequired("Email không được để trống!"),
                ]}
              >
                <Input placeholder={defaultInputs.email} />
              </Form.Item>
              <Form.Item
                name="ward"
                label={defaultLabels.ward}
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
                  placeholder={defaultInputs.ward}
                />
              </Form.Item>
              <Form.Item
                name="houseNumber"
                label={defaultLabels.houseNumber}
                className="modal__form-group-item"
                rules={[ruleRequired("Tên đường không được để trống!")]}
              >
                <Input placeholder={defaultInputs.houseNumber} />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn create">
              Xác nhận
            </button>
          </div>
        </Form>
      )}
    </>
  );
};

export default CreateSupplierModalComponent;
