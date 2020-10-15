package de.fraunhofer.iosb.ilt.fisabackend.model;

import de.fraunhofer.iosb.ilt.sta.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertIterableEquals;


public class SensorThingsApiBundleTest {

    private SensorThingsApiBundle actual;

    private List<EntityWrapper<Datastream>> expectedDatastreams;
    private List<EntityWrapper<Thing>> expectedThings;
    private List<EntityWrapper<Sensor>> expectedSensors;
    private List<EntityWrapper<Location>> expectedLocations;
    private List<EntityWrapper<HistoricalLocation>> expectedHistoricalLocations;
    private List<EntityWrapper<ObservedProperty>> expectedObservedProperties;
    private List<EntityWrapper<Observation>> expectedObservations;
    private List<EntityWrapper<FeatureOfInterest>> expectedFeatureOfInterests;


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

        this.expectedDatastreams.add(new EntityWrapper<>(testStream, null));
        this.actual.addDatastream(testStream, null);

        assertIterableEquals(expectedDatastreams, this.actual.getDatastreams());
    }

    @Test
    void addThingTest() {
        Thing testThing = new Thing();

        this.expectedThings.add(new EntityWrapper<>(testThing, null));
        this.actual.addThing(testThing, null);

        assertIterableEquals(expectedThings, this.actual.getThings());
    }

    @Test
    void addSensorTest() {
        Sensor testSensor = new Sensor();

        this.expectedSensors.add(new EntityWrapper<>(testSensor, null));
        this.actual.addSensor(testSensor, null);

        assertIterableEquals(expectedSensors, this.actual.getSensors());
    }

    @Test
    void addLocationTest() {
        Location testLocation = new Location();

        this.expectedLocations.add(new EntityWrapper<>(testLocation, null));
        this.actual.addLocation(testLocation, null);

        assertIterableEquals(expectedLocations, this.actual.getLocations());
    }

    @Test
    void addHistoricalLocationTest() {
        HistoricalLocation testHistoricalLocation = new HistoricalLocation();

        this.expectedHistoricalLocations.add(new EntityWrapper<>(testHistoricalLocation, null));
        this.actual.addHistoricalLocation(testHistoricalLocation, null);

        assertIterableEquals(expectedHistoricalLocations, this.actual.getHistoricalLocations());
    }

    @Test
    void addObservedPropertyTest() {
        ObservedProperty testObservedProperty = new ObservedProperty();

        this.expectedObservedProperties.add(new EntityWrapper<>(testObservedProperty, null));
        this.actual.addObservedProperty(testObservedProperty, null);

        assertIterableEquals(expectedObservedProperties, this.actual.getObservedProperties());
    }

    @Test
    void addObservationTest() {
        Observation testObservation = new Observation();

        this.expectedObservations.add(new EntityWrapper<>(testObservation, null));
        this.actual.addObservation(testObservation, null);

        assertIterableEquals(expectedObservations, this.actual.getObservations());
    }

    @Test
    void addFeatureOfInterestTest() {
        FeatureOfInterest testFeatureOfInterest = new FeatureOfInterest();

        this.expectedFeatureOfInterests.add(new EntityWrapper<>(testFeatureOfInterest, null));
        this.actual.addFeatureOfInterest(testFeatureOfInterest, null);

        assertIterableEquals(expectedFeatureOfInterests, this.actual.getFeatureOfInterests());
    }

}
