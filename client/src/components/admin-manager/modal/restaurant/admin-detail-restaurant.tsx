import { useEffect, useState } from "react";
import { DatePicker, Form, Input, Rate, Select, type UploadFile } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { RestaurantType } from "../../../../common/types";
import { ImageSourcePath, ModalLayout } from "../../../../common/values";
import TextArea from "antd/es/input/TextArea";
import CustomImagesUpload from "../../../common/images-upload";
import { convertUrlsToUploadFiles } from "../../../../utils/other-events";
import dayjs from "dayjs";

// Admin Detail Restaurant
const AdminDetailRestaurant: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  data,
}) => {
  const [form] = Form.useForm<RestaurantType>();
  const [images, setImages] = useState<UploadFile[]>([]);
  console.log(data);
  useEffect(() => {
    const load = async () => {
      const files = await convertUrlsToUploadFiles(
        (data as RestaurantType)?.restaurantImages?.map(
          (restaurantImage) => restaurantImage.image!
        ) || []
      );
      setImages(files);
    };
    load();
  }, [data?.restaurant]);

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id,
          manager: "#" + data?.manager?.id + " - " + data?.manager?.fullname,
          createAt: data?.createAt ? dayjs(data?.createAt) : undefined,
          name: data?.name,
          phone: data?.phone,
          email: data?.email,
          address: data?.address,
          description: data?.description,
          rating: data?.rating,
          status: data?.status,
        }}
        className="modal__form split-3"
        disabled
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title}</p>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="createAt"
                label={defaultLabels.createAt}
                className="modal__form-group-item"
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  className="text-center"
                />
              </Form.Item>
            </div>
            <Form.Item
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item"
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
              name="address"
              label={defaultLabels.address}
              className="modal__form-group-item multiple-2"
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
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item
                name="rating"
                label={defaultLabels.rating}
                className="modal__form-group-item"
              >
                <Rate allowHalf />
              </Form.Item>
            </div>
            <Form.Item
              name="manager"
              label={defaultLabels.manager}
              className="modal__form-group-item"
            >
              <Select />
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
            {data?.restaurantImages?.length! > 0 ? (
              <Form.Item
                label={
                  defaultLabels.images +
                  " (Tổng số ảnh: " +
                  data?.restaurantImages?.length +
                  ")"
                }
              >
                <CustomImagesUpload initialImages={images} disabled={true} />
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
      </Form>
    </>
  );
};

export default AdminDetailRestaurant;
