package com.sciencearena.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

@Service
public class DataService {

    /**
     * 处理overall数据，从JSON文件中动态读取并处理
     * @return 处理后的数据，包含模型、比赛和表现数据
     */
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
     * 格式化模型名称以更好地显示
     * 例如: "claude-3-opus" -> "Claude 3 Opus"
     */
    private String formatModelName(String modelName) {
        // 简单格式化：替换连字符为空格，首字母大写
        String[] parts = modelName.split("-");
        StringBuilder formatted = new StringBuilder();
        
        for (String part : parts) {
            if (!part.isEmpty()) {
                formatted.append(Character.toUpperCase(part.charAt(0)))
                         .append(part.substring(1))
                         .append(" ");
            }
        }
        
        return formatted.toString().trim();
    }
}
