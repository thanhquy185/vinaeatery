package vn.tuhoc.vinaeatery.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.RestaurantCriteria;
import vn.tuhoc.vinaeatery.domain.dto.RestaurantDTO;
import vn.tuhoc.vinaeatery.domain.dto.RestaurantUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Restaurant;
import vn.tuhoc.vinaeatery.domain.entity.RestaurantImage;
import vn.tuhoc.vinaeatery.domain.entity.RestaurantImageId;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.CloudinaryService;
import vn.tuhoc.vinaeatery.service.RestaurantImageService;
import vn.tuhoc.vinaeatery.service.RestaurantService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantApiController {
        // Properties
        private final RestaurantService restaurantService;
        private final RestaurantImageService restaurantImageService;
        private final CloudinaryService cloudinaryService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listRestaurant(@RequestBody FormSecurityDTO formSecurityDTO,
                        RestaurantCriteria restaurantCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "restaurants", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<Restaurant> listRestaurant = this.restaurantService.getAll(restaurantCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listRestaurant);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listRestaurantFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        RestaurantCriteria restaurantCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "restaurants", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<RestaurantDTO> listRestaurant = this.restaurantService.getAllFormat(restaurantCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listRestaurant);
        }

        @PostMapping("/list-format-for-public-page")
        public ResponseEntity<?> listRestaurantFormatForPublicPage(@RequestBody FormSecurityDTO formSecurityDTO,
                        RestaurantCriteria restaurantCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "restaurants", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<RestaurantDTO> listRestaurant = this.restaurantService.getAllFormatForPublicPage(restaurantCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listRestaurant);
        }

        @PostMapping("/list-format-by-manager-id/{id}")
        public ResponseEntity<?> listRestaurantFormatByManagerId(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "restaurants", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<RestaurantDTO> listRestaurant = this.restaurantService.getAllFormatByManagerId(id);
                return ResponseEntity.status(HttpStatus.OK).body(listRestaurant);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailRestaurant(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "restaurants", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Restaurant RestaurantSelected = this.restaurantService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(RestaurantSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleCreateRestaurant(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("restaurant") @Valid Restaurant restaurant,
                        @RequestPart(value = "restaurant-images", required = false) MultipartFile[] restaurantImages,
                        BindingResult bindingResult) throws IOException {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "restaurants",
                                "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                Restaurant restaurantCreate = this.restaurantService.upsert(restaurant);
                if (restaurantCreate != null && restaurantImages != null && restaurantImages.length > 0) {
                        for (MultipartFile restaurantImage : restaurantImages) {
                                String image = this.cloudinaryService.uploadImage(restaurantImage);

                                RestaurantImage newRestaurantImage = new RestaurantImage();
                                newRestaurantImage.setId(new RestaurantImageId(restaurantCreate.getId(), image));
                                restaurantImageService.upsert(newRestaurantImage);
                        }
                }

                return ResponseEntity.status(HttpStatus.OK).body(restaurantCreate);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleUpdateRestaurant(@PathVariable("id") Integer id,
                        @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("restaurant") @Valid RestaurantUpdateDTO restaurant,
                        @RequestPart(value = "restaurant-images", required = false) MultipartFile[] restaurantImages,
                        BindingResult bindingResult) throws IOException {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "restaurants",
                                "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                Restaurant restaurantUpdated = null;
                Restaurant selectedRestaurant = this.restaurantService.getOneById(id);
                if (selectedRestaurant != null) {
                        selectedRestaurant.setManagerId(restaurant.getManagerId());
                        selectedRestaurant.setName(restaurant.getName());
                        selectedRestaurant.setPhone(restaurant.getPhone());
                        selectedRestaurant.setEmail(restaurant.getEmail());
                        selectedRestaurant.setAddress(restaurant.getAddress());
                        selectedRestaurant.setDescription(restaurant.getDescription());
                        selectedRestaurant.setRating(restaurant.getRating());
                        restaurantUpdated = this.restaurantService.upsert(selectedRestaurant);

                        if (restaurantUpdated != null) {
                                this.restaurantImageService.deleteByRestaurantId(restaurantUpdated.getId());

                                if(restaurantImages != null && restaurantImages.length > 0) {
                                        for (MultipartFile restaurantImage : restaurantImages) {
                                                String image = this.cloudinaryService.uploadImage(restaurantImage);
        
                                                RestaurantImage newRestaurantImage = new RestaurantImage();
                                                newRestaurantImage
                                                                .setId(new RestaurantImageId(restaurantUpdated.getId(), image));
                                                restaurantImageService.upsert(newRestaurantImage);
                                        }
                                }
                        }
                }

                return ResponseEntity.status(HttpStatus.OK).body(restaurantUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleLockRestaurant(@PathVariable("id") Integer id,
                        @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("restaurant") @Valid CommonStatusUpdateDTO commonStatusUpdate,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "restaurants",
                                "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                                ? CommonStatusEnum.INACTIVE
                                : CommonStatusEnum.ACTIVE;

                Restaurant restaurantLocked = this.restaurantService.getOneById(id);
                if (restaurantLocked != null) {
                        restaurantLocked.setStatus(handleStatus);

                        this.restaurantService.lock(restaurantLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(restaurantLocked);
        }
}