package de.fraunhofer.iosb.ilt.fisabackend.service.converter;

import de.fraunhofer.iosb.ilt.fisabackend.model.EntityWrapper;
import de.fraunhofer.iosb.ilt.fisabackend.model.SensorThingsApiBundle;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.ExampleData;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaDocument;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObject;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObjectAttribute;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObjectAttributeDefinition;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaObjectDefinition;
import de.fraunhofer.iosb.ilt.fisabackend.model.definitions.FisaProject;
import de.fraunhofer.iosb.ilt.fisabackend.service.generator.ExampleDataGenerator;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.Mapper;
import de.fraunhofer.iosb.ilt.fisabackend.service.mapper.MappingResolver;
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTree;
import de.fraunhofer.iosb.ilt.fisabackend.util.StaUtil;
import de.fraunhofer.iosb.ilt.sta.model.*;
import org.geojson.GeoJsonObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

public class FisaProjectToBundleConverter {
    private final FisaProject project;
    private final MappingResolver resolver;

    /**
     * Create a new instance of the FisaProjectToBundleConverter.
     *
     * @param project  The project to convert.
     * @param resolver The resolver to use for the conversion.
     */
    public FisaProjectToBundleConverter(FisaProject project, MappingResolver resolver) {
        this.project = project;
        this.resolver = resolver;
    }

    /**
     * Converts a {@link FisaProject} into a {@link SensorThingsApiBundle}.
     * @return the converted bundle.
     */
    public SensorThingsApiBundle convertToBundle() {
        List<FisaObject> fisaObjects = new ArrayList<>(this.project.getFisaObjects());
        FisaDocument fisaDoc = this.project.getFisaDocument();
        Map<String, FisaObjectDefinition> objectDefinitions = fisaDoc.getObjectDefinitions().stream()
                .collect(Collectors.toMap(FisaObjectDefinition::getName, Function.identity()));
        Map<FisaObjectDefinition, Map<String, FisaObjectAttributeDefinition>> attributeDefinitions = fisaDoc
                .getObjectDefinitions().stream()
                .collect(Collectors.toMap(Function.identity(), def -> def.getAttributes().stream()
                    .collect(Collectors.toMap(FisaObjectAttributeDefinition::getName, Function.identity()))));
        Map<Long, FisaObject> idMap = fisaObjects.stream()
                .collect(Collectors.toMap(FisaObject::getId, Function.identity()));
        // map of entites with their FISA-IDs to allow linking
        Map<Long, Entity<?>> allChildren = fisaObjects.stream()
                .flatMap(obj -> obj.getChildren().stream())
                // workaround to allow null values in map
                .collect(HashMap::new, (m, l) -> m.put(l, null), HashMap::putAll);
        // remove all non-root objects
        fisaObjects.removeIf(obj -> allChildren.containsKey(obj.getId()));
        List<FisaTree> fisaTrees = new ArrayList<>();
        // build trees by adding the children
        for (FisaObject fisaObject : fisaObjects) {
            FisaTree tree = FisaTree.createTree(fisaObject);
            tree.acceptDownwards(node -> {
                FisaObject value = node.getValue();
                // add all children to the tree
                for (long child : value.getChildren()) {
                    node.addChild(idMap.get(child));
                }
            });
            fisaTrees.add(tree);
        }
        // generate entities
        for (FisaTree tree : fisaTrees) {
            tree.accept(node -> {
                FisaObjectDefinition definition = objectDefinitions.get(node.getValue().getDefinitionName());
                if (definition == null) {
                    throw new IllegalArgumentException(node.getValue().getDefinitionName() + " is not defined");
                }
                node.addContext(FisaObjectDefinition.class, definition);
                // if the object is reusable, only create a new entity if not already exists
                if (definition.getIsNotReusable()) {
                    Mapper mapper = this.resolver.resolve(definition.getMapsTo());
                    mapper.apply(node);
                } else {
                    Entity<?> entity = allChildren.computeIfAbsent(node.getValue().getId(), id -> {
                        Mapper mapper = this.resolver.resolve(definition.getMapsTo());
                        mapper.apply(node);
                        return node.getContext(Entity.class);
                    });
                    // set (if already in allChildren)
                    // or overwrite with same instance
                    node.addContext(Entity.class, entity);
                }
            });
        }
        // set attributes
        for (FisaTree tree : fisaTrees) {
            tree.accept(node -> {
                FisaObjectDefinition objectDefinition = node.getContext(FisaObjectDefinition.class);
                for (FisaObjectAttribute attribute : node.getValue().getAttributes()) {
                    FisaObjectAttributeDefinition definition = attributeDefinitions.get(objectDefinition)
                            .get(attribute.getDefinitionName());
                    if (definition == null) {
                        throw new IllegalArgumentException(attribute.getDefinitionName()
                                + " is no defined definition name");
                    }
                    Mapper mapper = this.resolver.resolve(definition.getMapsTo());
                    if (mapper == null) {
                        throw new IllegalArgumentException("No mapper found for " + definition.getMapsTo());
                    }
                    node.accept(n -> {
                        FisaObjectDefinition nObjectDef = n.getContext(FisaObjectDefinition.class);
                        // notReusable objects can't inherit attributes from other nodes
                        if (nObjectDef.getIsNotReusable() && n != node) {
                            return;
                        }
                        mapper.apply(n, attribute.getValue());
                    });
                }
            });
        }

        SensorThingsApiBundle bundle = new SensorThingsApiBundle();
        if (project.getGenerateExampleData()) {
            // generate example data
            ExampleDataGenerator generator = new ExampleDataGenerator();
            for (FisaTree tree : fisaTrees) {
                tree.accept(node -> {
                    Entity<?> context = node.getContext(Entity.class);
                    FisaObjectDefinition definition = node.getContext(FisaObjectDefinition.class);
                    ExampleData exampleData = definition.getExampleData();
                    if (exampleData == null) return;
                    if (context instanceof Datastream) {
                        Datastream datastream = (Datastream) context;
                        GeoJsonObject observedArea = datastream.getObservedArea();
                        List<Observation> observations = generator.generateObservations(exampleData, observedArea);
                        observations.forEach(observation -> observation.setDatastream(datastream));
                        for(Observation o: observations){
                            bundle.addObservation(o, null);
                        }
                    }
                });
            }
        }
        // create bundle
        for (FisaTree tree : fisaTrees) {
            // collect all entities of tree
            List<EntityWrapper<Entity<?>>> collected = new ArrayList<>();
            tree.accept(node -> {
                Entity<?> entity = node.getContext(Entity.class);

                if (entity != null) {
                    collected.add(new EntityWrapper<>(entity, node.getValue().getId()));
                }
            });

            // create STA relations between collected entities
            for (int outer = 0; outer < collected.size(); outer++) {
                for (EntityWrapper<Entity<?>> inner : collected) {
                    EntityWrapper<Entity<?>> from = collected.get(outer);
                    if (StaUtil.hasRelation(from.getEntity().getType(), inner.getEntity().getType())) {
                        StaUtil.setInRelation(from.getEntity(), inner.getEntity());
                    }
                }
            }
            // add entities of tree to bundle
            collected.forEach(addToBundle(bundle));
        }
        return bundle;
    }

