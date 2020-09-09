package de.fraunhofer.iosb.ilt.fisabackend;

import de.fraunhofer.iosb.ilt.fisabackend.service.converter.FisaConverter;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.DynamicMappingResolver;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.MappingResolver;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;;

@RestController
@SpringBootApplication
public class FisaBackendApplication {

    /**
     * The entry-point for the application.
     * @param args
     */
    public static void main(final String[] args) {
        SpringApplication.run(FisaBackendApplication.class, args);
    }

    @Value("${app.filesDirectory}")
    private String dir;

    /**
     * Shows a simple Hello-World Message.
     * @return Message
     */
    @RequestMapping("/")
    public String info() {
        return "This is the Fisa-Backend FilePath: " + dir;
    }

    /**
     * @return The mapping resolver.
     */
    @Bean
    public MappingResolver getMappingResolver() {
        var resolver = new DynamicMappingResolver();
        resolver.registerRootMapper("STA", new StaMapper());
        return resolver;
    }

    /**
     * @return The fisa converter.
     */
    @Bean
    public FisaConverter getConverter() {
        return new FisaConverter(getMappingResolver());
    }
}
