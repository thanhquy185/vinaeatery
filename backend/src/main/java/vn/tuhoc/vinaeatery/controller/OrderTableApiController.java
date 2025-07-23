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
import vn.tuhoc.vinaeatery.domain.OrderTable;
import vn.tuhoc.vinaeatery.domain.criteria.OrderTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderTableDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderTableUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.OrderTableService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/order-tables")
@AllArgsConstructor
public class OrderTableApiController {
    // Properties
    private final OrderTableService orderTableService;
    private final TimeService timeService;

    // Methods
    @GetMapping("/list")
    public ResponseEntity<List<?>> listOrderTable(OrderTableCriteria orderTableCriteria) {
        List<OrderTable> listOrderTable = this.orderTableService.getAll(orderTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listOrderTable);
    }

    @GetMapping("/list-format")
    public ResponseEntity<List<?>> listOrderTableFormat(OrderTableCriteria orderTableCriteria) {
        List<OrderTableDTO> listOrderTable = this.orderTableService.getAllFormat(orderTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listOrderTable);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> handleDetailOrderTable(@PathVariable("id") Integer id) {
        OrderTable orderTableSelected = this.orderTableService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(orderTableSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateOrderTable(@RequestBody @Valid OrderTable orderTable,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        OrderTable orderTableCreate = this.orderTableService.upsert(orderTable);
        return ResponseEntity.status(HttpStatus.OK).body(orderTableCreate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateOrderTable(@PathVariable("id") Integer id,
            @RequestBody @Valid OrderTableUpdateDTO orderTable,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        OrderTable orderTableUpdated = this.orderTableService.getOneById(id);
        if (orderTableUpdated != null) {
            orderTableUpdated.setTimeOrder(orderTable.getTimeOrder());
            orderTableUpdated.setTimeArrive(orderTable.getTimeArrive());
            orderTableUpdated.setNote(orderTable.getNote());
            orderTableUpdated.setFullname(orderTable.getFullname());
            orderTableUpdated.setPhone(orderTable.getPhone());
            orderTableUpdated.setEmail(orderTable.getEmail());
            orderTableUpdated.setAddress(orderTable.getAddress());
            orderTableUpdated.setTimeUpdate(this.timeService.getDateTimeVN(orderTable.getTimeUpdate()));
            this.orderTableService.upsert(orderTableUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(orderTableUpdated);
    }

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLockOrderTable(@PathVariable("id") Integer id,
            @RequestBody @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        OrderTable orderTableLocked = this.orderTableService.getOneById(id);
        if (orderTableLocked != null) {
            orderTableLocked.setStatus(handleStatus);
            orderTableLocked.setTimeUpdate(handleTimeUpdate);
            this.orderTableService.lock(orderTableLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(orderTableLocked);
    }
}