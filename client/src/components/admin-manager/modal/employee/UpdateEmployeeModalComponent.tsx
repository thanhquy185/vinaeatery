import useWards from "../../../../hooks/useWards";
import useProvinces from "../../../../hooks/useProvinces";
import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import ImageUploadComponent from "../../../ImageUploadComponent";
import TableRoleHistoriesComponent from "../../TableRoleHistoriesComponent";
import EmployeeApiService from "../../../../services/api/v1/EmployeeApiService";
import dayjs from "dayjs";
import { useState } from "react";
import { DatePicker, Form, Input, Select, Spin } from "antd";
import {
  ruleEmail,
  rulePhone,
  ruleRequired,
} from "../../../../constants/rules";
import {
  CommonGenderValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import type { RcFile } from "antd/es/upload";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  EmployeeDetailResponseType,
  EmployeeUpdateRequestType,
} from "../../../../types/EmployeeType";

const UpdateEmployeeModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: employeeDetail, isLoading } =
    useEntityQuery<EmployeeDetailResponseType>({
      keys: ["employee", data.id],
      params: { id: data.id },
      api: EmployeeApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<EmployeeUpdateRequestType>();
  const [imageFile, setImageFile] = useState<RcFile>();
  const [provinceCode, setProvinceCode] = useState<number>(0);

  const provinces = useProvinces();
  const wards = useWards(provinceCode);

  const updateMutation = useEntityMutation<
    EmployeeUpdateRequestType,
    EmployeeDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["employee", data.id]],
    api: EmployeeApiService.handleUpdate,
  });

  return (
    <Spin spinning={!employeeDetail || isLoading}>
      {employeeDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={{
            ...employeeDetail,
            birthdate: dayjs(data.birthdate),
            userId: data.user.id,
            userRole: data.user.role,
            userStatus: data.user.status,
            userMethod: data.user.method,
            userUsername: data.user.username,
            userPassword: "Mật khẩu đã được mã hoá!",
            roleId: data.role.id,
            permissionId: data.permission.id,
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
                  image: imageFile ?? undefined,
                  birthdate:
                    values.birthdate && dayjs(values.birthdate).isValid()
                      ? dayjs(values.birthdate).format("YYYY-MM-DD")
                      : dayjs().format("YYYY-MM-DD"),
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
                label={defaultLabels.image}
                htmlFor="create-image"
                className="modal__form-group-item"
              >
                <ImageUploadComponent
                  defaultSrc={employeeDetail.imageUrl}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  alt="image-preview"
                  htmlFor="create-image"
                  imageClassName="image-preview"
                  uploadClassName="image-uploader"
                  labelButton={defaultInputs.image}
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
                name="id"
                label={defaultLabels.id}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled />
              </Form.Item>
              <Form.Item
                name="fullname"
                label={defaultLabels.fullname}
                className="modal__form-group-item"
                rules={[ruleRequired("Họ và tên không được để trống!")]}
              >
                <Input placeholder={defaultInputs.fullname} />
              </Form.Item>
              <Form.Item
                name="phone"
                label={defaultLabels.phone}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Số điện thoại không được để trống!"),
                  rulePhone(),
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
              >
                <Select disabled />
              </Form.Item>
              <div className="modal__form-group-item-warper">
                <Form.Item
                  name="birthdate"
                  label={defaultLabels.birthdate}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Ngày sinh!")]}
                >
                  <DatePicker
                    allowClear
                    format="YYYY-MM-DD"
                    placeholder={defaultInputs.birthdate}
                  />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label={defaultLabels.gender}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Giới tính!")]}
                >
                  <Select
                    allowClear
                    options={[
                      {
                        label: CommonGenderValue.male,
                        value: CommonGenderValue.male,
                      },
                      {
                        label: CommonGenderValue.female,
                        value: CommonGenderValue.female,
                      },
                    ]}
                    placeholder={defaultInputs.gender}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="email"
                label={defaultLabels.email}
                className="modal__form-group-item"
                rules={[
                  ruleRequired("Email không được để trống!"),
                  ruleEmail(),
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
          <div className="modal__form-group-warper">
            <p className="modal__form-group-title">{defaultLabels.title2}</p>
            <div className="modal__form-group">
              <Form.Item
                name="userId"
                label={defaultLabels.userId}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled />
              </Form.Item>
              <Form.Item
                name="userRole"
                label={defaultLabels.userRole}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="userStatus"
                label={defaultLabels.userStatus}
                className="modal__form-group-item"
              >
                <Input placeholder={defaultInputs.userStatus} disabled />
              </Form.Item>
              <Form.Item
                name="userUsername"
                label={defaultLabels.userUsername}
                className="modal__form-group-item"
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="modal__form-group">
              <Form.Item
                name="userMethod"
                label={defaultLabels.userMethod}
                className="modal__form-group-item"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="userPassword"
                label={defaultLabels.userPassword}
                className="modal__form-group-item"
              >
                <Input className="text-center" disabled />
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
                rules={[ruleRequired("Chức vụ không được để trống!")]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={defaultInputs.role}
                  options={dataForCrud?.roles?.map((role) => ({
                    label: "#" + role?.id + " - " + role?.name,
                    value: role?.id,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label={defaultLabels.roleHistories}
                className="modal__form-group-item multiple-3"
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
                rules={[ruleRequired("Quyền hạn không được để trống!")]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={defaultInputs.permission}
                  options={dataForCrud?.permissions?.map((permission) => ({
                    label: "#" + permission?.id + " - " + permission?.name,
                    value: permission?.id,
                  }))}
                />
              </Form.Item>
            </div>
            <div className="modal__form-group"></div>
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

export default UpdateEmployeeModalComponent;
