package com.meshekle.app;

import android.app.Application;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
//import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.rnfs.RNFSPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

//import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
//import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication, ShareApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
//                    new RNFirebasePackage(),
//                    new RNFirebaseMessagingPackage(),
//                    new RNFirebaseNotificationsPackage(),
//                    new ReactNativePushNotificationPackage(),
                    new RNSharePackage(),
                    new RNFetchBlobPackage(),
                    new RNFSPackage(),
                    new ReactNativeDocumentPicker(),
                    new PickerPackage(),
                    new VectorIconsPackage(),
                    new RNGestureHandlerPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }

    @Override
    public String getFileProviderAuthority() {
        return "com.meshekle.app.provider";
    }
}
