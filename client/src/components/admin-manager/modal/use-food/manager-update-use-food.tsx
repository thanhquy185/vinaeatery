import { Image } from "antd";
import type { CrudObjectModalProps } from "../../../../common/props";
import type { UseFoodType } from "../../../../common/types";
import { ImageSourcePath, UseFoodStatus } from "../../../../common/values";
import { useEntityMutation } from "../../../../hook/use-entity-mutation";
import { HandleUpdateUseFood } from "../../../../requests/use-foods";
import { actionIndexes } from "../../../../utils/default-actions";
import { hasPermission } from "../../../../utils/has-permissions";
import { openConfirmation } from "../../../../utils/show-confirmation";
import { vietnamMoneyFormat } from "../../../../utils/other-events";

// Manager Update Use Food
const ManagerUpdateUseFood: React.FC<CrudObjectModalProps> = ({
  objectVN,
  objectEN,
  isManager,
  restaurantId,
  validActions,
  data,
  dataForCrud,
  closeModal,
}) => {
  // Update Mutation
  const updateMutation = useEntityMutation<UseFoodType>({
    messages: {
      success: `Cập nhật trạng thái ${objectVN?.toLowerCase()} thành công!`,
      error: `Cập nhật trạng thái ${objectVN?.toLowerCase()} thất bại!`,
    },
    invalidateKeys: [[objectEN]],
    api: HandleUpdateUseFood,
  });

  // Hàm gọi API để cập nhật trạng thái sử dụng món ăn
  const callApiToUpdateUseFood = async (
    id: number,
    button: HTMLElement,
    value: string,
  ) => {
    // Thêm class 'active' thể hiện là nút được nhấn
    button.classList.add("active");

    // Hỏi trước khi xử khi xử lý ?
    const answer = await openConfirmation({
      title: `Bạn có chắc chắn cập nhật ?`,
      content: "Hành động này không thể hoàn tác.",
    });
    if (answer) {
      // Biến giữ giá trị tương ứng với "trạng thái" cần thay đổi
      let status = null;
      if (
        value === UseFoodStatus.canOrder ||
        value === UseFoodStatus.canNotOrder
      ) {
        status = value;
      }

      // Thực thi mutation
      const response = await updateMutation.mutateAsync({
        values: {
          restaurantId: restaurantId,
          id: id,
          timeEnd: new Date().toISOString(),
          employeeId: dataForCrud?.infoLogin?.id,
          status: status! || undefined,
        },
      });
      if (data) {
        closeModal();
      }
    } else {
      // Xoá class 'active' thể hiện là nút không còn được nhấn
      button.classList.remove("active");
    }
  };

  return (
    <>
      <Image
        src={
          data?.food?.image!
            ? (data?.food?.image as string)
            : ImageSourcePath + "no-image.png"
        }
        alt=""
      />
      <div className="info">
        <b>Mã món ăn:</b>#{data?.food?.id}
      </div>
      <div className="info">
        <b>Tên món ăn:</b>
        {data?.food?.name}
      </div>
      <div className="info">
        <b>Loại món ăn:</b>
        {data?.food?.categoryFood?.name}
      </div>
      <div className="info">
        <b>Đơn vị:</b>
        {data?.food?.unit}
      </div>
      <div className="info">
        <b>Giá bán:</b>
        {vietnamMoneyFormat(data?.food?.price || 0)}
      </div>
      <div className="info">
        <b>Mô tả:</b>
        {data?.food?.description}
      </div>
      <div className="info">
        <b>Trạng thái:</b>
        <span
          className={
            "status " +
            (data?.status === UseFoodStatus.canOrder ? "green" : "red")
          }
        >
          {data?.status!}
        </span>
      </div>
      <div className="info">
        <b>Công thức món ăn:</b>
        <table>
          <colgroup>
            <col width="10%" />
            <col width="25%" />
            <col width="15%" />
            <col width="35%" />
            <col width="15%" />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên nguyên liệu</th>
              <th>Số lượng</th>
              <th>Ghi chú</th>
              <th>Tồn kho</th>
            </tr>
          </thead>
          <tbody>
            {(data as UseFoodType)?.food?.recipe?.map((recipeDetail) => (
              <tr key={recipeDetail?.ingredientId}>
                <td>{recipeDetail?.ingredientId}</td>
                <td>{recipeDetail?.ingredientName}</td>
                <td>{recipeDetail?.quantity}</td>
                <td>{recipeDetail?.note}</td>
                <td>{recipeDetail?.ingredientInventory}</td>
              </tr>
            ))}
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
          {data?.status! === UseFoodStatus.canNotOrder && (
            <button
              className="modal__button secondary btn green-secondary"
              onClick={(e) =>
                callApiToUpdateUseFood(
                  data?.id!,
                  e.target as HTMLElement,
                  UseFoodStatus.canOrder,
                )
              }
            >
              {UseFoodStatus.canOrder}
            </button>
          )}
          {data?.status! === UseFoodStatus.canOrder && (
            <button
              className="modal__button secondary btn red-secondary"
              onClick={(e) =>
                callApiToUpdateUseFood(
                  data?.id!,
                  e.target as HTMLElement,
                  UseFoodStatus.canNotOrder,
                )
              }
            >
              {UseFoodStatus.canNotOrder}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ManagerUpdateUseFood;
