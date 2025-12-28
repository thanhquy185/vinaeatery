package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.CategoryTable;
import vn.tuhoc.vinaeatery.domain.entity.TableE;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.CategoryTableCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryTableLockRequest;
import vn.tuhoc.vinaeatery.domain.request.CategoryTableUpdateRequest;
import vn.tuhoc.vinaeatery.service.CategoryTableService;
import vn.tuhoc.vinaeatery.service.TableService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/category-tables")
@RequiredArgsConstructor
public class CategoryTableApiController {
        // Properties
        private final CategoryTableService categoryTableService;
        private final TableService tableService;
        private final TimeService timeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listCategoryTable(@RequestBody FormSecurityDTO formSecurityDTO,
                        CategoryTableCriteria categoryTableCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-tables", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<CategoryTable> listCategoryTable = this.categoryTableService
                                .getAll(categoryTableCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listCategoryTable);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailCategoryTable(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "category-tables", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                CategoryTable categoryTableSelected = this.categoryTableService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(categoryTableSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreateCategoryTable(
                        @RequestBody @Valid CategoryTableCreateRequest categoryTableCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryTableCreateRequest.getFormSecurity(), "category-tables",
                                "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryTableCreateRequest.getCategoryTable() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại bàn không được để trống !"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryTable categoryTableCreate = this.categoryTableService
                                .upsert(categoryTableCreateRequest.getCategoryTable());
                return ResponseEntity.status(HttpStatus.OK).body(categoryTableCreate);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdateCategoryTable(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryTableUpdateRequest categoryTableUpdateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryTableUpdateRequest.getFormSecurity(), "category-tables",
                                "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryTableUpdateRequest.getCategoryTable() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại bàn không được để trống !"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                CategoryTable categoryTableUpdated = this.categoryTableService.getOneById(id);
                if (categoryTableUpdated != null) {
                        categoryTableUpdated.setName(categoryTableUpdateRequest.getCategoryTable().getName());
                        categoryTableUpdated.setSurchargeType(
                                        categoryTableUpdateRequest.getCategoryTable().getSurchargeType());
                        categoryTableUpdated.setSurchargeValue(
                                        categoryTableUpdateRequest.getCategoryTable().getSurchargeValue());
                        categoryTableUpdated
                                        .setDescription(categoryTableUpdateRequest.getCategoryTable().getDescription());
                        // categoryTableUpdated.setUpdateAt(this.timeService.getDateTimeVN(categoryTableUpdateRequest.getCategoryTable().getUpdateAt()));
                        categoryTableUpdated.setUpdateAt(this.timeService.getDateTimeVN(LocalDateTime.now()));
                        this.categoryTableService.upsert(categoryTableUpdated);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryTableUpdated);
        }

        @PatchMapping(value = "/lock/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleLockCategoryTable(@PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryTableLockRequest categoryTableLockRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(categoryTableLockRequest.getFormSecurity(), "category-tables",
                                "lock")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                if (categoryTableLockRequest.getCategoryTable() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu loại bàn không được để trống !"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                List<TableE> tableListIsUsing = tableService.getAllByCategoryTableId(id);
                if (tableListIsUsing != null && !tableListIsUsing.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Loại bàn này đang được ít nhất 1 bàn sử dụng sử dụng !"));
                }

                CommonStatusEnum handleStatus = categoryTableLockRequest.getCategoryTable()
                                .getStatus() == CommonStatusEnum.ACTIVE
                                                ? CommonStatusEnum.INACTIVE
                                                : CommonStatusEnum.ACTIVE;
                // LocalDateTime handleUpdateAt =
                // this.timeService.getDateTimeVN(commonStatusUpdate.getUpdateAt());
                LocalDateTime handleUpdateAt = this.timeService.getDateTimeVN(LocalDateTime.now());

                CategoryTable categoryTableLocked = this.categoryTableService.getOneById(id);
                if (categoryTableLocked != null) {
                        categoryTableLocked.setStatus(handleStatus);
                        categoryTableLocked.setUpdateAt(handleUpdateAt);
                        this.categoryTableService.lock(categoryTableLocked);
                }

                return ResponseEntity.status(HttpStatus.OK).body(categoryTableLocked);
        }
}
