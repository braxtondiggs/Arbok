package com.cymbit.almabox;

import android.app.DownloadManager;
import android.net.Uri;
import android.os.Environment;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.parse.GetCallback;
import com.parse.Parse;
import com.parse.ParseException;
import com.parse.ParseObject;
import com.parse.ParseQuery;

import java.io.File;


public class MainActivity extends ActionBarActivity {
    WebView mWebView = (WebView) findViewById(R.id.webview);
    TextView loadingText = (TextView) findViewById(R.id.loadingText);
    RelativeLayout loadingContainer = (RelativeLayout) findViewById(R.id.loadingContainer);

    private View mDecorView;
    private DownloadManager downloadManager;
    private long downloadReference;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mDecorView = getWindow().getDecorView();
        mDecorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE);

        Parse.enableLocalDatastore(this);
        Parse.initialize(this, "GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k", "oh8eC3w1vnRfBHpAaRljovwzVNaQJnrbh65ei7Wf");

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
        loadingText.setText("Checking for updates... Please Wait");
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
        WebSettings webSettings = mWebView.getSettings();
        loadingText.setText("Please Wait...");
        webSettings.setJavaScriptEnabled(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        mWebView.loadUrl("http://quilava.herokuapp.com/#/player/box");
        mWebView.setWebViewClient(new WebViewClient() {
            public void onPageFinished(WebView view, String url) {
                loadingText.setText("");
                loadingContainer.setVisibility(View.GONE);
            }
        });
    }
    public void updatePlayer(String url) {
        downloadManager = (DownloadManager)getSystemService(DOWNLOAD_SERVICE);
        Uri Download_Uri = Uri.parse(url);

        loadingText.setText("Updating Player... Please Wait");

        DownloadManager.Request r = new DownloadManager.Request(Download_Uri);

        r.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "AlmaBox.apk");
        r.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);

        downloadReference = downloadManager.enqueue(r);

        //DownloadManager dm = (DownloadManager) activity.getSystemService(Context.DOWNLOAD_SERVICE);
        //SharedPreferences mSharedPref = activity.getSharedPreferences("package", Context.MODE_PRIVATE);
        //mSharedPref.edit().putLong("downloadID", dm.enqueue(r)).commit();
    }
}
