package com.example.mobilesecurity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.WindowManager;

public class SplashActivity extends AppCompatActivity {
    private static final String tag = "SplashActivity";
    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
        try{
            Thread.sleep(2000);
        }catch (InterruptedException e){
            Log.d(tag,"인터럽트 오류");
        }
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }
}
