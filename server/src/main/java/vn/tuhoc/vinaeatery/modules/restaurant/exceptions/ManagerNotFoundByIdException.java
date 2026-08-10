package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class ManagerNotFoundByIdException extends RuntimeException {
    public ManagerNotFoundByIdException(Integer id) {
        super(String.format("Chủ nhà hàng có mã %s không tìm thấy!", id));
    }
}
