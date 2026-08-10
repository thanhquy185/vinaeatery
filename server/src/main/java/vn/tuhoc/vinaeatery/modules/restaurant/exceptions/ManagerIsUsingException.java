package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class ManagerIsUsingException extends RuntimeException {
    public ManagerIsUsingException(Integer id) {
        super(String.format("Chủ nhà hàng có mã %s đang được sử dụng!", id));
    }
}
