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
import vn.tuhoc.vinaeatery.domain.criteria.CategoryPermissionTicketCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket;
import vn.tuhoc.vinaeatery.domain.entity.PermissionTicket;
// import vn.tuhoc.vinaeatery.domain.entity.PermissionTicket;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.CategoryPermissionTicketCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryPermissionTicketLockRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryPermissionTicketUpdateRequest;
import vn.tuhoc.vinaeatery.service.CategoryPermissionTicketService;
import vn.tuhoc.vinaeatery.service.PermissionTicketService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/category-permission-tickets")
@RequiredArgsConstructor
public class CategoryPermissionTicketApiController {
        // Properties
        private final CategoryPermissionTicketService categoryPermissionTicketService;
        private final PermissionTicketService permissionTicketService;
        private final TimeService timeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listCategoryPermissionTicket(@RequestBody FormSecurityDTO formSecurityDTO,
                        CategoryPermissionTicketCriteria categoryPermissionTicketCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-permission-tickets", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<CategoryPermissionTicket> listCategoryPermissionTicket = this.categoryPermissionTicketService
                                .getAll(categoryPermissionTicketCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listCategoryPermissionTicket);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailCategoryPermissionTicket(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-permission-tickets", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                CategoryPermissionTicket categoryPermissionTicketSelected = this.categoryPermissionTicketService
                                .getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(categoryPermissionTicketSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateCategoryPermissionTicket(
                        @RequestBody @Valid CategoryPermissionTicketCreateRequest categoryPermissionTicketCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryPermissionTicketCreateRequest.getFormSecurity(),
                                "category-permission-tickets", "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryPermissionTicketCreateRequest.getCategoryPermissionTicket() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại nguyên liệu không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryPermissionTicket categoryPermissionTicketCreate = this.categoryPermissionTicketService
                                .upsert(categoryPermissionTicketCreateRequest.getCategoryPermissionTicket());
                return ResponseEntity.status(HttpStatus.OK).body(categoryPermissionTicketCreate);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateCategoryPermissionTicket(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryPermissionTicketUpdateRequest categoryPermissionTicketUpdateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryPermissionTicketUpdateRequest.getFormSecurity(),
                                "category-permission-tickets", "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryPermissionTicketUpdateRequest.getCategoryPermissionTicket() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại nguyên liệu không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryPermissionTicket categoryPermissionTicketUpdated = this.categoryPermissionTicketService
                                .getOneById(id);
                if (categoryPermissionTicketUpdated != null) {
                        categoryPermissionTicketUpdated
                                        .setName(categoryPermissionTicketUpdateRequest.getCategoryPermissionTicket()
                                                        .getName());
                        categoryPermissionTicketUpdated
                                        .setDescription(categoryPermissionTicketUpdateRequest
                                                        .getCategoryPermissionTicket()
                                                        .getDescription());
                        // categoryPermissionTicketUpdated.setUpdateAt(this.timeService.getDateTimeVN(categoryPermissionTicketUpdateRequest.getCategoryPermissionTicket().getUpdateAt()));
                        categoryPermissionTicketUpdated.setUpdateAt(categoryPermissionTicketUpdateRequest
                                        .getCategoryPermissionTicket().getUpdateAt());

                        this.categoryPermissionTicketService.upsert(categoryPermissionTicketUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryPermissionTicketUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockCategoryPermissionTicket(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryPermissionTicketLockRequest categoryPermissionTicketLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryPermissionTicketLockRequest.getFormSecurity(),
                                "category-permission-tickets",
                                "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryPermissionTicketLockRequest.getCategoryPermissionTicket() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại nguyên liệu không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                List<PermissionTicket> categoryPermissionTicketListIsUsing = permissionTicketService
                                .getAllByCategoryPermissionTicketId(id);
                if (categoryPermissionTicketListIsUsing != null &&
                                !categoryPermissionTicketListIsUsing.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                        "Loại đơn xin phép này đang được ít nhất 1 đơn xin phép sử dụng!"));
                }

                CommonStatusEnum handleStatus = categoryPermissionTicketLockRequest.getCategoryPermissionTicket()
                                .getStatus() == CommonStatusEnum.ACTIVE
                                                ? CommonStatusEnum.INACTIVE
                                                : CommonStatusEnum.ACTIVE;
                // LocalDateTime handleUpdateAt = this.serviceAt
                // .getDateTimeVN(categoryPermissionTicketLockRequest.getCategoryPermissionTicket().getUpdateAt());
                // LocalDateTime handleUpdateAt =
                // this.timeService.getDateTimeVN(LocalDateTime.now());

                CategoryPermissionTicket categoryPermissionTicketLocked = this.categoryPermissionTicketService
                                .getOneById(id);
                if (categoryPermissionTicketLocked != null) {
                        categoryPermissionTicketLocked.setStatus(handleStatus);
                        // categoryPermissionTicketLocked.setUpdateAt(handleUpdateAt);

                        this.categoryPermissionTicketService.lock(categoryPermissionTicketLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryPermissionTicketLocked);
        }
}
