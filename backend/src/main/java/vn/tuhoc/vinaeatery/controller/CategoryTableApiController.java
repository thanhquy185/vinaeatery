package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.CategoryTable;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryTableCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormGetDataDTO;
import vn.tuhoc.vinaeatery.domain.dto.CategoryTableUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.CategoryTableService;
import vn.tuhoc.vinaeatery.service.TableService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormGetData;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/category-tables")
@AllArgsConstructor
public class CategoryTableApiController {
    // Properties
    private final CategoryTableService categoryTableService;
    private final TableService tableService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listCategoryTable(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            CategoryTableCriteria categoryTableCriteria) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<CategoryTable> listCategoryTable = this.categoryTableService
                .getAll(categoryTableCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listCategoryTable);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailCategoryTable(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        CategoryTable categoryTableSelected = this.categoryTableService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(categoryTableSelected);
    }

    @PostMapping("/create")
    public ResponseEntity<?> handleCreateCategoryTable(@RequestBody @Valid CategoryTable categoryTable,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CategoryTable categoryTableCreate = this.categoryTableService.upsert(categoryTable);
        return ResponseEntity.status(HttpStatus.OK).body(categoryTableCreate);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateCategoryTable(@PathVariable("id") Integer id,
            @RequestBody @Valid CategoryTableUpdateDTO categoryTable,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        CategoryTable categoryTableUpdated = this.categoryTableService.getOneById(id);
        if (categoryTableUpdated != null) {
            categoryTableUpdated.setName(categoryTable.getName());
            categoryTableUpdated.setSurchargeType(categoryTable.getSurchargeType());
            categoryTableUpdated.setSurchargeValue(categoryTable.getSurchargeValue());
            categoryTableUpdated.setDescription(categoryTable.getDescription());
            categoryTableUpdated.setTimeUpdate(this.timeService.getDateTimeVN(categoryTable.getTimeUpdate()));
            this.categoryTableService.upsert(categoryTableUpdated);
        }

        return ResponseEntity.status(HttpStatus.OK).body(categoryTableUpdated);
    }

    @PutMapping("/lock/{id}")
    public ResponseEntity<?> handleLockCategoryTable(@PathVariable("id") Integer id,
            @RequestBody @Valid CommonStatusUpdateDTO commonStatusUpdate, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        if (tableService.getAllByCategoryTableId(id) != null
                && !tableService.getAllByCategoryTableId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr("Loại bàn này đang được ít nhất 1 bàn sử dụng sử dụng !"));
        }

        CommonStatusEnum handleStatus = commonStatusUpdate.getStatus() == CommonStatusEnum.ACTIVE
                ? CommonStatusEnum.INACTIVE
                : CommonStatusEnum.ACTIVE;
        LocalDateTime handleTimeUpdate = this.timeService.getDateTimeVN(commonStatusUpdate.getTimeUpdate());

        CategoryTable categoryTableLocked = this.categoryTableService.getOneById(id);
        if (categoryTableLocked != null) {
            categoryTableLocked.setStatus(handleStatus);
            categoryTableLocked.setTimeUpdate(handleTimeUpdate);
            this.categoryTableService.lock(categoryTableLocked);
        }

        return ResponseEntity.status(HttpStatus.OK).body(categoryTableLocked);
    }
}
