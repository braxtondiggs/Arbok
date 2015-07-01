package com.cymbit.almabox.pages;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.KeyEvent;
import android.view.View;
import android.widget.RelativeLayout;

import com.cymbit.almabox.PlayerActivity;
import com.cymbit.almabox.R;
import com.rey.material.widget.CheckBox;
import com.rey.material.widget.SnackBar;

public class NetworkActivity extends ActionBarActivity {
    SnackBar mSnackBar;
    RelativeLayout mEthernet;
    RelativeLayout mWiFi;
    CheckBox mEthernetRadio;
    CheckBox mWiFiRadio;
    Intent PlayerIntent;
    Intent WifiIntent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mSnackBar = (SnackBar) findViewById(R.id.step2_snackbar);
        mEthernet = (RelativeLayout) findViewById(R.id.Ethernet);
        mWiFi = (RelativeLayout) findViewById(R.id.Wifi);
        mEthernetRadio = (CheckBox) findViewById(R.id.EthernetRadio);
        mWiFiRadio = (CheckBox) findViewById(R.id.WiFiRadio);

        PlayerIntent = new Intent(this, PlayerActivity.class);
        WifiIntent = new Intent(this, WiFiActivity.class);

        mEthernet.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //startActivity(EthernetIntent);Show Success Dialog, Maybe?
            }
        });
        mWiFi.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(WifiIntent);
            }
        });

        super.onCreate(savedInstanceState);
        setContentView(R.layout.network_activity);
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
                mSnackBar.text("Invalid input, select a network with the 'Up'/'Down' keys!").actionText(null).singleLine(true).duration(1000);
                break;
            case KeyEvent.KEYCODE_DPAD_CENTER:
                if (mEthernetRadio.isChecked()) {
                    mEthernet.performClick();
                } else if (mWiFiRadio.isChecked()) {
                    mWiFi.performClick();
                }
                break;
            case KeyEvent.KEYCODE_DPAD_UP:
                mEthernet.setBackgroundColor(getResources().getColor(R.color.selected_item));
                mWiFi.setBackgroundColor(getResources().getColor(android.R.color.transparent));
                if (!mEthernetRadio.isChecked()) {
                    mEthernetRadio.setChecked(true);
                }
                if (mWiFiRadio.isChecked()) {
                    mWiFiRadio.setChecked(false);
                }
                break;
            case KeyEvent.KEYCODE_DPAD_DOWN:
                mWiFi.setBackgroundColor(getResources().getColor(R.color.selected_item));
                mEthernet.setBackgroundColor(getResources().getColor(android.R.color.transparent));
                if (!mWiFiRadio.isChecked()) {
                    mWiFiRadio.setChecked(true);
                }
                if (mEthernetRadio.isChecked()) {
                    mEthernetRadio.setChecked(false);
                }
                break;
            case KeyEvent.KEYCODE_BACK:
            case KeyEvent.KEYCODE_HOME:
                onBackPressed();
                break;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }
}