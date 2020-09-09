package de.fraunhofer.iosb.ilt.fisabackend.util;

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

public final class StaUtil {

    private StaUtil() {

    }

    /**
     * Create the relations between two entities.
     *
     * @param a the first entity.
     * @param b the second entity.
     * @return {@code true} if a relation was created, {@code false} otherwise.
     */
    public static boolean setInRelation(Entity<?> a, Entity<?> b) {
        if (a.getType() == b.getType()) {
            return false;
        }
        // decrease verbosity of only having to check one direction for each
        Entity<?> smaller = min(a, b);
        Entity<?> greater = max(a, b);
        switch (smaller.getType()) {
            case DATASTREAM:
                return setInRelation((Datastream) smaller, greater);
            case FEATURE_OF_INTEREST:
                return setInRelation((FeatureOfInterest) smaller, greater);
            case HISTORICAL_LOCATION:
                return setInRelation((HistoricalLocation) smaller, greater);
            case LOCATION:
                return setInRelation((Location) smaller, greater);
            case MULTIDATASTREAM:
                return setInRelation((MultiDatastream) smaller, greater);
            // all entity types should be covered
            default:
                return false;
        }
    }

    /**
     * Return whether the entity types are related, either in their singular form or plural form.
     *
     * @param a the first entity type.
     * @param b the second entity type.
     * @return {@code true} iff the types are related.
     */
    public static boolean hasRelation(EntityType a, EntityType b) {
        EntityType aSingular = a.getSingular();
        EntityType aPlural = a.getPlural();
        EntityType bSingular = b.getSingular();
        EntityType bPlural = b.getPlural();
        return aSingular.hasRelationTo(bSingular) || aSingular.hasRelationTo(bPlural)
                || aPlural.hasRelationTo(bSingular) || aPlural.hasRelationTo(bPlural);
    }

    private static boolean setInRelation(Datastream datastream, Entity<?> entity) {
        if (entity.getType() == EntityType.OBSERVATION) {
            //datastream.getObservations().add((Observation) entity);
            ((Observation) entity).setDatastream(datastream);
            return true;
        } else if (entity.getType() == EntityType.OBSERVED_PROPERTY) {
            datastream.setObservedProperty((ObservedProperty) entity);
            // ((ObservedProperty) entity).getDatastreams().add(datastream);
            return true;
        } else if (entity.getType() == EntityType.SENSOR) {
            datastream.setSensor((Sensor) entity);
            // ((Sensor) entity).getDatastreams().add(datastream);
            return true;
        } else if (entity.getType() == EntityType.THING) {
            datastream.setThing((Thing) entity);
            // ((Thing) entity).getDatastreams().add(datastream);
            return true;
        }
        return false;
    }

    private static boolean setInRelation(FeatureOfInterest featureOfInterest, Entity<?> entity) {
        if (entity.getType() == EntityType.OBSERVATION) {
            featureOfInterest.getObservations().add((Observation) entity);
            // ((Observation) entity).setFeatureOfInterest(featureOfInterest);
            return true;
        }
        return false;
    }

    private static boolean setInRelation(HistoricalLocation historicalLocation, Entity<?> entity) {
        if (entity.getType() == EntityType.LOCATION) {
            historicalLocation.getLocations().add((Location) entity);
            // ((Location) entity).getHistoricalLocations().add(historicalLocation);
            return true;
        } else if (entity.getType() == EntityType.THING) {
            historicalLocation.setThing((Thing) entity);
            // ((Thing) entity).getHistoricalLocations().add(historicalLocation);
            return true;
        }
        return false;
    }

    private static boolean setInRelation(Location location, Entity<?> entity) {
        if (entity.getType() == EntityType.THING) {
            location.getThings().add((Thing) entity);
            // ((Thing) entity).getLocations().add(location);
            return true;
        }
        // HistoricalLocations are covered already
        return false;
    }

    private static boolean setInRelation(MultiDatastream multiDatastream, Entity<?> entity) {
        if (entity.getType() == EntityType.OBSERVATION) {
            // multiDatastream.getObservations().add((Observation) entity);
            ((Observation) entity).setMultiDatastream(multiDatastream);
            return true;
        } else if (entity.getType() == EntityType.OBSERVED_PROPERTY) {
            multiDatastream.getObservedProperties().add((ObservedProperty) entity);
            // ((ObservedProperty) entity).getMultiDatastreams().add(multiDatastream);
            return true;
        }
        return false;
    }

    private static EntityType min(EntityType a, EntityType b) {
        // compare by name as internal enum structure might change
        // without changes to the STA specification
        return a.name().compareTo(b.getName()) < 0 ? a : b;
    }

    private static EntityType max(EntityType a, EntityType b) {
        return min(a, b) == a ? b : a;
    }

    private static Entity<?> min(Entity<?> a, Entity<?> b) {
        return min(a.getType(), b.getType()) == a.getType() ? a : b;
    }

    private static Entity<?> max(Entity<?> a, Entity<?> b) {
        return max(a.getType(), b.getType()) == a.getType() ? a : b;
    }
}
