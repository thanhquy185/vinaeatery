package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryRewardPunishCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.CategoryRewardPunish;
// import vn.tuhoc.vinaeatery.domain.entity.RewardPunish;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.CategoryRewardPunishCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryRewardPunishLockRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryRewardPunishUpdateRequest;
import vn.tuhoc.vinaeatery.service.CategoryRewardPunishService;
// import vn.tuhoc.vinaeatery.service.RewardPunishService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/category-reward-punishes")
@RequiredArgsConstructor
public class CategoryRewardPunishApiController {
        // Properties
        private final CategoryRewardPunishService categoryRewardPunishService;
        // private final RewardPunishService rewardPunishService;
        private final TimeService timeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listCategoryRewardPunish(@RequestBody FormSecurityDTO formSecurityDTO,
                        CategoryRewardPunishCriteria categoryRewardPunishCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-reward-punishes", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<CategoryRewardPunish> listCategoryRewardPunish = this.categoryRewardPunishService
                                .getAll(categoryRewardPunishCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listCategoryRewardPunish);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailCategoryRewardPunish(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-reward-punishes", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                CategoryRewardPunish categoryRewardPunishSelected = this.categoryRewardPunishService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(categoryRewardPunishSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateCategoryRewardPunish(
                        @RequestBody @Valid CategoryRewardPunishCreateRequest categoryRewardPunishCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryRewardPunishCreateRequest.getFormSecurity(),
                                "category-reward-punishes", "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryRewardPunishCreateRequest.getCategoryRewardPunish() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại nguyên liệu không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryRewardPunish categoryRewardPunishCreate = this.categoryRewardPunishService
                                .upsert(categoryRewardPunishCreateRequest.getCategoryRewardPunish());
                return ResponseEntity.status(HttpStatus.OK).body(categoryRewardPunishCreate);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateCategoryRewardPunish(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryRewardPunishUpdateRequest categoryRewardPunishUpdateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryRewardPunishUpdateRequest.getFormSecurity(),
                                "category-reward-punishes", "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryRewardPunishUpdateRequest.getCategoryRewardPunish() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại nguyên liệu không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryRewardPunish categoryRewardPunishUpdated = this.categoryRewardPunishService.getOneById(id);
                if (categoryRewardPunishUpdated != null) {
                        categoryRewardPunishUpdated
                                        .setName(categoryRewardPunishUpdateRequest.getCategoryRewardPunish().getName());
                        categoryRewardPunishUpdated
                                        .setHandle(categoryRewardPunishUpdateRequest.getCategoryRewardPunish()
                                                        .getHandle());
                        categoryRewardPunishUpdated
                                        .setDescription(categoryRewardPunishUpdateRequest.getCategoryRewardPunish()
                                                        .getDescription());
                        // categoryRewardPunishUpdated.setUpdateAt(this.timeService.getDateTimeVN(categoryRewardPunishUpdateRequest.getCategoryRewardPunish().getUpdateAt()));
                        categoryRewardPunishUpdated.setUpdateAt(
                                        categoryRewardPunishUpdateRequest.getCategoryRewardPunish().getUpdateAt());

                        this.categoryRewardPunishService.upsert(categoryRewardPunishUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryRewardPunishUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockCategoryRewardPunish(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryRewardPunishLockRequest categoryRewardPunishLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryRewardPunishLockRequest.getFormSecurity(),
                                "category-reward-punishes",
                                "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryRewardPunishLockRequest.getCategoryRewardPunish() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại nguyên liệu không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                // List<RewardPunish> categoryRewardPunishListIsUsing = RewardPunishService
                // .getAllByCategoryRewardPunishId(id);
                // if (categoryRewardPunishListIsUsing != null &&
                // !categoryRewardPunishListIsUsing.isEmpty()) {
                // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                // .body(ValidationUtil.buildRestResponseWithStr(
                // "Loại thưởng phạt này đang được ít nhất 1 thưởng phạt sử dụng!"));
                // }

                CommonStatusEnum handleStatus = categoryRewardPunishLockRequest.getCategoryRewardPunish()
                                .getStatus() == CommonStatusEnum.ACTIVE
                                                ? CommonStatusEnum.INACTIVE
                                                : CommonStatusEnum.ACTIVE;
                // LocalDateTime handleUpdateAt = this.serviceAt
                // .getDateTimeVN(categoryRewardPunishLockRequest.getCategoryRewardPunish().getUpdateAt());
                // LocalDateTime handleUpdateAt =
                // this.timeService.getDateTimeVN(LocalDateTime.now());

                CategoryRewardPunish categoryRewardPunishLocked = this.categoryRewardPunishService.getOneById(id);
                if (categoryRewardPunishLocked != null) {
                        categoryRewardPunishLocked.setStatus(handleStatus);
                        // categoryRewardPunishLocked.setUpdateAt(handleUpdateAt);

                        this.categoryRewardPunishService.lock(categoryRewardPunishLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryRewardPunishLocked);
        }
}
