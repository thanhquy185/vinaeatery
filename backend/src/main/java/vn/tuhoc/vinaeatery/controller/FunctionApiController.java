package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.tuhoc.vinaeatery.domain.Function;
import vn.tuhoc.vinaeatery.service.FunctionService;

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
    @GetMapping("/list")
    public ResponseEntity<List<?>> handleListFunction() {
        List<Function> listFunction = this.functionService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(listFunction);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> handleDetailFunction(@PathVariable("id") Integer id) {
        Function functionSelected = this.functionService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(functionSelected);
    }
}