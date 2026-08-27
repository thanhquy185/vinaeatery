import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import TextArea from "antd/es/input/TextArea";
import ListMenuDetailComponent from "./ListMenuDetailComponent";
import MenuApiService from "../../../../services/api/v1/MenuApiService";
import { useMemo, useState } from "react";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ruleRequired } from "../../../../constants/rules";
import {
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
  MenuUpdateRequestType,
  MenuDetailResponseType,
} from "../../../../types/MenuType";

const UpdateMenuModalComponent: React.FC<CrudObjectModalProps> = ({
  objectEN,
  objectVN,
  defaultLabels,
  defaultInputs,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: menuDetail, isLoading } =
    useEntityQuery<MenuDetailResponseType>({
      keys: ["menu", data.id],
      params: { id: data.id },
      api: MenuApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<MenuUpdateRequestType>();
  const [selectedFoodIds, setSelectedFoodIds] = useState<number[]>([]);

  const updateMutation = useEntityMutation<
    MenuUpdateRequestType,
    MenuDetailResponseType
  >({
    messages: {
      success: `Cập nhật ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["menu", data.id]],
    api: MenuApiService.handleUpdate,
  });

  useMemo(() => {
    if (menuDetail && menuDetail.menuDetails) {
      setSelectedFoodIds(
        menuDetail.menuDetails.map((menuDetail) => menuDetail.food.id),
      );
    }
  }, [menuDetail]);

  return (
    <Spin spinning={!menuDetail || isLoading}>
      {dataForCrud && menuDetail && (
        <Form
          form={form}
          layout={ModalLayout}
          autoComplete={ModalAutoComplete}
          initialValues={menuDetail}
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

              const response = await updateMutation.mutateAsync({
                values: {
                  ...values,
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
                  <Input className="text-center" disabled />
                </Form.Item>
                <Form.Item
                  name="status"
                  label={defaultLabels.status}
                  className="modal__form-group-item"
                >
                  <Select disabled />
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
            <button type="submit" className="modal__button btn update">
              Xác nhận
            </button>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default UpdateMenuModalComponent;
