package vn.tuhoc.vinaeatery.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.EmployeeCriteria;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeChangePasswordDTO;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeDTO;
import vn.tuhoc.vinaeatery.domain.dto.EmployeeUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Employee;
import vn.tuhoc.vinaeatery.domain.entity.RoleHistory;
import vn.tuhoc.vinaeatery.domain.entity.RoleHistoryId;
import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
// import vn.tuhoc.vinaeatery.domain.dto.EmployeeUpdateFromClientDTO;
import vn.tuhoc.vinaeatery.domain.enumm.EmployeeStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserMethodEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserRoleEnum;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UserService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;
import vn.tuhoc.vinaeatery.service.CloudinaryService;
import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.RoleHistoryService;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeApiController {
        // Properties
        private final UserService userService;
        private final RoleHistoryService roleHistoryService;
        private final EmployeeService employeeService;
        private final CloudinaryService cloudinaryService;
        private final PasswordEncoder passwordEncoder;
        private final TimeService timeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listEmployee(@RequestBody FormSecurityDTO formSecurityDTO,
                        EmployeeCriteria employeeCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "employees", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<Employee> listEmployee = this.employeeService.getAll(employeeCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listEmployee);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listEmployeeFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        EmployeeCriteria employeeCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "employees", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<EmployeeDTO> listEmployee = this.employeeService.getAllFormat(employeeCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listEmployee);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailEmployee(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "employees", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Employee employeeSelected = this.employeeService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(employeeSelected);
        }

        @PostMapping("/detail-by-user-id/{id}")
        public ResponseEntity<?> detailEmployeeByUserId(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer userId) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "employees", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                EmployeeDTO employeeSelected = this.employeeService.getOneByUserId(userId);
                return ResponseEntity.status(HttpStatus.OK).body(employeeSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleCreateEmployee(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("employee") @Valid Employee employee,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        BindingResult bindingResult) throws IOException {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "employees",
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

                // Nếu tên tài khoản đã tồn tại thì báo lỗi
                User userExistsByUsername = userService.getOneByUsername(employee.getPassword());
                if (userExistsByUsername != null && userExistsByUsername.getId() > 0) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr("Tên tài khoản đã tồn tại!"));
                }

                // Tạo tài khoản mới
                String hashPassword = this.passwordEncoder.encode(employee.getPassword());
                User newUser = new User();
                newUser.setCreateAt(employee.getCreateAt());
                newUser.setRole(UserRoleEnum.EMPLOYEE);
                newUser.setUsername(employee.getUsername());
                newUser.setPassword(hashPassword);
                newUser.setMethod(UserMethodEnum.HANDMADE);
                newUser.setIsUsing(UserIsUsingEnum.USING);
                newUser.setStatus(CommonStatusEnum.ACTIVE);
                User handleCreateNewUser = this.userService.upsert(newUser);

                Employee employeeCreated = null;
                if (handleCreateNewUser != null) {
                        // Cập nhật mã tài khoản
                        employee.setUserId(handleCreateNewUser.getId());

                        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
                        String image = null;
                        if (imageFile != null && !imageFile.isEmpty()) {
                                image = this.cloudinaryService.uploadImage(imageFile);
                        }
                        employee.setImage(image);

                        //
                        employeeCreated = this.employeeService.upsert(employee);
                        if (employeeCreated != null) {
                                roleHistoryService.upsert(new RoleHistory(
                                                new RoleHistoryId(employeeCreated.getId(), employee.getRoleId(),
                                                                this.timeService
                                                                                .getDateTimeVN(LocalDateTime.now())
                                                                                .format(DateTimeFormatter
                                                                                                .ofPattern("yyyy-MM-dd"))),
                                                null));
                        }
                }

                return ResponseEntity.status(HttpStatus.OK).body(employeeCreated);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleUpdateEmployee(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id,
                        @RequestPart("employee") @Valid EmployeeUpdateDTO employee,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        BindingResult bindingResult) throws IOException {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "employees",
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

                // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
                String image = null;
                if (imageFile != null && !imageFile.isEmpty()) {
                        image = this.cloudinaryService.uploadImage(imageFile);
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
                        employeeUpdate.setPermissionId(employee.getPermissionId());
                        employeeUpdate.setUpdateAt(employee.getUpdateAt());

                        RoleHistory currentRoleHistory = roleHistoryService.getNewByEmployeeId(id);
                        if (currentRoleHistory != null
                                        && currentRoleHistory.getId().getRoleId() != employee.getRoleId()) {
                                if (this.timeService
                                                .getDateTimeVN(LocalDateTime.now())
                                                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                                                .compareTo(currentRoleHistory.getId().getDateStart()) < 0) {
                                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                        .body(ValidationUtil.buildRestResponseWithStr(
                                                                        "Hôm sau mới được thay đổi chức vụ!"));
                                }

                                currentRoleHistory.setDateEnd(this.timeService
                                                .getDateTimeVN(LocalDateTime.now())
                                                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
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

        @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleLockEmployee(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id,
                        @RequestPart("employee") @Valid EmployeeStatusUpdateDTO employeeStatusUpdate,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "employees", "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                EmployeeStatusEnum handleStatus = employeeStatusUpdate.getStatus() == EmployeeStatusEnum.ACTIVE
                                ? EmployeeStatusEnum.INACTIVE
                                : EmployeeStatusEnum.ACTIVE;
                // LocalDateTime handleUpdateAt =
                // this.timeService.getDateTimeVN(employeeStatusUpdate.getUpdateAt());

                Employee employeeLocked = this.employeeService.getOneById(id);
                if (employeeLocked != null) {
                        employeeLocked.setStatus(handleStatus);
                        // employeeLocked.setUpdateAt(employeeStatusUpdate.getUpdateAt());
                        this.employeeService.upsert(employeeLocked);
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
        // Employee.setUpdateAt(this.timeService.getTimeVN(Employee.getUpdateAt()));

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
        // EmployeeUpdate.setUpdateAt(Employee.getUpdateAt());
        // this.employeeService.upsertEmployee(EmployeeUpdate);
        // }

        // return ResponseEntity.status(HttpStatus.CREATED).body(EmployeeUpdate);
        // }

        // @PutMapping(value = "/change-password/{id}", consumes =
        // MediaType.MULTIPART_FORM_DATA_VALUE)
        // public ResponseEntity<?> handleChangeEmployeePassword(
        // @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
        // @PathVariable("id") Integer id,
        // @RequestPart("employee") @Valid EmployeeChangePasswordDTO
        // employeeChangePassword,
        // BindingResult bindingResult) {
        // if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "employees",
        // "change-password")) {
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        // .body(ValidationUtil
        // .buildRestResponseWithStr(HandleFormSecurity
        // .getErrorMessageByHandleFormData()));
        // }

        // if (bindingResult.hasErrors()) {
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        // .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        // }

        // Employee employeeUpdatePassword = this.employeeService.getOneById(id);
        // if (employeeUpdatePassword != null) {
        // if
        // (!this.passwordEncoder.matches(employeeChangePassword.getCurrentPassword(),
        // employeeUpdatePassword.getPassword())) {
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        // .body(ValidationUtil.buildRestResponseWithStr(
        // "Mật khẩu hiện tại không đúng!"));
        // }
        // if (!employeeChangePassword.getNewPassword()
        // .equals(employeeChangePassword.getAuthNewPassword())) {
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        // .body(ValidationUtil.buildRestResponseWithStr(
        // "Xác nhận mật khẩu mới không đúng!"));
        // }

        // employeeUpdatePassword.setPassword(
        // this.passwordEncoder.encode(employeeChangePassword.getNewPassword()));
        // employeeUpdatePassword
        // .setUpdateAt(this.timeService
        // .getDateTimeVN(employeeChangePassword.getUpdateAt()));
        // //
        // employeeUpdatePassword.setUpdateAt(this.timeService.getDateTimeVN(LocalDateTime.now()));
        // this.employeeService.upsert(employeeUpdatePassword);
        // }

        // return ResponseEntity.status(HttpStatus.OK).body(employeeUpdatePassword);
        // }
}