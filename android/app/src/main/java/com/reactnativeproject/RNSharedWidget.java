package com.syntrixApps.LifeSpanTracker;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNSharedWidget extends ReactContextBaseJavaModule {

    ReactApplicationContext context;


    public  RNSharedWidget (ReactApplicationContext reactContext){
        super(reactContext);
        context = reactContext;
    }

    @NonNull
    @Override
    public String getName(){
        return "RNSharedWidget";
    }

    @ReactMethod
    public void setData(String key, String data, Callback callback){
        SharedPreferences.Editor editor = context.getSharedPreferences("DATA", Context.MODE_PRIVATE).edit();

        editor.putString(key, data);
        editor.commit();

        Intent intent = new Intent(getCurrentActivity().getApplicationContext(), LifeCounter.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        ComponentName componentName = new ComponentName(getCurrentActivity().getApplicationContext(), LifeCounter.class);
        int[] ids = AppWidgetManager.getInstance(getCurrentActivity().getApplicationContext()).getAppWidgetIds(componentName);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        getCurrentActivity().getApplicationContext().sendBroadcast(intent);
    }

}
