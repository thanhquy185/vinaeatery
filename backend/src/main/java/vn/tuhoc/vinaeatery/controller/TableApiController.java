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
import vn.tuhoc.vinaeatery.domain.TableE;
import vn.tuhoc.vinaeatery.domain.criteria.TableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.TableDTO;
import vn.tuhoc.vinaeatery.domain.dto.TableUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.TableService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/tables")
@AllArgsConstructor
public class TableApiController {
    // Properties
    private final TableService tableService;
    private final TimeService timeService;

    // Methods
    @GetMapping("/{id}")
    public ResponseEntity<?> tableIsExists(@PathVariable("id") Integer id) {
        Boolean result = tableService.isExists(id);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/list")
    public ResponseEntity<List<?>> listTable(TableCriteria tableCriteria) {
        List<TableE> listTable = this.tableService.getAll(tableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listTable);
    }

    @GetMapping("/list-format")
    public ResponseEntity<List<?>> listTableFormat(TableCriteria tableCriteria) {
        List<TableDTO> listTableFormat = this.tableService.getAllFormat(tableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listTableFormat);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> handleDetailTable(@PathVariable("id") Integer id) {
        TableE tableSelected = this.tableService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(tableSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateTable(@RequestBody @Valid TableE table,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        TableE tableCreate = this.tableService.upsert(table);
        return ResponseEntity.status(HttpStatus.OK).body(tableCreate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateTable(@PathVariable("id") Integer id,
            @RequestBody @Valid TableUpdateDTO table,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        TableE tableUpdated = this.tableService.getOneById(id);
        if (tableUpdated != null) {
            tableUpdated.setName(table.getName());
            tableUpdated.setCategoryTableId(table.getCategoryTableId());
            tableUpdated.setFloorId(table.getFloorId());
            tableUpdated.setSeats(table.getSeats());
            tableUpdated.setDescription(table.getDescription());
            tableUpdated.setTimeUpdate(this.timeService.getDateTimeVN(table.getTimeUpdate()));
            this.tableService.upsert(tableUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(tableUpdated);
    }

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLockTable(@PathVariable("id") Integer id,
            @RequestBody @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        TableE tableLocked = this.tableService.getOneById(id);
        if (tableLocked != null) {
            tableLocked.setStatus(handleStatus);
            tableLocked.setTimeUpdate(handleTimeUpdate);
            this.tableService.lock(tableLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(tableLocked);
    }
}