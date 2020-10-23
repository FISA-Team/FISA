package de.fraunhofer.iosb.ilt.fisabackend.service;

import de.fraunhofer.iosb.ilt.fisabackend.model.EntityWrapper;
import de.fraunhofer.iosb.ilt.fisabackend.model.SensorThingsApiBundle;
import de.fraunhofer.iosb.ilt.fisabackend.model.UploadToFrostResponse;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.EntityTransferException;
import de.fraunhofer.iosb.ilt.sta.ServiceFailureException;
import de.fraunhofer.iosb.ilt.sta.StatusCodeException;
import de.fraunhofer.iosb.ilt.sta.model.Datastream;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;
import de.fraunhofer.iosb.ilt.sta.model.FeatureOfInterest;
import de.fraunhofer.iosb.ilt.sta.model.HistoricalLocation;
import de.fraunhofer.iosb.ilt.sta.model.Location;
import de.fraunhofer.iosb.ilt.sta.model.Observation;
import de.fraunhofer.iosb.ilt.sta.model.ObservedProperty;
import de.fraunhofer.iosb.ilt.sta.model.Sensor;
import de.fraunhofer.iosb.ilt.sta.model.Thing;
import de.fraunhofer.iosb.ilt.sta.query.ExpandedEntity;
import de.fraunhofer.iosb.ilt.sta.query.Expansion;
import de.fraunhofer.iosb.ilt.sta.query.InvalidRelationException;
import de.fraunhofer.iosb.ilt.sta.service.SensorThingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

public class FrostCourier {
    private static final Logger LOGGER = LoggerFactory.getLogger(FrostCourier.class);

    public void removeObjects(SensorThingsApiBundle toRemove, String url) throws MalformedURLException, ServiceFailureException {
        SensorThingsService service = sensorThingsServiceInstantiator(url);

        for (EntityWrapper<Observation> observation : toRemove.getObservations()) {
            try {
                Observation o = service.observations().find(observation.getEntity().getId());
                if(o != null && o.equals(observation.getEntity())) {
                    service.observations().delete(o);
                }
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Observation: " + observation.getEntity().toString());
            }
        }

        for (EntityWrapper<Datastream> dataStream : toRemove.getDatastreams()) {
            try {
                Datastream d = service.datastreams().find(dataStream.getEntity().getId());
                if(d != null && d.equals(dataStream.getEntity())) {
                    service.datastreams().delete(d);
                }
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Datastream: " + dataStream.getEntity().toString());
            }

        }
        for (EntityWrapper<Thing> thing : toRemove.getThings()) {
            try {
                Thing t = service.things().find(thing.getEntity().getId());
                if (t != null && t.equals(thing.getEntity())) {
                    service.things().delete(t);
                }
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Thing: " + thing.getEntity().toString());
            }
        }
        for (EntityWrapper<Sensor> sensor : toRemove.getSensors()) {
            try {
                Sensor s = service.sensors().find(sensor.getEntity().getId());
                if (s != null && s.equals(sensor.getEntity())) {
                    service.sensors().delete(s);
                }
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Sensor: " + sensor.getEntity().toString());
            }
        }
        for (EntityWrapper<Location> location : toRemove.getLocations()) {
            try {
                Location l = service.locations().find(location.getEntity().getId());
                if(l != null && l.equals(location.getEntity())) {
                    service.locations().delete(l);
                }
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Location: " + location.getEntity().toString());
            }

        }
        for (EntityWrapper<HistoricalLocation> historicalLocation : toRemove.getHistoricalLocations()) {
            try {
                HistoricalLocation hl = service.historicalLocations().find(historicalLocation.getEntity().getId());
                if (hl != null && hl.equals(historicalLocation.getEntity())) {
                    service.historicalLocations().delete(hl);
                }
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the HistoricalLocation: " + historicalLocation.getEntity().toString());
            }
        }

        for (EntityWrapper<ObservedProperty> observedProperty : toRemove.getObservedProperties()) {
            try {
                ObservedProperty op = service.observedProperties().find(observedProperty.getEntity().getId());
                if(op != null && op.equals(observedProperty.getEntity())) {
                    service.observedProperties().delete(op);
                }
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the ObserverProperty: " + observedProperty.getEntity().toString());
            }
        }

        for (EntityWrapper<FeatureOfInterest> featureOfInterest : toRemove.getFeatureOfInterests()) {
            try {
                FeatureOfInterest f = service.featuresOfInterest().find(featureOfInterest.getEntity().getId());
                if(f != null && f.equals(featureOfInterest.getEntity())) {
                    service.featuresOfInterest().delete(f);
                }
            } catch (ServiceFailureException e) {
                // can't find this featureOfInterest
            }
        }
    }

