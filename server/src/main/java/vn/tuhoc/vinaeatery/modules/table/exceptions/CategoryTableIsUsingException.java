package vn.tuhoc.vinaeatery.modules.table.exceptions;

public class CategoryTableIsUsingException extends RuntimeException {
    public CategoryTableIsUsingException(Integer id) {
        super(String.format("Loại bàn ăn có mã %s đang được sử dụng!", id));
    }
}
