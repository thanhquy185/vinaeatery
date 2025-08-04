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
import vn.tuhoc.vinaeatery.domain.TableE;
import vn.tuhoc.vinaeatery.domain.UseTable;
import vn.tuhoc.vinaeatery.domain.criteria.TableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.TableDTO;
import vn.tuhoc.vinaeatery.domain.dto.TableUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.service.TableService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UseTableService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/tables")
@AllArgsConstructor
public class TableApiController {
    // Properties
    private final UseTableService useTableService;
    private final TableService tableService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listTable(@RequestBody FormSecurityDTO formSecurityDTO,
            TableCriteria tableCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<TableE> listTable = this.tableService.getAll(tableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listTable);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listTableFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            TableCriteria tableCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<TableDTO> listTableFormat = this.tableService.getAllFormat(tableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listTableFormat);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailTable(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "tables", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        TableE tableSelected = this.tableService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(tableSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateTable(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("table") @Valid TableE table,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "tables", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        TableE tableCreate = this.tableService.upsert(table);
        if (tableCreate != null) {
            UseTable newUseTable = new UseTable();
            newUseTable.setTimeStart(LocalDateTime.now());
            newUseTable.setTableId(tableCreate.getId());
            newUseTable.setStatus(UseTableStatusEnum.REPAIR);

            this.useTableService.upsert(newUseTable);
        }
        return ResponseEntity.status(HttpStatus.OK).body(tableCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateTable(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("table") @Valid TableUpdateDTO table,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "tables", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

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

    @PutMapping(value = "/lock/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleLockTable(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("table") @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "tables", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

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