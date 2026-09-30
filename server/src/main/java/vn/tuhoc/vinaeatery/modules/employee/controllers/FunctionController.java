package vn.tuhoc.vinaeatery.modules.employee.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.dtos.responses.FunctionSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.employee.services.interfaces.FunctionService;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestController
@RequestMapping("/api/v1/functions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FunctionController {
        FunctionService functionService;

        @GetMapping("/{id}")
        public ResponseEntity<RestResponseDTO<FunctionDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                FunctionDetailResponseDTO functionDetail = this.functionService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn chức năng theo mã chức năng thành công!",
                                functionDetail);
        }

        @GetMapping("")
        public ResponseEntity<RestResponseDTO<List<FunctionSummaryResponseDTO>>> handleGetSummary() {
                List<FunctionSummaryResponseDTO> functionSummary = this.functionService.handleGetSummary();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách chức năng thành công!",
                                functionSummary);
        }
}