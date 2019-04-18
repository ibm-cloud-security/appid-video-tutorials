package com.appid.tutorial;


import com.ibm.websphere.security.WSSecurityException;
import com.ibm.websphere.security.auth.WSSubject;
import org.json.JSONObject;

import javax.security.auth.Subject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Base64;
import java.util.Hashtable;

@WebServlet(name = "UserServlet", urlPatterns = "/api/user")
public class UserServlet extends HttpServlet {

    private static final long serialVersionUID = -3462096221114971485L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Subject sub = null;
        try {
            sub = WSSubject.getRunAsSubject();
        } catch (WSSecurityException e){
            e.printStackTrace();
        }

        Hashtable privateCredentials = sub.getPrivateCredentials(Hashtable.class).iterator().next();
        Object idTokenObj = privateCredentials.get("id_token");

        if (null == idTokenObj){
            resp.setStatus(401);
            resp.getWriter().println("Unauthorized");
            return;
        }

        String payloadString = idTokenObj.toString().split("\\.")[1];
        byte[] decodedPayload = Base64.getUrlDecoder().decode(payloadString);
        String decodedPayloadString = new String(decodedPayload);
        JSONObject decodedPayloadObject = new JSONObject(decodedPayloadString);

        JSONObject userJson = new JSONObject();
        userJson.put("name", decodedPayloadObject.getString("name"));
        userJson.put("everything", decodedPayloadObject);

        JSONObject responseJson = new JSONObject();
        responseJson.put("user", userJson);

        resp.addHeader("Content-Type", "application/json");
        resp.getWriter().println(responseJson.toString());
    }
}