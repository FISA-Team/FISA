package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.MappingResolver;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;

import java.util.HashMap;
import java.util.Map;

public class StaMapper implements Mapper {
    private final Map<String, StaEntityMapper<?>> entityMappers;

    /**
     * Create a new basic SensorThingsApi mapper.
     */
    public StaMapper() {
        this.entityMappers = new HashMap<>();
        setupStaEntities();
    }

    @Override
    public Mapper resolve(String mapsTo) {
        int delimiterIndex = mapsTo.indexOf(MappingResolver.DELIMITER);
        String entityKey;
        if (delimiterIndex == -1) {
            entityKey = mapsTo;
            // throw new IllegalArgumentException();
        } else {
            entityKey = mapsTo.substring(0, delimiterIndex);
        }
        StaEntityMapper<?> entityMapper = this.entityMappers.get(entityKey);
        if (entityMapper == null) {
            throw new IllegalArgumentException();
        }
        if (delimiterIndex == -1) {
            return entityMapper;
        }
        return entityMapper.resolve(mapsTo.substring(delimiterIndex + 1));
    }

    private void setupStaEntities() {
        this.entityMappers.put("Datastream", StaEntityMapper.datastreamMapper());
        this.entityMappers.put("FeatureOfInterest", StaEntityMapper.featureOfInterestMapper());
        this.entityMappers.put("HistoricalLocation", StaEntityMapper.historicalLocationMapper());
        this.entityMappers.put("Location", StaEntityMapper.locationMapper());
        this.entityMappers.put("MultiDatastream", StaEntityMapper.multiDatastreamMapper());
        this.entityMappers.put("Observation", StaEntityMapper.observationMapper());
        this.entityMappers.put("ObservedProperty", StaEntityMapper.observedPropertyMapper());
        this.entityMappers.put("Sensor", StaEntityMapper.sensorMapper());
        this.entityMappers.put("Thing", StaEntityMapper.thingMapper());
    }

    @Override
    public void apply(FisaTreeNode treeNode, String... arguments) {
        throw new UnsupportedOperationException("Cannot apply for this mapping");
    }
}
