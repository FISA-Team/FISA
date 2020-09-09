package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

import java.util.List;

/**
 * The FisaObjectDefinition defines a generic object of a use-case.
 */
public class FisaObjectDefinition {

    private String name;
    private String infoText;
    private boolean isTopLayer;
    private String mapsTo;
    private List<FisaObjectAttributeDefinition> attributes;
    private ExampleData exampleData;
    private ChildDefinition[] children;
    private String[] positionAttributes;
    private String caption;
    private boolean isNotReusable;

    /**
     * The default constructor of FisaObjectDefinition.
     */
    public FisaObjectDefinition() {
    }

    /**
     * Instantiates a FisaObjectDefinition.
     *  @param name Name of the FisaObjectDefinition
     * @param infoText Informational text about the FisaObjectDefinition
     * @param isTopLayer Boolean to flag, if objects of this definition are on top of the project hierarchy
     * @param mapsTo Name of the entity in the SensorThings-API the FisaObjectDefinition maps to
     * @param attributes List of FisaObjectAttributeDefinition
     * @param exampleData Exemplary data of FisaObjectDefinition
     * @param children List of child definitions
     * @param positionAttributes coordinates of a position of format: [longitude, latitude]
     * @param caption Contains caption to display to users
     * @param isNotReusable Boolean flag, whether this attribute can be used multiple times
     */
    public FisaObjectDefinition(
            String name,
            String infoText,
            boolean isTopLayer,
            String mapsTo,
            List<FisaObjectAttributeDefinition> attributes,
            ExampleData exampleData,
            ChildDefinition[] children,
            String[] positionAttributes,
            String caption,

            boolean isNotReusable) {
        this.name = name;
        this.infoText = infoText;
        this.isTopLayer = isTopLayer;
        this.mapsTo = mapsTo;
        this.attributes = attributes;
        this.exampleData = exampleData;
        this.children = children;
        this.positionAttributes = positionAttributes;
        this.caption = caption;
        this.isNotReusable = isNotReusable;
    }

    /**
     * @return The child-definitions of this ObjectDefinition
     */
    public ChildDefinition[] getChildren() {
        return children;
    }

    /**
     * @return The name of the described object
     */
    public String getName() {
        return this.name;
    }

    /**
     * @return The info-text, explaining this object in more detail
     */
    public String getInfoText() {
        return this.infoText;
    }

    /**
     * @return Whether the object can appear at the project-root
     */
    public boolean getIsTopLayer() {
        return this.isTopLayer;
    }

    /**
     * @return The corresponding SensorThings-API entity
     */
    public String getMapsTo() {
        return this.mapsTo;
    }

    /**
     * @return All attributes the objects has
     */
    public List<FisaObjectAttributeDefinition> getAttributes() {
        return this.attributes;
    }

    /**
     * @return The definition of example-data
     */
    public ExampleData getExampleData() {
        return this.exampleData;
    }

    /**
     * @return - the position attributes
     */
    public String[] getPositionAttributes() {
        return positionAttributes;
    }

    /**
     * @return - the caption
     */
    public String getCaption() {
        return caption;
    }

    /**
     * @return Boolean flag, to signal if attribute can be used multiple times
     */
    public boolean getIsNotReusable() {
        return isNotReusable;
    }

    /**
     * Sets the name of the described object.
     *
     * @param name name of described object
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Sets the info-text for the user.
     *
     * @param infoText information text for the user
     */
    public void setInfoText(String infoText) {
        this.infoText = infoText;
    }

    /**
     * Sets whether the object can appear at the root of the project.
     *
     * @param isTopLayer boolean flag
     */
    public void setIsTopLayer(boolean isTopLayer) {
        this.isTopLayer = isTopLayer;
    }

    /**
     * Sets the corresponding SensorThings-API entity.
     *
     * @param mapsTo Corresponding SensorThings-API entity
     */
    public void setMapsTo(String mapsTo) {
        this.mapsTo = mapsTo;
    }

    /**
     * Sets the attributes-definitions of the object-definition.
     *
     * @param attributes attribute definitions
     */
    public void setAttributes(List<FisaObjectAttributeDefinition> attributes) {
        this.attributes = attributes;
    }

    /**
     * Sets the children of the definition.
     *
     * @param children Children
     */
    public void setChildren(ChildDefinition[] children) {
        this.children = children;
    }

    /**
     * Sets the definition of the example-data.
     *
     * @param exampleData Example-data
     */
    public void setExampleData(ExampleData exampleData) {
        this.exampleData = exampleData;
    }

    /**
     * Sets the positionAttributes.
     *
     * @param positionAttributes New coordinates of format: [longitude, latitude]
     */
    public void setPositionAttributes(String[] positionAttributes) {
        this.positionAttributes = positionAttributes;
    }

    /**
     * Sets caption.
     *
     * @param caption New caption
     */
    public void setCaption(String caption) {
        this.caption = caption;
    }

    /**
     * Sets whether objects of this definition can be used multiple times in a project
     *
     * @param notReusable New boolean value
     */
    public void setIsNotReusable(boolean notReusable) {
        isNotReusable = notReusable;
    }
}
