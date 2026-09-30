package vn.tuhoc.vinaeatery.modules.dashboard.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.BillEntity;
import vn.tuhoc.vinaeatery.modules.active.repositories.BillRepository;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.ProfitRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ProfitLineChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ProfitResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ProfitTableBodyResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ProfitTableFootResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.ProfitTableResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.TimeRangeResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.services.interfaces.ProfitService;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.InputTicketEntity;
import vn.tuhoc.vinaeatery.modules.food.repositories.InputTicketRepository;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapper;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.RestaurantRepository;
import vn.tuhoc.vinaeatery.utils.TimeRangeUtil;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfitServiceImplement implements ProfitService {
        RestaurantRepository restaurantRepository;
        BillRepository billRepository;
        InputTicketRepository inputTicketRepository;
        RestaurantMapper restaurantMapper;

        @Override
        @Cacheable(value = "dashboard__profit", key = "'restaurantId=' + #profitRequestDTO.getRestaurantId() + 'timeline=' + #profitRequestDTO.getTimeline() + 'timeDetail=' + #profitRequestDTO.getTimeDetail()", unless = "#result == null")
        public ProfitResponseDTO handleDashboard(ProfitRequestDTO profitRequestDTO) {
                int restaurantId = profitRequestDTO.getRestaurantId();

                //
                List<Long> revenueLine = new ArrayList<>();
                List<Long> expenseLine = new ArrayList<>();
                List<Long> profitLine = new ArrayList<>();
                List<String> xLabels = new ArrayList<>();
                List<ProfitTableBodyResponseDTO> body = new ArrayList<>();
                //
                List<TimeRangeResponseDTO> timeRangeResponseDTOs = TimeRangeUtil.getTimeRanges(
                                profitRequestDTO.getTimeline(),
                                profitRequestDTO.getTimeDetail());
                List<BillEntity> billsInTimeRange = this.billRepository
                                .findAllInTimeRange(
                                                restaurantId,
                                                timeRangeResponseDTOs.get(0).getStart(),
                                                timeRangeResponseDTOs
                                                                .get(timeRangeResponseDTOs.size() - 1).getEnd());
                List<InputTicketEntity> inputTicketsInTimeRange = this.inputTicketRepository
                                .findAllInTimeRange(
                                                restaurantId,
                                                timeRangeResponseDTOs.get(0).getStart(),
                                                timeRangeResponseDTOs
                                                                .get(timeRangeResponseDTOs.size() - 1).getEnd());
                //
                billsInTimeRange.sort(Comparator.comparing(BillEntity::getCreateAt));
                inputTicketsInTimeRange.sort(Comparator.comparing(InputTicketEntity::getCreateAt));
                //
                int billIndex = 0;
                int inputTicketIndex = 0;
                for (TimeRangeResponseDTO timeRangeResponseDTO : timeRangeResponseDTOs) {
                        String label = timeRangeResponseDTO.getLabel();
                        String start = timeRangeResponseDTO.getStart();
                        String end = timeRangeResponseDTO.getEnd();

                        long revenue = 0;
                        long expense = 0;
                        while (billIndex < billsInTimeRange.size()) {
                                BillEntity billEntity = billsInTimeRange.get(billIndex);

                                String billCreateAt = billEntity.getCreateAt();
                                if (billCreateAt.compareTo(start) < 0) {
                                        billIndex++;
                                        continue;
                                }
                                if (billCreateAt.compareTo(end) > 0) {
                                        break;
                                }

                                revenue += billEntity.getTotalPrice();
                                billIndex++;
                        }
                        while (inputTicketIndex < inputTicketsInTimeRange.size()) {
                                InputTicketEntity inputTicketEntity = inputTicketsInTimeRange.get(inputTicketIndex);

                                String inputTicketCreateAt = inputTicketEntity.getCreateAt();
                                if (inputTicketCreateAt.compareTo(start) < 0) {
                                        inputTicketIndex++;
                                        continue;
                                }
                                if (inputTicketCreateAt.compareTo(end) > 0) {
                                        break;
                                }

                                expense -= inputTicketEntity.getTotalInputPrice();
                                inputTicketIndex++;
                        }

                        long profit = revenue + expense;
                        ProfitTableBodyResponseDTO profitTBodyResponseDTO = ProfitTableBodyResponseDTO.builder()
                                        .label(label)
                                        .start(start)
                                        .end(end)
                                        .revenue(revenue)
                                        .expense(expense)
                                        .profit(profit)
                                        .build();

                        revenueLine.add(revenue);
                        expenseLine.add(expense);
                        profitLine.add(profit);
                        xLabels.add(label);
                        body.add(profitTBodyResponseDTO);
                }
                //
                ProfitTableFootResponseDTO foot = ProfitTableFootResponseDTO.builder()
                                .totalRevenue(revenueLine.stream().reduce(0L, Long::sum))
                                .totalExpense(expenseLine.stream().reduce(0L, Long::sum))
                                .totalProfit(profitLine.stream().reduce(0L, Long::sum))
                                .build();

                RestaurantSubInfoResponseDTO restaurant = this.restaurantMapper
                                .entityToSubInfoResponse(
                                                this.restaurantRepository.findOneByIdToCrud(restaurantId).get());
                ProfitLineChartResponseDTO lineChart = ProfitLineChartResponseDTO.builder()
                                .profitLine(profitLine)
                                .expenseLine(expenseLine)
                                .revenueLine(revenueLine)
                                .xLabels(xLabels)
                                .build();
                ProfitTableResponseDTO table = ProfitTableResponseDTO.builder()
                                .body(body)
                                .foot(foot)
                                .build();

                ProfitResponseDTO profitResponseDTO = ProfitResponseDTO.builder()
                                .restaurant(restaurant)
                                .dateStart(timeRangeResponseDTOs.get(0).getStart())
                                .dateEnd(timeRangeResponseDTOs.get(timeRangeResponseDTOs.size() - 1).getEnd())
                                .lineChart(lineChart)
                                .table(table)
                                .build();

                return profitResponseDTO;
        }
}
