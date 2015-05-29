package com.cymbit.almabox;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.parse.GetCallback;
import com.parse.Parse;
import com.parse.ParseException;
import com.parse.ParseObject;
import com.parse.ParseQuery;

import java.io.File;


public class MainActivity extends ActionBarActivity {
    //WebView myWebView = (WebView) findViewById(R.id.webview);
    //WebSettings webSettings = myWebView.getSettings();
    private View mDecorView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mDecorView = getWindow().getDecorView();
        mDecorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE);

        //webSettings.setJavaScriptEnabled(true);
        //webSettings.setUseWideViewPort(true);
        //webSettings.setLoadWithOverviewMode(true);
        //myWebView.loadUrl("http://quilava.herokuapp.com/#/player/box");*/


        Parse.enableLocalDatastore(this);
        Parse.initialize(this, "GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k", "oh8eC3w1vnRfBHpAaRljovwzVNaQJnrbh65ei7Wf");
        /*ParseObject testObject = new ParseObject("TestObject");
        testObject.put("foo", "bar");
        testObject.saveInBackground();*/
        setContentView(R.layout.activity_main);
        checkVersion();

        /*@JavascriptInterface
        public void getLocalStorage() {
            print.
        }*/
    }
    public static void InstallAPK(String filename){
        File file = new File(filename);
        if(file.exists()){
            try {
                String command;
                command = "pm install -r " + filename;//pm or adb install
                Process proc = Runtime.getRuntime().exec(new String[] { "su", "-c", command });
                proc.waitFor();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    public void checkVersion() {
        final String versionName = BuildConfig.VERSION_NAME;

        ParseQuery<ParseObject> query = ParseQuery.getQuery("Server");
        query.getFirstInBackground(new GetCallback<ParseObject>() {
            public void done(ParseObject serverInfo, ParseException e) {
                if (e == null) {
                    if (serverInfo.getString("version").equals(versionName)) {
                        loadPlayer();
                    }else {
                        updatePlayer(serverInfo.getString("url"));
                    }
                } else {
                    Log.d("score", "Error: " + e.getMessage());
                    loadPlayer();
                }
            }
        });
    }
    public void loadPlayer() {

    }
    public void updatePlayer(String url) {

    }
}
