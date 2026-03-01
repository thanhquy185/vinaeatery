package com.tuhoc.vinaeatery.controller;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.VinaeateryApplication;
import vn.tuhoc.vinaeatery.domain.dto.CommonStatusUpdateDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO.Developer;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO.Field;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO.Project;
import vn.tuhoc.vinaeatery.domain.dto.TableUpdateDTO;
import vn.tuhoc.vinaeatery.domain.entity.TableE;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.service.TableService;
import vn.tuhoc.vinaeatery.service.TimeService;

@SpringBootTest(classes = VinaeateryApplication.class)
@AutoConfigureMockMvc
@Transactional
public class TableApiControllerTest {
        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private TableService tableService;

        private ObjectMapper objectMapper;

        @Autowired
        private TimeService timeService;

        private FormSecurityDTO formSecurity;
        private TableE tableResponse;
        private TableE tableCreate;
        private TableUpdateDTO tableUpdate;
        private CommonStatusUpdateDTO tableLock;

        @BeforeEach
        void init() {
                this.objectMapper = new ObjectMapper();
                this.objectMapper.registerModule(new JavaTimeModule());
                this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

                this.formSecurity = FormSecurityDTO.builder()
                                .project(new Project("vinaeatery", "2025-06-01", "react.js", "spring-boot"))
                                .developer(new Developer("tranthanhquy", "0923073724", "thanhquyfu@gmail.com"))
                                .field(new Field())
                                .build();

                this.tableResponse = TableE.builder()
                                .id(1)
                                .name("table name")
                                .categoryTableId(1)
                                .floorId(1)
                                .seats(0)
                                .description("table description")
                                .status(CommonStatusEnum.ACTIVE)
                                .updateAt(this.timeService.getDateTimeVN(LocalDateTime.now()))
                                .build();

                this.tableCreate = TableE.builder()
                                .name("table name")
                                .categoryTableId(1)
                                .floorId(1)
                                .seats(0)
                                .description("table description")
                                .status(CommonStatusEnum.ACTIVE)
                                .updateAt(this.timeService.getDateTimeVN(LocalDateTime.now()))
                                .build();
        }

        @Test
        void createTable_success() throws Exception {
                this.formSecurity.setField(new Field("tables", "create"));

                String formSecurityContent = this.objectMapper.writeValueAsString(this.formSecurity);
                String tableCreateContent = this.objectMapper.writeValueAsString(this.tableCreate);

                Mockito.when(this.tableService.upsert(ArgumentMatchers.any())).thenReturn(tableResponse);

                MockMultipartFile formSecurityPart = new MockMultipartFile(
                                "form-security",
                                "",
                                MediaType.APPLICATION_JSON_VALUE,
                                formSecurityContent.getBytes(StandardCharsets.UTF_8));
                MockMultipartFile tablePart = new MockMultipartFile(
                                "table",
                                "",
                                MediaType.APPLICATION_JSON_VALUE,
                                tableCreateContent.getBytes(StandardCharsets.UTF_8));

                this.mockMvc.perform(MockMvcRequestBuilders.multipart("/api/tables/create")
                                .file(formSecurityPart)
                                .file(tablePart))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value(200))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.error").isEmpty())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Call API success"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.id").value(tableResponse.getId()))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.data.name")
                                                .value(tableResponse.getName()));

        }
}
