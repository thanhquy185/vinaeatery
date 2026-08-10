package vn.tuhoc.vinaeatery.modules.table.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.requests.CategoryTableUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.dtos.responses.CategoryTableCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.CategoryTableCriteria;
import vn.tuhoc.vinaeatery.modules.table.services.CategoryTableService;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@RestController
@RequestMapping("/api/v1/category-tables")
@RequiredArgsConstructor
public class CategoryTableController {
        private final CategoryTableService categoryTableService;

        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('CATEGORY_TABLES__READ')")
        public ResponseEntity<RestResponseDTO<CategoryTableDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                CategoryTableDetailResponseDTO categoryTableDetail = this.categoryTableService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn loại bàn ăn theo mã loại bàn ăn thành công!",
                                categoryTableDetail);
        }

        @GetMapping("")
        @PreAuthorize("hasAuthority('CATEGORY_TABLES__READ')")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<CategoryTableSummaryResponseDTO>>> handleGetSummary(
                        CategoryTableCriteria categoryTableCriteria) {
                PageResponseDTO<CategoryTableSummaryResponseDTO> categoryTableSummary = this.categoryTableService
                                .handleGetSummary(categoryTableCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách loại bàn ăn thành công!",
                                categoryTableSummary);
        }

        @GetMapping("/crud")
        @PreAuthorize("hasAuthority('CATEGORY_TABLES__READ')")
        public ResponseEntity<RestResponseDTO<List<CategoryTableCrudResponseDTO>>> getCrud(
                        @RequestParam(value = "restaurantId", required = false) Integer restaurantId) {
                List<CategoryTableCrudResponseDTO> categoryTableCrud = ValidationUtil.nonNull(restaurantId)
                                ? this.categoryTableService.handleGetCrud(restaurantId)
                                : this.categoryTableService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách loại bàn ăn để xử lý thông tin thành công!",
                                categoryTableCrud);
        }

        @PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('CATEGORY_TABLES__CREATE')")
        public ResponseEntity<RestResponseDTO<CategoryTableDetailResponseDTO>> handleCreate(
                        @RequestBody @Valid CategoryTableCreateRequestDTO categoryTableCreateRequestDTO) {
                CategoryTableDetailResponseDTO categoryTableCreated = this.categoryTableService
                                .handleCreate(categoryTableCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm loại bàn ăn thành công!",
                                categoryTableCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('CATEGORY_TABLES__UPDATE')")
        public ResponseEntity<RestResponseDTO<CategoryTableDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryTableUpdateRequestDTO categoryTableUpdateRequestDTO) {
                CategoryTableDetailResponseDTO categoryTableUpdated = this.categoryTableService.handleUpdate(id,
                                categoryTableUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin loại bàn ăn thành công!",
                                categoryTableUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("hasAuthority('CATEGORY_TABLES__DELETE')")
        public ResponseEntity<RestResponseDTO<CategoryTableDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid CategoryTableDeleteRequestDTO categoryTableDeleteRequestDTO) {
                CategoryTableDetailResponseDTO categoryTableDeleted = this.categoryTableService.handleDelete(id,
                                categoryTableDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái loại bàn ăn thành công!",
                                categoryTableDeleted);
        }
}
