package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Customer;
import vn.tuhoc.vinaeatery.domain.UseTable;
import vn.tuhoc.vinaeatery.domain.criteria.CustomerCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.CustomerDTO;
import vn.tuhoc.vinaeatery.domain.dto.CustomerUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.CustomerService;
import vn.tuhoc.vinaeatery.service.TableService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UseTableService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/customers")
@AllArgsConstructor
public class CustomerApiController {
    // Properties
    private final UseTableService useTableService;
    private final CustomerService customerService;
    private final TableService tableService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listCustomer(@RequestBody FormSecurityDTO formSecurityDTO,
            CustomerCriteria customerCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
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
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
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
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Customer customerSelected = this.customerService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(customerSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateCustomer(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("customer") @Valid Customer customer, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Customer customerCreate = this.customerService.upsert(customer);
        return ResponseEntity.status(HttpStatus.OK).body(customerCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateCustomer(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("customer") @Valid CustomerUpdateDTO customer,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Customer customerUpdated = this.customerService.getOneById(id);
        if (customerUpdated != null) {
            customerUpdated.setCustomerCardId(customer.getCustomerCardId());
            customerUpdated.setFullname(customer.getFullname());
            customerUpdated.setBirthday(customer.getBirthday());
            customerUpdated.setGender(customer.getGender());
            customerUpdated.setPhone(customer.getPhone());
            customerUpdated.setEmail(customer.getEmail());
            customerUpdated.setAddress(customer.getAddress());
            customerUpdated.setDescription(customer.getDescription());
            customerUpdated.setTimeUpdate(this.timeService.getDateTimeVN(customer.getTimeUpdate()));
            this.customerService.upsert(customerUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(customerUpdated);
    }

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockCustomer(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("customer") @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customers", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        UseTable useTable = useTableService.getNewOneByCustomerId(id);
        if (useTable != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(String.format("Khách hàng này đang sử dụng bàn ăn %s !",
                                    tableService.getOneById(useTable.getTableId()).getName())));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        Customer customerLocked = this.customerService.getOneById(id);
        if (customerLocked != null) {
            customerLocked.setStatus(handleStatus);
            customerLocked.setTimeUpdate(handleTimeUpdate);
            this.customerService.lock(customerLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(customerLocked);
    }
}