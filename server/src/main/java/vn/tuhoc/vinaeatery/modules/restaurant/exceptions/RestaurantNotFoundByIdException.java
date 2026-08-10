package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

public class RestaurantNotFoundByIdException extends RuntimeException {
    public RestaurantNotFoundByIdException(Integer id) {
        super(String.format("Nhà hàng có mã %s không tìm thấy!", id));
    }
}
