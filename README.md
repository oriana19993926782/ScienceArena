# Science Arena

这是一个基于Spring Boot的前后端分离项目，用于展示和比较不同AI模型在科学考试中的表现。后端运行在8090端口。

## 项目结构

```
ScienceArena/
├── backend/                   # Spring Boot 后端项目
│   ├── src/                   # 源代码
│   │   ├── main/
│   │   │   ├── java/com/sciencearena/backend/
│   │   │   │   ├── controller/    # 控制器
│   │   │   │   ├── service/       # 服务层
│   │   │   │   ├── BackendApplication.java  # 主应用类
│   │   │   ├── resources/
│   │   │   │   ├── data/          # 数据文件目录
│   │   │   │   │   ├── overallPerformance.json         # 总体表现数据
│   │   │   │   │   ├── com_models_score_perQuestion.json  # 每题得分数据
│   │   │   │   │   ├── com_models_pubTime_cost_info.json  # 模型发布和成本信息
│   │   │   │   │   ├── com_models_questions_modelAnswer_perRun_details.json # 模型回答详情
│   │   │   │   ├── application.properties   # 配置文件
│   ├── pom.xml                # Maven 依赖配置
├── static_frontend/          # 静态前端项目
│   ├── index.html             # 首页HTML文件
│   ├── static/                # 静态资源目录
│   │   ├── css/               # CSS样式文件
│   │   │   ├── index.css      # 主样式文件
│   │   │   ├── overall-table.css # 总体表格样式
│   │   ├── js/                # JavaScript文件
│   │   │   ├── competitions.js # 竞赛数据处理脚本
```

## 运行项目

### 后端 (Spring Boot)

1. 进入后端目录：
   ```
   cd backend
   ```

2. 使用Maven编译并运行：
   ```
   mvn spring-boot:run
   ```

3. 后端将在8090端口启动

### 前端 (HTML/CSS/JS)

1. 前端为纯静态文件，无需构建
2. 使用任何静态文件服务器提供服务，或直接通过后端访问（后端已配置为提供静态文件）

## API接口

后端提供以下API：

- GET `/api/competitions` - 获取所有比赛名称
- GET `/api/competition/{competitionId}` - 获取特定比赛的数据
- GET `/api/overall` - 获取所有模型的总体表现数据
- GET `/api/model-answer/{competitionId}/{modelName}/{questionId}` - 获取特定模型对特定问题的回答详情

## 数据结构

项目使用JSON文件存储数据，主要包括：

- `overallPerformance.json` - 包含各模型在不同比赛中的总体表现
- `com_models_score_perQuestion.json` - 包含各模型在每个问题上的得分
- `com_models_pubTime_cost_info.json` - 包含模型的发布时间和成本信息
- `com_models_questions_modelAnswer_perRun_details.json` - 包含模型回答的详细信息
