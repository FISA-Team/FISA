package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.MappingResolver;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.external.geojson.GeoJsonObjectMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.complex.StaUnitOfMeasurementMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;
import de.fraunhofer.iosb.ilt.sta.model.Datastream;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;
import de.fraunhofer.iosb.ilt.sta.model.FeatureOfInterest;
import de.fraunhofer.iosb.ilt.sta.model.HistoricalLocation;
import de.fraunhofer.iosb.ilt.sta.model.Location;
import de.fraunhofer.iosb.ilt.sta.model.MultiDatastream;
import de.fraunhofer.iosb.ilt.sta.model.Observation;
import de.fraunhofer.iosb.ilt.sta.model.ObservedProperty;
import de.fraunhofer.iosb.ilt.sta.model.Sensor;
import de.fraunhofer.iosb.ilt.sta.model.Thing;
import de.fraunhofer.iosb.ilt.sta.model.ext.UnitOfMeasurement;
import org.geojson.GeoJsonObject;
import org.threeten.extra.Interval;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Supplier;

import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;

public class StaEntityMapper<T extends Entity<T>> implements Mapper {
    private final Map<String, StaAttributeMapper<T>> attributeMappers;
    private final Supplier<T> constructor;

    protected StaEntityMapper(Map<String, StaAttributeMapper<T>> attributeMappers, Supplier<T> constructor) {
        this.attributeMappers = attributeMappers;
        this.constructor = constructor;
    }

    /**
     * @return the entity mapper for {@link Datastream}.
     */
    public static StaEntityMapper<Datastream> datastreamMapper() {
        return new StaEntityMapper<Datastream>(
                List.of(
                        new StaSimpleAttributeMapper<>("description", Datastream::setDescription,
                                EntityType.DATASTREAM),
                        new StaSimpleAttributeMapper<>("name", Datastream::setName, EntityType.DATASTREAM),
                        new StaSimpleAttributeMapper<>("observationType", Datastream::setObservationType,
                                EntityType.DATASTREAM),
                        new GeoJsonObjectMapper<>("observedArea", Datastream::getObservedArea,
                                Datastream::setObservedArea, EntityType.DATASTREAM),
                        new StaSimpleAttributeMapper<Datastream>("phenomenonTime",
                                (e, s) -> e.setPhenomenonTime(Interval.parse(s)), EntityType.DATASTREAM),
                        StaComplexAttributeMapper.<Datastream>mapped("properties", entity -> {
                            Map<String, Object> properties = entity.getProperties();
                            if (properties == null) {
                                properties = new HashMap<>();
                            }
                            return properties;
                        }, EntityType.DATASTREAM),
                        new StaSimpleAttributeMapper<Datastream>("resultTime",
                                (e, s) -> e.setResultTime(Interval.parse(s)), EntityType.DATASTREAM),
                        new StaUnitOfMeasurementMapper<>("unitOfMeasurement", (Datastream datastream) -> {
                            UnitOfMeasurement unitOfMeasurement = datastream.getUnitOfMeasurement();
                            if (unitOfMeasurement == null) {
                                unitOfMeasurement = new UnitOfMeasurement();
                                datastream.setUnitOfMeasurement(unitOfMeasurement);
                            }
                            return unitOfMeasurement;
                        }, EntityType.DATASTREAM)
                )
                        .stream()
                        .collect(toMap(StaAttributeMapper::getAttributeName, identity())),
                Datastream::new);
    }

    /**
     * @return the entity mapper for {@link FeatureOfInterest}.
     */
    public static StaEntityMapper<FeatureOfInterest> featureOfInterestMapper() {
        return new StaEntityMapper<FeatureOfInterest>(
                List.of(
                        new StaSimpleAttributeMapper<>("description", FeatureOfInterest::setDescription,
                                EntityType.FEATURE_OF_INTEREST),
                        new StaSimpleAttributeMapper<>("encodingType", FeatureOfInterest::setEncodingType,
                                EntityType.FEATURE_OF_INTEREST),
                        new GeoJsonObjectMapper<>("feature", FeatureOfInterest::getFeature,
                                FeatureOfInterest::setFeature, EntityType.FEATURE_OF_INTEREST),
                        new StaSimpleAttributeMapper<>("name", FeatureOfInterest::setName,
                                EntityType.FEATURE_OF_INTEREST),
                        StaComplexAttributeMapper.<FeatureOfInterest>mapped("properties", entity -> {
                            Map<String, Object> properties = entity.getProperties();
                            if (properties == null) {
                                properties = new HashMap<>();
                            }
                            return properties;
                        }, EntityType.FEATURE_OF_INTEREST))
                        .stream()
                        .collect(toMap(StaAttributeMapper::getAttributeName, identity())),
                FeatureOfInterest::new);
    }

