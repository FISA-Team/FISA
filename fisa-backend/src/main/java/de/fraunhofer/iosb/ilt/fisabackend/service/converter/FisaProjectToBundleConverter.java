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
import de.fraunhofer.iosb.ilt.fisabackend.service.tree.FisaTreeNode;
import de.fraunhofer.iosb.ilt.fisabackend.util.StaUtil;
import de.fraunhofer.iosb.ilt.sta.model.Datastream;
import de.fraunhofer.iosb.ilt.sta.model.Entity;
import de.fraunhofer.iosb.ilt.sta.model.FeatureOfInterest;
import de.fraunhofer.iosb.ilt.sta.model.Observation;
import de.fraunhofer.iosb.ilt.sta.model.HistoricalLocation;
import de.fraunhofer.iosb.ilt.sta.model.Location;
import de.fraunhofer.iosb.ilt.sta.model.ObservedProperty;
import de.fraunhofer.iosb.ilt.sta.model.Sensor;
import de.fraunhofer.iosb.ilt.sta.model.Thing;
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
    public SensorThingsApiBundle convertObjectsToBundle() {
        return convertToBundle(project.getFisaObjects());
    }

    /**
     * Converts the removed objects in the {@link FisaProject} into a {@link SensorThingsApiBundle}.
     * @return the converted bundle.
     */
    public SensorThingsApiBundle convertRemovedObjectsToBundle() {
        return convertToBundle(project.getRemovedFisaObjects());
    }

    private SensorThingsApiBundle convertToBundle(List<FisaObject> fisaObjects) {
        FisaDocument fisaDoc = this.project.getFisaDocument();
        Map<String, FisaObjectDefinition> objectDefinitions = fisaDoc.getObjectDefinitions().stream()
                .collect(Collectors.toMap(FisaObjectDefinition::getName, Function.identity()));
        Map<FisaObjectDefinition, Map<String, FisaObjectAttributeDefinition>> attributeDefinitions = fisaDoc
                .getObjectDefinitions().stream()
                .collect(Collectors.toMap(Function.identity(), def -> def.getAttributes().stream()
                    .collect(Collectors.toMap(FisaObjectAttributeDefinition::getName, Function.identity()))));
        Map<Long, FisaObject> idMap = fisaObjects.stream()
                .collect(Collectors.toMap(FisaObject::getId, Function.identity()));
        // map of entities with their FISA-IDs to allow linking
        Map<Long, Entity<?>> allChildren = fisaObjects.stream()
                .flatMap(obj -> obj.getChildren().stream())
                // workaround to allow null values in map
                .collect(HashMap::new, (m, l) -> m.put(l, null), HashMap::putAll);
        List<FisaObject> rootObjects = new ArrayList<>();
        List<FisaTree> fisaTrees = new ArrayList<>();
        // add root Objects to the rootObjects list
        for (FisaObject o: fisaObjects) {
            if (!allChildren.containsKey(o.getId())) {
                rootObjects.add(o);
            }
        }
        // build trees by adding the children
        for (FisaObject fisaObject : rootObjects) {
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
            tree.accept(node -> generateEntities(node, objectDefinitions, allChildren));
        }

        // set attributes
        for (FisaTree tree : fisaTrees) {
            tree.accept(node -> setAttributes(node, attributeDefinitions));
        }

        SensorThingsApiBundle bundle = new SensorThingsApiBundle();
        if (project.getGenerateExampleData()) {
            // generate example data
            addExampleData(fisaTrees, bundle);
        }

        // create bundle
        createBundle(fisaTrees, bundle);
        return bundle;
    }

    private void createBundle(List<FisaTree> fisaTrees, SensorThingsApiBundle bundle) {
        for (FisaTree tree : fisaTrees) {

            // collect all entities of tree
            List<EntityWrapper<Entity<?>>> collected = new ArrayList<>();
            List<FisaTreeNode> nodesOfCollected = new ArrayList<>();
            tree.accept(node -> {
                Entity<?> entity = node.getContext(Entity.class);

                if (entity != null) {
                    collected.add(new EntityWrapper<>(entity, node.getValue()));
                    nodesOfCollected.add(node);
                }
            });

            // create STA relations between collected entities
            for (int outer = 0; outer < collected.size(); outer++) {
                for (int inner = 0; inner < collected.size(); inner++) {
                    Entity<?> to = collected.get(inner).getEntity();
                    Entity<?> from = collected.get(outer).getEntity();
                    // Check if the Objects and the Entity-Types are in relation
                    if (StaUtil.hasChildRelation(nodesOfCollected.get(inner), nodesOfCollected.get(outer))
                            && StaUtil.hasRelation(from.getType(), to.getType())) {
                        StaUtil.setInRelation(from, to);
                    }
                }
            }
            // add entities of tree to bundle
            collected.forEach(addToBundle(bundle));
        }
    }

    private void generateEntities(FisaTreeNode node, Map<String, FisaObjectDefinition> objectDefinitions,
                                  Map<Long, Entity<?>> allChildren) {
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
    }

    private void setAttributes(FisaTreeNode node, Map<FisaObjectDefinition, Map<String,
            FisaObjectAttributeDefinition>> attributeDefinitions) {
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
    }

    private void addExampleData(List<FisaTree> fisaTrees, SensorThingsApiBundle bundle) {
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
                    for (Observation o: observations) {
                        bundle.addObservation(o, null);
                    }
                }
            });
        }
    }

    private Consumer<EntityWrapper<Entity<?>>> addToBundle(SensorThingsApiBundle bundle) {
        return entityWrapper -> {
            switch (entityWrapper.getEntity().getType()) {
                case DATASTREAM:
                    bundle.addDatastream((Datastream) entityWrapper.getEntity(),
                            entityWrapper.getDefiningFisaObject());
                    break;
                case FEATURE_OF_INTEREST:
                    bundle.addFeatureOfInterest((FeatureOfInterest) entityWrapper.getEntity(),
                            entityWrapper.getDefiningFisaObject());
                    break;
                case HISTORICAL_LOCATION:
                    bundle.addHistoricalLocation((HistoricalLocation) entityWrapper.getEntity(),
                            entityWrapper.getDefiningFisaObject());
                    break;
                case LOCATION:
                    bundle.addLocation((Location) entityWrapper.getEntity(), entityWrapper.getDefiningFisaObject());
                    break;
                case OBSERVATION:
                    bundle.addObservation((Observation) entityWrapper.getEntity(),
                            entityWrapper.getDefiningFisaObject());
                    break;
                case OBSERVED_PROPERTY:
                    bundle.addObservedProperty((ObservedProperty) entityWrapper.getEntity(),
                            entityWrapper.getDefiningFisaObject());
                    break;
                case SENSOR:
                    bundle.addSensor((Sensor) entityWrapper.getEntity(), entityWrapper.getDefiningFisaObject());
                    break;
                case THING:
                    bundle.addThing((Thing) entityWrapper.getEntity(), entityWrapper.getDefiningFisaObject());
                    break;
                default:
                    throw new UnsupportedOperationException(entityWrapper.getEntity().getType() + " is not supported");
            }
        };
    }
}
