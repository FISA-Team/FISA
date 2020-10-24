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
    private ExampleDataGenerator generator;

    @BeforeEach
    void setUp() {
        this.generator = new ExampleDataGenerator();
    }


    @Test
    void generateExampleDataTest() {
        ExampleData data = new ExampleData(2, 25d, 15d,
                LocalDateTime.of(2021, 1, 1, 0, 0),
                LocalDateTime.of(2020, 1, 1, 0, 0));
        List<Observation> observations = generator.generateObservations(data, new Point(1, 1));
        assertEquals(2, observations.size());
    }

    @Test
    void generateExampleDataTest2() {
        ExampleData data = new ExampleData(3, 25d, 15d,
                LocalDateTime.of(2021, 1, 1, 0, 0),
                LocalDateTime.of(2020, 1, 1, 0, 0));
        List<Observation> observations = generator.generateObservations(data, new Point(1, 0));
        assertEquals(3, observations.size());
    }
}
