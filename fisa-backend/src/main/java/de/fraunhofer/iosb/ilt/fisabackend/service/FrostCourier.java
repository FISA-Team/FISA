package de.fraunhofer.iosb.ilt.fisabackend.service;

import de.fraunhofer.iosb.ilt.fisabackend.model.EntityWrapper;
import de.fraunhofer.iosb.ilt.fisabackend.model.SensorThingsApiBundle;
import de.fraunhofer.iosb.ilt.fisabackend.model.UploadToFrostResponse;
import de.fraunhofer.iosb.ilt.fisabackend.service.exception.EntityTransferException;
import de.fraunhofer.iosb.ilt.sta.ServiceFailureException;
import de.fraunhofer.iosb.ilt.sta.StatusCodeException;
import de.fraunhofer.iosb.ilt.sta.model.Datastream;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;
import de.fraunhofer.iosb.ilt.sta.service.SensorThingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

public class FrostCourier {
    private static final Logger LOGGER = LoggerFactory.getLogger(FrostCourier.class);

    /**
     * Removes the given Objects from the FROST-Server
     *
     * @param toRemove the SensorThingsApiBundle with the entities to remove
     * @param url the url of the FROST-Server
     * @throws MalformedURLException   If an invalid URL is given
     */
    public void removeObjects(SensorThingsApiBundle toRemove, String url) throws MalformedURLException {
        SensorThingsService service = sensorThingsServiceInstantiator(url);

        // remove all Observations
        removeEntities(toRemove.getObservations(), service);
        // remove all FeatureOfInterests
        removeEntities(toRemove.getFeatureOfInterests(), service);
        // remove all Datastreams
        removeEntities(toRemove.getDatastreams(), service);
        // remove all Sensors
        removeEntities(toRemove.getSensors(), service);
        // remove all HistoricalLocations
        removeEntities(toRemove.getHistoricalLocations(), service);
        // remove all Locations
        removeEntities(toRemove.getLocations(), service);
        // remove all Thins
        removeEntities(toRemove.getThings(), service);
        // remove all ObservedProperties
        removeEntities(toRemove.getObservedProperties(), service);
    }

    /**
     * removes the entity with the help of the service
     * @param entityWrapperList the Entity to remove
     * @param service the sensor-thing service
     * @param <T> the type of the entity.
     */
    private  <T extends Entity<T>> void removeEntities(List<EntityWrapper<T>> entityWrapperList,
                                                       SensorThingsService service) {
        for (EntityWrapper<T> entity: entityWrapperList) {
            try {
                service.delete(entity.getEntity());
            } catch (ServiceFailureException e) {
                LOGGER.error("Can't find and remove " + entity.getEntity().getType() + ": "
                        + entity.getEntity().toString());
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
        // upload all Things
        uploadEntityList(bundle.getThings(),  responseData, service);
        // upload all Sensors
        uploadEntityList(bundle.getSensors(),  responseData, service);
        // upload all Locations
        uploadEntityList(bundle.getLocations(),  responseData, service);
        // upload all HistoricalLocations
        uploadEntityList(bundle.getHistoricalLocations(),  responseData, service);
        // upload all ObservedProperties
        uploadEntityList(bundle.getObservedProperties(),  responseData, service);
        // upload all Datastreams
        uploadEntityList(bundle.getDatastreams(),  responseData, service);
        // upload all FeatureOfInterests
        uploadEntityList(bundle.getFeatureOfInterests(),  responseData, service);
        // upload all Observations
        uploadEntityList(bundle.getObservations(),  responseData, service);

        LOGGER.info("Uploaded project successfully");

        return responseData;
    }

    private <T extends Entity<T>> void uploadEntityList(List<EntityWrapper<T>> entityList,
                       UploadToFrostResponse responseData, SensorThingsService service) throws ServiceFailureException {
        for (EntityWrapper<T> entity: entityList) {
            safeCreate(service, entity.getEntity());
            entity.setFrostId();
            if (entity.getEntity().getType() == EntityType.DATASTREAM) {
                Datastream datastream = (Datastream) entity.getEntity();
                responseData.addDatastream(entity.getDefiningFisaObject(), datastream.getName());
            } else {
                responseData.addObject(entity.getDefiningFisaObject());
            }

        }
    }

    /**
     * Creates an entity on the specified service and wraps exceptions into {@link EntityTransferException}.
     *
     * @param service the service to transfer the entity to.
     * @param entity  the entity to transfer.
     * @param <T>     the type of the entity.
     * @throws EntityTransferException if the entity couldn't be transferred correctly.
     */
    private static <T extends Entity<T>> void safeCreate(SensorThingsService service, T entity)
            throws ServiceFailureException {
        if (entity.getId() != null) {
            try {
                service.update(entity);
            } catch (StatusCodeException e) {
                throw new EntityTransferException(entity, e);
            }
            return;
        }
        try {
            service.create(entity);
        } catch (StatusCodeException e) {
            throw new EntityTransferException(entity, e);
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
