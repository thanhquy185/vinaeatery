import { useEffect, useRef, useState } from "react";
import { DatePicker, Form, Input, Rate, Select, Space } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload";
import TextArea from "antd/es/input/TextArea";
import type { CrudObjectModalProps } from "../../../../common/props";
import { ruleEmail, rulePhone, ruleRequired } from "../../../../common/rules";
import type { RestaurantType } from "../../../../common/types";
import { ModalAutoComplete, ModalLayout } from "../../../../common/values";
import CustomImagesUpload from "../../../common/images-upload";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateRestaurant } from "../../../../requests/restaurants";
import { showCreateValidAddress } from "../../../../services/showCreateValidAddress";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { convertUrlsToUploadFiles } from "../../../../utils/other-events";
import dayjs from "dayjs";

// Admin Update Restaurant
const AdminUpdateRestaurant: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<RestaurantType>();
  const [images, setImages] = useState<UploadFile[]>();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const updateMutation = useEntityMutation<RestaurantType>({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["users"]],
    api: HandleUpdateRestaurant,
  });

  useEffect(() => {
    const load = async () => {
      const files = await convertUrlsToUploadFiles(
        (data as RestaurantType)?.restaurantImages?.map(
          (restaurantImage) => restaurantImage.image!,
        ) || [],
      );
      setImages(files);
    };
    load();
  }, [data]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [images]);

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        autoComplete={ModalAutoComplete}
        initialValues={{
          id: data?.id || undefined,
          managerId: data?.manager?.id || undefined,
          createAt: data?.createAt ? dayjs(data?.createAt) : undefined,
          name: data?.name || undefined,
          phone: data?.phone || undefined,
          email: data?.email || undefined,
          address: data?.address || undefined,
          description: data?.description || undefined,
          rating: data?.rating || undefined,
          status: data?.status || undefined,
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
                restaurantImageFiles:
                  images?.map((image) =>
                    image.originFileObj
                      ? image.originFileObj
                      : (image as RcFile),
                  ) || [],
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
          <p className="modal__form-group-title">{defaultLabels.title}</p>
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
              name="name"
              label={defaultLabels.name}
              className="modal__form-group-item"
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
              label={defaultLabels.address}
              className="modal__form-group-item multiple-2"
              required
            >
              <Space.Compact>
                <Form.Item
                  name="address"
                  rules={[ruleRequired("Địa chỉ không được để trống")]}
                  noStyle
                >
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
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select disabled />
              </Form.Item>
              <Form.Item
                name="rating"
                label={defaultLabels.rating}
                className="modal__form-group-item"
                rules={[ruleRequired("Cần chọn Đánh giá!")]}
              >
                <Rate allowHalf />
              </Form.Item>
            </div>
            <Form.Item
              name="managerId"
              label={defaultLabels.manager}
              className="modal__form-group-item"
              rules={[ruleRequired("Chủ nhà hàng không được để trống!")]}
            >
              <Select
                options={dataForCrud?.managers?.map((manager) => ({
                  label: "#" + manager?.id + " - " + manager?.fullname,
                  value: manager?.id,
                }))}
                placeholder={defaultInputs.manager}
              />
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
                defaultLabels.images + " (Tổng số ảnh: " + images?.length + ")"
              }
            >
              <div ref={scrollRef} className="images-upload-warper">
                <CustomImagesUpload
                  initialImages={images}
                  onChange={(list) => setImages(list)}
                />
              </div>
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

export default AdminUpdateRestaurant;
