import useWards from "../../../../hooks/useWards";
import useProvinces from "../../../../hooks/useProvinces";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import RestaurantLocationPickerComponent from "../../../RestaurantLocationPicker";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import ImagesUploadComponent from "../../../ImagesUploadComponent";
import TextArea from "antd/es/input/TextArea";
import RestaurantApiService from "../../../../services/api/v1/RestaurantApiService";
import { useMemo, useRef, useState } from "react";
import { Form, Input, InputNumber, Select } from "antd";
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
import type { UploadFile } from "antd/es/upload";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { ManagerCrudResponseType } from "../../../../types/ManagerType";
import type { RestaurantImageCreateRequestType } from "../../../../types/RestaurantImageType";
import type {
  RestaurantCreateRequestType,
  RestaurantDetailResponseType,
} from "../../../../types/RestaurantType";

const CreateRestaurantModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<RestaurantCreateRequestType>();
  const [images, setImages] = useState<UploadFile[]>([]);
  const [selectedManager, setSelectedManager] =
    useState<ManagerCrudResponseType | null>(null);
  const [provinceCode, setProvinceCode] = useState<number>(0);

  const provinces = useProvinces();
  const wards = useWards(provinceCode);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const createMutation = useEntityMutation<
    RestaurantCreateRequestType,
    RestaurantDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: RestaurantApiService.handleCreate,
  });

  useMemo(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [images]);

  return (
    <>
      {dataForCrud && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          className="modal__form split-3"
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
                  images:
                    images?.map(
                      (image) =>
                        ({
                          image: image.originFileObj,
                        }) as RestaurantImageCreateRequestType,
                    ) || [],
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
            <p className="modal__form-group-title">{defaultLabels.title1}</p>
            <div className="modal__form-group">
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
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Tên nhà hàng không được để trống")]}
              >
                <Input placeholder={defaultInputs.name} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống"),
                  rulePhone(),
                ]}
              >
                <Input placeholder={defaultInputs.phone} />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item multiple-2"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.description}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
                rules={[ruleRequired("Cần chọn Trạng thái!")]}
              >
                <Select
                  allowClear
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
                  placeholder={defaultInputs.status}
                />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
                rules={[ruleRequired("Email không được để trống"), ruleEmail()]}
              >
                <Input placeholder={defaultInputs.email} />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                label={
                  defaultLabels.images +
                  " (Tổng số ảnh: " +
                  images?.length +
                  ")"
                }
              >
                <div ref={scrollRef} className="images-upload-warper">
                  <ImagesUploadComponent
                    initialImages={images}
                    onChange={(list) => setImages(list)}
                  />
                </div>
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title2}</p>
            <div className="modal__form-group">
              <Form.Item
                name="managerId"
                label={defaultLabels.manager}
                className="modal__form-group-item multiple-3"
                rules={[ruleRequired("Chủ nhà hàng không được để trống!")]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={defaultInputs.manager}
                  options={(dataForCrud.managers || []).map((manager) => ({
                    label:
                      "#" +
                      manager.id +
                      " - " +
                      manager.fullname +
                      " - " +
                      manager.phone +
                      " - " +
                      manager.email,
                    value: manager.id,
                    object: manager,
                  }))}
                  onChange={(value, option) => {
                    form.setFieldValue("managerId", value);
                    setSelectedManager(value ? (option as any).object : null);
                  }}
                />
                {selectedManager && (
                  <CardInfoInModalComponent
                    hasImage={true}
                    image={selectedManager.image}
                    fullname={selectedManager.fullname}
                    phone={selectedManager.phone}
                    email={selectedManager.email}
                    address={`${selectedManager.houseNumber}, ${selectedManager.streetName}, ${selectedManager.ward}, ${selectedManager.province}`}
                  />
                )}
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title3}</p>
            <div className="modal__form-group">
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="latitude"
                  label={defaultLabels.latitude}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Vĩ độ không được để trống!")]}
                >
                  <InputNumber min={0} placeholder={defaultInputs.latitude} />
                </Form.Item>
                <Form.Item
                  name="longitude"
                  label={defaultLabels.longitude}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Kinh độ không được để trống!")]}
                >
                  <InputNumber min={0} placeholder={defaultInputs.longitude} />
                </Form.Item>
              </div>
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
                name="streetName"
                label={defaultLabels.streetName}
                className="modal__form-group-item"
                rules={[ruleRequired("Tên đường không được để trống!")]}
              >
                <Input placeholder={defaultInputs.streetName} />
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
            <div className="modal__form-group">
              <Form.Item className="modal__form-group-item multiple-2 margin-bottom-0">
                <RestaurantLocationPickerComponent
                  onChange={(location) => {
                    form.setFieldValue("latitude", location.latitude);
                    form.setFieldValue("longitude", location.longitude);
                    form.setFieldValue("houseNumber", location.houseNumber);
                    form.setFieldValue("streetName", location.streetName);
                    form.setFieldValue("ward", location.ward);
                    form.setFieldValue("province", location.province);
                  }}
                />
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

export default CreateRestaurantModalComponent;
