package com.Api_Crafter.Rest_Spring.Exception;

public class NoSchemaFoundException extends Exception {

    public NoSchemaFoundException() {
        super("No schema found");
    }

    public NoSchemaFoundException(String message) {
        super(message);
    }

    public NoSchemaFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoSchemaFoundException(Throwable cause) {
        super(cause);
    }
}
