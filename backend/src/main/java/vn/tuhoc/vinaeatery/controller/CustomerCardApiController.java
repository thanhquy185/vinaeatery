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
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.CustomerCard;
import vn.tuhoc.vinaeatery.domain.criteria.CustomerCardCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.CustomerCardUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.CustomerCardService;
import vn.tuhoc.vinaeatery.service.CustomerService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UploadService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/customer-cards")
@AllArgsConstructor
public class CustomerCardApiController {
    // Properties
    private final CustomerCardService customerCardService;
    private final CustomerService customerService;
    private final TimeService timeService;
    private final UploadService uploadService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listCustomerCard(@RequestBody FormSecurityDTO formSecurityDTO,
            CustomerCardCriteria customerCardCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customer-cards", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<CustomerCard> listCustomerCard = this.customerCardService.getAll(customerCardCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listCustomerCard);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailCustomerCard(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customer-cards", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        CustomerCard customerCardSelected = this.customerCardService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(customerCardSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateCustomerCard(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("customer-card") @Valid CustomerCard customerCard,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customer-cards", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.uploadService.uploadImageFiles(imageFile, "customer-cards",
                    String.valueOf(this.customerCardService.getLastOne().getId() + 1));
        }
        customerCard.setImage(image);

        CustomerCard customerCardCreate = this.customerCardService.upsert(customerCard);
        return ResponseEntity.status(HttpStatus.OK).body(customerCardCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateCustomerCard(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("customer-card") @Valid CustomerCardUpdateDTO customerCard,
            @RequestPart(value = "image-file", required = false) MultipartFile imageFile, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customer-cards", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật file ảnh vào source code và lấy ra tên file để lưu vào csdl
        String image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            image = this.uploadService.uploadImageFiles(imageFile, "customer-cards", String.valueOf(id));
        }
        customerCard.setImage(image);

        CustomerCard customerCardUpdated = this.customerCardService.getOneById(id);
        if (customerCardUpdated != null) {
            if (customerCardUpdated.getImage() == null || customerCard.getImage() != null) {
                customerCardUpdated.setImage(customerCard.getImage());
            }
            customerCardUpdated.setName(customerCard.getName());
            customerCardUpdated.setThreshold(customerCard.getThreshold());
            customerCardUpdated.setDiscount(customerCard.getDiscount());
            customerCardUpdated.setDescription(customerCard.getDescription());
            customerCardUpdated.setTimeUpdate(this.timeService.getDateTimeVN(customerCard.getTimeUpdate()));
            this.customerCardService.upsert(customerCardUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(customerCardUpdated);
    }

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockCustomerCard(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("customer-card") @Valid CommonStatusUpdateDTO commonStatusUpdate,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "customer-cards", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        if (customerService.getAllByCustomerCardId(id) != null
                && !customerService.getAllByCustomerCardId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Thẻ khách hàng này đang được ít nhất 1 khách hàng sử dụng !"));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        CustomerCard customerCardLocked = this.customerCardService.getOneById(id);
        if (customerCardLocked != null) {
            customerCardLocked.setStatus(handleStatus);
            customerCardLocked.setTimeUpdate(handleTimeUpdate);
            this.customerCardService.lock(customerCardLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(customerCardLocked);
    }
}