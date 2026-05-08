package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.UseTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseTableDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseTableUpdateDTO;
import vn.tuhoc.vinaeatery.domain.entity.HandlePayment;
import vn.tuhoc.vinaeatery.domain.entity.UseTable;
import vn.tuhoc.vinaeatery.domain.enumm.HandlePaymentStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.service.UseTableService;
import vn.tuhoc.vinaeatery.service.HandlePaymentService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/use-tables")
@RequiredArgsConstructor
public class UseTableApiController {
    // Properties
    private final UseTableService useTableService;
    private final HandlePaymentService handlePaymentService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/{restaurantId}/{tableId}")
    public ResponseEntity<?> newUseTableByTableId(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("restaurantId") Integer restaurantId, @PathVariable("tableId") Integer tableId) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        UseTableDTO useTableDTO = useTableService.getNewOneFormatByRestaurantIdAndTableId(restaurantId, tableId);
        return useTableDTO != null ? ResponseEntity.status(HttpStatus.OK).body(useTableDTO)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ValidationUtil.buildRestResponseWithStr("Bàn ăn không tồn tại trong nhà hàng!"));
    }

    @PostMapping("/list")
    public ResponseEntity<?> listUseTable(@RequestBody FormSecurityDTO formSecurityDTO,
            UseTableCriteria useTableCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<UseTable> listUseTable = this.useTableService.getAll(useTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listUseTable);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listUseTableFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            UseTableCriteria useTableCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<UseTableDTO> listUseTableFormat = this.useTableService.getAllFormat(useTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listUseTableFormat);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailUseTable(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Long id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        UseTable useTableSelected = this.useTableService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(useTableSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateUseTable(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("use-table") @Valid UseTable useTable, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        UseTable useTableCreate = this.useTableService.upsert(useTable);
        return ResponseEntity.status(HttpStatus.OK).body(useTableCreate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateUseTable(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Long id,
            @RequestPart("use-table") @Valid UseTableUpdateDTO useTable,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-tables", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        UseTable useTableUpdated = this.useTableService.getOneById(id);
        if (useTableUpdated != null) {
            useTableUpdated.setTimeEnd(this.timeService.getDateTimeVN(useTable.getTimeEnd()));
            useTableUpdated.setEmployeeId(useTable.getEmployeeId());
            // useTableUpdated.setStatus(useTable.getStatus());

            UseTable newUseTable = new UseTable();
            newUseTable.setRestaurantId(useTableUpdated.getRestaurantId());
            newUseTable.setTimeStart(LocalDateTime.now());
            newUseTable.setTimeEnd(null);
            newUseTable.setTableId(useTableUpdated.getTableId());
            newUseTable.setOrderId(null);
            newUseTable.setOrderTableId(null);
            newUseTable.setStatus(useTable.getStatus());
            if (useTable.getStatus() == UseTableStatusEnum.OCCUPIED) {
                newUseTable.setCustomerId(useTable.getCustomerId());
                newUseTable.setCustomerFullname(useTable.getCustomerFullname());
                newUseTable.setCustomerPhone(useTable.getCustomerPhone());
                newUseTable.setCustomerEmail(useTable.getCustomerEmail());
            } else if (useTable.getStatus() == UseTableStatusEnum.RESERVED) {
                newUseTable.setOrderTableId(useTable.getOrderTableId());
            } else if (useTable.getStatus() == UseTableStatusEnum.EMPTY) {

            } else if (useTable.getStatus() == UseTableStatusEnum.REPAIR) {

            }

            this.useTableService.upsert(useTableUpdated);
            UseTable newUseTableCreated = this.useTableService.upsert(newUseTable);
            if (newUseTableCreated != null && newUseTableCreated.getStatus() == UseTableStatusEnum.OCCUPIED) {
                HandlePayment newHandlePayment = new HandlePayment();
                newHandlePayment.setUseTableId(newUseTableCreated.getId());
                newHandlePayment.setEmployeeId(null);
                newHandlePayment.setPayMethodId(null);
                newHandlePayment.setPayTotalPrice(null);
                newHandlePayment.setStatus(HandlePaymentStatusEnum.NOTHING);

                this.handlePaymentService.upsert(newHandlePayment);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(useTableUpdated);
    }
}