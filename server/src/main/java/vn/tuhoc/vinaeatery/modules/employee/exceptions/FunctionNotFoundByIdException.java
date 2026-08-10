package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class FunctionNotFoundByIdException extends RuntimeException {
    public FunctionNotFoundByIdException(Integer id) {
        super(String.format("Chức năng có mã %s không tìm thấy!", id));
    }
}
