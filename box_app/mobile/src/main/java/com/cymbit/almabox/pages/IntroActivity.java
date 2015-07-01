package com.cymbit.almabox.pages;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;

import com.cymbit.almabox.R;
import com.rey.material.widget.SnackBar;

public class IntroActivity extends ActionBarActivity {
    SnackBar mSnackBar;
    Button mGetStarted;
    Intent intent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mSnackBar = (SnackBar)findViewById(R.id.step1_snackbar);
        mGetStarted = (Button)findViewById(R.id.step1_button);
        intent = new Intent(this, NetworkActivity.class);

        mGetStarted.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(intent);
            }
        });

        super.onCreate(savedInstanceState);
        setContentView(R.layout.intro_activity);
    }
    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_POWER:
            case KeyEvent.KEYCODE_VOLUME_MUTE:
            case KeyEvent.KEYCODE_HOME:
            case KeyEvent.KEYCODE_DPAD_UP:
            case KeyEvent.KEYCODE_DPAD_LEFT:
            case KeyEvent.KEYCODE_DPAD_RIGHT:
            case KeyEvent.KEYCODE_DPAD_DOWN:
            case KeyEvent.KEYCODE_MENU:
            case KeyEvent.KEYCODE_BACK:
            case KeyEvent.KEYCODE_VOLUME_DOWN:
            case KeyEvent.KEYCODE_VOLUME_UP:
                mSnackBar.text("Invalid input, press 'OK' to begin!" ).actionText(null).singleLine(true).duration(1000);
                break;
            case KeyEvent.KEYCODE_DPAD_CENTER:
                mGetStarted.performClick();
                break;
        }
        return super.onKeyUp(keyCode, event);
    }
}