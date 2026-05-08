package vn.tuhoc.vinaeatery.controller;

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
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.OrderTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderTableDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderUpdateStatusDTO;
import vn.tuhoc.vinaeatery.domain.entity.OrderTable;
import vn.tuhoc.vinaeatery.service.OrderTableService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/order-tables")
@RequiredArgsConstructor
public class OrderTableApiController {
    // Properties
    private final OrderTableService orderTableService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listOrderTable(@RequestBody FormSecurityDTO formSecurityDTO,
            OrderTableCriteria orderTableCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<OrderTable> listOrderTable = this.orderTableService.getAll(orderTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listOrderTable);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listOrderTableFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            OrderTableCriteria orderTableCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<OrderTableDTO> listOrderTable = this.orderTableService.getAllFormat(orderTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listOrderTable);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailOrderTable(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        OrderTable orderTableSelected = this.orderTableService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(orderTableSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateOrderTable(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("order-table") @Valid OrderTable orderTable,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-tables", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        OrderTable orderTableCreate = this.orderTableService.upsert(orderTable);
        return ResponseEntity.status(HttpStatus.OK).body(orderTableCreate);
    }

    @PutMapping(value = "/update-status/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateStatusOrder(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("order-table") OrderUpdateStatusDTO orderTable) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-tables", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        OrderTable orderTableUpdated = this.orderTableService.getOneById(id);
        if (orderTableUpdated != null) {
            orderTableUpdated.setEmployeeId(orderTable.getEmployeeId());
            orderTableUpdated.setStatus(orderTable.getStatus());
        }
        this.orderTableService.upsert(orderTableUpdated);

        return ResponseEntity.status(HttpStatus.OK).body(orderTableUpdated);
    }
}