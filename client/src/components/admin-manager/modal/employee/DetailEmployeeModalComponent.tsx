import useEntityQuery from "../../../../hooks/useEntityQuery2";
import TextArea from "antd/es/input/TextArea";
import ImageUploadComponent from "../../../ImageUploadComponent";
import TableRoleHistoriesComponent from "../../TableRoleHistoriesComponent";
import EmployeeApiService from "../../../../services/api/v1/EmployeeApiService";
import dayjs from "dayjs";
import { DatePicker, Form, Input, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { EmployeeDetailResponseType } from "../../../../types/EmployeeType";

const DetailEmployeeModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  defaultInputs,
  data,
}) => {
  const { data: employeeDetail, isLoading } =
    useEntityQuery<EmployeeDetailResponseType>({
      keys: ["employee", data.id],
      params: { id: data.id },
      api: EmployeeApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<EmployeeDetailResponseType>();

  return (
    <Spin spinning={!employeeDetail || isLoading}>
      {employeeDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          initialValues={{
            ...employeeDetail,
            birthdate: dayjs(employeeDetail.birthdate),
            userId: employeeDetail.user.id,
            userRole: employeeDetail.user.role,
            userStatus: employeeDetail.user.status,
            userMethod: employeeDetail.user.method,
            userUsername: employeeDetail.user.username,
            userPassword: "Mật khẩu đã được mã hoá!",
            roleId:
              "#" + employeeDetail.role.id + " - " + employeeDetail.role.name,
            permissionId:
              "#" +
              employeeDetail.permission.id +
              " - " +
              employeeDetail.permission.name,
          }}
          className="modal__form split-3"
          disabled
        >
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title1}</p>
            <div className="modal__form-group">
              <Form.Item
                label={defaultLabels.image}
                className="modal__form-group-item"
              >
                <ImageUploadComponent
                  defaultSrc={data.image as string}
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
                className="modal__form-group-item"
              >
                <TextArea
                  className="multiple-2"
                  placeholder={defaultInputs.description}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
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
                className="modal__form-group-item"
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
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="userUsername"
                label={defaultLabels.userUsername}
                className="modal__form-group-item"
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
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title3}</p>
            <div className="modal__form-group">
              <Form.Item
                name="roleId"
                label={defaultLabels.role}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
              <Form.Item
                label={defaultLabels.roleHistories}
                className="modal__form-group-item multiple-3 margin-bottom-0"
              >
                <TableRoleHistoriesComponent
                  roleHistories={employeeDetail.roleHistories}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="permissionId"
                label={defaultLabels.permission}
                className="modal__form-group-item"
              >
                <Select />
              </Form.Item>
            </div>
            <div className="modal__form-group"></div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailEmployeeModalComponent;
