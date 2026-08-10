package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class CustomerPhoneIsExistsException extends RuntimeException {
    public CustomerPhoneIsExistsException(String phone) {
        super(String.format("Số điện thoại khách hàng %s đã tồn tại!", phone));
    }
}
