package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Customer;
import vn.tuhoc.vinaeatery.domain.criteria.CustomerCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.CustomerDTO;
import vn.tuhoc.vinaeatery.domain.dto.CustomerUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.CustomerService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/customers")
@AllArgsConstructor
public class CustomerApiController {
    // Properties
    private final CustomerService customerService;
    private final TimeService timeService;

    // Methods
    @GetMapping("/list")
    public ResponseEntity<List<?>> listCustomer(CustomerCriteria customerCriteria) {
        List<Customer> listCustomer = this.customerService.getAll(customerCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listCustomer);
    }

    @GetMapping("/list-format")
    public ResponseEntity<List<?>> listCustomerFormat(CustomerCriteria customerCriteria) {
        List<CustomerDTO> listCustomer = this.customerService.getAllFormat(customerCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listCustomer);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> handleDetailCustomer(@PathVariable("id") Integer id) {
        Customer customerSelected = this.customerService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(customerSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateCustomer(@RequestBody @Valid Customer customer, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        Customer customerCreate = this.customerService.upsert(customer);
        return ResponseEntity.status(HttpStatus.OK).body(customerCreate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateCustomer(@PathVariable("id") Integer id,
            @RequestBody @Valid CustomerUpdateDTO customer,
            BindingResult bindingResult) {
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

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLockCustomer(@PathVariable("id") Integer id,
            @RequestBody @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
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