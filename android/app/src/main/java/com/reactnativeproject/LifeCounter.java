package com.syntrixApps.LifeSpanTracker;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.widget.RemoteViews;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

/** Home-screen widget for the user's elapsed life time. */
public class LifeCounter extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.life_counter);
        try {
            SharedPreferences preferences = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String savedData = preferences.getString("lifeCounter", null);
            if (savedData == null) {
                showEmptyState(context, views);
            } else {
                Date birthDate = parseBirthDate(new JSONObject(savedData).getString("birthDate"));
                if (birthDate == null) {
                    showEmptyState(context, views);
                } else {
                    bindLifeData(context, views, birthDate);
                }
            }
        } catch (JSONException exception) {
            showEmptyState(context, views);
        }
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static void bindLifeData(Context context, RemoteViews views, Date birthDate) {
        long elapsed = Math.max(0L, System.currentTimeMillis() - birthDate.getTime());
        double years = elapsed / (365.25d * 24d * 60d * 60d * 1000d);
        String[] yearsParts = String.format(Locale.US, "%.4f", years).split("\\.");

        views.setTextViewText(R.id.years_decimal, yearsParts[0] + ".");
        views.setTextViewText(R.id.years_float, yearsParts.length > 1 ? yearsParts[1] : "0000");
        views.setTextViewText(R.id.days_lived,
                String.format(Locale.getDefault(), "%,d", elapsed / (24L * 60L * 60L * 1000L)));
        views.setTextViewText(R.id.birthday_countdown, getBirthdayCountdown(context, birthDate));
        setOpenAppIntent(context, views);
    }

    private static Date parseBirthDate(String birthDate) {
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
            formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
            return formatter.parse(birthDate);
        } catch (Exception ignored) {
            return null;
        }
    }

    private static String getBirthdayCountdown(Context context, Date birthDate) {
        Calendar today = Calendar.getInstance();
        Calendar todayStart = (Calendar) today.clone();
        todayStart.set(Calendar.HOUR_OF_DAY, 0);
        todayStart.set(Calendar.MINUTE, 0);
        todayStart.set(Calendar.SECOND, 0);
        todayStart.set(Calendar.MILLISECOND, 0);
        Calendar nextBirthday = birthdayInYear(birthDate, todayStart.get(Calendar.YEAR));
        if (nextBirthday.before(todayStart)) {
            nextBirthday = birthdayInYear(birthDate, todayStart.get(Calendar.YEAR) + 1);
        }

        int days = 0;
        Calendar cursor = (Calendar) todayStart.clone();
        while (cursor.before(nextBirthday)) {
            cursor.add(Calendar.DAY_OF_YEAR, 1);
            days++;
        }
        if (days == 0) return context.getString(R.string.birthday_today);
        return context.getResources().getQuantityString(R.plurals.birthday_days, days, days);
    }

    private static Calendar birthdayInYear(Date birthDate, int year) {
        Calendar birthday = Calendar.getInstance();
        birthday.clear();
        birthday.set(Calendar.YEAR, year);
        birthday.set(Calendar.MONTH, calendarValue(birthDate, Calendar.MONTH));
        birthday.set(Calendar.DAY_OF_MONTH, 1);
        int lastDay = birthday.getActualMaximum(Calendar.DAY_OF_MONTH);
        birthday.set(Calendar.DAY_OF_MONTH, Math.min(
                calendarValue(birthDate, Calendar.DAY_OF_MONTH), lastDay));
        return birthday;
    }

    private static int calendarValue(Date date, int field) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(field);
    }

    private static void setOpenAppIntent(Context context, RemoteViews views) {
        Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (launchIntent == null) return;
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, launchIntent, flags);
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);
    }

    private static void showEmptyState(Context context, RemoteViews views) {
        views.setTextViewText(R.id.years_decimal, "—");
        views.setTextViewText(R.id.years_float, "");
        views.setTextViewText(R.id.days_lived, "—");
        views.setTextViewText(R.id.birthday_countdown, context.getString(R.string.add_birthday_hint));
        setOpenAppIntent(context, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
}
