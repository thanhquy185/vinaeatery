package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.RestaurantCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FoodDTO;
import vn.tuhoc.vinaeatery.domain.dto.RestaurantDTO;
import vn.tuhoc.vinaeatery.domain.dto.RestaurantImageDTO;
import vn.tuhoc.vinaeatery.domain.entity.Restaurant_;
import vn.tuhoc.vinaeatery.domain.entity.Food;
import vn.tuhoc.vinaeatery.domain.entity.Restaurant;
import vn.tuhoc.vinaeatery.domain.entity.RestaurantImage;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.EmployeeRepository;
import vn.tuhoc.vinaeatery.repository.FoodRepository;
import vn.tuhoc.vinaeatery.repository.RestaurantRepository;
import vn.tuhoc.vinaeatery.service.specification.RestaurantSpecification;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    // Properties
    private final ManagerService managerService;
    private final RestaurantImageService restaurantImageService;
    private final FoodService foodService;
    private final RestaurantRepository restaurantRepository;
    private final EmployeeRepository employeeRepository;
    private final FoodRepository foodRepository;

    // Methods
    public Restaurant getOneById(Integer id) {
        return this.restaurantRepository.findOneById(id);
    }

    public RestaurantDTO getOneFormatById(Integer id) {
        RestaurantDTO restaurantDTO = new RestaurantDTO();
        Restaurant restaurant = getOneById(id);
        if (restaurant != null) {
            restaurantDTO.setId(restaurant.getId());
            if (restaurant.getManagerId() != null) {
                restaurantDTO.setManager(managerService.getOneFormatById(restaurant.getManagerId()));
            }
            restaurantDTO.setCreateAt(restaurant.getCreateAt());
            restaurantDTO.setName(restaurant.getName());
            restaurantDTO.setPhone(restaurant.getPhone());
            restaurantDTO.setEmail(restaurant.getEmail());
            restaurantDTO.setAddress(restaurant.getAddress());
            restaurantDTO.setDescription(restaurant.getDescription());
            restaurantDTO.setStatus(restaurant.getStatus());
            restaurantDTO.setRating(restaurant.getRating());
            
            List<RestaurantImageDTO> restaurantImagesFormat = new ArrayList<>();
            List<RestaurantImage> restaurantImages = this.restaurantImageService
                    .getAllByRestaurantId(restaurant.getId());
            if (restaurantImages != null && !restaurantImages.isEmpty()) {
                for (RestaurantImage restaurantImage : restaurantImages) {
                    restaurantImagesFormat.add(new RestaurantImageDTO(restaurantImage.getId().getImage()));
                }
            }
            restaurantDTO.setRestaurantImages(restaurantImagesFormat);
        }

        return restaurantDTO;
    }

    public List<Restaurant> getAll() {
        return this.restaurantRepository.findAll();
    }

    public List<Restaurant> getAll(RestaurantCriteria restaurantCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (restaurantCriteria.getSort() != null && restaurantCriteria.getSort().isPresent()) {
            String sortStr = restaurantCriteria.getSort().get();
            switch (sortStr) {
                case "Mã khách hàng tăng dần" -> sort = Sort.by(Restaurant_.ID).ascending();
                case "Mã khách hàng giảm dần" -> sort = Sort.by(Restaurant_.ID).descending();
                case "Tên nhà hàng tăng dần" -> sort = Sort.by(Restaurant_.NAME).ascending();
                case "Tên nhà hàng giảm dần" -> sort = Sort.by(Restaurant_.NAME).descending();
            }
        }

        //
        if (restaurantCriteria.getId() == null
                && restaurantCriteria.getName() == null
                && restaurantCriteria.getPhone() == null
                && restaurantCriteria.getEmail() == null
                && restaurantCriteria.getStatus() == null
                && restaurantCriteria.getSort() == null) {
            return this.restaurantRepository.findAll(sort);
        }
        //
        Specification<Restaurant> combinedSpec = Specification.where(null);
        if (restaurantCriteria.getId() != null && restaurantCriteria.getId().isPresent()) {
            if (restaurantCriteria.getId().get().matches("\\d+")) {
                Specification<Restaurant> currentSpec = RestaurantSpecification
                        .idEqual(restaurantCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (restaurantCriteria.getName() != null && restaurantCriteria.getName().isPresent()) {
            Specification<Restaurant> currentSpec = RestaurantSpecification
                    .nameLike(restaurantCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (restaurantCriteria.getPhone() != null && restaurantCriteria.getPhone().isPresent()) {
            if (restaurantCriteria.getPhone().get().matches("\\d+")) {
                Specification<Restaurant> currentSpec = RestaurantSpecification
                        .phoneLike(restaurantCriteria.getPhone().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (restaurantCriteria.getEmail() != null && restaurantCriteria.getEmail().isPresent()) {
            Specification<Restaurant> currentSpec = RestaurantSpecification
                    .emailLike(restaurantCriteria.getEmail().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (restaurantCriteria.getStatus() != null && restaurantCriteria.getStatus().isPresent()) {
            String statusString = restaurantCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Restaurant> currentSpec = RestaurantSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.restaurantRepository.findAll(combinedSpec, sort);
    }

    public List<Restaurant> getAllByManagerId(Integer managerId) {
        return this.restaurantRepository.findAllByManagerId(managerId);
    }

    public List<RestaurantDTO> getAllFormat(RestaurantCriteria restaurantCriteria) {
        List<RestaurantDTO> listFormat = new ArrayList<>();
        for (Restaurant restaurant : getAll(restaurantCriteria)) {
            listFormat.add(getOneFormatById(restaurant.getId()));
        }

        return listFormat;
    }

    public List<RestaurantDTO> getAllFormatByManagerId(Integer managerId) {
        List<RestaurantDTO> listFormat = new ArrayList<>();
        for (Restaurant restaurant : getAllByManagerId(managerId)) {
            RestaurantDTO restaurantFormat = getOneFormatById(restaurant.getId());

            // List<RestaurantImageDTO> restaurantImagesFormat = new ArrayList<>();
            // List<RestaurantImage> restaurantImages = this.restaurantImageService
            // .getAllByRestaurantId(restaurant.getId());
            // if (restaurantImages != null && !restaurantImages.isEmpty()) {
            // for (RestaurantImage restaurantImage : restaurantImages) {
            // restaurantImagesFormat.add(new
            // RestaurantImageDTO(restaurantImage.getId().getImage()));
            // }
            // }
            // restaurantFormat.setRestaurantImages(restaurantImagesFormat);
            restaurantFormat
                    .setNumberOfEmployees(employeeRepository.findAllByRestaurantId(restaurantFormat.getId()).size());
            restaurantFormat
                    .setNumberOfFoods(foodRepository.findAllByRestaurantId(restaurantFormat.getId()).size());

            listFormat.add(restaurantFormat);
        }

        return listFormat;
    }

    public List<RestaurantDTO> getAllFormatForPublicPage(RestaurantCriteria restaurantCriteria) {
        List<RestaurantDTO> listFormat = new ArrayList<>();
        for (Restaurant restaurant : getAll(restaurantCriteria)) {
            RestaurantDTO restaurantFormat = getOneFormatById(restaurant.getId());

            // List<RestaurantImageDTO> restaurantImagesFormat = new ArrayList<>();
            // List<RestaurantImage> restaurantImages = this.restaurantImageService
            // .getAllByRestaurantId(restaurant.getId());
            // if (restaurantImages != null && !restaurantImages.isEmpty()) {
            // for (RestaurantImage restaurantImage : restaurantImages) {
            // restaurantImagesFormat.add(new
            // RestaurantImageDTO(restaurantImage.getId().getImage()));
            // }
            // }
            // restaurantFormat.setRestaurantImages(restaurantImagesFormat);

            List<FoodDTO> restaurantFoodsFormat = new ArrayList<>();
            List<Food> restaurantFoods = this.foodRepository.findAllByRestaurantId(restaurant.getId());
            if (restaurantFoods != null && !restaurantFoods.isEmpty()) {
                for (Food restaurantFood : restaurantFoods) {
                    restaurantFoodsFormat.add(this.foodService.getOneFormatById(restaurantFood.getId()));
                }
            }
            restaurantFormat.setRestaurantFoods(restaurantFoodsFormat);

            listFormat.add(restaurantFormat);
        }

        return listFormat;
    }

    public Restaurant upsert(Restaurant restaurant) {
        return this.restaurantRepository.save(restaurant);
    }

    public void delete(Integer id) {
        this.restaurantRepository.deleteById(id);
    }

    public void lock(Restaurant restaurant) {
        this.restaurantRepository.save(restaurant);
    }
}