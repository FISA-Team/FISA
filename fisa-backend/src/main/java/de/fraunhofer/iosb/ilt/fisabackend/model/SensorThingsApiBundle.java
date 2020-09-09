package de.fraunhofer.iosb.ilt.fisabackend.model;

import java.util.List;
import java.util.ArrayList;

import de.fraunhofer.iosb.ilt.sta.model.Datastream;
import de.fraunhofer.iosb.ilt.sta.model.FeatureOfInterest;
import de.fraunhofer.iosb.ilt.sta.model.HistoricalLocation;
import de.fraunhofer.iosb.ilt.sta.model.Location;
import de.fraunhofer.iosb.ilt.sta.model.Observation;
import de.fraunhofer.iosb.ilt.sta.model.ObservedProperty;
import de.fraunhofer.iosb.ilt.sta.model.Sensor;
import de.fraunhofer.iosb.ilt.sta.model.Thing;

/**
 * The SensorThingsApiBundle represents a set of entities of the SensorThings-API.
 * The entities are instances of classes of the FROST-Client.
 */
public class SensorThingsApiBundle {

    private List<Datastream> datastreams;
    private List<Thing> things;
    private List<Sensor> sensors;
    private List<Location> locations;
    private List<HistoricalLocation> historicalLocations;
    private List<ObservedProperty> observedProperties;
    private List<Observation> observations;
    private List<FeatureOfInterest> featureOfInterests;

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
    public List<Datastream> getDatastreams() {
        return this.datastreams;
    }

    /**
     * @return List of Thing
     */
    public List<Thing> getThings() {
        return this.things;
    }

    /**
     * @return List of Sensor
     */
    public List<Sensor> getSensors() {
        return this.sensors;
    }

    /**
     * @return List of Location
     */
    public List<Location> getLocations() {
        return this.locations;
    }

    /**
     * @return List of HistoricalLocation
     */
    public List<HistoricalLocation> getHistoricalLocations() {
        return this.historicalLocations;
    }

    /**
     * @return List of ObservedProperty
     */
    public List<ObservedProperty> getObservedProperties() {
        return this.observedProperties;
    }

    /**
     * @return List of Observation
     */
    public List<Observation> getObservations() {
        return this.observations;
    }

    /**
     * @return List of FeatureOfInterest
     */
    public List<FeatureOfInterest> getFeatureOfInterests() {
        return this.featureOfInterests;
    }

    /**
     * Adds a new Datastream to the list of Datastream.
     *
     * @param datastream Datastream to be added
     */
    public void addDatastream(Datastream datastream) {
        this.datastreams.add(datastream);
    }

    /**
     * Adds a new Thing to the list of Thing.
     *
     * @param thing Thing to be added
     */
    public void addThing(Thing thing) {
        this.things.add(thing);
    }

    /**
     * Adds a new Sensor to the list of Sensor.
     *
     * @param sensor Sensor to be added
     */
    public void addSensor(Sensor sensor) {
        this.sensors.add(sensor);
    }

    /**
     * Adds a new Location to the list of Location.
     *
     * @param location Location to be added
     */
    public void addLocation(Location location) {
        this.locations.add(location);
    }

    /**
     * Adds a new HistoricalLocation to the list of HistoricalLocation.
     *
     * @param historicalLocation HistoricalLocation to be added
     */
    public void addHistoricalLocation(HistoricalLocation historicalLocation) {
        this.historicalLocations.add(historicalLocation);
    }

    /**
     * Adds a new ObservedProperty to the list of ObservedProperty.
     *
     * @param observedProperty ObservedProperty to be added
     */
    public void addObservedProperty(ObservedProperty observedProperty) {
        this.observedProperties.add(observedProperty);
    }

    /**
     * Adds a new Observation to the list of Observation.
     *
     * @param observation Observation to be added
     */
    public void addObservation(Observation observation) {
        this.observations.add(observation);
    }

    /**
     * Adds a new FeatureOfInterest to the list of FeatureOfInterest.
     *
     * @param featureOfInterest FeatureOfInterest to be added
     */
    public void addFeatureOfInterest(FeatureOfInterest featureOfInterest) {
        this.featureOfInterests.add(featureOfInterest);
    }
}
