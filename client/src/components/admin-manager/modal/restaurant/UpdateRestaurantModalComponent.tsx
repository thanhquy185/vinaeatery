import useWards from "../../../../hooks/useWards";
import useProvinces from "../../../../hooks/useProvinces";
import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import RestaurantLocationPickerComponent from "../../../RestaurantLocationPicker";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import ImagesUploadComponent from "../../../ImagesUploadComponent";
import TextArea from "antd/es/input/TextArea";
import RestaurantApiService from "../../../../services/api/v1/RestaurantApiService";
import { useMemo, useRef, useState } from "react";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import {
  ruleEmail,
  rulePhone,
  ruleRequired,
} from "../../../../constants/rules";
import { ModalAutoComplete, ModalLayout } from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmation";
import { convertUrlsToUploadFiles } from "../../../../utils/otherEvents";
import type { UploadFile } from "antd/es/upload";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { ManagerCrudResponseType } from "../../../../types/ManagerType";
import type { RestaurantImageUpdateRequestType } from "../../../../types/RestaurantImageType";
import type {
  RestaurantUpdateRequestType,
  RestaurantDetailResponseType,
} from "../../../../types/RestaurantType";

const UpdateRestaurantModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: restaurantDetail, isLoading } =
    useEntityQuery<RestaurantDetailResponseType>({
      keys: ["restaurant", data.id],
      params: { id: data.id },
      api: RestaurantApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<RestaurantUpdateRequestType>();
  const [images, setImages] = useState<UploadFile[]>();
  const [selectedManager, setSelectedManager] =
    useState<ManagerCrudResponseType | null>(null);
  const [provinceCode, setProvinceCode] = useState<number>(0);

  const provinces = useProvinces();
  const wards = useWards(provinceCode);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const updateMutation = useEntityMutation<
    RestaurantUpdateRequestType,
    RestaurantDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["restaurant", data.id]],
    api: RestaurantApiService.handleUpdate,
  });

  useMemo(async () => {
    if (restaurantDetail) {
      const files = await convertUrlsToUploadFiles(
        restaurantDetail.restaurantImages.map(
          (restaurantImage) => restaurantImage.image!,
        ) || [],
      );
      setImages(files);

      const manager = restaurantDetail.manager;
      setSelectedManager(manager);
    }
  }, [restaurantDetail]);
  useMemo(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [images]);

  return (
    <Spin spinning={!restaurantDetail || isLoading}>
      {dataForCrud && restaurantDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={{
            ...restaurantDetail,
            managerId: restaurantDetail.manager.id,
          }}
          className="modal__form split-3"
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
                  images:
                    images?.map(
                      (image) =>
                        ({
                          image: image.originFileObj
                            ? (image.originFileObj as unknown)
                            : image,
                        }) as RestaurantImageUpdateRequestType,
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
                <Input className="text-center" disabled />
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
              >
                <Select disabled />
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
                  value={selectedManager?.id}
                  onChange={(value, option) => {
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
                  isDefaultLocation={true}
                  latitude={restaurantDetail.latitude}
                  longitude={restaurantDetail.longitude}
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
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default UpdateRestaurantModalComponent;
