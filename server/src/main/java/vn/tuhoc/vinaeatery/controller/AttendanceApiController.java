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
import vn.tuhoc.vinaeatery.domain.criteria.AttendanceCriteria;
import vn.tuhoc.vinaeatery.domain.dto.AttendanceDTO;
import vn.tuhoc.vinaeatery.domain.dto.AttendanceUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Attendance;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;
import vn.tuhoc.vinaeatery.service.AttendanceService;

@RestController
@RequestMapping("/api/attendances")
@RequiredArgsConstructor
public class AttendanceApiController {
        // Properties
        private final AttendanceService attendanceService;
        private final TimeService timeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listAttendance(@RequestBody FormSecurityDTO formSecurityDTO,
                        AttendanceCriteria attendanceCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "attendances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<Attendance> listAttendance = this.attendanceService.getAll(attendanceCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listAttendance);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listAttendanceFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        AttendanceCriteria attendanceCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "attendances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<AttendanceDTO> listAttendance = this.attendanceService.getAllFormat(attendanceCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listAttendance);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailAttendance(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "attendances", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Attendance attendanceSelected = this.attendanceService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(attendanceSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleCreateAttendance(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("attendance") @Valid Attendance attendance,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "attendances",
                                "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                // Nếu thông tin không hợp lệ thì báo lỗi
                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                Attendance attendanceCreated = this.attendanceService.upsert(attendance);

                return ResponseEntity.status(HttpStatus.OK).body(attendanceCreated);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleUpdateAttendance(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id,
                        @RequestPart("attendance") @Valid AttendanceUpdateDTO attendance,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "attendances",
                                "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                // Nếu thông tin không hợp lệ thì báo lỗi
                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                // Cập nhật lại dữ liệu
                Attendance attendanceUpdate = this.attendanceService.getOneById(id);
                if (attendanceUpdate != null) {
                        attendanceUpdate.setCheckIn(attendance.getCheckIn());
                        attendanceUpdate.setCheckOut(attendance.getCheckOut());
                        attendanceUpdate.setLeave(attendance.getLeave());
                        attendanceUpdate.setStatus(attendance.getStatus());
                        // attendanceUpdate.setUpdateAt(attendance.getUpdateAt());

                        this.attendanceService.upsert(attendanceUpdate);
                }

                return ResponseEntity.status(HttpStatus.OK).body(attendanceUpdate);
        }
}