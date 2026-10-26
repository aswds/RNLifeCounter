package com.syntrixApps.LifeSpanTracker;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
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
        boolean didSave = context
                .getSharedPreferences("DATA", Context.MODE_PRIVATE)
                .edit()
                .putString(key, data)
                .commit();
        if (!didSave) {
            callback.invoke(false);
            return;
        }

        ComponentName componentName = new ComponentName(context, LifeCounter.class);
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        int[] ids = appWidgetManager.getAppWidgetIds(componentName);
        for (int id : ids) {
            LifeCounter.updateAppWidget(context, appWidgetManager, id);
        }
        callback.invoke(true);
    }

}
