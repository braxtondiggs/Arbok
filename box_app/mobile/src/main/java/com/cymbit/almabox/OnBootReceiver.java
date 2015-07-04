package com.cymbit.almabox;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.cymbit.almabox.pages.IntroActivity;

public class OnBootReceiver extends BroadcastReceiver {
    Intent mainIntent;

    @Override
    public void onReceive(Context context, Intent intent) {
        SharedPreferences sharedPref = context.getSharedPreferences(context.getResources().getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        Boolean isNetworkConfig = sharedPref.getBoolean("isNetworkConfig", false);
        if (isNetworkConfig) {
            mainIntent = new Intent(context, PlayerActivity.class);
        } else {
            mainIntent = new Intent(context, IntroActivity.class);
        }
        context.startActivity(mainIntent);
    }
}
