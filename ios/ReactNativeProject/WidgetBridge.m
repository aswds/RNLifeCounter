#import <React/RCTBridgeModule.h>

extern void RNReloadLifeClockWidget(void);

@interface RNSharedWidget : NSObject <RCTBridgeModule>
@end

@implementation RNSharedWidget

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setData:(NSString *)key
                  data:(NSString *)data
                  callback:(RCTResponseSenderBlock)callback)
{
  NSUserDefaults *sharedDefaults = [[NSUserDefaults alloc]
      initWithSuiteName:@"group.org.reactjs.native.example.ReactNativeProject"];

  if (sharedDefaults == nil) {
    callback(@[@NO]);
    return;
  }

  [sharedDefaults setObject:data forKey:key];
  [sharedDefaults synchronize];
  dispatch_async(dispatch_get_main_queue(), ^{
    RNReloadLifeClockWidget();
  });
  callback(@[@YES]);
}

@end
