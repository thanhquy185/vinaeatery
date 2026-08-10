package vn.tuhoc.vinaeatery.modules.table.exceptions;

public class FloorNotFoundByIdException extends RuntimeException {
    public FloorNotFoundByIdException(Integer id) {
        super(String.format("Tầng có mã %s không tìm thấy!", id));
    }
}
