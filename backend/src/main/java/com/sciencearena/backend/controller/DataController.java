package com.sciencearena.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.sciencearena.backend.service.DataService;
import java.util.Map;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*") // 允许跨域请求，在生产环境中应该限制来源
public class DataController {

    private static final Logger logger = LoggerFactory.getLogger(DataController.class);
    private final DataService dataService;

    @Autowired
    public DataController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping("/overall")
    public Map<String, Object> getOverallData() {
        logger.info("接收到/api/data/overall请求");
        return dataService.processOverallData();
    }
    
    @GetMapping("/competitions")
    public List<String> getAllCompetitions() {
        logger.info("接收到/api/data/competitions请求");
        return dataService.getAllCompetitionNames();
    }
    
    @GetMapping("/competition/{competitionId}")
    public Map<String, Object> getCompetitionData(@PathVariable String competitionId) {
        logger.info("接收到/api/data/competition/{}请求", competitionId);
        try {
            Map<String, Object> result = dataService.getCompetitionData(competitionId);
            logger.info("成功处理/api/data/competition/{}请求，返回{}个模型数据", 
                       competitionId, 
                       result.containsKey("models") ? ((List<?>)result.get("models")).size() : 0);
            return result;
        } catch (Exception e) {
            logger.error("处理/api/data/competition/{}请求时发生错误: {}", competitionId, e.getMessage(), e);
            throw e;
        }
    }
    
    @GetMapping("/modelAnswer")
    public Map<String, Object> getModelAnswer(
            @RequestParam String competitionId,
            @RequestParam String modelName,
            @RequestParam String questionId) {
        logger.info("接收到模型回答详情请求: 比赛={}, 模型={}, 问题={}", competitionId, modelName, questionId);
        try {
            Map<String, Object> result = dataService.getModelAnswerDetail(competitionId, modelName, questionId);
            logger.info("成功处理模型回答详情请求: 比赛={}, 模型={}, 问题={}", competitionId, modelName, questionId);
            return result;
        } catch (Exception e) {
            logger.error("处理模型回答详情请求时发生错误: 比赛={}, 模型={}, 问题={}, 错误: {}", 
                       competitionId, modelName, questionId, e.getMessage(), e);
            throw e;
        }
    }
}
