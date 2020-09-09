package de.fraunhofer.iosb.ilt.fisabackend.service.exception;

/**
 * Exception to signal that a client request cannot be fulfilled.
 */
public class ClientRequestException extends Exception {

    /**
     * Creates a ClientRequestException.
     *
     * @param errorMessage The message that will be sent, in case of an error
     */
    public ClientRequestException(String errorMessage) {
        super(errorMessage);
    }
}
