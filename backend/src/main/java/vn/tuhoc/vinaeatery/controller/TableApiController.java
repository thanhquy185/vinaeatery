package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
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
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.tuhoc.vinaeatery.domain.criteria.TableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.TableDTO;
import vn.tuhoc.vinaeatery.domain.entity.TableE;
import vn.tuhoc.vinaeatery.domain.entity.UseTable;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UseTableStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.TableCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.TableLockRequest;
import vn.tuhoc.vinaeatery.domain.request.TableUpdateRequest;
import vn.tuhoc.vinaeatery.service.TableService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UseTableService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@Slf4j
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

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleCreateTable(@RequestBody @Valid TableCreateRequest tableCreateRequest,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(tableCreateRequest.getFormSecurity(), "tables", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (tableCreateRequest.getTable() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Dữ liệu bàn không được để trống !"));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        TableE tableCreate = this.tableService.upsert(tableCreateRequest.getTable());
        if (tableCreate != null) {
            UseTable newUseTable = new UseTable();
            newUseTable.setRestaurantId(tableCreate.getRestaurantId());
            newUseTable.setTimeStart(LocalDateTime.now());
            newUseTable.setTableId(tableCreate.getId());
            newUseTable.setStatus(UseTableStatusEnum.EMPTY);
            this.useTableService.upsert(newUseTable);
        }
        return ResponseEntity.status(HttpStatus.OK).body(tableCreate);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleUpdateTable(@PathVariable("id") Integer id,
            @RequestBody @Valid TableUpdateRequest tableUpdateRequest,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(tableUpdateRequest.getFormSecurity(), "tables", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (tableUpdateRequest.getTable() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Dữ liệu bàn không được để trống !"));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        TableE tableUpdated = this.tableService.getOneById(id);
        if (tableUpdated != null) {
            tableUpdated.setName(tableUpdateRequest.getTable().getName());
            tableUpdated.setCategoryTableId(tableUpdateRequest.getTable().getCategoryTableId());
            tableUpdated.setFloorId(tableUpdateRequest.getTable().getFloorId());
            tableUpdated.setSeats(tableUpdateRequest.getTable().getSeats());
            tableUpdated.setDescription(tableUpdateRequest.getTable().getDescription());
            // tableUpdated.setUpdateAt(this.timeService.getDateTimeVN(tableUpdateRequest.getTable().getUpdateAt()));
            tableUpdated.setUpdateAt(this.timeService.getDateTimeVN(LocalDateTime.now()));

            this.tableService.upsert(tableUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(tableUpdated);
    }

    @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleLockTable(@PathVariable("id") Integer id,
            @RequestBody @Valid TableLockRequest tableLockRequest,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(tableLockRequest.getFormSecurity(), "tables", "lock")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (tableLockRequest.getTable() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Dữ liệu bàn không được để trống !"));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CommonStatusEnum handleStatus = tableLockRequest.getTable().getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        // LocalDateTime handleUpdateAt =
        // this.timeService.getDateTimeVN(tableLockRequest.getTable().getUpdateAt());
        LocalDateTime handleUpdateAt = this.timeService.getDateTimeVN(LocalDateTime.now());

        TableE tableLocked = this.tableService.getOneById(id);
        if (tableLocked != null) {
            tableLocked.setStatus(handleStatus);
            tableLocked.setUpdateAt(handleUpdateAt);

            this.tableService.lock(tableLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(tableLocked);
    }
}