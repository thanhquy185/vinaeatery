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
import vn.tuhoc.vinaeatery.domain.criteria.ManagerCriteria;
import vn.tuhoc.vinaeatery.domain.dto.ManagerDTO;
import vn.tuhoc.vinaeatery.domain.dto.ManagerUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Employee;
import vn.tuhoc.vinaeatery.domain.entity.Manager;
import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;
import vn.tuhoc.vinaeatery.domain.request.ManagerCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.ManagerLockRequest;
import vn.tuhoc.vinaeatery.domain.request.ManagerUpdateRequest;
import vn.tuhoc.vinaeatery.repository.RestaurantRepository;
import vn.tuhoc.vinaeatery.service.CloudinaryService;
import vn.tuhoc.vinaeatery.service.ManagerService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UserService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/managers")
@RequiredArgsConstructor
public class ManagerApiController {
        // Properties
        private final UserService userService;
        private final ManagerService managerService;
        private final TimeService timeService;
        private final CloudinaryService cloudinaryService;
        private final RestaurantRepository restaurantRepository;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listManager(@RequestBody FormSecurityDTO formSecurityDTO,
                        ManagerCriteria ManagerCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "managers", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<Manager> listManager = this.managerService.getAll(ManagerCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listManager);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listManagerFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        ManagerCriteria ManagerCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "managers", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<ManagerDTO> listManager = this.managerService.getAllFormat(ManagerCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listManager);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailManager(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "managers", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Manager ManagerSelected = this.managerService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(ManagerSelected);
        }

        @PostMapping("/detail-by-user-id/{id}")
        public ResponseEntity<?> detailManagerByUserId(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer userId) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "managers", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                ManagerDTO managerSelected = this.managerService.getOneByUserId(userId);
                return ResponseEntity.status(HttpStatus.OK).body(managerSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleCreateManager(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("manager") @Valid Manager manager,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        BindingResult bindingResult) throws IOException {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "managers",
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

                // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
                String image = null;
                if (imageFile != null && !imageFile.isEmpty()) {
                        image = this.cloudinaryService.uploadImage(imageFile);
                }
                manager.setImage(image);

                Manager managerCreated = this.managerService.upsert(manager);
                if (managerCreated != null) {
                        User userUpdated = this.userService.getOneById(managerCreated.getUserId());
                        userUpdated.setIsUsing(UserIsUsingEnum.USING);
                        this.userService.upsert(userUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(managerCreated);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleUpdateManager(@PathVariable("id") Integer id,
                        @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("manager") @Valid ManagerUpdateDTO manager,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        BindingResult bindingResult) throws IOException {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "managers",
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

                // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
                String image = null;
                if (imageFile != null && !imageFile.isEmpty()) {
                        image = this.cloudinaryService.uploadImage(imageFile);
                }
                manager.setImage(image);

                Manager managerUpdated = this.managerService.getOneById(id);
                if (managerUpdated != null) {
                        User userOld = this.userService.getOneById(managerUpdated.getUserId());
                        userOld.setIsUsing(UserIsUsingEnum.NOTUSING);
                        this.userService.upsert(userOld);

                        managerUpdated.setUserId(manager.getUserId());
                        if (managerUpdated.getImage() == null || manager.getImage() != null) {
                                managerUpdated.setImage(manager.getImage());
                        }
                        managerUpdated.setFullname(manager.getFullname());
                        managerUpdated.setBirthday(manager.getBirthday());
                        managerUpdated.setGender(manager.getGender());
                        managerUpdated.setPhone(manager.getPhone());
                        managerUpdated.setEmail(manager.getEmail());
                        managerUpdated.setAddress(manager.getAddress());
                        managerUpdated.setDescription(manager.getDescription());
                        // managerUpdated.setUpdateAt(this.timeService.getDateTimeVN(manager.getUpdateAt()));
                        managerUpdated.setUpdateAt(manager.getUpdateAt());
                        Manager managerUpdatedResult = this.managerService.upsert(managerUpdated);

                        User userNew = this.userService.getOneById(managerUpdatedResult.getUserId());
                        userNew.setIsUsing(UserIsUsingEnum.USING);
                        this.userService.upsert(userNew);
                }

                return ResponseEntity.status(HttpStatus.OK).body(managerUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleLockManager(@PathVariable("id") Integer id,
                        @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("manager") @Valid CommonStatusUpdateDTO commonStatusUpdate,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "managers", "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }
                if (this.restaurantRepository.findAllByManagerId(id) != null
                                && !this.restaurantRepository.findAllByManagerId(id).isEmpty()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Chủ nhà hàng hiện tại đang là chủ của ít nhất 1 nhà hàng !"));
                }

                CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                                ? CommonStatusEnum.INACTIVE
                                : CommonStatusEnum.ACTIVE;
                // LocalDateTime handleUpdateAt =
                // this.timeService.getDateTimeVN(ManagerLockRequest.getManager().getUpdateAt());
                // LocalDateTime handleUpdateAt =
                // this.timeService.getDateTimeVN(LocalDateTime.now());

                Manager managerLocked = this.managerService.getOneById(id);
                if (managerLocked != null) {
                        managerLocked.setStatus(handleStatus);
                        // managerLocked.setUpdateAt(ManagerLockRequest.getManager().getUpdateAt());

                        this.managerService.lock(managerLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(managerLocked);
        }
}