package de.fraunhofer.iosb.ilt.fisabackend.service;

import de.fraunhofer.iosb.ilt.fisabackend.model.EntityWrapper;
import de.fraunhofer.iosb.ilt.fisabackend.model.SensorThingsApiBundle;
import de.fraunhofer.iosb.ilt.fisabackend.model.responseData.DatastreamInfo;
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
import java.util.ArrayList;
import java.util.List;

public class FrostCourier {
    private static final Logger LOGGER = LoggerFactory.getLogger(FrostCourier.class);

    /**
     * Uploads a FISA-Project to a FROST-Server.
     *
     * @param bundle SensorThingsApiBundle containing all entities of a project
     * @param url    URL of the server, a project shall be uploaded to
     * @throws MalformedURLException   If an invalid URL is given
     * @throws ServiceFailureException If an entity cannot be uploaded to the server
     * @return a list of DatastreamIdAndName
     */
    public List<DatastreamInfo> uploadProject(SensorThingsApiBundle bundle, String url)
            throws MalformedURLException, ServiceFailureException {
        SensorThingsService service = sensorThingsServiceInstantiator(url);
        LOGGER.info("Using {} as frost server url", url);

        // 1:1 relations can be removed after upload
        // no entity should create multiple related entities of the same type
        for (EntityWrapper<Datastream> dataStream : bundle.getDatastreams()) {
            safeCreate(service, dataStream);
            Datastream loaded = service.datastreams().find(dataStream.getId(), datastreamExpansion());
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
        }

        for (EntityWrapper<Thing> thing : bundle.getThings()) {
            safeCreate(service, thing);
            // bundle.getMultiDatastream().removeAll(thing.getMultiDatastreams()); not implemented
        }

        for (EntityWrapper<Sensor> sensor : bundle.getSensors()) {
            safeCreate(service, sensor);
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
        }

        for (EntityWrapper<HistoricalLocation> historicalLocation : bundle.getHistoricalLocations()) {
            safeCreate(service, historicalLocation);
        }

        for (EntityWrapper<ObservedProperty> observedProperty : bundle.getObservedProperties()) {
            safeCreate(service, observedProperty);
            // bundle.getMultiDatastreams().removeAll(observedProperty.getMultiDatastreams()); not implemented
        }

        for (EntityWrapper<Observation> observation : bundle.getObservations()) {
            safeCreate(service, observation);
            // bundle.getDatastreams().remove(observation.getDatastream());
            // bundle.getMultiDatastreams().remove(observation.getMultiDatastream()); not implemented
            // bundle.getFeatureOfInterests().remove(observation.getEntity().getFeatureOfInterest());
        }

        for (EntityWrapper<FeatureOfInterest> featureOfInterest : bundle.getFeatureOfInterests()) {
            safeCreate(service, featureOfInterest);
        }
        LOGGER.info("Uploaded project successfully");

        // create upload observedProperty info list.
        List<DatastreamInfo> infoList = new ArrayList<>();
        for (EntityWrapper<Datastream> datastream: bundle.getDatastreams()) {
            infoList.add(new DatastreamInfo(datastream.getEntity()));
        }
        return infoList;
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
        if (entity.getEntity().getId() != null) return; // ignore already created entities
        if(entity.getId() != null){
            entity.getEntity().setId(entity.getId());
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
