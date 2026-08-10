package vn.tuhoc.vinaeatery.modules.employee.exceptions;

public class EmployeeNotFoundByIdException extends RuntimeException {
    public EmployeeNotFoundByIdException(Integer id) {
        super(String.format("Nhân viên có mã %s không tìm thấy!", id));
    }
}
