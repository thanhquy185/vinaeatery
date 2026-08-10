package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class SupplierNotFoundByIdException extends RuntimeException {
    public SupplierNotFoundByIdException(Integer id) {
        super(String.format("Nhà cung cấp có mã %s không tìm thấy!", id));
    }
}
