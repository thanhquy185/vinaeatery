package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class RestaurantPhoneIsExistsException extends RuntimeException {
    public RestaurantPhoneIsExistsException(String phone) {
        super(String.format("Số điện thoại nhà hàng %s đã tồn tại!", phone));
    }
}
