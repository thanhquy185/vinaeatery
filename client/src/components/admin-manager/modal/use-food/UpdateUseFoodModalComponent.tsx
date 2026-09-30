import useEntityQuery from "../../../../hooks/useEntityQuery2";
import useEntityMutation from "../../../../hooks/useEntityMutation";
import UseFoodApiService from "../../../../services/api/v1/UseFoodApiService";
import dayjs from "dayjs";
import { Image, Spin, Tag } from "antd";
import {
  ImageSourcePath,
  FoodIngredientStatusValue,
  UseFoodStatusValue,
} from "../../../../constants/values";
import { actionIndexes } from "../../../../utils/defaultActionsUtil";
import { hasPermission } from "../../../../utils/hasPermissionsUtil";
import { openConfirmation } from "../../../../utils/showConfirmationUtil";
import { vietnamMoneyFormat } from "../../../../utils/otherEvents";
import type { CrudObjectModalProps } from "../../../../constants/props";
import type { UseFoodStatusEnum } from "../../../../constants/enums";
import type {
  UseFoodDetailResponseType,
  UseFoodUpdateStatusRequestType,
} from "../../../../types/UseFoodType";

const UpdateUseFoodModalComponent: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  isManager,
  restaurantId,
  validActions,
  data,
  dataForCrud,
  closeModal,
}) => {
  const { data: useFoodDetail, isLoading } =
    useEntityQuery<UseFoodDetailResponseType>({
      keys: ["use-food", data.id],
      params: { id: data.id },
      api: UseFoodApiService.handleGetDetailById,
    });

  const updateMutation = useEntityMutation<
    UseFoodUpdateStatusRequestType,
    UseFoodDetailResponseType
  >({
    messages: {
      success: `Cập nhật trạng thái ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật trạng thái ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN], ["use-food", data.id]],
    api: UseFoodApiService.handleUpdateStatus,
  });

  // Hàm gọi API để cập nhật trạng thái sử dụng món ăn
  const callApiToUpdateUseFood = async (
    id: number,
    button: HTMLElement,
    value: string,
  ) => {
    button.classList.add("active");

    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      const response = await updateMutation.mutateAsync({
        values: {
          id: id,
          employeeId: dataForCrud?.infoLogin?.id!,
          endAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          status: value as UseFoodStatusEnum,
        },
      });
      if (response) {
        closeModal();
      }
    }

    button.classList.remove("active");
  };

  return (
    <Spin spinning={!useFoodDetail || isLoading}>
      {useFoodDetail && (
        <>
          <Image
            src={
              useFoodDetail.food.imageUrl ?? ImageSourcePath + "no-image.png"
            }
            alt=""
          />
          <div className="info">
            <b>Mã món ăn:</b>#{useFoodDetail.food.id}
          </div>
          <div className="info">
            <b>Tên món ăn:</b>
            {useFoodDetail.food.name}
          </div>
          <div className="info">
            <b>Loại món ăn:</b>
            {useFoodDetail.food.categoryFood.name}
          </div>
          <div className="info">
            <b>Đơn vị:</b>
            {useFoodDetail.food.unit}
          </div>
          <div className="info">
            <b>Giá bán:</b>
            {vietnamMoneyFormat(useFoodDetail.food.price || 0)}
          </div>
          <div className="info">
            <b>Mô tả:</b>
            {useFoodDetail.food.description}
          </div>
          <div className="info">
            <b>Trạng thái:</b>
            <span
              className={
                "status " +
                (useFoodDetail.status === UseFoodStatusValue.can_order
                  ? "green"
                  : "red")
              }
            >
              {useFoodDetail.status}
            </span>
          </div>
          <div className="info">
            <b>Công thức món ăn:</b>
            <table>
              <colgroup>
                <col width="15%" />
                <col width="30%" />
                <col width="20%" />
                <col width="20%" />
                <col width="15%" />
              </colgroup>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên nguyên liệu</th>
                  <th>Yêu cầu</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {useFoodDetail.food.recipes.map((recipe) => {
                  const isSufficient =
                    recipe.ingredient.inventory > recipe.quantity;

                  return (
                    <tr key={recipe.ingredient.id}>
                      <td>{recipe.ingredient.id}</td>
                      <td>{recipe.ingredient.name}</td>
                      <td>{recipe.quantity}</td>
                      <td>{recipe.ingredient.inventory}</td>
                      <td>
                        <Tag
                          color={isSufficient ? "green" : "red"}
                          bordered={false}
                        >
                          {isSufficient
                            ? FoodIngredientStatusValue.sufficient
                            : FoodIngredientStatusValue.insufficient}
                        </Tag>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {hasPermission({
            isManager: isManager!,
            restaurantIdForCrud: restaurantId,
            validActions,
            requiredActionId: actionIndexes.update,
          }) && (
            <div className="modal__buttons mg-top">
              {useFoodDetail.status === UseFoodStatusValue.can_not_order && (
                <button
                  className="modal__button secondary btn green-secondary"
                  onClick={(e) =>
                    callApiToUpdateUseFood(
                      useFoodDetail.id,
                      e.target as HTMLElement,
                      UseFoodStatusValue.can_order,
                    )
                  }
                >
                  {UseFoodStatusValue.can_order}
                </button>
              )}
              {useFoodDetail.status === UseFoodStatusValue.can_order && (
                <button
                  className="modal__button secondary btn red-secondary"
                  onClick={(e) =>
                    callApiToUpdateUseFood(
                      useFoodDetail.id,
                      e.target as HTMLElement,
                      UseFoodStatusValue.can_not_order,
                    )
                  }
                >
                  {UseFoodStatusValue.can_not_order}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </Spin>
  );
};

export default UpdateUseFoodModalComponent;
