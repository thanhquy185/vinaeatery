import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import ListMenuDetailComponent from "./ListMenuDetailComponent";
import MenuApiService from "../../../../services/api/v1/MenuApiService";
import { useState } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
  CommonStatusValue,
  MenuTypeValue,
  ModalAutoComplete,
  ModalLayout,
} from "../../../../constants/values";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type {
  MenuCreateRequestType,
  MenuDetailResponseType,
} from "../../../../types/MenuType";

const CreateMenuModalComponent: React.FC<CrudObjectModalProps> = ({
  objectEN,
  objectVN,
  defaultLabels,
  defaultInputs,
  restaurantId,
  dataForCrud,
  closeModal,
}) => {
  const [form] = Form.useForm<MenuCreateRequestType>();
  const [selectedFoodIds, setSelectedFoodIds] = useState<number[]>([]);

  const createMutation = useEntityMutation<
    MenuCreateRequestType,
    MenuDetailResponseType
  >({
    messages: {
      success: `Thêm ${objectVN?.toLowerCase()} thành công!`,
      error: `Thêm ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: MenuApiService.handleCreate,
  });

  return (
    <>
      {restaurantId && dataForCrud && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          className="modal__form split-3"
          onFinish={async () => {
            const submitButton = document.querySelector(
              ".modal__form button[type='submit']",
            );

            submitButton?.classList.add("active");

            const answer = await openConfirmation({
              title: `Bạn có chắc chắn thêm ?`,
              content: "Hành động này không thể hoàn tác.",
            });
            if (answer) {
              const values = form.getFieldsValue();

              const response = await createMutation.mutateAsync({
                values: {
                  ...values,
                  restaurantId: restaurantId,
                  menuDetails: selectedFoodIds.map((selectedFoodId) => ({
                    foodId: selectedFoodId,
                  })),
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
              <div className="modal__form-group-item-warper split-2">
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
                  name="status"
                  label={defaultLabels.status}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Trạng thái!")]}
                >
                  <Select
                    allowClear
                    placeholder={defaultInputs.status}
                    options={[
                      {
                        label: CommonStatusValue.active,
                        value: CommonStatusValue.active,
                      },
                      {
                        label: CommonStatusValue.inactive,
                        value: CommonStatusValue.inactive,
                      },
                    ]}
                  />
                </Form.Item>
              </div>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item"
                rules={[ruleRequired("Tên thực đơn không được để trống!")]}
              >
                <Input placeholder={defaultInputs.name} />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="type"
                  label={defaultLabels.type}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần chọn Loại thực đơn!")]}
                >
                  <Select
                    allowClear
                    placeholder={defaultInputs.type}
                    options={[
                      {
                        label: MenuTypeValue.ala_carte,
                        value: MenuTypeValue.ala_carte,
                      },
                      {
                        label: MenuTypeValue.buffet,
                        value: MenuTypeValue.buffet,
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="price"
                  label={defaultLabels.price}
                  className="modal__form-group-item"
                  rules={[ruleRequired("Cần nhập Giá tiền!")]}
                >
                  <InputNumber
                    min={0}
                    formatter={(value) => inputNumberFormatter(value)}
                    parser={(value) => inputNumberParse(value)}
                    placeholder={defaultInputs.price}
                  />
                </Form.Item>
              </div>
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
                label={defaultLabels.menuDetails}
                className="modal__form-group-item multiple-2"
              >
                <ListMenuDetailComponent
                  type="update"
                  foods={dataForCrud.foods || []}
                  selectedFoodIds={selectedFoodIds}
                  setSelectedFoodIds={setSelectedFoodIds}
                />
              </Form.Item>
            </div>
          </div>
          <div className="modal__buttons">
            <button type="submit" className="modal__button btn create">
              Xác nhận
            </button>
          </div>
        </Form>
      )}
    </>
  );
};

export default CreateMenuModalComponent;
