package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Restaurant;

@Repository
public interface RestaurantRepository
        extends JpaRepository<Restaurant, Integer>, JpaSpecificationExecutor<Restaurant> {
    // Methods
    Restaurant findOneById(Integer id);

    List<Restaurant> findAllByManagerId(Integer managerId);

    void deleteById(Integer id);
}