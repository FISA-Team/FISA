package de.fraunhofer.iosb.ilt.fisabackend.service.mapper.external.geojson;

import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.sta.StaComplexAttributeMapper;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.EntityType;
import org.geojson.GeoJsonObject;
import org.geojson.Point;

import java.util.HashMap;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Function;

public class GeoJsonObjectMapper<T extends Entity<T>> extends StaComplexAttributeMapper<T, GeoJsonObject> {
    private final Map<String, Mapper> mappers;

    /**
     * Create a new mapper for {@link GeoJsonObject} attributes.
     *
     * @param attributeName the name of the attribute.
     * @param getter        the function to access the attribute.
     * @param setter        the setter to create a new {@link GeoJsonObject}.
     * @param entityType    the entity type the attribute belongs to.
     */
    public GeoJsonObjectMapper(String attributeName, Function<T, GeoJsonObject> getter,
                               BiConsumer<T, GeoJsonObject> setter, EntityType entityType) {
        super(attributeName, getter, entityType);
        this.mappers = new HashMap<>();
        this.mappers.put("point", new PointMapper<T>(entityType, "point", getter.andThen(gjo -> {
            if (!(gjo instanceof Point)) {
                return new Point();
            }
            return (Point) gjo;
        }), setter::accept));
        this.mappers.put("polygon", new PolygonMapper<T>(entityType, "polygon", setter::accept));
    }

    @Override
    public Mapper resolve(String mapsTo) {
        int delimiterIndex = mapsTo.indexOf(DELIMITER);
        if (delimiterIndex == -1) {
            // TODO handle properly
            return mappers.get(mapsTo);
        }
        return mappers.get(mapsTo.substring(0, delimiterIndex)).resolve(mapsTo.substring(delimiterIndex + 1));
    }
}
