package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import de.fraunhofer.iosb.ilt.sta.model.Id;

import java.util.ArrayList;
import java.util.List;

/**
 * The FisaObject represents a generic object of a FisaProject.
 */
public class FisaObject {

    private Id frostId;
    private long id;
    private String definitionName;
    private List<Long> children;
    private List<FisaObjectAttribute> attributes;

    /**
     * The default constructor of FisaObject.
     */
    public FisaObject() {
    }

    /**
     * Constructor
     * @param id Id of the FisaObject
     * @param definitionName Name of the Definition the FisaObjects is based on
     * @param children List of child-id's
     * @param attributes List of FisaAttributes of this FisaObject
     */
    public FisaObject(long id, String definitionName, List<Long> children, List<FisaObjectAttribute> attributes) {
        this.id = id;
        this.definitionName = definitionName;
        this.children = children;
        this.attributes = attributes;
    }

    /**
     * Returns the ID of a FisaObject.
     *
     * @return long representing an ID
     */
    public long getId() {
        return this.id;
    }

    /**
     * Returns the Name of the corresponding definition class.
     *
     * @return Name of corresponding definition class
     */
    public String getDefinitionName() {
        return this.definitionName;
    }

    /**
     * Returns a list of Long representing the hierarchy of child objects.
     *
     * @return List of Long
     */
    public List<Long> getChildren() {
        if (this.children == null) {
            this.children = new ArrayList<>();
        }
        return this.children;
    }

    /**
     * Returns a list of attributes of a FisaObject.
     *
     * @return List of FisaObjectAttribute
     */
    public List<FisaObjectAttribute> getAttributes() {
        if (this.attributes == null) {
            this.attributes = new ArrayList<>();
        }
        return this.attributes;
    }

    /**
     * Returns the Frost-Id
     *
     * @return The Frost-Id
     */
    public Id getFrostId() {
        return frostId;
    }

    /**
     * Sets the ID of a FisaObject.
     *
     * @param id long representing the ID
     */
    public void setId(long id) {
        this.id = id;
    }

    /**
     * Sets the name of the corresponding definition class.
     *
     * @param definitionName Name of the definition class
     */
    public void setDefinitionName(String definitionName) {
        this.definitionName = definitionName;
    }

    /**
     * Sets the list of Long, representing the hierarchy of child objects.
     *
     * @param children List of Long
     */
    public void setChildren(List<Long> children) {
        this.children = children;
    }

    /**
     * Sets the list of attributes of a FisaObject.
     *
     * @param attributes List containing FisaObjectAttribute
     */
    public void setAttributes(List<FisaObjectAttribute> attributes) {
        this.attributes = attributes;
    }

    /**
     * Sets the frost-id of a FisaObject
     *
     * @param frostId The Id of this FisaObject on FROST
     */
    public void setFrostId(String frostId) {
        if (frostId != null && !frostId.isEmpty()) {
            this.frostId = Id.tryToParse(frostId);
        }
    }

    @Override
    public String toString() {
        return this.id + " " + this.definitionName;
    }
}
