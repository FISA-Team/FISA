package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import java.util.List;
import java.util.UUID;

/**
 * The FisaDocument defines the structure of a use-case.
 */
public class FisaDocument {

    private String name;
    private UUID uuid;
    private List<FisaObjectDefinition> objectDefinitions;
    private List<FisaObject> fisaTemplate;

    /**
     * The default constructor of FisaDocument.
     */
    public FisaDocument() {
    }

    /**
     * Instantiates a FisaDocument.
     *
     * @param name Name of the document
     * @param uuid Identifier
     * @param objectDefinitions Definitions of the use-case
     * @param fisaTemplate Templates for a use-case
     */
    public FisaDocument(
            String name,
            UUID uuid,
            List<FisaObjectDefinition> objectDefinitions,
            List<FisaObject> fisaTemplate
    ) {
        this.name = name;
        this.uuid = uuid;
        this.objectDefinitions = objectDefinitions;
        this.fisaTemplate = fisaTemplate;
    }

    /**
     * Returns the name of FisaDocument.
     *
     * @return Name of FisaDocument
     */
    public String getName() {
        return this.name;
    }

    /**
     * Returns the UUID of a FisaDocument.
     *
     * @return UUID
     */
    public UUID getUuid() {
        return this.uuid;
    }

    /**
     * Returns the definitions of a use-case.
     *
     * @return Definitions of objects
     */
    public List<FisaObjectDefinition> getObjectDefinitions() {
        return this.objectDefinitions;
    }

    /**
     * Returns templates of a use-case
     *
     * @return Templates of a use-case
     */
    public List<FisaObject> getFisaTemplate() {
        return this.fisaTemplate;
    }

    /**
     * Sets the name of a FisaDocument.
     *
     * @param name Name to be set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Sets the UUID of a FisaDocument.
     *
     * @param uuid UUID to be set
     */
    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    /**
     * Sets the object definitions of a FisaDocument.
     *
     * @param objectDefinitions List of object definitions
     */
    public void setObjectDefinitions(List<FisaObjectDefinition> objectDefinitions) {
        this.objectDefinitions = objectDefinitions;
    }

    /**
     * Sets the templates of a use-case.
     *
     * @param fisaTemplate List of FisaObjects as template
     */
    public void setFisaTemplate(List<FisaObject> fisaTemplate) {
        this.fisaTemplate = fisaTemplate;
    }
}
