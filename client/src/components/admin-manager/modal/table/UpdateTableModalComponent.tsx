import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import TableApiService from "../../../../services/api/v1/TableApiService";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import { ModalAutoComplete, ModalLayout } from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmation";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  TableDetailResponseType,
  TableUpdateRequestType,
} from "../../../../types/TableType";

const UpdateTableModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: tableDetail, isLoading } =
    useEntityQuery<TableDetailResponseType>({
      keys: ["table", data.id],
      params: { id: data.id },
      api: TableApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<TableUpdateRequestType>();

  const updateMutation = useEntityMutation<
    TableUpdateRequestType,
    TableDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["table", data.id]],
    api: TableApiService.handleUpdate,
  });

  return (
    <Spin spinning={!tableDetail || isLoading}>
      {tableDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={{
            ...tableDetail,
            floorId: tableDetail.floor.id,
            categoryTableId: tableDetail.categoryTable.id,
          }}
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
                values: values,
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
                className="modal__form-group-item"
                rules={[ruleRequired("Tên bàn không được để trống!")]}
              >
                <Input placeholder={defaultInputs.name} />
              </Form.Item>
              <Form.Item
                name="categoryTableId"
                label={defaultLabels.categoryTable}
                className="modal__form-group-item"
                rules={[ruleRequired("Loại bàn không được để trống!")]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={defaultInputs.categoryTable}
                  options={dataForCrud?.categoryTables?.map(
                    (categoryTable) => ({
                      label:
                        "#" + categoryTable.id + " - " + categoryTable.name,
                      value: categoryTable.id,
                    }),
                  )}
                />
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
              <Form.Item
                name="seats"
                label={defaultLabels.seats}
                className="modal__form-group-item"
                rules={[ruleRequired("Số chỗ ngồi không được để trống!")]}
              >
                <InputNumber
                  min={0}
                  formatter={(value) => inputNumberFormatter(value)}
                  parser={(value) => inputNumberParse(value)}
                  placeholder={defaultInputs.seats}
                />
              </Form.Item>
              <Form.Item
                name="floorId"
                label={defaultLabels.floor}
                className="modal__form-group-item"
                rules={[ruleRequired("Tầng không được để trống!")]}
              >
                <Select
                  placeholder={defaultInputs.floor}
                  options={dataForCrud?.floors?.map((floor) => ({
                    label: "#" + floor.id + " - " + floor.name,
                    value: floor.id,
                  }))}
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

export default UpdateTableModalComponent;
