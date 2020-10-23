package de.fraunhofer.iosb.ilt.fisabackend.service;

import de.fraunhofer.iosb.ilt.fisabackend.model.EntityWrapper;
import de.fraunhofer.iosb.ilt.fisabackend.model.SensorThingsApiBundle;
import de.fraunhofer.iosb.ilt.fisabackend.model.UploadToFrostResponse;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.EntityTransferException;
import de.fraunhofer.iosb.ilt.sta.ServiceFailureException;
import de.fraunhofer.iosb.ilt.sta.StatusCodeException;
import de.fraunhofer.iosb.ilt.sta.model.Datastream;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.FeatureOfInterest;
import de.fraunhofer.iosb.ilt.sta.model.HistoricalLocation;
import de.fraunhofer.iosb.ilt.sta.model.Location;
import de.fraunhofer.iosb.ilt.sta.model.Observation;
import de.fraunhofer.iosb.ilt.sta.model.ObservedProperty;
import de.fraunhofer.iosb.ilt.sta.model.Sensor;
import de.fraunhofer.iosb.ilt.sta.model.Thing;
import de.fraunhofer.iosb.ilt.sta.service.SensorThingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;

public class FrostCourier {
    private static final Logger LOGGER = LoggerFactory.getLogger(FrostCourier.class);

    /**
     * removes the given Objects from the FROST-Server
     *
     * @param toRemove the SensorThingsApiBundle with the entities to remove
     * @param url the url of the FROST-Server
     * @throws MalformedURLException   If an invalid URL is given
     */
    public void removeObjects(SensorThingsApiBundle toRemove, String url) throws MalformedURLException {
        SensorThingsService service = sensorThingsServiceInstantiator(url);

        for (EntityWrapper<Observation> observation : toRemove.getObservations()) {
            try {
                service.delete(observation.getEntity());
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Observation: " + observation.getEntity().toString());
            }
        }

        for (EntityWrapper<Datastream> dataStream : toRemove.getDatastreams()) {
            try {
                service.delete(dataStream.getEntity());
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Datastream: " + dataStream.getEntity().toString());
            }
        }

        for (EntityWrapper<Thing> thing : toRemove.getThings()) {
            try {
                service.delete(thing.getEntity());
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Thing: " + thing.getEntity().toString());
            }
        }

        for (EntityWrapper<Sensor> sensor : toRemove.getSensors()) {
            try {
                service.delete(sensor.getEntity());
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Sensor: " + sensor.getEntity().toString());
            }
        }

        for (EntityWrapper<Location> location : toRemove.getLocations()) {
            try {
                service.delete(location.getEntity());
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the Location: " + location.getEntity().toString());
            }

        }

        for (EntityWrapper<HistoricalLocation> historicalLocation : toRemove.getHistoricalLocations()) {
            try {
                service.delete(historicalLocation.getEntity());
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the HistoricalLocation: "
                        + historicalLocation.getEntity().toString());
            }
        }

        for (EntityWrapper<ObservedProperty> observedProperty : toRemove.getObservedProperties()) {
            try {
                service.delete(observedProperty.getEntity());
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the ObserverProperty: " + observedProperty.getEntity().toString());
            }
        }

        for (EntityWrapper<FeatureOfInterest> featureOfInterest : toRemove.getFeatureOfInterests()) {
            try {
                service.delete(featureOfInterest.getEntity());
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove the FeatureOfInterest: "
                        + featureOfInterest.getEntity().toString());
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

        // Sort the bundle, so not created Entities will be added first
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
}
