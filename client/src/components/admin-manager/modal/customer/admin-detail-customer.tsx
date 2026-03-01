import { DatePicker, Form, Input, Select } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { CustomerType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import CustomImageUpload from "../../../common/image-upload";

// Admin Detail Customer
const AdminDetailCustomer: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  data,
}) => {
  const [form] = Form.useForm<CustomerType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id || undefined,
          user:
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
        disabled
      >
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title}</p>
          <div className="modal__form-group">
            <Form.Item
              name="image"
              label={defaultLabels.image}
              className="modal__form-group-item"
            >
              <CustomImageUpload
                defaultSrc={data?.image! as string}
                alt="image-preview"
                imageClassName="image-preview"
                imageCategoryName="customers"
                uploadClassName="image-uploader"
                labelButton={defaultInputs.image}
                disabled
              />
            </Form.Item>
            <Form.Item
              name="description"
              label={defaultLabels.description}
              className="modal__form-group-item margin-bottom-0"
            >
              <TextArea className="multiple-2" />
            </Form.Item>
          </div>
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
              name="fullname"
              label={defaultLabels.fullname}
              className="modal__form-group-item multiple-2"
            >
              <Input />
            </Form.Item>
            <div className="modal__form-group-item-warper">
              <Form.Item
                name="birthday"
                label={defaultLabels.birthday}
                className="modal__form-group-item"
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                name="gender"
                label={defaultLabels.gender}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
            </div>
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
              className="modal__form-group-item multiple-2 margin-bottom-0"
            >
              <Input />
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
              name="user"
              label={defaultLabels.user}
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
        </div>
      </Form>
    </>
  );
};

export default AdminDetailCustomer;
