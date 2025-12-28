package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.domain.entity.RestaurantImage;
import vn.tuhoc.vinaeatery.domain.entity.RestaurantImageId;

public interface RestaurantImageRepository
        extends JpaRepository<RestaurantImage, RestaurantImageId>, JpaSpecificationExecutor<RestaurantImage> {
    // Methods
    RestaurantImage findOneById(RestaurantImageId id);

    List<RestaurantImage> findAllByIdRestaurantId(Integer restaurantId);

    void deleteById(RestaurantImageId id);
    
    void deleteByIdRestaurantId(Integer restaurantId);
}
