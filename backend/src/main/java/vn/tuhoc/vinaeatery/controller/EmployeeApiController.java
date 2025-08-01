package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Employee;
import vn.tuhoc.vinaeatery.domain.RoleHistory;
import vn.tuhoc.vinaeatery.domain.RoleHistoryId;
import vn.tuhoc.vinaeatery.domain.criteria.EmployeeCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeChangePasswordDTO;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeDTO;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormGetDataDTO;
// import vn.tuhoc.vinaeatery.domain.dto.EmployeeUpdateFromClientDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UploadService;
import vn.tuhoc.vinaeatery.util.HandleFormGetData;
import vn.tuhoc.vinaeatery.util.ValidationUtil;
import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.RoleHistoryService;

@RestController
@RequestMapping("/api/employees")
@AllArgsConstructor
public class EmployeeApiController {
    // Properties
    private final RoleHistoryService roleHistoryService;
    private final EmployeeService employeeService;
    private final UploadService uploadService;
    private final PasswordEncoder passwordEncoder;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listEmployee(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            EmployeeCriteria employeeCriteria) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<Employee> listEmployee = this.employeeService.getAll(employeeCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listEmployee);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listEmployeeFormat(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            EmployeeCriteria employeeCriteria) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<EmployeeDTO> listEmployee = this.employeeService.getAllFormat(employeeCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listEmployee);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailEmployee(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        Employee employeeSelected = this.employeeService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(employeeSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateEmployee(@RequestPart("employee") @Valid Employee employee,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile, BindingResult bindingResult) {
        // Nếu thông tin không hợp lệ thì báo lỗi
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.uploadService.uploadImageFiles(imageFile, "employees",
                    String.valueOf(this.employeeService.getLastOne().getId() + 1));
        }
        employee.setImage(image);

        // Mã hoá mật khẩu
        String hashPassword = this.passwordEncoder.encode(employee.getPassword());
        employee.setPassword(hashPassword);

        //
        Employee employeeCreated = this.employeeService.upsert(employee);
        if (employeeCreated != null) {
            roleHistoryService.upsert(new RoleHistory(
                    new RoleHistoryId(employeeCreated.getId(), employee.getRoleId(), this.timeService
                            .getDateTimeVN(LocalDateTime.now()).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))),
                    null));
        }

        return ResponseEntity.status(HttpStatus.OK).body(employeeCreated);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateEmployee(@PathVariable("id") Integer id,
            @RequestPart("employee") @Valid EmployeeUpdateDTO employee,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile, BindingResult bindingResult) {
        // Nếu thông tin không hợp lệ thì báo lỗi
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.uploadService.uploadImageFiles(imageFile, "employees", String.valueOf(id));
        }
        employee.setImage(image);

        // Cập nhật lại dữ liệu
        Employee employeeUpdate = this.employeeService.getOneById(id);
        if (employeeUpdate != null) {
            if (employeeUpdate.getImage() == null || employee.getImage() != null) {
                employeeUpdate.setImage(employee.getImage());
            }
            employeeUpdate.setFullname(employee.getFullname());
            employeeUpdate.setBirthday(employee.getBirthday());
            employeeUpdate.setGender(employee.getGender());
            employeeUpdate.setPhone(employee.getPhone());
            employeeUpdate.setEmail(employee.getEmail());
            employeeUpdate.setAddress(employee.getAddress());
            employeeUpdate.setDateBegin(employee.getDateBegin());
            employeeUpdate.setDateEnd(employee.getDateEnd());
            employeeUpdate.setTimeUpdate(this.timeService.getDateTimeVN(employee.getTimeUpdate()));

            RoleHistory currentRoleHistory = roleHistoryService.getNewByEmployeeId(id);
            if (currentRoleHistory != null
                    && currentRoleHistory.getId().getRoleId() != employee.getRoleId()) {
                if (this.timeService
                        .getDateTimeVN(LocalDateTime.now()).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                        .compareTo(currentRoleHistory.getId().getDateBegin()) < 0) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ValidationUtil.buildRestResponseWithStr("Hôm sau mới được thay đổi chức vụ !"));
                }

