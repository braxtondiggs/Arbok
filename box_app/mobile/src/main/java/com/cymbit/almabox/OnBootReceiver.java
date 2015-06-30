package com.cymbit.almabox;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class OnBootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("OnBootReceiver", "Hi, Mom!");
        Intent mainIntent = new Intent(context, SetupActivity.class);
        context.startActivity(mainIntent);
    }
}
