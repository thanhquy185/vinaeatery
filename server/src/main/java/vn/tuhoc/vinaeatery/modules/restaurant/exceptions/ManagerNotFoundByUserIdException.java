package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class ManagerNotFoundByUserIdException extends RuntimeException {
    public ManagerNotFoundByUserIdException(Integer userId) {
        super(String.format("Chủ nhà hàng có mã tài khoản %s không tìm thấy!", userId));
    }
}