                currentRoleHistory.setDateEnd(this.timeService
                        .getDateTimeVN(LocalDateTime.now()).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                this.roleHistoryService.upsert(currentRoleHistory);

                RoleHistory newRoleHistory = new RoleHistory(
                        new RoleHistoryId(id, employee.getRoleId(), this.timeService
                                .getDateTimeVN(LocalDateTime.now().plusDays(1))
                                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))),
                        null);
                this.roleHistoryService.upsert(newRoleHistory);
            }

            this.employeeService.upsert(employeeUpdate);
        }

        return ResponseEntity.status(HttpStatus.OK).body(employeeUpdate);
    }

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLock(@PathVariable("id") Integer id,
            @RequestBody @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        Employee employeeLocked = this.employeeService.getOneById(id);
        if (employeeLocked != null) {
            employeeLocked.setStatus(handleStatus);
            employeeLocked.setTimeUpdate(handleTimeUpdate);
            this.employeeService.lock(employeeLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(employeeLocked);
    }

    // @PutMapping("/update_from_client/{id}")
    // public ResponseEntity<?> handleUpdateEmployeeFromClient(@PathVariable("id")
    // Integer id,
    // @RequestPart("Employee") @Valid EmployeeUpdateFromClientDTO Employee,
    // @RequestPart(value = "file-image", required = false) MultipartFile fileImage,
    // BindingResult bindingResult) {
    // // Nếu thông tin không hợp lệ thì báo lỗi
    // if (bindingResult.hasErrors()) {
    // return
    // ResponseEntity.status(HttpStatus.BAD_REQUEST).body(bindingResult.getFieldErrors());
    // }

    // // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
    // String image = null;
    // if (fileImage != null && !fileImage.isEmpty()) {
    // image = this.uploadService.uploadImageFiles(fileImage, "Employees",
    // String.valueOf(id));
    // }
    // Employee.setImage(image);

    // // Cập nhật lại theo giờ Việt Nam
    // Employee.setTimeUpdate(this.timeService.getTimeVN(Employee.getTimeUpdate()));

    // // Cập nhật lại dữ liệu
    // Employee EmployeeUpdate = this.employeeService.getOneById(id);
    // if (EmployeeUpdate != null) {
    // if (EmployeeUpdate.getImage() == null || Employee.getImage() != null) {
    // EmployeeUpdate.setImage(Employee.getImage());
    // }
    // EmployeeUpdate.setFullname(Employee.getFullname());
    // EmployeeUpdate.setBirthday(Employee.getBirthday());
    // EmployeeUpdate.setGender(Employee.getGender());
    // EmployeeUpdate.setPhone(Employee.getPhone());
    // EmployeeUpdate.setEmail(Employee.getEmail());
    // EmployeeUpdate.setAddress(Employee.getAddress());
    // EmployeeUpdate.setTimeUpdate(Employee.getTimeUpdate());
    // this.employeeService.upsertEmployee(EmployeeUpdate);
    // }

    // return ResponseEntity.status(HttpStatus.CREATED).body(EmployeeUpdate);
    // }

    @PutMapping("change-password/{id}")
    public ResponseEntity<?> handleChangeEmployeePassword(@PathVariable("id") Integer id,
            @RequestBody @Valid EmployeeChangePasswordDTO employeeChangePassword, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Employee employeeUpdatePassword = this.employeeService.getOneById(id);
        if (employeeUpdatePassword != null) {
            if (!this.passwordEncoder.matches(employeeChangePassword.getCurrentPassword(),
                    employeeUpdatePassword.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ValidationUtil.buildRestResponseWithStr("Mật khẩu hiện tại không đúng !"));
            }
            if (!employeeChangePassword.getNewPassword().equals(employeeChangePassword.getAuthNewPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ValidationUtil.buildRestResponseWithStr("Xác nhận mật khẩu mới không đúng !"));
            }

            employeeUpdatePassword.setPassword(this.passwordEncoder.encode(employeeChangePassword.getNewPassword()));
            employeeUpdatePassword
                    .setTimeUpdate(this.timeService.getDateTimeVN(employeeChangePassword.getTimeUpdate()));
            // employeeUpdatePassword.setTimeUpdate(this.timeService.getDateTimeVN(LocalDateTime.now()));
            this.employeeService.upsert(employeeUpdatePassword);
        }

        return ResponseEntity.status(HttpStatus.OK).body(employeeUpdatePassword);
    }
}