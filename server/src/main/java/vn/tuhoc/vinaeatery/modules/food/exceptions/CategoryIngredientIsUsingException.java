package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class CategoryIngredientIsUsingException extends RuntimeException {

    public CategoryIngredientIsUsingException(Integer id) {
        super(String.format("Loại nguyên liệu có mã %s đang được sử dụng!", id));
    }
}
