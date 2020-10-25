package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

public class ExampleDataTest {

    private static final int EXAMPLE_YEAR = 2020;
    private static final int EXAMPLE_EXP_COUNT = 300;
    private static final int EXAMPLE_EXP_VAL_MAX = 20;
    private static final int EXAMPLE_EXP_VAL_MIN = -10;
    private static final int EXAMPLE_MONTH = 5;
    private static final int EXAMPLE_DAY_ONE = 10;
    private static final int EXAMPLE_DAY_TWO = 7;
    private static final int EXAMPLE_HOUR = 12;
    private static final int  EXAMPLE_HOUR_TWO = 6;
    private static final int EXAMPLE_MINUTE = 55;
    private static final int EXAMPLE_COUNT = 100;
    private static final int EXAMPLE_MAX_VALUE = 1000;
    private static final int EXAMPLE_MIN_VALUE = -300;

    private int expectedCount;
    private double expectedValueMax;
    private double expectedValueMin;
    private LocalDateTime expectedTimeMax;
    private LocalDateTime expectedTimeMin;

    private ExampleData actual = new ExampleData();

    @BeforeEach
    void setUp() {
        this.expectedCount = EXAMPLE_EXP_COUNT;
        this.expectedValueMax = EXAMPLE_EXP_VAL_MAX;
        this.expectedValueMin = EXAMPLE_EXP_VAL_MIN;
        this.expectedTimeMax = LocalDateTime.of(
                EXAMPLE_YEAR,
                EXAMPLE_MONTH,
                EXAMPLE_DAY_ONE,
                EXAMPLE_HOUR,
                EXAMPLE_MINUTE);
        this.expectedTimeMin = LocalDateTime.of(
                EXAMPLE_YEAR,
                EXAMPLE_MONTH,
                EXAMPLE_DAY_TWO,
                EXAMPLE_HOUR,
                EXAMPLE_MINUTE);

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
        this.expectedCount = EXAMPLE_COUNT;

        this.actual.setCount(EXAMPLE_COUNT);

        assertEquals(this.expectedCount, this.actual.getCount());
    }

    @Test
    void setValueMaxTest() {
        this.expectedValueMax = EXAMPLE_MAX_VALUE;

        this.actual.setValueMax(EXAMPLE_MAX_VALUE);

        assertEquals(this.expectedValueMax, this.actual.getValueMax());
    }

    @Test
    void setValueMinTest() {
        this.expectedValueMin = EXAMPLE_MIN_VALUE;

        this.actual.setValueMin(EXAMPLE_MIN_VALUE);

        assertEquals(this.expectedValueMin, this.actual.getValueMin());
    }

    @Test
    void setTimeMax() {
        this.expectedTimeMax = LocalDateTime.of(
                EXAMPLE_YEAR,
                EXAMPLE_MONTH,
                EXAMPLE_MONTH + 1,
                EXAMPLE_HOUR,
                EXAMPLE_MINUTE);

        this.actual.setTimeMax(LocalDateTime.of(
                EXAMPLE_YEAR,
                EXAMPLE_MONTH,
                EXAMPLE_MONTH + 1,
                EXAMPLE_HOUR,
                EXAMPLE_MINUTE));

        assertEquals(this.expectedTimeMax, this.actual.getTimeMax());
    }

    @Test
    void setTimeMin() {
        this.expectedTimeMin = LocalDateTime.of(
                EXAMPLE_YEAR,
                EXAMPLE_MONTH,
                EXAMPLE_DAY_TWO,
                EXAMPLE_HOUR_TWO,
                EXAMPLE_HOUR_TWO);

        this.actual.setTimeMin(LocalDateTime.of(
                EXAMPLE_YEAR,
                EXAMPLE_MONTH,
                EXAMPLE_DAY_TWO,
                EXAMPLE_HOUR_TWO,
                EXAMPLE_HOUR_TWO));

        assertEquals(this.expectedTimeMin, this.actual.getTimeMin());
    }

    @Test
    void parseExampleData() {
        String s = "{\n"
                + "        \"count\": 10,\n"
                + "        \"valueMin\": 0,\n"
                + "        \"valueMax\": 14,\n"
                + "        \"timeMin\": \"2020-01-01T01:00:00\",\n"
                + "        \"timeMax\": \"2020-01-01T23:59:59\"\n"
                + "      }";
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
