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
import vn.tuhoc.vinaeatery.domain.criteria.CustomerCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.CustomerDTO;
import vn.tuhoc.vinaeatery.domain.dto.CustomerUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.Customer;
import vn.tuhoc.vinaeatery.domain.entity.User;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;
import vn.tuhoc.vinaeatery.service.CloudinaryService;
import vn.tuhoc.vinaeatery.service.CustomerService;
import vn.tuhoc.vinaeatery.service.UserService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerApiController {
        // Properties
        private final UserService userService;
        private final CustomerService customerService;
        private final CloudinaryService cloudinaryService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listCustomer(@RequestBody FormSecurityDTO formSecurityDTO,
                        CustomerCriteria customerCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<Customer> listCustomer = this.customerService.getAll(customerCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listCustomer);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listCustomerFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        CustomerCriteria customerCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<CustomerDTO> listCustomer = this.customerService.getAllFormat(customerCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listCustomer);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailCustomer(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                Customer customerSelected = this.customerService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(customerSelected);
        }

        @PostMapping("/detail-by-user-id/{id}")
        public ResponseEntity<?> detailCustomerByUserId(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer userId) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                CustomerDTO customerSelected = this.customerService.getOneByUserId(userId);
                return ResponseEntity.status(HttpStatus.OK).body(customerSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleCreateCustomer(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("customer") @Valid Customer customer,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        BindingResult bindingResult) throws IOException {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers",
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
                customer.setImage(image);

                Customer customerCreated = this.customerService.upsert(customer);
                if (customerCreated != null) {
                        User userUpdated = this.userService.getOneById(customerCreated.getUserId());
                        userUpdated.setIsUsing(UserIsUsingEnum.USING);
                        this.userService.upsert(userUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(customerCreated);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleUpdateManager(@PathVariable("id") Integer id,
                        @RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @RequestPart("customer") @Valid CustomerUpdateDTO customer,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        BindingResult bindingResult) throws IOException {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers",
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
                customer.setImage(image);

                Customer customerUpdated = this.customerService.getOneById(id);
                if (customerUpdated != null) {
                        User userOld = this.userService.getOneById(customerUpdated.getUserId());
                        userOld.setIsUsing(UserIsUsingEnum.NOTUSING);
                        this.userService.upsert(userOld);

                        customerUpdated.setUserId(customer.getUserId());
                        if (customerUpdated.getImage() == null || customer.getImage() != null) {
                                customerUpdated.setImage(customer.getImage());
                        }
                        customerUpdated.setFullname(customer.getFullname());
                        customerUpdated.setBirthday(customer.getBirthday());
                        customerUpdated.setGender(customer.getGender());
                        customerUpdated.setPhone(customer.getPhone());
                        customerUpdated.setEmail(customer.getEmail());
                        customerUpdated.setAddress(customer.getAddress());
                        customerUpdated.setDescription(customer.getDescription());
                        Customer customerUpdatedResult = this.customerService.upsert(customerUpdated);

                        User userNew = this.userService.getOneById(customerUpdatedResult.getUserId());
                        userNew.setIsUsing(UserIsUsingEnum.USING);
                        this.userService.upsert(userNew);
                }

                return ResponseEntity.status(HttpStatus.OK).body(customerUpdated);
        }

        // @PatchMapping(value = "/lock/{id}", consumes =
        // MediaType.APPLICATION_JSON_VALUE)
        // public ResponseEntity<?> handleLockCustomer(@PathVariable("id") Integer id,
        // @RequestBody @Valid CustomerLockRequest customerLockRequest,
        // BindingResult bindingResult) {
        // if
        // (!HandleFormSecurity.isValidFormData(customerLockRequest.getFormSecurity(),
        // "customers", "lock")) {
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        // .body(ValidationUtil
        // .buildRestResponseWithStr(HandleFormSecurity
        // .getErrorMessageByHandleFormData()));
        // }

        // if (customerLockRequest.getCustomer() == null) {
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        // .body(ValidationUtil
        // .buildRestResponseWithStr(
        // "Dữ liệu khách hàng không được để trống!"));
        // }

        // if (bindingResult.hasErrors()) {
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        // .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        // }

        // UseTable useTable = useTableService.getNewOneByCustomerId(id);
        // if (useTable != null) {
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        // .body(ValidationUtil
        // .buildRestResponseWithStr(String.format(
        // "Khách hàng này đang sử dụng bàn ăn %s!",
        // tableService.getOneById(useTable.getTableId())
        // .getName())));
        // }

        // CommonStatusEnum handleStatus = customerLockRequest.getCustomer().getStatus()
        // == CommonStatusEnum.ACTIVE
        // ? CommonStatusEnum.INACTIVE
        // : CommonStatusEnum.ACTIVE;
        // // LocalDateTime handleUpdateAt =
        // //
        // this.timeService.getDateTimeVN(customerLockRequest.getCustomer().getUpdateAt());
        // // LocalDateTime handleUpdateAt =
        // // this.timeService.getDateTimeVN(LocalDateTime.now());

        // Customer customerLocked = this.customerService.getOneById(id);
        // if (customerLocked != null) {
        // customerLocked.setStatus(handleStatus);
        // //
        // customerLocked.setUpdateAt(customerLockRequest.getCustomer().getUpdateAt());

        // this.customerService.lock(customerLocked);
        // }

        // return ResponseEntity.status(HttpStatus.OK).body(customerLocked);
        // }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> handleLockManager(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id,
                        @RequestPart("customer") @Valid CommonStatusUpdateDTO commonStatusUpdate,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers", "lock")) {
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

                Customer customerLocked = this.customerService.getOneById(id);
                if (customerLocked != null) {
                        customerLocked.setStatus(handleStatus);

                        this.customerService.lock(customerLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(customerLocked);
        }
}