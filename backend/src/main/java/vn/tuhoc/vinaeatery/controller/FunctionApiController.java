package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.tuhoc.vinaeatery.domain.Function;
import vn.tuhoc.vinaeatery.domain.dto.FormGetDataDTO;
import vn.tuhoc.vinaeatery.service.FunctionService;
import vn.tuhoc.vinaeatery.util.HandleFormGetData;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/functions")
public class FunctionApiController {
    // Properties
    private final FunctionService functionService;

    // Constructors
    public FunctionApiController(FunctionService functionService) {
        this.functionService = functionService;
    }

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listFunction(@RequestBody @Valid FormGetDataDTO formGetDataDTO) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        List<Function> listFunction = this.functionService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(listFunction);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailFunction(@RequestBody @Valid FormGetDataDTO formGetDataDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormGetData.isValidFormGetData(formGetDataDTO)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithStr(HandleFormGetData.getErrorMessageByGetData()));
        }

        Function functionSelected = this.functionService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(functionSelected);
    }
}