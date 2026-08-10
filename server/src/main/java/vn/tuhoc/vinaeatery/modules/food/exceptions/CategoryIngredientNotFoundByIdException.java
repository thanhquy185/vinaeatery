package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class CategoryIngredientNotFoundByIdException extends RuntimeException {
    public CategoryIngredientNotFoundByIdException(Integer id) {
        super(String.format("Loại nguyên liệu có mã %s không tìm thấy!", id));
    }
}
