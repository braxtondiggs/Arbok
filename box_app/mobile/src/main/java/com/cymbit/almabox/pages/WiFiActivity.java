package com.cymbit.almabox.pages;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.KeyEvent;
import android.view.View;
import android.widget.RelativeLayout;

import com.cymbit.almabox.R;
import com.rey.material.widget.EditText;
import com.rey.material.widget.SnackBar;
import com.rey.material.widget.Spinner;

public class WiFiActivity extends ActionBarActivity {
    SnackBar mSnackBar;
    RelativeLayout mSSID;
    RelativeLayout mPassword;
    Spinner mSSIDSpinner;
    EditText mPasswordTxt;
    Intent SetupIntent;
    String selected = "SSID";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mSnackBar = (SnackBar)findViewById(R.id.step3_snackbar);
        mSSID = (RelativeLayout)findViewById(R.id.SSID);
        mSSIDSpinner = (Spinner)findViewById(R.id.SSIDSpinner);
        mPasswordTxt = (EditText)findViewById(R.id.PasswordTxt);
        mPassword = (RelativeLayout)findViewById(R.id.Password);

        SetupIntent = new Intent(this, IntroActivity.class);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.wifi_activity);
    }
    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_POWER:
            case KeyEvent.KEYCODE_VOLUME_MUTE:
            case KeyEvent.KEYCODE_DPAD_LEFT:
            case KeyEvent.KEYCODE_DPAD_RIGHT:
            case KeyEvent.KEYCODE_MENU:
            case KeyEvent.KEYCODE_VOLUME_DOWN:
            case KeyEvent.KEYCODE_VOLUME_UP:
                mSnackBar.text("Invalid input, insert network info with the 'Up'/'Down' keys!").actionText(null).singleLine(true).duration(1000);
                break;
            case KeyEvent.KEYCODE_DPAD_CENTER:
                if (selected.equals("SSID")) {

                }else if (selected.equals("Password")) {
                    
                }
                break;
            case KeyEvent.KEYCODE_DPAD_UP:
                mSSID.setBackgroundColor(getResources().getColor(R.color.selected_item));
                mPassword.setBackgroundColor(getResources().getColor(android.R.color.transparent));
                selected = "SSID";
                break;
            case KeyEvent.KEYCODE_DPAD_DOWN:
                mPassword.setBackgroundColor(getResources().getColor(R.color.selected_item));
                mSSID.setBackgroundColor(getResources().getColor(android.R.color.transparent));
                selected = "Password";
                break;
            case KeyEvent.KEYCODE_BACK:
                onBackPressed();
                break;
            case KeyEvent.KEYCODE_HOME:
                startActivity(SetupIntent);
                break;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }
}