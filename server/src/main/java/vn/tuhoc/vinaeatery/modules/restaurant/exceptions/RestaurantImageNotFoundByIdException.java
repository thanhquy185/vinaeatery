package vn.tuhoc.vinaeatery.modules.restaurant.exceptions;

import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantImageIdEntity;

public class RestaurantImageNotFoundByIdException extends RuntimeException {
    public RestaurantImageNotFoundByIdException(RestaurantImageIdEntity id) {
        super(String.format("Hình ảnh nhà hàng có mã nhà hàng %s và đường dẫn ảnh %s không tìm thấy!",
                id.getRestaurantId(), id.getImage()));
    }
}
