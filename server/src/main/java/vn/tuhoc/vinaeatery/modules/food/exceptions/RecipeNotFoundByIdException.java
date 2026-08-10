package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class RecipeNotFoundByIdException extends RuntimeException {
    public RecipeNotFoundByIdException(Integer foodId, Integer ingredientId) {
        super(String.format("Công thức có mã món ăn %s và mã nguyên liệu %s không tìm thấy!", foodId, ingredientId));
    }
}
