package de.fraunhofer.iosb.ilt.fisabackend.model;

import de.fraunhofer.iosb.ilt.sta.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertIterableEquals;


public class SensorThingsApiBundleTest {

    private SensorThingsApiBundle actual;

    private List<Datastream> expectedDatastreams;
    private List<Thing> expectedThings;
    private List<Sensor> expectedSensors;
    private List<Location> expectedLocations;
    private List<HistoricalLocation> expectedHistoricalLocations;
    private List<ObservedProperty> expectedObservedProperties;
    private List<Observation> expectedObservations;
    private List<FeatureOfInterest> expectedFeatureOfInterests;


    @BeforeEach
    void setUp() {
        this.actual = new SensorThingsApiBundle();

        this.expectedDatastreams = new ArrayList<>();
        this.expectedThings = new ArrayList<>();
        this.expectedSensors = new ArrayList<>();
        this.expectedLocations = new ArrayList<>();
        this.expectedHistoricalLocations = new ArrayList<>();
        this.expectedObservedProperties = new ArrayList<>();
        this.expectedObservations = new ArrayList<>();
        this.expectedFeatureOfInterests = new ArrayList<>();
    }

    @Test
    void addDatastreamTest() {
        Datastream testStream = new Datastream();

        this.expectedDatastreams.add(testStream);
        this.actual.addDatastream(testStream);

        assertIterableEquals(expectedDatastreams, this.actual.getDatastreams());
    }

    @Test
    void addThingTest() {
        Thing testThing = new Thing();

        this.expectedThings.add(testThing);
        this.actual.addThing(testThing);

        assertIterableEquals(expectedThings, this.actual.getThings());
    }

    @Test
    void addSensorTest() {
        Sensor testSensor = new Sensor();

        this.expectedSensors.add(testSensor);
        this.actual.addSensor(testSensor);

        assertIterableEquals(expectedSensors, this.actual.getSensors());
    }

    @Test
    void addLocationTest() {
        Location testLocation = new Location();

        this.expectedLocations.add(testLocation);
        this.actual.addLocation(testLocation);

        assertIterableEquals(expectedLocations, this.actual.getLocations());
    }

    @Test
    void addHistoricalLocationTest() {
        HistoricalLocation testHistoricalLocation = new HistoricalLocation();

        this.expectedHistoricalLocations.add(testHistoricalLocation);
        this.actual.addHistoricalLocation(testHistoricalLocation);

        assertIterableEquals(expectedHistoricalLocations, this.actual.getHistoricalLocations());
    }

    @Test
    void addObservedPropertyTest() {
        ObservedProperty testObservedProperty = new ObservedProperty();

        this.expectedObservedProperties.add(testObservedProperty);
        this.actual.addObservedProperty(testObservedProperty);

        assertIterableEquals(expectedObservedProperties, this.actual.getObservedProperties());
    }

    @Test
    void addObservationTest() {
        Observation testObservation = new Observation();

        this.expectedObservations.add(testObservation);
        this.actual.addObservation(testObservation);

        assertIterableEquals(expectedObservations, this.actual.getObservations());
    }

    @Test
    void addFeatureOfInterestTest() {
        FeatureOfInterest testFeatureOfInterest = new FeatureOfInterest();

        this.expectedFeatureOfInterests.add(testFeatureOfInterest);
        this.actual.addFeatureOfInterest(testFeatureOfInterest);

        assertIterableEquals(expectedFeatureOfInterests, this.actual.getFeatureOfInterests());
    }


}
