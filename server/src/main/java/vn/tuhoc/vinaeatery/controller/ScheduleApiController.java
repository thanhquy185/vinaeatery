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
import vn.tuhoc.vinaeatery.domain.criteria.ScheduleCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.ScheduleDTO;
import vn.tuhoc.vinaeatery.domain.dto.ScheduleUpdateDTO;
import vn.tuhoc.vinaeatery.domain.entity.Schedule;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployee;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployeeForCrud;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployeeId;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShift;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShiftForCrud;
import vn.tuhoc.vinaeatery.domain.entity.ScheduleShiftId;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.ScheduleEmployeeService;
import vn.tuhoc.vinaeatery.service.ScheduleService;
import vn.tuhoc.vinaeatery.service.ScheduleShiftService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleApiController {
    // Properties
    private final ScheduleService scheduleService;
    private final ScheduleEmployeeService scheduleEmployeeService;
    private final ScheduleShiftService scheduleShiftService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listSchedule(@RequestBody FormSecurityDTO formSecurityDTO,
            ScheduleCriteria scheduleCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "schedules", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Schedule> listSchedule = this.scheduleService.getAll(scheduleCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listSchedule);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listScheduleFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            ScheduleCriteria scheduleCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "schedules", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<ScheduleDTO> listSchedule = this.scheduleService.getAllFormat(scheduleCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listSchedule);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailSchedule(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "schedules", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Schedule scheduleSelected = this.scheduleService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(scheduleSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateSchedule(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("schedule") @Valid Schedule schedule, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "schedules", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Schedule scheduleCreated = this.scheduleService.upsert(schedule);
        if (scheduleCreated != null) {
            List<ScheduleEmployeeForCrud> scheduleEmployees = schedule.getScheduleEmployees();
            if (scheduleEmployees != null && !scheduleEmployees.isEmpty()) {
                for (ScheduleEmployeeForCrud scheduleEmployeeForCrud : scheduleEmployees) {
                    ScheduleEmployee newScheduleEmployee = new ScheduleEmployee(
                            new ScheduleEmployeeId(scheduleCreated.getId(), scheduleEmployeeForCrud.getEmployeeId()));
                    this.scheduleEmployeeService.upsert(newScheduleEmployee);
                }
            }

            List<ScheduleShiftForCrud> scheduleShifts = schedule.getScheduleShifts();
            if (scheduleShifts != null && !scheduleShifts.isEmpty()) {
                for (ScheduleShiftForCrud scheduleShiftForCrud : scheduleShifts) {
                    ScheduleShift newScheduleShift = new ScheduleShift(
                            new ScheduleShiftId(scheduleCreated.getId(), scheduleShiftForCrud.getShiftId()));
                    this.scheduleShiftService.upsert(newScheduleShift);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(scheduleCreated);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateSchedule(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("schedule") @Valid ScheduleUpdateDTO schedule,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "schedules", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Schedule scheduleUpdated = this.scheduleService.getOneById(id);
        if (scheduleUpdated != null) {
            scheduleUpdated.setName(schedule.getName());
            scheduleUpdated.setDateStart(schedule.getDateStart());
            scheduleUpdated.setDateEnd(schedule.getDateEnd());
            scheduleUpdated.setNote(schedule.getNote());
            this.scheduleService.upsert(scheduleUpdated);

            this.scheduleEmployeeService.clearAllByScheduleId(scheduleUpdated.getId());
            List<ScheduleEmployeeForCrud> scheduleEmployees = schedule.getScheduleEmployees();
            if (scheduleEmployees != null && !scheduleEmployees.isEmpty()) {
                for (ScheduleEmployeeForCrud scheduleEmployeeForCrud : scheduleEmployees) {
                    ScheduleEmployee newScheduleEmployee = new ScheduleEmployee(
                            new ScheduleEmployeeId(scheduleUpdated.getId(),
                                    scheduleEmployeeForCrud.getEmployeeId()));
                    this.scheduleEmployeeService.upsert(newScheduleEmployee);
                }
            }

            this.scheduleShiftService.clearAllByScheduleId(scheduleUpdated.getId());
            List<ScheduleShiftForCrud> scheduleShifts = schedule.getScheduleShifts();
            if (scheduleShifts != null && !scheduleShifts.isEmpty()) {
                for (ScheduleShiftForCrud scheduleShiftForCrud : scheduleShifts) {
                    ScheduleShift newScheduleShift = new ScheduleShift(
                            new ScheduleShiftId(scheduleUpdated.getId(),
                                    scheduleShiftForCrud.getShiftId()));
                    this.scheduleShiftService.upsert(newScheduleShift);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(scheduleUpdated);
    }

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockSchedule(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("schedule") @Valid CommonStatusUpdateDTO commonStatusUpdate,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "schedules", "lock")) {
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

        Schedule scheduleLocked = this.scheduleService.getOneById(id);
        if (scheduleLocked != null) {
            scheduleLocked.setStatus(handleStatus);

            this.scheduleService.lock(scheduleLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(scheduleLocked);
    }
}