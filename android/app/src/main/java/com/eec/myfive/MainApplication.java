package com.easteregg.myfive;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;
import com.reactlibrary.RNOpenSettingsPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CodePush("YJGIJa0pv5qdU1PS_96hMCsxq-Eiec1e1c92-f9f7-4832-92bc-9995b0dd8d90", getApplicationContext(), BuildConfig.DEBUG),
            new RCTSplashScreenPackage(),
            new RNOpenSettingsPackage(),
            new ReactNativeContacts(),
            new VectorIconsPackage(),
            new ImagePickerPackage(),
            new MapsPackage()
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
}
