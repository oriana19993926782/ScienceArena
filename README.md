# Science Arena

这是一个基于Spring Boot的前后端分离项目，后端运行在8090端口。

## 项目结构

```
ScienceArena/
├── backend/                   # Spring Boot 后端项目
│   ├── src/                   # 源代码
│   │   ├── main/
│   │   │   ├── java/com/sciencearena/backend/
│   │   │   │   ├── controller/    # 控制器
│   │   │   │   ├── BackendApplication.java  # 主应用类
│   │   │   ├── resources/
│   │   │   │   ├── application.properties   # 配置文件
│   ├── pom.xml                # Maven 依赖配置
├── frontend-simple/           # 纯HTML/CSS/JS前端项目
│   ├── css/                   # CSS样式文件
│   │   ├── styles.css         # 主样式文件
│   ├── js/                    # JavaScript文件
│   │   ├── main.js            # 主脚本文件
│   ├── index.html             # 首页HTML文件
│   ├── about.html             # 关于页面HTML文件
```

## 运行项目

### 后端 (Spring Boot)

1. 进入后端目录：
   ```
   cd backend
   ```

2. 使用Maven编译并运行：
   ```
   ./mvnw spring-boot:run
   ```
   或者使用Maven：
   ```
   mvn spring-boot:run
   ```

3. 后端将在8090端口启动

### 前端 (HTML/CSS/JS)

1. 前端为纯静态文件，无需构建
2. 可以直接在浏览器中打开frontend-simple/index.html文件，或者使用任何静态文件服务器提供服务

## API测试

后端提供了一个简单的测试API：

- GET `http://localhost:8090/api/hello` - 返回一个简单的问候消息

前端主页上有一个按钮，点击可以测试与后端的连接。
