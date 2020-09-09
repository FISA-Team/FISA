package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.external.geojson;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaAttributeMapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;
import org.geojson.LngLatAlt;
import org.geojson.Point;

import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.ObjDoubleConsumer;

public class PointMapper<T extends Entity<T>> extends StaAttributeMapper<T> {
    private final Function<T, Point> getter;
    private final BiConsumer<T, Point> setter;

    protected PointMapper(EntityType entityType, String attributeName, Function<T, Point> getter,
                          BiConsumer<T, Point> setter) {
        super(entityType, attributeName);
        this.getter = getter;
        this.setter = setter;
    }

    @Override
    public void apply(FisaTreeNode treeNode, String... arguments) {
        throw new UnsupportedOperationException("Cannot apply mapping here");
    }

    @Override
    public Mapper resolve(String mapsTo) {
        switch (mapsTo) {
            case "longitude":
                return new CoordinateMapper(LngLatAlt::setLongitude);
            case "latitude":
                return new CoordinateMapper(LngLatAlt::setLatitude);
            case "altitude":
                return new CoordinateMapper(LngLatAlt::setAltitude);
            default:
                throw new UnsupportedOperationException("Not supported: " + mapsTo);
        }
    }

    private final class CoordinateMapper implements Mapper {
        private final ObjDoubleConsumer<LngLatAlt> consumer;

        private CoordinateMapper(ObjDoubleConsumer<LngLatAlt> consumer) {
            this.consumer = consumer;
        }

        @Override
        public void apply(FisaTreeNode treeNode, String... arguments) {
            Entity<?> entity = treeNode.getContext(Entity.class);
            if (!entityTypeMatches(entity)) {
                return;
            }
            @SuppressWarnings("unchecked")
            T checkedEntity = (T) entity;
            Point point = getter.apply(checkedEntity);
            LngLatAlt coordinates = point.getCoordinates();
            if (coordinates == null) {
                coordinates = new LngLatAlt();
                point.setCoordinates(coordinates);
            }
            consumer.accept(coordinates, Double.parseDouble(arguments[0]));
            setter.accept(checkedEntity, point);
        }

        @Override
        public Mapper resolve(String mapsTo) {
            return null;
        }
    }
}
