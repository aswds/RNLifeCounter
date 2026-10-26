import WidgetKit

@_cdecl("RNReloadLifeClockWidget")
public func RNReloadLifeClockWidget() {
  if #available(iOS 14.0, *) {
    WidgetCenter.shared.reloadTimelines(ofKind: "LifeClockWidget")
  }
}
