import { DatePicker, Form, Input, Select, Space } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { EmployeeType } from "../../../../common/types";
import { ModalLayout } from "../../../../common/values";
import CustomImageUpload from "../../../common/image-upload";
import dayjs from "dayjs";

// Manager Detail Employee
const ManagerDetailEmployee: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  data,
  modalForCrud,
}) => {
  const [form] = Form.useForm<EmployeeType>();

  return (
    <>
      <Form
        form={form}
        layout={ModalLayout}
        initialValues={{
          id: data?.id! || undefined,
          // image: data?.image! || undefined,
          fullname: data?.fullname! || undefined,
          birthday: dayjs(data?.birthday!) || undefined,
          gender: data?.gender! || undefined,
          phone: data?.phone! || undefined,
          email: data?.email! || undefined,
          address: data?.address! || undefined,
          currentRole:
            "#" + data?.currentRole?.id + " - " + data?.currentRole?.name ||
            undefined,
          username: data?.user?.username! || undefined,
          permission:
            "#" + data?.permission?.id + " - " + data?.permission?.name ||
            undefined,
          status: data?.status! || undefined,
        }}
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
              name="username"
              label={defaultLabels.username}
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
            <Form.Item
              label={defaultLabels.password}
              className="modal__form-group-item"
            >
              <Input className="text-center" value="Mật khẩu đã được mã hoá!" />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.currentRole}
              className="modal__form-group-item"
            >
              <Space.Compact>
                <Form.Item name="currentRole" noStyle>
                  <Select />
                </Form.Item>
                <button
                  type="button"
                  className="btn secondary-btn diff"
                  onClick={() =>
                    modalForCrud?.roleHistories?.openModalDetail?.({
                      roleHistories: data?.roleHistories,
                    })
                  }
                >
                  Chi tiết
                </button>
              </Space.Compact>
            </Form.Item>
            <Form.Item
              name="permission"
              label={defaultLabels.permission}
              className="modal__form-group-item"
            >
              <Select />
            </Form.Item>
          </div>
        </div>
        <div className="modal__form-group-warper">
          <p className="modal__form-group-title">{defaultLabels.title2}</p>
          <div className="modal__form-group">
            <Form.Item
              label={defaultLabels.image}
              className="modal__form-group-item margin-bottom-0"
            >
              <CustomImageUpload
                defaultSrc={data?.image! as string}
                alt="image-preview"
                imageClassName="image-preview"
                uploadClassName="image-uploader"
                imageCategoryName="employees"
                labelButton={defaultInputs.image}
                disabled
              />
            </Form.Item>
          </div>
          <div className="modal__form-group">
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
              name="address"
              label={defaultLabels.address}
              className="modal__form-group-item multiple-2 margin-bottom-0"
            >
              <Input />
            </Form.Item>
          </div>
          <div className="modal__form-group">
            <div className="modal__form-group-item-warper split-2">
              <Form.Item
                name="birthday"
                label={defaultLabels.birthday}
                className="modal__form-group-item"
              >
                <DatePicker />
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
          </div>
        </div>
      </Form>
    </>
  );
};

export default ManagerDetailEmployee;
