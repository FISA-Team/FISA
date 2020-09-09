package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

/**
 * ChildDefinition structures the children of entities in use-cases.
 */
public class ChildDefinition {

    private String objectName;
    private int quantity;
    private String infoText;

    /**
     * Default constructor.
     */
    public ChildDefinition() {
    }

    /**
     * Instantiates a ChildDefinition.
     *
     * @param object Name of the child object
     * @param quantity Quantity that the parent object may hold of one child object
     * @param infoText Information about the child
     */
    public ChildDefinition(String object, int quantity, String infoText) {
        this.objectName = object;
        this.quantity = quantity;
        this.infoText = infoText;
    }

    /**
     * Returns the name of the child object.
     *
     * @return Name of the child object
     */
    public String getObjectName() {
        return this.objectName;
    }

    /**
     * Returns the quantity of instances of a child the parent object can hold.
     *
     * @return Quantity of children
     */
    public int getQuantity() {
        return this.quantity;
    }

    /**
     * Returns an information text.
     *
     * @return Information text
     */
    public String getInfoText() {
        return this.infoText;
    }

    /**
     * Sets the name of the child object.
     *
     * @param objectName Name to set
     */
    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    /**
     * Sets the quantity of child object instances a parent can hold.
     *
     * @param quantity Quantity of child object instances
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * Sets the information text of a child.
     *
     * @param infoText Information text to be set
     */
    public void setInfoText(String infoText) {
        this.infoText = infoText;
    }
}
