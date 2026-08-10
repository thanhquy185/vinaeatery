package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class CustomerNotFoundByUserIdException extends RuntimeException {
    public CustomerNotFoundByUserIdException(Integer userId) {
        super(String.format("Khách hàng có mã tài khoản %s không tìm thấy!", userId));
    }
}
