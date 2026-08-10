package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class CustomerNotFoundByPhoneException extends RuntimeException {
    public CustomerNotFoundByPhoneException(String phone) {
        super(String.format("Khách hàng có số điện thoại %s không tìm thấy!", phone));
    }
}
