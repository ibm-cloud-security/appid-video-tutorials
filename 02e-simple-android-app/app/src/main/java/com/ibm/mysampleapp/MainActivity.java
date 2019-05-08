package com.ibm.mysampleapp;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.ibm.cloud.appid.android.api.AppID;
import com.ibm.cloud.appid.android.api.AuthorizationException;
import com.ibm.cloud.appid.android.api.AuthorizationListener;
import com.ibm.cloud.appid.android.api.LoginWidget;
import com.ibm.cloud.appid.android.api.tokens.AccessToken;
import com.ibm.cloud.appid.android.api.tokens.IdentityToken;
import com.ibm.cloud.appid.android.api.tokens.RefreshToken;

public class MainActivity extends AppCompatActivity {

    Button button;
    TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        button = (Button)findViewById(R.id.loginButton);
        textView = (TextView) findViewById(R.id.authResult);

        AppID.getInstance().initialize(getApplicationContext(), "your-appid-tenant-id", AppID.REGION_US_SOUTH);
    }

    public void onLoginButtonClicked(View v){
        Log.d("MainActivity", "onLoginButtonClicked");
        textView.setText("Authentication in progress....");

        LoginWidget loginWidget = AppID.getInstance().getLoginWidget();
        loginWidget.launch(this, new AuthorizationListener() {
            @Override
            public void onAuthorizationFailure (AuthorizationException exception) {
                Log.d("AuthorizationListener", "onAuthorizationFailure");
            }

            @Override
            public void onAuthorizationCanceled () {
                Log.d("AuthorizationListener", "onAuthorizationCanceled");
            }

            @Override
            public void onAuthorizationSuccess (AccessToken accessToken, final IdentityToken identityToken, RefreshToken refreshToken) {
                Log.d("AuthorizationListener", "onAuthorizationSuccess");
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        button.setVisibility(View.INVISIBLE);
                        textView.setText("Hello " + identityToken.getName());
                    }
                });
            }
        });
    }

}
