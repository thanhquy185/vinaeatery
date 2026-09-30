package vn.tuhoc.vinaeatery.modules.dashboard.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackExperienceEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackScoreEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.FeedbackExperienceEnum;
import vn.tuhoc.vinaeatery.modules.active.repositories.FeedbackExperienceRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.FeedbackRepository;
import vn.tuhoc.vinaeatery.modules.active.repositories.FeedbackScoreRepository;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.requests.FeedbackRequestDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.FeedbackCardResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.FeedbackChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.FeedbackResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.FeedbackTableBodyResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.FeedbackTableFootResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.FeedbackTableResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.PieChartResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.dtos.responses.TimeRangeResponseDTO;
import vn.tuhoc.vinaeatery.modules.dashboard.services.interfaces.DFeedbackService;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.mappers.RestaurantMapper;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.RestaurantSubInfoResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.RestaurantRepository;
import vn.tuhoc.vinaeatery.utils.TimeRangeUtil;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DFeedbackServiceImplement implements DFeedbackService {
    RestaurantRepository restaurantRepository;
    FeedbackExperienceRepository feedbackExperienceRepository;
    FeedbackScoreRepository feedbackScoreRepository;
    FeedbackRepository feedbackRepository;
    RestaurantMapper restaurantMapper;

    private void handleCalScore(int[] scores, Integer feedbackScore) {
        if (feedbackScore != null && feedbackScore >= 1 && feedbackScore <= 5) {
            scores[feedbackScore - 1]++;
        }
    }

    @Override
    @Cacheable(value = "dashboard__feedback", key = "'restaurantId=' + #feedbackRequestDTO.getRestaurantId() + 'timeline=' + #feedbackRequestDTO.getTimeline() + 'timeDetail=' + #feedbackRequestDTO.getTimeDetail()", unless = "#result == null")
    public FeedbackResponseDTO handleDashboard(FeedbackRequestDTO feedbackRequestDTO) {
        int restaurantId = feedbackRequestDTO.getRestaurantId();

        //
        List<PieChartResponseDTO> data = new ArrayList<>();
        List<FeedbackTableBodyResponseDTO> tableBody = new ArrayList<>();
        //
        List<TimeRangeResponseDTO> timeRangeResponseDTOs = TimeRangeUtil.getTimeRanges(
                feedbackRequestDTO.getTimeline(),
                feedbackRequestDTO.getTimeDetail());
        //
        List<FeedbackEntity> feedbackInTimeRange = this.feedbackRepository
                .findAllInTimeRange(
                        restaurantId,
                        timeRangeResponseDTOs.get(0).getStart(),
                        timeRangeResponseDTOs
                                .get(timeRangeResponseDTOs.size() - 1)
                                .getEnd());
        feedbackInTimeRange.sort(Comparator.comparing(FeedbackEntity::getExperience));
        //
        List<FeedbackExperienceEntity> feedbackExperienceEntities = this.feedbackExperienceRepository
                .findAllForDashboard();
        int feedbackIndex1 = 0;
        for (FeedbackExperienceEntity feedbackExperienceEntity : feedbackExperienceEntities) {
            String id = feedbackExperienceEntity.getId();
            String name = feedbackExperienceEntity.getName();
            Integer index = feedbackExperienceEntity.getIndex();

            long value = 0;
            while (feedbackIndex1 < feedbackInTimeRange.size()) {
                FeedbackEntity feedbackEntity = feedbackInTimeRange.get(feedbackIndex1);

                if (feedbackEntity.getExperience().equals(FeedbackExperienceEnum.fromValue(id))) {
                    value++;
                    feedbackIndex1++;
                } else {
                    break;
                }
            }

            PieChartResponseDTO pieChartResponseDTO = PieChartResponseDTO.builder()
                    .id(index)
                    .label(name)
                    .value(value)
                    .build();

            data.add(pieChartResponseDTO);
        }
        //
        List<FeedbackScoreEntity> feedbackScoreEntities = this.feedbackScoreRepository.findAllForDashboard();
        for (FeedbackScoreEntity feedbackScoreEntity : feedbackScoreEntities) {
            String id = feedbackScoreEntity.getId();
            String name = feedbackScoreEntity.getName();

            int[] scores = new int[5];
            int feedbackIndex2 = 0;
            while (feedbackIndex2 < feedbackInTimeRange.size()) {
                FeedbackEntity feedbackEntity = feedbackInTimeRange.get(feedbackIndex2);

                if (id.equalsIgnoreCase("FOOD")) {
                    this.handleCalScore(scores, feedbackEntity.getScore1());
                } else if (id.equalsIgnoreCase("SPEED")) {
                    this.handleCalScore(scores, feedbackEntity.getScore2());
                } else if (id.equalsIgnoreCase("EMPLOYEE")) {
                    this.handleCalScore(scores, feedbackEntity.getScore3());
                } else if (id.equalsIgnoreCase("SERVICE")) {
                    this.handleCalScore(scores, feedbackEntity.getScore4());
                } else if (id.equalsIgnoreCase("PLACE")) {
                    this.handleCalScore(scores, feedbackEntity.getScore5());
                }

                feedbackIndex2++;
            }

            FeedbackTableBodyResponseDTO feedbackTableBodyResponseDTO = FeedbackTableBodyResponseDTO
                    .builder()
                    .name(name)
                    .score1(scores[0])
                    .score2(scores[1])
                    .score3(scores[2])
                    .score4(scores[3])
                    .score5(scores[4])
                    .build();

            tableBody.add(feedbackTableBodyResponseDTO);
        }
        //
        Integer totalScore1 = tableBody.stream().mapToInt(FeedbackTableBodyResponseDTO::getScore1).sum();
        Integer totalScore2 = tableBody.stream().mapToInt(FeedbackTableBodyResponseDTO::getScore2).sum();
        Integer totalScore3 = tableBody.stream().mapToInt(FeedbackTableBodyResponseDTO::getScore3).sum();
        Integer totalScore4 = tableBody.stream().mapToInt(FeedbackTableBodyResponseDTO::getScore4).sum();
        Integer totalScore5 = tableBody.stream().mapToInt(FeedbackTableBodyResponseDTO::getScore5).sum();
        List<Integer> scores = List.of(totalScore1, totalScore2, totalScore3, totalScore4, totalScore5);
        Integer totalScore = scores.stream().reduce(0, Integer::sum);
        //
        int cardTotal = feedbackInTimeRange.size();
        double cardAverage = totalScore > 0 ? (totalScore1 * 1 + totalScore2 * 2
                + totalScore3 * 3 + totalScore4 * 4 + totalScore5 * 5)
                / totalScore : 0;
        int cardMax = scores.stream()
                .max(Integer::compareTo)
                .orElse(0);
        int cardMin = scores.stream()
                .min(Integer::compareTo)
                .orElse(0);
        FeedbackTableFootResponseDTO tableFoot = FeedbackTableFootResponseDTO.builder()
                .totalScore1(totalScore1)
                .totalScore2(totalScore2)
                .totalScore3(totalScore3)
                .totalScore4(totalScore4)
                .totalScore5(totalScore5)
                .build();

        RestaurantSubInfoResponseDTO restaurant = this.restaurantMapper
                .entityToSubInfoResponse(this.restaurantRepository.findOneByIdToCrud(restaurantId).get());
        FeedbackCardResponseDTO card = FeedbackCardResponseDTO.builder()
                .total(cardTotal)
                .average(cardAverage)
                .max(cardMax)
                .min(cardMin)
                .build();
        FeedbackChartResponseDTO chart = FeedbackChartResponseDTO.builder()
                .data(data)
                .build();
        FeedbackTableResponseDTO table = FeedbackTableResponseDTO.builder()
                .tableBody(tableBody)
                .tableFoot(tableFoot)
                .build();

        FeedbackResponseDTO feedbackResponseDTO = FeedbackResponseDTO.builder()
                .restaurant(restaurant)
                .dateStart(timeRangeResponseDTOs.get(0).getStart())
                .dateEnd(timeRangeResponseDTOs.get(timeRangeResponseDTOs.size() - 1).getEnd())
                .card(card)
                .chart(chart)
                .table(table)
                .build();

        return feedbackResponseDTO;
    }
}
