package vn.tuhoc.vinaeatery.modules.active.exceptions;

public class UseTableNotFoundByRestaurantIdTableIdAndEndAtIsNull extends RuntimeException {
    public UseTableNotFoundByRestaurantIdTableIdAndEndAtIsNull(Integer restaurantId, Integer tableId) {
        super(String.format(
                "Sử dụng bàn ăn mới nhất có mã nhà hàng %s và mã bàn ăn %s không tìm thấy!",
                restaurantId,
                tableId));
    }
}
