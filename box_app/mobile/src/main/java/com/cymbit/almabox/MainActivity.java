package com.cymbit.almabox;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.Environment;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.animation.Animation;
import android.view.inputmethod.InputConnection;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.parse.GetCallback;
import com.parse.ParseException;
import com.parse.ParseObject;
import com.parse.ParseQuery;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;


public class MainActivity extends ActionBarActivity {
    Animation animationFadeOut;
    WebView mWebView;
    TextView loadingText;
    RelativeLayout loadingContainer;
    private WifiManager wifi;
    private View mDecorView;
    private DownloadManager downloadManager;
    private long downloadReference;
    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (DownloadManager.ACTION_DOWNLOAD_COMPLETE.equals(action)) {
                long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, 0);
                DownloadManager.Query query = new DownloadManager.Query();
                query.setFilterById(downloadReference);
                Cursor c = downloadManager.query(query);
                if (c.moveToFirst()) {
                    int columnIndex = c.getColumnIndex(DownloadManager.COLUMN_STATUS);
                    if (DownloadManager.STATUS_SUCCESSFUL == c.getInt(columnIndex)) {
                        if (downloadId == c.getInt(0)) {
                            String uriString = c.getString(c.getColumnIndex("local_uri"));
                            InstallAPK(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + "/AlmaBox.apk");
                        } else {
                            //Should Start Player
                        }
                    } else {
                        //Should Start Player
                    }
                } else {
                    //Should Start Player
                }
            }
        }
    };

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        System.out.println(keyCode);
        switch (keyCode) {
            case KeyEvent.KEYCODE_DPAD_DOWN:
            case KeyEvent.KEYCODE_DPAD_UP:
            case KeyEvent.KEYCODE_DPAD_LEFT:
            case KeyEvent.KEYCODE_DPAD_RIGHT:
                System.out.println("Right Input");
                break;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        /*try {
            Process root = Runtime.getRuntime().exec("su");
        } catch (Exception e) {
            e.printStackTrace();
        }*/

        super.onCreate(savedInstanceState);
        /*mDecorView = getWindow().getDecorView();
        mDecorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE);

        setContentView(R.layout.activity_main);

        Parse.enableLocalDatastore(this);
        Parse.initialize(this, "GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k", "oh8eC3w1vnRfBHpAaRljovwzVNaQJnrbh65ei7Wf");

        mWebView = (WebView) findViewById(R.id.webview);
        loadingText = (TextView) findViewById(R.id.loadingText);
        loadingContainer = (RelativeLayout) findViewById(R.id.loadingContainer);
        animationFadeOut = AnimationUtils.loadAnimation(this, R.anim.fadeout);

        checkVersion();

        registerReceiver(receiver, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));*/
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            mDecorView = getWindow().getDecorView();
            mDecorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
        }
    }

    public void InstallAPK(String filename) {
        File file = new File(filename);
        if (file.exists()) {
            try {
                String command;
                command = "pm install -r " + filename;//pm or adb install
                Process proc = Runtime.getRuntime().exec(new String[]{"su", "-c", command});
                proc.waitFor();
                rebootPhone();
            } catch (Exception e) {
                e.printStackTrace();
                //Should Start Player
            }
        } else {
            System.out.println("File Error");
            //Should Start Player
        }
    }

    public void rebootPhone() {
        try {
            String command = "reboot";
            Process proc = Runtime.getRuntime().exec(new String[]{"su", "-c", command});
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
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
                    } else {
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
        loadingText.setText("Please Wait...");

        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        mWebView.setWebChromeClient(new WebChromeClient());
        mWebView.loadUrl("http://alma.life/#/player/box");
        mWebView.setWebViewClient(new WebViewClient() {
            public void onPageFinished(WebView view, String url) {
                loadingText.setText("");
                loadingContainer.setVisibility(View.GONE);
                mWebView.setVisibility(View.VISIBLE);
                loadingContainer.startAnimation(animationFadeOut);
                /*try {
                    Thread.sleep(10000);
                    Log.d("", "All the cookies in a string:" + getCookie(url, "boxCode"));
                    Pubnub pubnub = new Pubnub("pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2", "sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe");

                    try {
                        pubnub.subscribe(getCookie(url, "boxCode WIFI"), new Callback() {
                            @Override
                            public void connectCallback(String channel, Object message) {
                                System.out.println("SUBSCRIBE : CONNECT on channel:" + channel
                                        + " : " + message.getClass() + " : "
                                        + message.toString());
                            }

                            @Override
                            public void successCallback(String channel, Object message) {
                                System.out.println("SUBSCRIBE : " + channel + " : "
                                        + message.getClass() + " : " + message.toString());
                            }
                        });
                    } catch (PubnubException e) {
                        System.out.println(e.toString());
                    }
                } catch (InterruptedException e) {

                }*/
            }
        });
    }

    public void updatePlayer(String url) {
        downloadManager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        Uri Download_Uri = Uri.parse(url);

        loadingText.setText("Updating Player... Please Wait");
        if (isFileExists(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + "/AlmaBox.apk")) {
            deleteExistingFile(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + "/AlmaBox.apk");
        }

        DownloadManager.Request r = new DownloadManager.Request(Download_Uri);

        r.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "AlmaBox.apk");
        r.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);

        downloadReference = downloadManager.enqueue(r);

        new Thread(new Runnable() {

            @Override
            public void run() {
                boolean downloading = true;
                while (downloading) {
                    try {
                        Thread.sleep(10000);
                        DownloadManager.Query q = new DownloadManager.Query();
                        q.setFilterById(downloadReference);

                        Cursor cursor = downloadManager.query(q);
                        cursor.moveToFirst();
                        int bytes_downloaded = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
                        int bytes_total = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));

                        if (cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS)) == DownloadManager.STATUS_SUCCESSFUL) {
                            downloading = false;
                        }

                        final int dl_progress = (int) ((double) bytes_downloaded / (double) bytes_total * 100f);

                        runOnUiThread(new Runnable() {

                            @Override
                            public void run() {

                                Log.d("Prog", Integer.toString(dl_progress));
                            }
                        });

                        cursor.close();
                    } catch (InterruptedException e) {

                    }
                }
            }
        }).start();
    }

    public String getCookie(String siteName, String CookieName) {
        String CookieValue = null;

        CookieManager cookieManager = CookieManager.getInstance();
        String cookies = cookieManager.getCookie(siteName);
        String[] temp = cookies.split(";");
        for (String ar1 : temp) {
            if (ar1.contains(CookieName)) {
                String[] temp1 = ar1.split("=");
                CookieValue = temp1[1];
            }
        }
        return CookieValue;
    }

    private boolean isFileExists(String filename) {
        File folder1 = new File(filename);
        return folder1.exists();
    }

    private boolean deleteExistingFile(String filename) {
        File folder1 = new File(filename);
        return folder1.delete();
    }
}
