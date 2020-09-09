package de.fraunhofer.iosb.ilt.fisabackend.service.generator;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.ExampleData;
import de.fraunhofer.iosb.ilt.sta.model.FeatureOfInterest;
import de.fraunhofer.iosb.ilt.sta.model.Observation;
import org.geojson.GeoJsonObject;
import org.geojson.Point;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.DoubleStream;

public class ExampleDataGenerator {

    /**
     * Generates a list of observations from example data.
     *
     * @param exampleData the data to generate observations from.
     * @param location    the location associated with the observations.
     * @return a list of observations.
     */
    public List<Observation> generateObservations(ExampleData exampleData, GeoJsonObject location) {
        int count = exampleData.getCount();
        List<Observation> observations = new ArrayList<>(count);
        LocalDateTime min = exampleData.getTimeMin();
        Duration offset = Duration.between(min, exampleData.getTimeMax());
        if (count > 1) {
            offset = offset.dividedBy(count - 1);
        }
        DoubleStream doubleStream = randomValueGenerator(exampleData);
        double[] doubles = doubleStream.toArray();
        GeoJsonObject absoluteLocation = location == null ? new Point(0, 0) : location;
        for (int i = 0; i < count; i++) {
            Observation observation = new Observation();
            ZonedDateTime dateTime = min.plus(offset.multipliedBy(i)).atZone(ZoneId.systemDefault());
            observation.setFeatureOfInterest(
                    new FeatureOfInterest(dateTime + "." + i, "", "application/geo+json", absoluteLocation));
            observation.setResultTime(dateTime);
            observation.setResult(doubles[i]);
            observations.add(observation);
        }
        return observations;
    }

    private static DoubleStream randomValueGenerator(ExampleData exampleData) {
        return ThreadLocalRandom.current().doubles(exampleData.getCount(),
                exampleData.getValueMin(),
                exampleData.getValueMax());
    }
}
