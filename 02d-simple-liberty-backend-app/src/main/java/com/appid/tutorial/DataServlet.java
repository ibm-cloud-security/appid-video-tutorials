package com.appid.tutorial;

import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "DataServlet", urlPatterns = "/api/data")
public class DataServlet extends HttpServlet {

    private static final long serialVersionUID = -3462096221114971485L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JSONObject data = new JSONObject();
        data.put("data", 12345);
        resp.addHeader("Content-Type", "application/json");
        resp.getWriter().println(data.toString());
    }
}