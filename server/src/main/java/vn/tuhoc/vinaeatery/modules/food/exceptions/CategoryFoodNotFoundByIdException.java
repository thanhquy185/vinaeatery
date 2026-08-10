package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class CategoryFoodNotFoundByIdException extends RuntimeException {
    public CategoryFoodNotFoundByIdException(Integer id) {
        super(String.format("Loại món ăn có mã %s không tìm thấy!", id));
    }
}