    /**
     * @return the entity mapper for {@link HistoricalLocation}.
     */
    public static StaEntityMapper<HistoricalLocation> historicalLocationMapper() {
        return new StaEntityMapper<HistoricalLocation>(
                List.of(
                        new StaSimpleAttributeMapper<HistoricalLocation>("time",
                                (e, s) -> e.setTime(ZonedDateTime.parse(s)), EntityType.HISTORICAL_LOCATION))
                        .stream()
                        .collect(toMap(StaAttributeMapper::getAttributeName, identity())),
                HistoricalLocation::new);
    }

    /**
     * @return the entity mapper for {@link Location}.
     */
    public static StaEntityMapper<Location> locationMapper() {
        return new StaEntityMapper<Location>(
                List.of(
                        new StaSimpleAttributeMapper<>("description", Location::setDescription, EntityType.LOCATION),
                        new StaSimpleAttributeMapper<>("encodingType", Location::setEncodingType, EntityType.LOCATION),
                        new GeoJsonObjectMapper<Location>("location",
                                loc -> (GeoJsonObject) loc.getLocation(), Location::setLocation, EntityType.LOCATION),
                        new StaSimpleAttributeMapper<>("name", Location::setName, EntityType.LOCATION),
                        StaComplexAttributeMapper.<Location>mapped("properties", entity -> {
                            Map<String, Object> properties = entity.getProperties();
                            if (properties == null) {
                                properties = new HashMap<>();
                                entity.setProperties(properties);
                            }
                            return properties;
                        }, EntityType.LOCATION))
                        .stream()
                        .collect(toMap(StaAttributeMapper::getAttributeName, identity())),
                Location::new);
    }

    /**
     * @return the entity mapper for {@link MultiDatastream}.
     */
    public static StaEntityMapper<MultiDatastream> multiDatastreamMapper() {
        return new StaEntityMapper<MultiDatastream>(
                List.of(
                        new StaSimpleAttributeMapper<>("description", MultiDatastream::setDescription,
                                EntityType.MULTIDATASTREAM),
                        // new StaAttributeMapper<>("multiObservationDataTypes", List.class, clazz),
                        new StaSimpleAttributeMapper<>("name", MultiDatastream::setName, EntityType.MULTIDATASTREAM),
                        new StaSimpleAttributeMapper<>("observationType", MultiDatastream::setObservationType,
                                EntityType.MULTIDATASTREAM),
                        new GeoJsonObjectMapper<>("observedArea", MultiDatastream::getObservedArea,
                                MultiDatastream::setObservedArea, EntityType.MULTIDATASTREAM),
                        new StaSimpleAttributeMapper<MultiDatastream>("phenomenonTime",
                                (e, s) -> e.setPhenomenonTime(Interval.parse(s)), EntityType.MULTIDATASTREAM),
                        StaComplexAttributeMapper.<MultiDatastream>mapped("properties", entity -> {
                            Map<String, Object> properties = entity.getProperties();
                            if (properties == null) {
                                properties = new HashMap<>();
                                entity.setProperties(properties);
                            }
                            return properties;
                        }, EntityType.MULTIDATASTREAM),
                        new StaSimpleAttributeMapper<MultiDatastream>("resultTime",
                                (e, s) -> e.setResultTime(Interval.parse(s)), EntityType.MULTIDATASTREAM))
                        // new StaAttributeMapper<>("unitOfMeasurements", List.class, clazz))
                        .stream()
                        .collect(toMap(StaAttributeMapper::getAttributeName, identity())),
                MultiDatastream::new);
    }

    /**
     * @return the entity mapper for {@link Observation}.
     */
    public static StaEntityMapper<Observation> observationMapper() {
        return new StaEntityMapper<Observation>(
                List.of(
                        // new StaAttributeMapper<>("phenomenonTime", TimeObject.class, clazz),
                        // new StaAttributeMapper<>("result", Object.class, clazz),
                        // new StaAttributeMapper<>("resultQuality", Object.class, clazz),
                        new StaSimpleAttributeMapper<Observation>("resultTime",
                                (e, s) -> e.setResultTime(ZonedDateTime.parse(s)), EntityType.OBSERVATION),
                        new StaSimpleAttributeMapper<Observation>("validTime",
                                (e, s) -> e.setValidTime(Interval.parse(s)), EntityType.OBSERVATION),
                        StaComplexAttributeMapper.<Observation>mapped("parameters", entity -> {
                            Map<String, Object> properties = entity.getParameters();
                            if (properties == null) {
                                properties = new HashMap<>();
                            }
                            return properties;
                        }, EntityType.OBSERVATION))
                        .stream()
                        .collect(toMap(StaAttributeMapper::getAttributeName, identity())),
                Observation::new);
    }