    private Consumer<EntityWrapper<Entity<?>>> addToBundle(SensorThingsApiBundle bundle) {
        return entityWrapper -> {
            switch (entityWrapper.getEntity().getType()) {
                case DATASTREAM:
                    bundle.addDatastream((Datastream) entityWrapper.getEntity(), entityWrapper.getId());
                    break;
                case FEATURE_OF_INTEREST:
                    bundle.addFeatureOfInterest((FeatureOfInterest) entityWrapper.getEntity(), entityWrapper.getId());
                    break;
                case HISTORICAL_LOCATION:
                    bundle.addHistoricalLocation((HistoricalLocation) entityWrapper.getEntity(), entityWrapper.getId());
                    break;
                case LOCATION:
                    bundle.addLocation((Location) entityWrapper.getEntity(), entityWrapper.getId());
                    break;
                case OBSERVATION:
                    bundle.addObservation((Observation) entityWrapper.getEntity(), entityWrapper.getId());
                    break;
                case OBSERVED_PROPERTY:
                    bundle.addObservedProperty((ObservedProperty) entityWrapper.getEntity(), entityWrapper.getId());
                    break;
                case SENSOR:
                    bundle.addSensor((Sensor) entityWrapper.getEntity(), entityWrapper.getId());
                    break;
                case THING:
                    bundle.addThing((Thing) entityWrapper.getEntity(), entityWrapper.getId());
                    break;
                default:
                    throw new UnsupportedOperationException(entityWrapper.getEntity().getType() + " is not supported");
            }
        };
    }
}
