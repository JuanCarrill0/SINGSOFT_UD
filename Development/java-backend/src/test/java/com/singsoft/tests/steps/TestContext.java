package com.singsoft.tests.steps;

import io.restassured.response.Response;
import java.util.Map;

public class TestContext {
    private Response response;
    private Map<String, Object> responseJson;
    private String token;

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    public Map<String, Object> getResponseJson() {
        return responseJson;
    }

    @SuppressWarnings("unchecked")
    public void setResponseJson(Map<String, Object> responseJson) {
        this.responseJson = responseJson;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
