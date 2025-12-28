package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.entity.RestaurantImage;
import vn.tuhoc.vinaeatery.domain.entity.RestaurantImageId;
import vn.tuhoc.vinaeatery.repository.RestaurantImageRepository;

@Service
@RequiredArgsConstructor
public class RestaurantImageService {
    // Properties
    private final RestaurantImageRepository restaurantImageRepository;

    // Methods
    public RestaurantImage getOneById(RestaurantImageId id) {
        return this.restaurantImageRepository.findOneById(id);
    }

    public List<RestaurantImage> getAllByRestaurantId(Integer restaurantId) {
        return this.restaurantImageRepository.findAllByIdRestaurantId(restaurantId);
    }

    public List<RestaurantImage> getAll() {
        return this.restaurantImageRepository.findAll();
    }

    public RestaurantImage upsert(RestaurantImage RestaurantImage) {
        return this.restaurantImageRepository.save(RestaurantImage);
    }

    public void deleteById(RestaurantImageId id) {
        this.restaurantImageRepository.deleteById(id);
    }

    @Transactional
    public void deleteByRestaurantId(Integer restaurantId) {
        this.restaurantImageRepository.deleteByIdRestaurantId(restaurantId);
    }
}