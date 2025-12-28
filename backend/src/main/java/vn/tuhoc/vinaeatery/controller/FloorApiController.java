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
import vn.tuhoc.vinaeatery.domain.criteria.FloorCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Floor;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.FloorCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.FloorLockRequest;
import vn.tuhoc.vinaeatery.domain.request.FloorUpdateRequest;
import vn.tuhoc.vinaeatery.service.FloorService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/floors")
@RequiredArgsConstructor
public class FloorApiController {
        // Properties
        private final FloorService floorService;
        private final TimeService timeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listFloor(@RequestBody FormSecurityDTO formSecurityDTO,
                        FloorCriteria floorCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "floors", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<Floor> listFloor = this.floorService
                                .getAll(floorCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listFloor);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailFloor(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "floors", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Floor floorSelected = this.floorService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(floorSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateFloor(@RequestBody @Valid FloorCreateRequest floorCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(floorCreateRequest.getFormSecurity(), "floors", "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (floorCreateRequest.getFloor() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu tầng không được để trống !"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                Floor floorCreate = this.floorService.upsert(floorCreateRequest.getFloor());
                return ResponseEntity.status(HttpStatus.OK).body(floorCreate);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateFloor(@PathVariable("id") Integer id,
                        @RequestBody @Valid FloorUpdateRequest floorUpdateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(floorUpdateRequest.getFormSecurity(), "floors", "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (floorUpdateRequest.getFloor() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu tầng không được để trống !"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                Floor floorUpdated = this.floorService.getOneById(id);
                if (floorUpdated != null) {
                        floorUpdated.setName(floorUpdateRequest.getFloor().getName());
                        floorUpdated.setDescription(floorUpdateRequest.getFloor().getDescription());
                        // floorUpdated.setUpdateAt(this.timeService.getDateTimeVN(floorUpdateRequest.getFloor().getUpdateAt()));
                        floorUpdated.setUpdateAt(this.timeService.getDateTimeVN(LocalDateTime.now()));
                        this.floorService.upsert(floorUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(floorUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockFloor(@PathVariable("id") Integer id,
                        @RequestBody @Valid FloorLockRequest floorLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(floorLockRequest.getFormSecurity(), "floors", "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (floorLockRequest.getFloor() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu tầng không được để trống !"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                if (floorService.isUsingByOneTable(id)) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Tầng này đang được ít nhất 1 bàn sử dụng sử dụng !"));
                }

                CommonStatusEnum handleStatus = floorLockRequest.getFloor().getStatus() == CommonStatusEnum.ACTIVE
                                ? CommonStatusEnum.INACTIVE
                                : CommonStatusEnum.ACTIVE;
                // LocalDateTime handleUpdateAt =
                // this.timeService.getDateTimeVN(floorLockRequest.getFloor().getUpdateAt());
                LocalDateTime handleUpdateAt = this.timeService.getDateTimeVN(LocalDateTime.now());

                Floor floorLocked = this.floorService.getOneById(id);
                if (floorLocked != null) {
                        floorLocked.setStatus(handleStatus);
                        floorLocked.setUpdateAt(handleUpdateAt);
                        this.floorService.lock(floorLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(floorLocked);
        }
}