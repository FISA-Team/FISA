package de.fraunhofer.iosb.ilt.fisabackend.model.definitions;

/**
 * The FisaObjectAttribute represents an attribute of a FisaObject.
 */
public class FisaObjectAttribute {

    private String definitionName;
    private String value;

    /**
     * The default constructor of FisaObjectAttribute.
     */
    public FisaObjectAttribute() {
    }

    /**
     * Instantiates a FisaObjectAttribute.
     *
     * @param definitionName Name of the corresponding definition class
     * @param value Actual value of the FisaObjectAttribute
     */
    public FisaObjectAttribute(String definitionName, String value) {
        this.definitionName = definitionName;
        this.value = value;
    }

    /**
     * Returns the name of the corresponding definition class.
     *
     * @return Name of the definition class
     */
    public String getDefinitionName() {
        return this.definitionName;
    }

    /**
     * Returns the actual value of the FisaObjectAttribute.
     *
     * @return Actual value
     */
    public String getValue() {
        return this.value;
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
     * Sets the actual value of the FisaObjectAttribute.
     *
     * @param value Actual value
     */
    public void setValue(String value) {
        this.value = value;
    }
}
