package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.ShiftCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.ShiftDTO;
import vn.tuhoc.vinaeatery.domain.dto.ShiftUpdateDTO;
import vn.tuhoc.vinaeatery.domain.entity.Shift;
import vn.tuhoc.vinaeatery.domain.entity.ShiftDetail;
import vn.tuhoc.vinaeatery.domain.entity.ShiftDetailForCrud;
import vn.tuhoc.vinaeatery.domain.entity.ShiftDetailId;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.ShiftDetailService;
import vn.tuhoc.vinaeatery.service.ShiftService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
public class ShiftApiController {
    // Properties
    private final ShiftService shiftService;
    private final ShiftDetailService shiftDetailService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listShift(@RequestBody FormSecurityDTO formSecurityDTO,
            ShiftCriteria shiftCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "shifts", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Shift> listShift = this.shiftService.getAll(shiftCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listShift);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listShiftFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            ShiftCriteria shiftCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "shifts", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<ShiftDTO> listShift = this.shiftService.getAllFormat(shiftCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listShift);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailShift(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "shifts", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Shift ShiftSelected = this.shiftService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(ShiftSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateShift(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("shift") @Valid Shift shift, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "shifts", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Shift shiftCreated = this.shiftService.upsert(shift);
        if (shiftCreated != null) {
            List<ShiftDetailForCrud> shiftDetails = shift.getShiftDetails();
            if (shiftDetails != null && !shiftDetails.isEmpty()) {
                for (ShiftDetailForCrud shiftDetailForCrud : shiftDetails) {
                    ShiftDetail newShiftDetail = new ShiftDetail(
                            new ShiftDetailId(shiftCreated.getId(), shiftDetailForCrud.getDayOfWeek(),
                                    shiftDetailForCrud.getTimeStart(), shiftDetailForCrud.getTimeEnd()));
                    this.shiftDetailService.upsert(newShiftDetail);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(shiftCreated);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateShift(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("shift") @Valid ShiftUpdateDTO shift,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "shifts", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Shift shiftUpdated = this.shiftService.getOneById(id);
        if (shiftUpdated != null) {
            shiftUpdated.setName(shift.getName());
            this.shiftService.upsert(shiftUpdated);

            this.shiftDetailService.clearAllByShiftId(shiftUpdated.getId());
            List<ShiftDetailForCrud> shiftDetails = shift.getShiftDetails();
            if (shiftDetails != null && !shiftDetails.isEmpty()) {
                for (ShiftDetailForCrud shiftDetailForCrud : shiftDetails) {
                    ShiftDetail newShiftDetail = new ShiftDetail(
                            new ShiftDetailId(shiftUpdated.getId(), shiftDetailForCrud.getDayOfWeek(),
                                    shiftDetailForCrud.getTimeStart(), shiftDetailForCrud.getTimeEnd()));
                    this.shiftDetailService.upsert(newShiftDetail);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(shiftUpdated);
    }

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockShift(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("shift") @Valid CommonStatusUpdateDTO commonStatusUpdate,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "shifts", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;

        Shift shiftLocked = this.shiftService.getOneById(id);
        if (shiftLocked != null) {
            shiftLocked.setStatus(handleStatus);

            this.shiftService.lock(shiftLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(shiftLocked);
    }
}