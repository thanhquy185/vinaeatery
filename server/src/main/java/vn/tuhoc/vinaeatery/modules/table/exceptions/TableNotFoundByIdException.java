package vn.tuhoc.vinaeatery.modules.table.exceptions;

public class TableNotFoundByIdException extends RuntimeException {
    public TableNotFoundByIdException(Integer id) {
        super(String.format("Bàn ăn có mã %s không tìm thấy!", id));
    }
}
