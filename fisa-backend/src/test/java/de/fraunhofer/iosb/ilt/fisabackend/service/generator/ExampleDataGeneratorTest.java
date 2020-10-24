package de.fraunhofer.iosb.ilt.fisabackend.service.generator;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.ExampleData;
import de.fraunhofer.iosb.ilt.sta.model.Observation;
import org.geojson.Point;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ExampleDataGeneratorTest {
    private static final int EXAMPLE_YEAR = 2020;
    private static final double EXAMPLE_VALUE_MAX = 25d;
    private static final double EXAMPLE_VALUE_MIN = 15d;
    private static final int EXAMPLE_COUNT = 3;

    private ExampleDataGenerator generator;

    @BeforeEach
    void setUp() {
        this.generator = new ExampleDataGenerator();
    }


    @Test
    void generateExampleDataTest() {
        ExampleData data = new ExampleData(2, EXAMPLE_VALUE_MAX, EXAMPLE_VALUE_MIN,
                LocalDateTime.of(EXAMPLE_YEAR + 1, 1, 1, 0, 0),
                LocalDateTime.of(EXAMPLE_YEAR, 1, 1, 0, 0));
        List<Observation> observations = generator.generateObservations(data, new Point(1, 1));
        assertEquals(2, observations.size());
    }

    @Test
    void generateExampleDataTest2() {
        ExampleData data = new ExampleData(EXAMPLE_COUNT, EXAMPLE_VALUE_MAX, EXAMPLE_VALUE_MIN,
                LocalDateTime.of(EXAMPLE_YEAR + 1, 1, 1, 0, 0),
                LocalDateTime.of(EXAMPLE_YEAR, 1, 1, 0, 0));
        List<Observation> observations = generator.generateObservations(data, new Point(1, 0));
        assertEquals(EXAMPLE_COUNT, observations.size());
    }
}
