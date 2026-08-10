package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class IngredientNotFoundByIdException extends RuntimeException {
    public IngredientNotFoundByIdException(Integer id) {
        super(String.format("Nguyên liệu có mã %s không tìm thấy!", id));
    }
}
