package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class ManagerPhoneIsExistsException extends RuntimeException {
    public ManagerPhoneIsExistsException(String phone) {
        super(String.format("Số điện thoại chủ nhà hàng %s đã tồn tại!", phone));
    }
}
