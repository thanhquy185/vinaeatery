package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class RestaurantEmailIsExistsException extends RuntimeException {
    public RestaurantEmailIsExistsException(String email) {
        super(String.format("Email nhà hàng %s đã tồn tại!", email));
    }
}
