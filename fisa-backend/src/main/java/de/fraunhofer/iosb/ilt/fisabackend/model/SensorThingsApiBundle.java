package de.fraunhofer.iosb.ilt.fisabackend.model;

import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;

import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;
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
     * Sorts Entities with no FrostId to the front, to create this Entities first.
     */
    public void sort() {
        datastreams.sort(new CompareEntities());
        things.sort(new CompareEntities());
        sensors.sort(new CompareEntities());
        locations.sort(new CompareEntities());
        historicalLocations.sort(new CompareEntities());
        observedProperties.sort(new CompareEntities());
        observations.sort(new CompareEntities());
        featureOfInterests.sort(new CompareEntities());
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
     * @param definingFisaObject the defining FISA-Object of the Datastream
     */
    public void addDatastream(Datastream datastream, FisaObject definingFisaObject) {
        this.datastreams.add(new EntityWrapper<>(datastream, definingFisaObject));
    }

    /**
     * Adds a new Thing to the list of Thing.
     *
     * @param thing Thing to be added
     * @param definingFisaObject the defining FISA-Object of the Thing
     */
    public void addThing(Thing thing, FisaObject definingFisaObject) {
        this.things.add(new EntityWrapper<>(thing, definingFisaObject));
    }

    /**
     * Adds a new Sensor to the list of Sensor.
     *
     * @param sensor Sensor to be added
     * @param definingFisaObject the defining FISA-Object of the Sensor
     */
    public void addSensor(Sensor sensor, FisaObject definingFisaObject) {
        this.sensors.add(new EntityWrapper<>(sensor, definingFisaObject));
    }

    /**
     * Adds a new Location to the list of Location.
     *
     * @param location Location to be added
     * @param definingFisaObject the defining FISA-Object of the Location
     */
    public void addLocation(Location location, FisaObject definingFisaObject) {
        this.locations.add(new EntityWrapper<>(location, definingFisaObject));
    }

    /**
     * Adds a new HistoricalLocation to the list of HistoricalLocation.
     *
     * @param historicalLocation HistoricalLocation to be added
     * @param definingFisaObject the defining FISA-Object of the HistoricalLocation
     */
    public void addHistoricalLocation(HistoricalLocation historicalLocation, FisaObject definingFisaObject) {
        this.historicalLocations.add(new EntityWrapper<>(historicalLocation, definingFisaObject));
    }

    /**
     * Adds a new ObservedProperty to the list of ObservedProperty.
     *
     * @param observedProperty ObservedProperty to be added
     * @param definingFisaObject the defining FISA-Object of the ObservedProperty
     */
    public void addObservedProperty(ObservedProperty observedProperty, FisaObject definingFisaObject) {
        this.observedProperties.add(new EntityWrapper<>(observedProperty, definingFisaObject));
    }

    /**
     * Adds a new Observation to the list of Observation.
     *
     * @param observation Observation to be added
     * @param definingFisaObject the defining FISA-Object of the Observation
     */
    public void addObservation(Observation observation, FisaObject definingFisaObject) {
        this.observations.add(new EntityWrapper<>(observation, definingFisaObject));
    }

    /**
     * Adds a new FeatureOfInterest to the list of FeatureOfInterest.
     *
     * @param featureOfInterest FeatureOfInterest to be added
     * @param definingFisaObject the defining FISA-Object of the FeatureOfInterest
     */
    public void addFeatureOfInterest(FeatureOfInterest featureOfInterest, FisaObject definingFisaObject) {
        this.featureOfInterests.add(new EntityWrapper<>(featureOfInterest, definingFisaObject));
    }

    /**
     * A private class to compare the Enteties
     */
    private static class CompareEntities implements Comparator<EntityWrapper<?>> {

        @Override
        public int compare(EntityWrapper<?> o1, EntityWrapper<?> o2) {
            if (o1.getDefiningFisaObject().getFrostId() == null && o2.getDefiningFisaObject().getFrostId() == null) {
                return 0;
            }
            if (o1.getDefiningFisaObject().getFrostId() == null) {
                return -1;
            }
            if (o2.getDefiningFisaObject().getFrostId() == null) {
                return 1;
            }
            return 0;
        }
    }
}
