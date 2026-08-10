package vn.tuhoc.vinaeatery.modules.table.exceptions;

public class CategoryTableNotFoundByIdException extends RuntimeException {
    public CategoryTableNotFoundByIdException(Integer id) {
        super(String.format("Loại bàn ăn có mã %s không tìm thấy!", id));
    }

}
