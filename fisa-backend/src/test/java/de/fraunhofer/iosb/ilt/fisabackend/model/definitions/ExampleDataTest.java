package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

public class ExampleDataTest {

    private int expectedCount;
    private double expectedValueMax;
    private double expectedValueMin;
    private LocalDateTime expectedTimeMax;
    private LocalDateTime expectedTimeMin;

    private ExampleData actual = new ExampleData();

    @BeforeEach
    void setUp() {
        this.expectedCount = 300;
        this.expectedValueMax = 20;
        this.expectedValueMin = -10;
        this.expectedTimeMax = LocalDateTime.of(2020, 5, 10, 12, 55);
        this.expectedTimeMin = LocalDateTime.of(2020, 5, 7, 12, 55);

        this.actual = new ExampleData(
                this.expectedCount,
                this.expectedValueMax,
                this.expectedValueMin,
                this.expectedTimeMax,
                this.expectedTimeMin
        );
    }

    @Test
    void getCountTest() {
        assertEquals(this.expectedCount, this.actual.getCount());
    }

    @Test
    void getValueMaxTest() {
        assertEquals(this.expectedValueMax, this.actual.getValueMax());
    }

    @Test
    void getValueMinTest() {
        assertEquals(this.expectedValueMin, this.actual.getValueMin());
    }

    @Test
    void getTimeMax() {
        assertEquals(this.expectedTimeMax, this.actual.getTimeMax());
    }

    @Test
    void getTimeMin() {
        assertEquals(this.expectedTimeMin, this.actual.getTimeMin());
    }

    @Test
    void setCountTest() {
        this.expectedCount = 100;

        this.actual.setCount(100);

        assertEquals(this.expectedCount, this.actual.getCount());
    }

    @Test
    void setValueMaxTest() {
        this.expectedValueMax = 1000;

        this.actual.setValueMax(1000);

        assertEquals(this.expectedValueMax, this.actual.getValueMax());
    }

    @Test
    void setValueMinTest() {
        this.expectedValueMin = -300;

        this.actual.setValueMin(-300);

        assertEquals(this.expectedValueMin, this.actual.getValueMin());
    }

    @Test
    void setTimeMax() {
        this.expectedTimeMax = LocalDateTime.of(2020, 5, 6, 6, 6);

        this.actual.setTimeMax(LocalDateTime.of(2020, 5, 6, 6, 6));

        assertEquals(this.expectedTimeMax, this.actual.getTimeMax());
    }

    @Test
    void setTimeMin() {
        this.expectedTimeMin = LocalDateTime.of(2020, 5, 6, 6, 6);

        this.actual.setTimeMin(LocalDateTime.of(2020, 5, 6, 6, 6));

        assertEquals(this.expectedTimeMin, this.actual.getTimeMin());
    }

    @Test
    void parseExampleData() {
        String s = "{\n" +
                "        \"count\": 10,\n" +
                "        \"valueMin\": 0,\n" +
                "        \"valueMax\": 14,\n" +
                "        \"timeMin\": \"2020-01-01T01:00:00\",\n" +
                "        \"timeMax\": \"2020-01-01T23:59:59\"\n" +
                "      }";
        ObjectMapper mapper = new ObjectMapper();
        try {
            ExampleData data = mapper.readValue(s, ExampleData.class);
            System.out.println(data);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            fail();
        }
    }

}