    /**
     * Uploads a FISA-Project to a FROST-Server.
     *
     * @param bundle SensorThingsApiBundle containing all entities of a project
     * @param url    URL of the server, a project shall be uploaded to
     * @throws MalformedURLException   If an invalid URL is given
     * @throws ServiceFailureException If an entity cannot be uploaded to the server
     * @return The response data for the Frontend
     */
    public UploadToFrostResponse uploadProject(SensorThingsApiBundle bundle, String url)
            throws MalformedURLException, ServiceFailureException {
        SensorThingsService service = sensorThingsServiceInstantiator(url);
        LOGGER.info("Using {} as frost server url", url);
        UploadToFrostResponse responseData = new UploadToFrostResponse();

        // Sort the bundle, so not created Entites will be added first
        bundle.sort();

        for (EntityWrapper<Thing> thing : bundle.getThings()) {
            safeCreate(service, thing);
            thing.setFrostId();
            responseData.addObject(thing.getDefiningFisaObject());
            // bundle.getMultiDatastream().removeAll(thing.getMultiDatastreams()); not implemented
        }

        for (EntityWrapper<Sensor> sensor : bundle.getSensors()) {
            safeCreate(service, sensor);
            sensor.setFrostId();
            responseData.addObject(sensor.getDefiningFisaObject());
            // bundle.getMultiDatastreams().removeAll(sensor.getMultiDatastreams()); not implemented
        }

        for (EntityWrapper<Location> location : bundle.getLocations()) {
            // workaround for n:m, create things if they don't exist
            // to prevent duplication (one thing may be related to multiple locations)
            for (Thing thing : location.getEntity().getThings()) {
                if (thing.getId() == null) {
                    safeCreate(service, new EntityWrapper<>(thing));
                }
            }
            safeCreate(service, location);
            location.setFrostId();
            responseData.addObject(location.getDefiningFisaObject());
        }

        for (EntityWrapper<HistoricalLocation> historicalLocation : bundle.getHistoricalLocations()) {
            safeCreate(service, historicalLocation);
            historicalLocation.setFrostId();
            responseData.addObject(historicalLocation.getDefiningFisaObject());
        }

        for (EntityWrapper<ObservedProperty> observedProperty : bundle.getObservedProperties()) {
            safeCreate(service, observedProperty);
            observedProperty.setFrostId();
            responseData.addObject(observedProperty.getDefiningFisaObject());
            // bundle.getMultiDatastreams().removeAll(observedProperty.getMultiDatastreams()); not implemented
        }

        // 1:1 relations can be removed after upload
        // no entity should create multiple related entities of the same type
        for (EntityWrapper<Datastream> dataStream : bundle.getDatastreams()) {
            safeCreate(service, dataStream);
            Datastream loaded = service.datastreams().find(dataStream.getEntity().getId(), datastreamExpansion());
            // remove entities that are already added
            if (dataStream.getEntity().getThing() != null) {
                dataStream.getEntity().getThing().setId(loaded.getThing().getId());
            }
            if (dataStream.getEntity().getSensor() != null) {
                dataStream.getEntity().getSensor().setId(loaded.getSensor().getId());

            }
            if (dataStream.getEntity().getObservedProperty() != null) {
                dataStream.getEntity().getObservedProperty().setId(loaded.getObservedProperty().getId());
            }

            dataStream.setFrostId();
            responseData.addDatastream(dataStream.getDefiningFisaObject(), dataStream.getEntity().getName());
        }

        for (EntityWrapper<Observation> observation : bundle.getObservations()) {
            safeCreate(service, observation);
            observation.setFrostId();
            responseData.addObject(observation.getDefiningFisaObject());
            // bundle.getDatastreams().remove(observation.getDatastream());
            // bundle.getMultiDatastreams().remove(observation.getMultiDatastream()); not implemented
            // bundle.getFeatureOfInterests().remove(observation.getEntity().getFeatureOfInterest());
        }

        for (EntityWrapper<FeatureOfInterest> featureOfInterest : bundle.getFeatureOfInterests()) {
            safeCreate(service, featureOfInterest);
            featureOfInterest.setFrostId();
            responseData.addObject(featureOfInterest.getDefiningFisaObject());
        }
        LOGGER.info("Uploaded project successfully");

        return responseData;
    }

    /**
     * Creates an entity on the specified service and wraps exceptions into {@link EntityTransferException}.
     *
     * @param service the service to transfer the entity to.
     * @param entity  the entity to transfer.
     * @param <T>     the type of the entity.
     * @throws EntityTransferException if the entity couldn't be transferred correctly.
     */
    private static <T extends Entity<T>> void safeCreate(SensorThingsService service, EntityWrapper<T> entity)
            throws ServiceFailureException {
        if (entity.getEntity().getId() != null) {
            try {
                service.update(entity.getEntity());
            } catch (StatusCodeException e) {
                throw new EntityTransferException(entity.getEntity(), e);
            }
            return;
        }
        try {
            service.create(entity.getEntity());
        } catch (StatusCodeException e) {
            throw new EntityTransferException(entity.getEntity(), e);
        }
    }

    /**
     * Instanciates a SensorThingsService of the FROST-Client.
     *
     * @param url The endpoint of the service
     * @return SensorThingsService to communicate with FROST-Servers
     * @throws MalformedURLException If invalid URL is given
     */
    private SensorThingsService sensorThingsServiceInstantiator(String url) throws MalformedURLException {
        URL serviceEndpoint = new URL(url);
        return new SensorThingsService(serviceEndpoint);
    }

    private static Expansion datastreamExpansion() {
        try {
            return Expansion.of(EntityType.DATASTREAM)
                    .with(ExpandedEntity.from(EntityType.THING))
                    .and(ExpandedEntity.from(EntityType.SENSOR))
                    .and(ExpandedEntity.from(EntityType.OBSERVATIONS, EntityType.FEATURE_OF_INTEREST))
                    .and(ExpandedEntity.from(EntityType.OBSERVED_PROPERTY));
        } catch (InvalidRelationException e) {
            throw new AssertionError(e);
        }
    }
}
