package com.sciencearena.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.sciencearena.backend.service.DataService;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*") // 允许跨域请求，在生产环境中应该限制来源
public class DataController {

    private final DataService dataService;

    @Autowired
    public DataController(DataService dataService) {
        this.dataService = dataService;
    }

    @GetMapping("/overall")
    public Map<String, Object> getOverallData() {
        return dataService.processOverallData();
    }
}
