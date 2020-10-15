package de.fraunhofer.iosb.ilt.fisabackend.model;

import java.util.List;
import java.util.ArrayList;

import de.fraunhofer.iosb.ilt.sta.model.*;

/**
 * The SensorThingsApiBundle represents a set of entities of the SensorThings-API.
 * The entities are instances of classes of the FROST-Client.
 */
public class SensorThingsApiBundle {

    private List<EntityWrapper<Datastream>> datastreams;
    private List<EntityWrapper<Thing>> things;
    private List<EntityWrapper<Sensor>> sensors;
    private List<EntityWrapper<Location>> locations;
    private List<EntityWrapper<HistoricalLocation>> historicalLocations;
    private List<EntityWrapper<ObservedProperty>> observedProperties;
    private List<EntityWrapper<Observation>> observations;
    private List<EntityWrapper<FeatureOfInterest>> featureOfInterests;

    /**
     * Instantiates a new SensorThingsApiBundle.
     */
    public SensorThingsApiBundle() {
        this.datastreams = new ArrayList<>();
        this.things = new ArrayList<>();
        this.sensors = new ArrayList<>();
        this.locations = new ArrayList<>();
        this.historicalLocations = new ArrayList<>();
        this.observedProperties = new ArrayList<>();
        this.observations = new ArrayList<>();
        this.featureOfInterests = new ArrayList<>();
    }

    /**
     * @return List of Datastream
     */
    public List<EntityWrapper<Datastream>> getDatastreams() {
        return this.datastreams;
    }

    /**
     * @return List of Thing
     */
    public List<EntityWrapper<Thing>> getThings() {
        return this.things;
    }

    /**
     * @return List of Sensor
     */
    public List<EntityWrapper<Sensor>> getSensors() {
        return this.sensors;
    }

    /**
     * @return List of Location
     */
    public List<EntityWrapper<Location>> getLocations() {
        return this.locations;
    }

    /**
     * @return List of HistoricalLocation
     */
    public List<EntityWrapper<HistoricalLocation>> getHistoricalLocations() {
        return this.historicalLocations;
    }

    /**
     * @return List of ObservedProperty
     */
    public List<EntityWrapper<ObservedProperty>> getObservedProperties() {
        return this.observedProperties;
    }

    /**
     * @return List of Observation
     */
    public List<EntityWrapper<Observation>> getObservations() {
        return this.observations;
    }

    /**
     * @return List of FeatureOfInterest
     */
    public List<EntityWrapper<FeatureOfInterest>> getFeatureOfInterests() {
        return this.featureOfInterests;
    }

    /**
     * Adds a new Datastream to the list of Datastream.
     *
     * @param datastream Datastream to be added
     */
    public void addDatastream(Datastream datastream, Id id) {
        this.datastreams.add(new EntityWrapper<>(datastream, id));
    }

    /**
     * Adds a new Thing to the list of Thing.
     *
     * @param thing Thing to be added
     */
    public void addThing(Thing thing, Id id) {
        this.things.add(new EntityWrapper<>(thing, id));
    }

    /**
     * Adds a new Sensor to the list of Sensor.
     *
     * @param sensor Sensor to be added
     */
    public void addSensor(Sensor sensor, Id id) {
        this.sensors.add(new EntityWrapper<>(sensor));
    }

    /**
     * Adds a new Location to the list of Location.
     *
     * @param location Location to be added
     */
    public void addLocation(Location location, Id id) {
        this.locations.add(new EntityWrapper<>(location));
    }

    /**
     * Adds a new HistoricalLocation to the list of HistoricalLocation.
     *
     * @param historicalLocation HistoricalLocation to be added
     */
    public void addHistoricalLocation(HistoricalLocation historicalLocation, Id id) {
        this.historicalLocations.add(new EntityWrapper<>(historicalLocation));
    }

    /**
     * Adds a new ObservedProperty to the list of ObservedProperty.
     *
     * @param observedProperty ObservedProperty to be added
     */
    public void addObservedProperty(ObservedProperty observedProperty, Id id) {
        this.observedProperties.add(new EntityWrapper<>(observedProperty));
    }

    /**
     * Adds a new Observation to the list of Observation.
     *
     * @param observation Observation to be added
     */
    public void addObservation(Observation observation, Id id) {
        this.observations.add(new EntityWrapper<>(observation));
    }

    /**
     * Adds a new FeatureOfInterest to the list of FeatureOfInterest.
     *
     * @param featureOfInterest FeatureOfInterest to be added
     */
    public void addFeatureOfInterest(FeatureOfInterest featureOfInterest, Id id) {
        this.featureOfInterests.add(new EntityWrapper<>(featureOfInterest));
    }
}
