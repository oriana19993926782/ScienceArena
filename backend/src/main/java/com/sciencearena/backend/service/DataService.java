package com.sciencearena.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DataService {

    private static final Logger logger = LoggerFactory.getLogger(DataService.class);

    public Map<String, Object> processOverallData() {
        try {
            // 读取JSON文件
            ClassPathResource resource = new ClassPathResource("data/overallPerformance.json");
            InputStream inputStream = resource.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(inputStream);

            // 结果容器
            Map<String, Object> result = new HashMap<>();
            List<Map<String, Object>> modelsData = new ArrayList<>();
            Set<String> competitionsSet = new HashSet<>();

            // 遍历所有模型
            for (JsonNode modelNode : rootNode) {
                String modelName = modelNode.get("模型名称").asText();
                JsonNode performanceNode = modelNode.get("performance");
                
                Map<String, Object> modelData = new HashMap<>();
                modelData.put("model", formatModelName(modelName));
                
                // 跟踪总分和最大分数以计算平均值
                double totalScore = 0;
                double totalMaxScore = 0;
                
                // 处理每个比赛的数据
                Iterator<String> competitionFields = performanceNode.fieldNames();
                while (competitionFields.hasNext()) {
                    String competition = competitionFields.next();
                    competitionsSet.add(competition); // 收集所有比赛名称
                    
                    JsonNode compData = performanceNode.get(competition);
                    double score = compData.get("得分").asDouble();
                    double maxScore = compData.get("总分").asDouble();
                    
                    // 计算比赛准确率并存储
                    double accuracy = maxScore > 0 ? score / maxScore : 0;
                    modelData.put(competition, accuracy);
                    
                    // 累积总分和最大分
                    totalScore += score;
                    totalMaxScore += maxScore;
                }
                
                // 计算平均准确率
                double avgAccuracy = totalMaxScore > 0 ? totalScore / totalMaxScore : 0;
                modelData.put("avg", avgAccuracy);
                
                modelsData.add(modelData);
            }
            
            // 按平均准确率降序排序
            modelsData.sort((a, b) -> Double.compare((Double)b.get("avg"), (Double)a.get("avg")));
            
            // 转换比赛集合为排序列表
            List<String> competitions = new ArrayList<>(competitionsSet);
            Collections.sort(competitions); // 按字母排序比赛
            
            // 构建结果
            result.put("models", modelsData);
            result.put("competitions", competitions);
            
            return result;
            
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyMap();
        }
    }
    
    /**
     * 从JSON文件中提取所有比赛名称
     * @return 比赛名称列表
     */
    public List<String> getAllCompetitionNames() {
        try {
            // 读取JSON文件
            ClassPathResource resource = new ClassPathResource("data/overallPerformance.json");
            InputStream inputStream = resource.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(inputStream);
            
            // 用于收集所有比赛名称的Set
            Set<String> competitionsSet = new HashSet<>();
            
            // 遍历所有模型的performance字段，收集比赛名称
            for (JsonNode modelNode : rootNode) {
                if (modelNode.has("performance")) {
                    JsonNode performanceNode = modelNode.get("performance");
                    Iterator<String> fieldNames = performanceNode.fieldNames();
                    while (fieldNames.hasNext()) {
                        String competition = fieldNames.next();
                        competitionsSet.add(competition);
                    }
                }
            }
            
            // 将Set转换为List并排序
            List<String> competitionsList = new ArrayList<>(competitionsSet);
            Collections.sort(competitionsList); // 按字母顺序排序
            
            // 在列表开头添加"Overall"
            List<String> result = new ArrayList<>();
            result.add("overall");
            result.addAll(competitionsList);
            
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
    /**
     * 格式化模型名称以更好地显示
     * 例如: "claude-3-opus" -> "Claude 3 Opus"
     */
    private String formatModelName(String modelName) {
        // 直接返回原始模型名称，不进行任何格式化
        return modelName;
    }
    
    /**
     * 获取特定比赛的数据
     * @param competitionId 比赛ID
     * @return 包含比赛数据的Map
     */
    public Map<String, Object> getCompetitionData(String competitionId) {
        logger.info("开始获取比赛数据: {}", competitionId);
        try {
            // 读取分数JSON文件
            logger.debug("尝试读取分数JSON文件");
            ClassPathResource scoreResource = new ClassPathResource("data/com_models_score_perQuestion.json");
            InputStream scoreInputStream = scoreResource.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode scoreRootNode = mapper.readTree(scoreInputStream);
            
            // 读取成本和发布时间JSON文件
            logger.debug("尝试读取成本和发布时间JSON文件");
            ClassPathResource costInfoResource = new ClassPathResource("data/com_models_pubTime_cost_info.json");
            InputStream costInfoInputStream = costInfoResource.getInputStream();
            JsonNode costInfoRootNode = mapper.readTree(costInfoInputStream);
            
            logger.debug("JSON文件读取成功，根节点类型: {}", scoreRootNode.getNodeType());
            
            // 打印根节点的所有字段名
            StringBuilder rootFields = new StringBuilder("根节点字段: ");
            Iterator<String> fieldNames = scoreRootNode.fieldNames();
            while (fieldNames.hasNext()) {
                rootFields.append(fieldNames.next()).append(", ");
            }
            logger.debug(rootFields.toString());
            
            // 检查请求的比赛是否存在
            logger.debug("检查比赛ID是否存在: {}", competitionId);
            if (!scoreRootNode.has(competitionId)) {
                logger.warn("比赛ID不存在: {}", competitionId);
                return Collections.emptyMap();
            }
            
            // 获取该比赛的所有数据
            JsonNode competitionNode = scoreRootNode.get(competitionId);
            logger.debug("获取到比赛节点，类型: {}", competitionNode.getNodeType());
            
            // 结果Map
            Map<String, Object> resultMap = new HashMap<>();
            // 比赛标题
            resultMap.put("title", competitionId);
            
            // 模型数据列表
            List<Map<String, Object>> modelsList = new ArrayList<>();
            
            // 遍历该比赛下的所有模型
            logger.debug("开始处理比赛下的模型数据");
            Iterator<String> modelNames = competitionNode.fieldNames();
            int modelCount = 0;
            
            while (modelNames.hasNext()) {
                String modelName = modelNames.next();
                logger.debug("处理模型: {}", modelName);
                JsonNode modelNode = competitionNode.get(modelName);
                
                // 获取成本和发布信息
                JsonNode modelCostInfo = null;
                if (costInfoRootNode.has(competitionId) && 
                    costInfoRootNode.get(competitionId).has(modelName)) {
                    modelCostInfo = costInfoRootNode.get(competitionId).get(modelName);
                    logger.debug("找到模型 {} 的成本和发布信息", modelName);
                } else {
                    logger.debug("未找到模型 {} 的成本和发布信息", modelName);
                }
                
                // 检查模型是否在比赛后发布
                boolean isPublishedAfter = false;
                if (modelCostInfo != null && modelCostInfo.has("is_published_after_competition")) {
                    isPublishedAfter = "true".equals(modelCostInfo.get("is_published_after_competition").asText());
                    logger.debug("模型 {} 在比赛后发布: {}", modelName, isPublishedAfter);
                }
                
                // 获取实际成本
                String cost = "0";
                if (modelCostInfo != null && modelCostInfo.has("cost")) {
                    cost = modelCostInfo.get("cost").asText();
                    logger.debug("模型 {} 的成本: {}", modelName, cost);
                }
                
                Map<String, Object> modelData = new HashMap<>();
                // 保持模型名称不变，但添加一个标志指示是否在比赛后发布
                modelData.put("model", modelName);
                modelData.put("is_published_after_competition", isPublishedAfter);
                
                // 计算该模型在该比赛中的平均分
                double totalAccuracy = 0;
                int problemCount = 0;
                
                // 保存问题列表
                List<Map<String, Object>> problemsList = new ArrayList<>();
                
                // 获取所有问题
                List<String> questionIds = new ArrayList<>();
                Iterator<String> questionIterator = modelNode.fieldNames();
                while (questionIterator.hasNext()) {
                    questionIds.add(questionIterator.next());
                }
                
                logger.debug("模型 {} 的问题数量: {}", modelName, questionIds.size());
                
                // 排序问题ID
                Collections.sort(questionIds, (a, b) -> {
                    try {
                        // 尝试将问题ID转换为数字进行比较
                        double numA = Double.parseDouble(a);
                        double numB = Double.parseDouble(b);
                        return Double.compare(numA, numB);
                    } catch (NumberFormatException e) {
                        // 如果转换失败，按字符串比较
                        return a.compareTo(b);
                    }
                });
                
                // 处理所有问题，不再限制数量
                logger.debug("将处理模型 {} 的所有 {} 个问题", modelName, questionIds.size());
                
                for (String questionId : questionIds) {
                    JsonNode questionNode = modelNode.get(questionId);
                    
                    if (questionNode.has("score") && questionNode.has("total_score")) {
                        double score = questionNode.get("score").asDouble();
                        double totalScore = questionNode.get("total_score").asDouble();
                        
                        // 计算准确率
                        double accuracy = totalScore > 0 ? score / totalScore : 0;
                        totalAccuracy += accuracy;
                        
                        // 存储问题数据
                        Map<String, Object> problemData = new HashMap<>();
                        problemData.put("id", questionId);
                        problemData.put("accuracy", accuracy);
                        
                        // 添加模型输出（如果有的话）
                        if (questionNode.has("output")) {
                            problemData.put("trace", questionNode.get("output").asText());
                        } else {
                            problemData.put("trace", "Model output for " + modelName + " on question " + questionId);
                        }
                        
                        problemsList.add(problemData);
                        problemCount++;
                    } else {
                        logger.warn("问题 {} 缺少score或total_score字段", questionId);
                    }
                }
                
                // 计算平均准确率
                double avgAccuracy = problemCount > 0 ? totalAccuracy / problemCount : 0;
                modelData.put("avg", avgAccuracy);
                modelData.put("problems", problemsList);
                
                // 添加模型成本
                modelData.put("cost", cost);
                
                // 将模型数据添加到结果列表
                modelsList.add(modelData);
                modelCount++;
                
                logger.debug("模型 {} 处理完成，包含 {} 个问题", modelName, problemCount);
            }
            
            // 将模型列表添加到结果Map
            resultMap.put("models", modelsList);
            
            logger.info("比赛 {} 数据处理完成，共 {} 个模型", competitionId, modelCount);
            return resultMap;
        } catch (Exception e) {
            logger.error("处理比赛数据时发生异常: {}", e.getMessage(), e);
            e.printStackTrace();
            return Collections.emptyMap();
        }
    }
    
    /**
     * 获取模型对特定问题的回答详情
     * @param competitionId 比赛ID
     * @param modelName 模型名称
     * @param questionId 问题ID
     * @return 包含模型回答详情的Map
     */
    public Map<String, Object> getModelAnswerDetail(String competitionId, String modelName, String questionId) {
        logger.info("正在获取模型回答详情: 比赛={}, 模型={}, 问题={}", competitionId, modelName, questionId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("competitionId", competitionId);
        result.put("modelName", modelName);
        result.put("questionId", questionId);
        
        try {
            // 读取JSON文件
            ClassPathResource resource = new ClassPathResource("data/com_models_questions_modelAnswer_perRun_details.json");
            InputStream inputStream = resource.getInputStream();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(inputStream);
            
            // 检查是否存在请求的比赛
            if (!rootNode.has(competitionId)) {
                logger.error("找不到比赛: {}", competitionId);
                throw new RuntimeException("比赛不存在: " + competitionId);
            }
            
            JsonNode competitionNode = rootNode.get(competitionId);
            
            // 检查是否存在请求的模型
            if (!competitionNode.has(modelName)) {
                logger.error("在比赛{}中找不到模型: {}", competitionId, modelName);
                throw new RuntimeException("在比赛 " + competitionId + " 中找不到模型: " + modelName);
            }
            
            JsonNode modelNode = competitionNode.get(modelName);
            
            // 检查是否存在请求的问题
            if (!modelNode.has(questionId)) {
                logger.error("在比赛{}的模型{}中找不到问题: {}", competitionId, modelName, questionId);
                throw new RuntimeException("在比赛 " + competitionId + " 的模型 " + modelName + " 中找不到问题: " + questionId);
            }
            
            JsonNode questionNode = modelNode.get(questionId);
            
            // 提取问题详情
            result.put("originalQuestion", questionNode.get("original_question").asText());
            result.put("correctAnswer", questionNode.get("correct_answer").asText());
            result.put("averageScore", questionNode.get("average_score").asDouble());
            result.put("fullScore", questionNode.get("full_score").asDouble());
            
            // 提取每次运行的详情
            JsonNode detailNode = questionNode.get("detail");
            List<Map<String, Object>> details = new ArrayList<>();
            
            detailNode.fields().forEachRemaining(entry -> {
                String runId = entry.getKey();
                JsonNode runNode = entry.getValue();
                
                Map<String, Object> runDetail = new HashMap<>();
                runDetail.put("run", runId);
                runDetail.put("fullSolution", runNode.get("full_model_solution").asText());
                runDetail.put("parsedAnswer", runNode.get("parsed_Answer").asText());
                runDetail.put("score", runNode.get("score_of_this_time").asDouble());
                
                details.add(runDetail);
            });
            
            result.put("details", details);
            
            logger.info("成功获取模型回答详情，共有{}次运行记录", details.size());
            return result;
            
        } catch (Exception e) {
            logger.error("获取模型回答详情时发生错误: {}", e.getMessage(), e);
            throw new RuntimeException("获取模型回答详情失败: " + e.getMessage(), e);
        }
    }
}
