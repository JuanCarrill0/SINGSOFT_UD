package com.singsoft.tests.steps;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.Assertions;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserSteps {

    private final TestContext context;
    private final String AUTH_BASE = "http://localhost:8080/api/auth";

    public UserSteps(TestContext context) {
        this.context = context;
    }

    @Given("there is no user with email {string}")
    public void there_is_no_user_with_email(String email) {
        // best-effort cleanup; if endpoint does not exist, ignore
        try {
            RestAssured.when().delete(AUTH_BASE + "/users/email/" + email);
        } catch (Exception e) {
            // ignore - cleanup best-effort
        }
    }

    @When("I register with the following data:")
    public void i_register_with_the_following_data(DataTable table) {
        List<Map<String, String>> rows = table.asMaps(String.class, String.class);
        Map<String, Object> body = new HashMap<>();
        for (Map<String, String> row : rows) {
            body.put(row.get("firstName") != null ? "firstName" : row.get("field"),
                    row.containsKey("firstName") ? row.get("firstName") : row.get("value"));
        }
        Response res = RestAssured.given()
                .contentType("application/json")
                .body(body)
                .post(AUTH_BASE + "/register");
        context.setResponse(res);
        try {
            context.setResponseJson(res.getBody().jsonPath().getMap(""));
        } catch (Exception ignored) {}
        if (res.getStatusCode() == 200 || res.getStatusCode() == 201) {
            try {
                Object t = context.getResponseJson() != null ? context.getResponseJson().get("token") : null;
                if (t != null) context.setToken(t.toString());
            } catch (Exception ignored) {}
        }
    }

    @Then("the system should create the user successfully")
    public void system_should_create_user_successfully() {
        Response res = context.getResponse();
        Assertions.assertTrue(res != null && (res.getStatusCode() == 200 || res.getStatusCode() == 201));
    }

    @Then("the system should reject the registration")
    public void system_should_reject_registration() {
        Response res = context.getResponse();
        Assertions.assertTrue(res != null && res.getStatusCode() >= 400);
    }

    @Then("it should return a valid JWT token")
    public void it_should_return_a_valid_jwt_token() {
        Assertions.assertNotNull(context.getToken());
        Assertions.assertFalse(context.getToken().isEmpty());
    }

    @When("I log in with:")
    public void i_log_in_with(DataTable table) {
        List<Map<String, String>> rows = table.asMaps(String.class, String.class);
        Map<String, Object> body = new HashMap<>();
        for (Map<String, String> row : rows) {
            body.put(row.get("firstName") != null ? "firstName" : row.get("field"),
                    row.containsKey("firstName") ? row.get("firstName") : row.get("value"));
        }
        Response res = RestAssured.given()
                .contentType("application/json")
                .body(body)
                .post(AUTH_BASE + "/login");
        context.setResponse(res);
        try {
            context.setResponseJson(res.getBody().jsonPath().getMap(""));
        } catch (Exception ignored) {}
        if (res.getStatusCode() == 200) {
            try {
                Object t = context.getResponseJson() != null ? context.getResponseJson().get("token") : null;
                if (t != null) context.setToken(t.toString());
            } catch (Exception ignored) {}
        }
    }

    @Then("the system should authenticate the user successfully")
    public void system_authenticate_user_successfully() {
        Response res = context.getResponse();
        Assertions.assertTrue(res != null && res.getStatusCode() == 200);
    }

    @Then("it should return the user data")
    public void it_should_return_the_user_data() {
        Map<String, Object> json = context.getResponseJson();
        Assertions.assertNotNull(json);
        Assertions.assertTrue(json.containsKey("user") || json.containsKey("userId") || json.containsKey("userid"));
    }

}
