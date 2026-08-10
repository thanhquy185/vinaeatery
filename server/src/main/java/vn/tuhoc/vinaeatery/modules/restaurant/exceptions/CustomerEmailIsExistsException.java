package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class CustomerEmailIsExistsException extends RuntimeException {
    public CustomerEmailIsExistsException(String email) {
        super(String.format("Email khách hàng %s đã tồn tại!", email));
    }
}
