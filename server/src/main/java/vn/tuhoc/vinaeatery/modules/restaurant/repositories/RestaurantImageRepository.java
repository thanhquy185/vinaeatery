package vn.tuhoc.vinaeatery.modules.restaurant.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantImageEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantImageIdEntity;

public interface RestaurantImageRepository
        extends JpaRepository<RestaurantImageEntity, RestaurantImageIdEntity>,
        JpaSpecificationExecutor<RestaurantImageEntity> {

}
