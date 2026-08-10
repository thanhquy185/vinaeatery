import useEntityQuery from "../../../../hooks/useEntityQuery2";
import RestaurantLocationPickerComponent from "../../../RestaurantLocationPicker";
import CardInfoInModalComponent from "../../CardInfoInModalComponent";
import ImagesUploadComponent from "../../../ImagesUploadComponent";
import TextArea from "antd/es/input/TextArea";
import RestaurantApiService from "../../../../services/api/v1/RestaurantApiService";
import { Form, Input, InputNumber, Select, Spin, type UploadFile } from "antd";
import { useMemo, useState } from "react";
import { ImageSourcePath, ModalLayout } from "../../../../constants/values";
import { convertUrlsToUploadFiles } from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { RestaurantDetailResponseType } from "../../../../types/RestaurantType";

const DetailRestaurantModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
}) => {
  const { data: restaurantDetail, isLoading } =
    useEntityQuery<RestaurantDetailResponseType>({
      keys: ["restaurant", data.id],
      params: { id: data.id },
      api: RestaurantApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<RestaurantDetailResponseType>();
  const [images, setImages] = useState<UploadFile[]>([]);

  useMemo(async () => {
    if (restaurantDetail) {
      const files = await convertUrlsToUploadFiles(
        restaurantDetail.restaurantImages.map(
          (restaurantImage) => restaurantImage.image!,
        ) || [],
      );

      setImages(files);
    }
  }, [restaurantDetail]);

  return (
    <Spin spinning={!restaurantDetail || isLoading}>
      {restaurantDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={restaurantDetail}
          className="modal__form split-3"
          disabled
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title1}</p>
            <div className="modal__form-group">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item multiple-2"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={defaultLabels.description}
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <TextArea className="multiple-2" />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item label="." className="modal__form-group-item hidden">
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              {restaurantDetail.restaurantImages.length! > 0 ? (
                <Form.Item
                  label={`${defaultLabels.images} (Tổng số ảnh: ${restaurantDetail.restaurantImages.length})`}
                >
                  <ImagesUploadComponent
                    initialImages={images}
                    disabled={true}
                  />
                </Form.Item>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <img
                      src={ImageSourcePath + "image-question-icon.png"}
                      alt=""
                      style={{ width: 200, height: 200 }}
                    />
                    <p style={{ fontSize: 22, fontWeight: 600 }}>
                      Nhà hàng này chưa cập nhật ảnh.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title2}</p>
            <div className="modal__form-group">
              <Form.Item
                name="manager"
                label={defaultLabels.manager}
                className="modal__form-group-item multiple-3"
              >
                <CardInfoInModalComponent
                  hasImage={true}
                  image={restaurantDetail.manager.image}
                  fullname={restaurantDetail.manager.fullname}
                  phone={restaurantDetail.manager.phone}
                  email={restaurantDetail.manager.email}
                  address={`${restaurantDetail.manager.houseNumber}, ${restaurantDetail.manager.streetName}, ${restaurantDetail.manager.ward}, ${restaurantDetail.manager.province}`}
                />
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
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="longitude"
                  label={defaultLabels.longitude}
                  className="modal__form-group-item"
                >
                  <InputNumber />
                </Form.Item>
              </div>
              <Form.Item
                name="province"
                label={defaultLabels.province}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item
                name="ward"
                label={defaultLabels.ward}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item
                name="streetName"
                label={defaultLabels.streetName}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="houseNumber"
                label={defaultLabels.houseNumber}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item className="modal__form-group-item multiple-2 margin-bottom-0">
                <RestaurantLocationPickerComponent
                  type="detail"
                  isDefaultLocation={true}
                  latitude={restaurantDetail.latitude}
                  longitude={restaurantDetail.longitude}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailRestaurantModalComponent;
