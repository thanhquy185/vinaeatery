import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TablePermissionDetailsComponent from "./TablePermissionDetailsComponent";
import PermissionApiService from "../../../../services/api/v1/PermissionApiService";
import { useMemo, useState } from "react";
import { Form, Input, Select, Spin } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import { ModalAutoComplete, ModalLayout } from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  PermissionDetailResponseType,
  PermissionUpdateRequestType,
} from "../../../../types/PermissionType";
import type {
  PermissionDDetailResponseType,
  PermissionDetailUpdateRequestType,
} from "../../../../types/PermissionDetailType";

const UpdatePermissionModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  closeModal,
}) => {
  const { data: permissionDetail, isLoading } =
    useEntityQuery<PermissionDetailResponseType>({
      keys: ["permission", data.id],
      params: { id: data.id },
      api: PermissionApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<PermissionUpdateRequestType>();
  const [permissionDetails, setPermissionDetails] = useState<
    PermissionDetailUpdateRequestType[]
  >([]);

  const updateMutation = useEntityMutation<
    PermissionUpdateRequestType,
    PermissionDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["permission", data.id]],
    api: PermissionApiService.handleUpdate,
  });

  useMemo(() => {
    if (permissionDetail) {
      setPermissionDetails(
        permissionDetail.permissionDetails?.map(
          (permissionDetail: PermissionDDetailResponseType) => ({
            functionId: permissionDetail.function.id,
            action: permissionDetail.action,
          }),
        ),
      );
    }
  }, [permissionDetail]);

  return (
    <Spin spinning={!permissionDetail || isLoading}>
      {permissionDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={permissionDetail}
          className="modal__form split-2"
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
                  permissionDetails: permissionDetails,
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
            <p className="modal__form-group-title">{defaultLabels.title}</p>
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
                htmlFor="update-name"
                className="modal__form-group-item multiple-2"
                rules={[ruleRequired("Tên chức vụ không được để trống!")]}
              >
                <Input id="update-name" placeholder={defaultInputs.name} />
              </Form.Item>
              <Form.Item
                label={defaultLabels.permissionDetails}
                htmlFor="update-permissionDetails"
                className="modal__form-group-item multiple-2"
              >
                <TablePermissionDetailsComponent
                  id="update-permissionDetails"
                  data={permissionDetails}
                  setPermissionDetails={setPermissionDetails}
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

export default UpdatePermissionModalComponent;
