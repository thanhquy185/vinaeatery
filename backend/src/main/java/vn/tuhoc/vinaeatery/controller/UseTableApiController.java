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
import vn.tuhoc.vinaeatery.domain.UseTable;
import vn.tuhoc.vinaeatery.domain.criteria.UseTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.UseTableDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseTableUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.service.UseTableService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/use-tables")
@AllArgsConstructor
public class UseTableApiController {
    // Properties
    private final UseTableService useTableService;
    private final TimeService timeService;

    // Methods
    @GetMapping("/{tableId}")
    public ResponseEntity<?> handleNewUseTableByTableId(@PathVariable("tableId") Integer tableId) {
        UseTableDTO useTableDTO = useTableService.getNewOneFormatByTableId(tableId);
        return ResponseEntity.status(HttpStatus.OK).body(useTableDTO);
    }

    @GetMapping("/list")
    public ResponseEntity<List<?>> listUseTable(UseTableCriteria useTableCriteria) {
        List<UseTable> listUseTable = this.useTableService.getAll(useTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listUseTable);
    }

    @GetMapping("/list-format")
    public ResponseEntity<List<?>> listUseTableFormat(UseTableCriteria useTableCriteria) {
        List<UseTableDTO> listUseTableFormat = this.useTableService.getAllFormat(useTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listUseTableFormat);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> handleDetailUseTable(@PathVariable("id") Long id) {
        UseTable useTableSelected = this.useTableService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(useTableSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateUseTable(@RequestBody @Valid UseTable useTable, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        UseTable useTableCreate = this.useTableService.upsert(useTable);
        return ResponseEntity.status(HttpStatus.OK).body(useTableCreate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateUseTable(@PathVariable("id") Long id,
            @RequestBody @Valid UseTableUpdateDTO useTable,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        UseTable useTableUpdated = this.useTableService.getOneById(id);
        if (useTableUpdated != null) {
            useTableUpdated.setTimeEnd(timeService.getDateTimeVN(useTable.getTimeEnd()));
            useTableUpdated.setStatus(useTable.getStatus());
            this.useTableService.upsert(useTableUpdated);

            UseTable newUseTable = new UseTable();
            newUseTable.setTimeStart(LocalDateTime.now());
            newUseTable.setTimeEnd(null);
            newUseTable.setTableId(useTableUpdated.getTableId());
            if (useTable.getStatus() == UseTableStatusEnum.OCCUPIED) {
                if (useTable.getCustomerId() != null) {
                    newUseTable.setCustomerId(useTable.getCustomerId());
                }
            } else if (useTable.getStatus() == UseTableStatusEnum.RESERVED) {
                if (useTable.getOrderTableId() != null) {
                    newUseTable.setOrderTableId(useTable.getOrderTableId());
                }
            } else if (useTable.getStatus() == UseTableStatusEnum.EMPTY) {

            } else if (useTable.getStatus() == UseTableStatusEnum.REPAIR) {

            }
            newUseTable.setOrderId(null);
            newUseTable.setStatus(useTableUpdated.getStatus());
            this.useTableService.upsert(newUseTable);
        }

        return ResponseEntity.status(HttpStatus.OK).body(useTableUpdated);
    }
}