package vn.tuhoc.vinaeatery.modules.food.exceptions;

public class FoodNotFoundByIdException extends RuntimeException {
    public FoodNotFoundByIdException(Integer id) {
        super(String.format("Món ăn có mã %s không tìm thấy!", id));
    }
}
