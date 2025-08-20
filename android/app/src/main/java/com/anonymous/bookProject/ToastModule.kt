package com.anonymous.bookproject

import android.widget.Toast
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ToastModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ToastModule" // Name used in JS
    }

    @ReactMethod
    fun show(message: String, promise: Promise) {
        try {
            Toast.makeText(reactContext, message, Toast.LENGTH_SHORT).show()
            promise.resolve("Toast shown successfully")
        } catch (e: Exception) {
            promise.reject("TOAST_ERROR", e)
        }
    }
}
