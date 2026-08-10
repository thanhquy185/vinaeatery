package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class CategoryFoodIsUsingException extends RuntimeException {
    public CategoryFoodIsUsingException(Integer id) {
        super(String.format("Loại món ăn có mã %s đang được sử dụng!", id));
    }
}
