import useEntityQuery from "../../../../hooks/useEntityQuery2";
import TextArea from "antd/es/input/TextArea";
import ImageUploadComponent from "../../../ImageUploadComponent";
import CustomerApiService from "../../../../services/api/v1/CustomerApiService";
import dayjs from "dayjs";
import { DatePicker, Form, Input, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { CustomerDetailResponseType } from "../../../../types/CustomerType";

const DetailCustomerModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  data,
}) => {
  const { data: customerDetail, isLoading } =
    useEntityQuery<CustomerDetailResponseType>({
      keys: ["customer", data.id],
      params: { id: data.id },
      api: CustomerApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<CustomerDetailResponseType>();

  return (
    <Spin spinning={!customerDetail || isLoading}>
      {customerDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={{
            ...customerDetail,
            birthdate: dayjs(customerDetail.birthdate),
            userId: customerDetail.user.id,
            userRole: customerDetail.user.role,
            userStatus: customerDetail.user.status,
            userMethod: customerDetail.user.method,
            userUsername: customerDetail.user.username,
            userPassword: "Mật khẩu đã được mã hoá!",
          }}
          className="modal__form split-3"
          disabled
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title1}</p>
            <div className="modal__form-group">
              <Form.Item
                name="image"
                label={defaultLabels.image}
                className="modal__form-group-item"
              >
                <ImageUploadComponent
                  defaultSrc={data?.image as string}
                  alt="image-preview"
                  imageClassName="image-preview"
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
              <Form.Item
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="fullname"
                label={defaultLabels.fullname}
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
                name="province"
                label={defaultLabels.province}
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
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="status"
                label={defaultLabels.status}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="birthdate"
                  label={defaultLabels.birthdate}
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
                name="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="ward"
                label={defaultLabels.ward}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item
                name="houseNumber"
                label={defaultLabels.houseNumber}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title2}</p>
            <div className="modal__form-group">
              <Form.Item
                name="userId"
                label={defaultLabels.userId}
                className="modal__form-group-item"
              >
                <Input className="text-center" />
              </Form.Item>
              <Form.Item
                name="userRole"
                label={defaultLabels.userRole}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="userStatus"
                label={defaultLabels.userStatus}
                className="modal__form-group-item"
              >
                <Input placeholder={defaultInputs.userStatus} />
              </Form.Item>
              <Form.Item
                name="userUsername"
                label={defaultLabels.userUsername}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="userMethod"
                label={defaultLabels.userMethod}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="userPassword"
                label={defaultLabels.userPassword}
                className="modal__form-group-item margin-bottom-0"
              >
                <Input className="text-center" />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailCustomerModalComponent;
