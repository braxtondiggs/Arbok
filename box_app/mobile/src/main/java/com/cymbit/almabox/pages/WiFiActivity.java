package com.cymbit.almabox.pages;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.inputmethodservice.Keyboard.Key;
import android.inputmethodservice.Keyboard;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.RelativeLayout;

import com.cymbit.almabox.PlayerActivity;
import com.cymbit.almabox.R;
import com.rey.material.app.Dialog;
import com.rey.material.widget.EditText;
import com.rey.material.widget.SnackBar;
import com.rey.material.widget.Spinner;

import java.util.List;

public class WiFiActivity extends Activity {
    SnackBar mSnackBar;
    RelativeLayout mSSID;
    RelativeLayout mPassword;
    Spinner mSSIDSpinner;
    EditText mPasswordTxt;
    Button mButton;
    Intent SetupIntent;
    Intent PlayerIntent;
    View mDecorView;
    WifiManager mWifiManager;
    String selected = "SSID";
    Dialog mDialog;
    WifiScanReceiver wifiReciever;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.wifi_activity);
        new Instrumentation().setInTouchMode(false);

        mDecorView = getWindow().getDecorView();
        mDecorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN);

        mSnackBar = (SnackBar) findViewById(R.id.step3_snackbar);
        mSSID = (RelativeLayout) findViewById(R.id.SSID);
        mSSIDSpinner = (Spinner) findViewById(R.id.SSIDSpinner);
        mPasswordTxt = (EditText) findViewById(R.id.PasswordTxt);
        mPassword = (RelativeLayout) findViewById(R.id.Password);
        mButton = (Button) findViewById(R.id.step3_button);

        mDialog = new Dialog(WiFiActivity.this, R.style.SimpleDialog);

        SetupIntent = new Intent(WiFiActivity.this, IntroActivity.class);
        PlayerIntent = new Intent(WiFiActivity.this, PlayerActivity.class);

        mWifiManager = (WifiManager) getSystemService(Context.WIFI_SERVICE);
        if (!mWifiManager.isWifiEnabled()) {
            mWifiManager.setWifiEnabled(true);
        }

        mSSID.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mSSIDSpinner.performClick();
            }
        });

        mPassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mPasswordTxt.requestFocus();
                mPasswordTxt.requestFocusFromTouch();
                //mPasswordTxt.setFocusableInTouchMode(true);

                InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.showSoftInput(mPasswordTxt, InputMethodManager.SHOW_IMPLICIT);
            }
        });

        /*mButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mDialog.title(R.string.checking).contentView(R.layout.network_dialog_loading).show();
                WifiConfiguration conf = new WifiConfiguration();
                conf.SSID = "\"" + mSSIDSpinner.getSelectedItem().toString() + "\"";
                if (mPasswordTxt.getText().toString().trim().equals("")) {
                    conf.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE);
                }else {
                    conf.preSharedKey = "\"" + mPasswordTxt.getText().toString() + "\"";
                }
                mWifiManager.addNetwork(conf);

                List<WifiConfiguration> list = mWifiManager.getConfiguredNetworks();
                for( WifiConfiguration i : list ) {
                    if(i.SSID != null && i.SSID.equals("\"" + mSSIDSpinner.getSelectedItem().toString() + "\"")) {
                        mWifiManager.disconnect();
                        mWifiManager.enableNetwork(i.networkId, true);
                        if (mWifiManager.reconnect()) {
                            mDialog.title("Network Success").contentView(R.layout.network_dialog_success).positiveAction("OK").positiveActionClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    SharedPreferences sharedPref = getApplicationContext().getSharedPreferences(getApplicationContext().getResources().getString(R.string.preference_file_key), Context.MODE_PRIVATE);
                                    SharedPreferences.Editor edit = sharedPref.edit();
                                    edit.clear();
                                    edit.putBoolean("isNetworkConfig", true);
                                    edit.commit();
                                    startActivity(PlayerIntent);
                                }
                            }).show();
                        }else{
                            mDialog.title("Network Error").contentView(R.layout.network_dialog_error_wifi).positiveAction("OK").positiveActionClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    mDialog.dismiss();
                                }
                            }).show();
                        }
                        break;
                    }
                }
            }
        });*/
        wifiReciever = new WifiScanReceiver();

        mWifiManager = (WifiManager) getSystemService(Context.WIFI_SERVICE);
        mWifiManager.startScan();
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
                mSnackBar.text("Invalid input, insert network info with the 'Up'/'Down' keys!").actionText(null).singleLine(true).duration(1000).show(WiFiActivity.this);
                break;
            case KeyEvent.KEYCODE_DPAD_CENTER:
                switch (selected) {
                    case "SSID":
                        mSSID.performClick();
                        break;
                    case "Password":
                        mPassword.performClick();
                        break;
                    case "OK":
                        //mButton.performClick();
                        break;
                }
                if (mDialog.isShowing()) {
                    mDialog.dismiss();
                }
                mSSIDSpinner.setSelection(mSSIDSpinner.getSelectedItemPosition());
                break;
            case KeyEvent.KEYCODE_DPAD_UP:
                Keyboard
                if (selected.equals("Password")) {
                    setSelected("SSID");
                }else if(selected.equals("OK")) {
                    setSelected("Password");
                }
                break;
            case KeyEvent.KEYCODE_DPAD_DOWN:
                if (selected.equals("SSID")) {
                    setSelected("Password");
                }else if(selected.equals("Password")) {
                    setSelected("OK");
                }

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

    protected void onPause() {
        unregisterReceiver(wifiReciever);
        super.onPause();
    }

    protected void onResume() {
        registerReceiver(wifiReciever, new IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION));
        super.onResume();
    }

    private class WifiScanReceiver extends BroadcastReceiver {
        public void onReceive(Context c, Intent intent) {
            List<ScanResult> wifiScanList = mWifiManager.getScanResults();
            String[] items = new String[wifiScanList.size()];
            for (int i = 0; i < wifiScanList.size(); i++) {
                String SSID = (wifiScanList.get(i)).SSID;
                //if (!SSID.trim().equals("")) {
                items[i] = (SSID.trim());
                //}
            }
            ArrayAdapter<String> adapter = new ArrayAdapter<>(WiFiActivity.this, R.layout.row_spn, items);
            adapter.setDropDownViewResource(R.layout.row_spn_dropdown);

            mSSIDSpinner.setAdapter(adapter);
        }
    }
    private void setSelected(String elem) {
        switch (elem) {
            case "SSID":
                mSSID.setBackgroundColor(getResources().getColor(R.color.selected_item));
                mPassword.setBackgroundColor(getResources().getColor(android.R.color.transparent));
                selected = "SSID";
                break;
            case "Password":
                mPassword.setBackgroundColor(getResources().getColor(R.color.selected_item));
                mSSID.setBackgroundColor(getResources().getColor(android.R.color.transparent));
                selected = "Password";
                break;
            case "OK":

                break;
        }
    }
}