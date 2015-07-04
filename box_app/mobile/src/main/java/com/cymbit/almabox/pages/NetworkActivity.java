package com.cymbit.almabox.pages;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.ActionBarActivity;
import android.view.KeyEvent;
import android.view.View;
import android.widget.RelativeLayout;

import com.cymbit.almabox.PlayerActivity;
import com.cymbit.almabox.R;
import com.rey.material.app.Dialog;
import com.rey.material.widget.CheckBox;
import com.rey.material.widget.SnackBar;

public class NetworkActivity extends Activity {
    SnackBar mSnackBar;
    RelativeLayout mEthernet;
    RelativeLayout mWiFi;
    CheckBox mEthernetRadio;
    CheckBox mWiFiRadio;
    Intent PlayerIntent;
    Intent WifiIntent;
    View mDecorView;
    Dialog mDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.network_activity);

        mDecorView = getWindow().getDecorView();
        mDecorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN);

        mSnackBar = (SnackBar) findViewById(R.id.step2_snackbar);
        mEthernet = (RelativeLayout) findViewById(R.id.Ethernet);
        mWiFi = (RelativeLayout) findViewById(R.id.Wifi);
        mEthernetRadio = (CheckBox) findViewById(R.id.EthernetRadio);
        mWiFiRadio = (CheckBox) findViewById(R.id.WiFiRadio);

        PlayerIntent = new Intent(NetworkActivity.this, PlayerActivity.class);
        WifiIntent = new Intent(NetworkActivity.this, WiFiActivity.class);

        mDialog = new Dialog(NetworkActivity.this, R.style.SimpleDialog);

        mEthernet.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mDialog.title(R.string.checking).contentView(R.layout.network_dialog_loading).show();
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        mDialog.dismiss();
                        if (isConnected() && isEthernet()) {
                            mDialog.title("Network Success").contentView(R.layout.network_dialog_success).positiveAction("OK").positiveActionClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    SharedPreferences sharedPref = getApplicationContext().getSharedPreferences(getApplicationContext().getResources().getString(R.string.preference_file_key), Context.MODE_PRIVATE);
                                    SharedPreferences.Editor edit = sharedPref.edit();
                                    edit.clear();
                                    edit.putBoolean("isNetworkConfig", true);
                                    edit.apply();
                                    startActivity(PlayerIntent);
                                }
                            }).show();
                        } else {
                            mDialog.title("Network Error").contentView(R.layout.network_dialog_error_ethernet).positiveAction("OK").positiveActionClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    mDialog.dismiss();
                                }
                            }).show();

                        }
                    }
                }, 4000);
            }
        });
        mWiFi.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(WifiIntent);
            }
        });
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
                mSnackBar.text("Invalid input, select a network with the 'Up'/'Down' keys!").actionText(null).duration(2000).show(NetworkActivity.this);
                break;
            case KeyEvent.KEYCODE_DPAD_CENTER:
                if (mEthernetRadio.isChecked()) {
                    mEthernet.performClick();
                } else if (mWiFiRadio.isChecked()) {
                    mWiFi.performClick();
                }
                if (mDialog.isShowing()) {
                    mDialog.dismiss();
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

    private boolean isConnected() {
        ConnectivityManager cm = (ConnectivityManager) getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnected();
    }

    private boolean isEthernet() {
        ConnectivityManager cm = (ConnectivityManager) getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        return activeNetwork.getType() == ConnectivityManager.TYPE_ETHERNET;
    }
}