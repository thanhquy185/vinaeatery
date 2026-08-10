import useEntityQuery from "../../../../hooks/useEntityQuery2";
import TextArea from "antd/es/input/TextArea";
import ListMenuDetailComponent from "./ListMenuDetailComponent";
import MenuApiService from "../../../../services/api/v1/MenuApiService";
import { useMemo, useState } from "react";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { ModalLayout } from "../../../../constants/values";
import {
  inputNumberFormatter,
  inputNumberParse,
} from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { MenuDetailResponseType } from "../../../../types/MenuType";

const DetailMenuModalComponent: React.FC<CrudObjectModalProps> = ({
  defaultLabels,
  data,
  dataForCrud,
}) => {
  const { data: menuDetail, isLoading } =
    useEntityQuery<MenuDetailResponseType>({
      keys: ["menu", data.id],
      params: { id: data.id },
      api: MenuApiService.handleGetDetailById,
    });

  const [form] = Form.useForm<MenuDetailResponseType>();
  const [selectedFoodIds, setSelectedFoodIds] = useState<number[]>([]);

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
          initialValues={menuDetail}
          className="modal__form split-3"
          disabled
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
                  <Input className="text-center" />
                </Form.Item>
                <Form.Item
                  name="status"
                  label={defaultLabels.status}
                  className="modal__form-group-item"
                >
                  <Select />
                </Form.Item>
              </div>
              <Form.Item
                name="name"
                label={defaultLabels.name}
                className="modal__form-group-item"
              >
                <Input />
              </Form.Item>
              <div className="modal__form-group-item-warper split-2">
                <Form.Item
                  name="type"
                  label={defaultLabels.type}
                  className="modal__form-group-item"
                >
                  <Select />
                </Form.Item>
                <Form.Item
                  name="price"
                  label={defaultLabels.price}
                  className="modal__form-group-item"
                >
                  <InputNumber
                    formatter={(value) => inputNumberFormatter(value)}
                    parser={(value) => inputNumberParse(value)}
                  />
                </Form.Item>
              </div>
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
                label={defaultLabels.menuDetails}
                className="modal__form-group-item multiple-2 margin-bottom-0"
              >
                <ListMenuDetailComponent
                  type="detail"
                  foods={dataForCrud.foods || []}
                  selectedFoodIds={selectedFoodIds}
                  setSelectedFoodIds={setSelectedFoodIds}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      )}
    </Spin>
  );
};

export default DetailMenuModalComponent;