    /**
     * @return the entity mapper for {@link ObservedProperty}.
     */
    public static StaEntityMapper<ObservedProperty> observedPropertyMapper() {
        return new StaEntityMapper<ObservedProperty>(
                List.of(
                        new StaSimpleAttributeMapper<>("definition", ObservedProperty::setDefinition,
                                EntityType.OBSERVED_PROPERTY),
                        new StaSimpleAttributeMapper<>("description", ObservedProperty::setDescription,
                                EntityType.OBSERVED_PROPERTY),
                        new StaSimpleAttributeMapper<>("name", ObservedProperty::setName, EntityType.OBSERVED_PROPERTY),
                        StaComplexAttributeMapper.<ObservedProperty>mapped("properties", entity -> {
                            Map<String, Object> properties = entity.getProperties();
                            if (properties == null) {
                                properties = new HashMap<>();
                                entity.setProperties(properties);
                            }
                            return properties;
                        }, EntityType.OBSERVED_PROPERTY))
                        .stream()
                        .collect(toMap(StaAttributeMapper::getAttributeName, identity())),
                ObservedProperty::new);
    }

    /**
     * @return the entity mapper for {@link Sensor}.
     */
    public static StaEntityMapper<Sensor> sensorMapper() {
        return new StaEntityMapper<Sensor>(
                List.of(
                        new StaSimpleAttributeMapper<>("description", Sensor::setDescription, EntityType.SENSOR),
                        new StaSimpleAttributeMapper<>("encodingType", Sensor::setEncodingType, EntityType.SENSOR),
                        new StaSimpleAttributeMapper<>("metadata", Sensor::setMetadata, EntityType.SENSOR),
                        new StaSimpleAttributeMapper<>("name", Sensor::setName, EntityType.SENSOR),
                        StaComplexAttributeMapper.<Sensor>mapped("properties", entity -> {
                            Map<String, Object> properties = entity.getProperties();
                            if (properties == null) {
                                properties = new HashMap<>();
                                entity.setProperties(properties);
                            }
                            return properties;
                        }, EntityType.SENSOR))
                        .stream()
                        .collect(toMap(StaAttributeMapper::getAttributeName, identity())),
                Sensor::new);
    }

    /**
     * @return the entity mapper for {@link Thing}.
     */
    public static StaEntityMapper<Thing> thingMapper() {
        return new StaEntityMapper<>(
                List.of(
                        new StaSimpleAttributeMapper<>("description", Thing::setDescription, EntityType.THING),
                        new StaSimpleAttributeMapper<>("name", Thing::setName, EntityType.THING),
                        StaComplexAttributeMapper.<Thing>mapped("properties", entity -> {
                            Map<String, Object> properties = entity.getProperties();
                            if (properties == null) {
                                properties = new HashMap<>();
                                entity.setProperties(properties);
                            }
                            return properties;
                        }, EntityType.THING))
                        .stream()
                        .collect(toMap(StaAttributeMapper::getAttributeName, identity())),
                Thing::new);
    }

    @Override
    public Mapper resolve(String mapsTo) {
        int delimiterIndex = mapsTo.indexOf(MappingResolver.DELIMITER);
        boolean collection = false;
        if (delimiterIndex == -1) {
            delimiterIndex = mapsTo.indexOf(MappingResolver.COLLECTION_OPEN);
            if (delimiterIndex != -1) {
                collection = true;
            }
        }
        String attributeKey;
        if (delimiterIndex == -1) {
            attributeKey = mapsTo;
        } else {
            attributeKey = mapsTo.substring(0, delimiterIndex);
        }
        if (!this.attributeMappers.containsKey(attributeKey)) {
            throw new IllegalArgumentException(attributeKey + " is no valid attribute");
        }
        StaAttributeMapper<T> attribute = this.attributeMappers.get(attributeKey);
        String newMapsTo = "";
        if (collection) {
            newMapsTo = mapsTo.substring(delimiterIndex + 1, mapsTo.length() - 1);
        } else if (delimiterIndex != -1) {
            newMapsTo = mapsTo.substring(delimiterIndex + 1);
        }
        if (newMapsTo.isEmpty() && collection) {
            throw new IllegalArgumentException("No collection parameter");
        }
        if (newMapsTo.isEmpty()) {
            return attribute;
        }
        return attribute.resolve(newMapsTo);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StaEntityMapper)) return false;
        StaEntityMapper<?> that = (StaEntityMapper<?>) o;
        return this.attributeMappers.equals(that.attributeMappers);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.attributeMappers);
    }

    @Override
    public String toString() {
        return "StaEntityMapper{" + "attributeMappers=" + this.attributeMappers + '}';
    }

    @Override
    public void apply(FisaTreeNode treeNode, String... arguments) {
        treeNode.addContext(Entity.class, this.constructor.get());
    }
}
