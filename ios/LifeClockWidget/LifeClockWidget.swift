import SwiftUI
import WidgetKit

private let appGroup = "group.org.reactjs.native.example.ReactNativeProject"
private let widgetKind = "LifeClockWidget"

struct LifeClockEntry: TimelineEntry {
    let date: Date
    let birthDate: Date?
}

struct LifeClockProvider: TimelineProvider {
    func placeholder(in context: Context) -> LifeClockEntry {
        let now = Date()
        return LifeClockEntry(date: now, birthDate: Calendar.current.date(byAdding: .year, value: -27, to: now))
    }

    func getSnapshot(in context: Context, completion: @escaping (LifeClockEntry) -> Void) {
        completion(LifeClockEntry(date: Date(), birthDate: savedBirthDate()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<LifeClockEntry>) -> Void) {
        let now = Date()
        let entry = LifeClockEntry(date: now, birthDate: savedBirthDate())
        // The widget recalculates from the birthday on each timeline entry, so
        // the details remain current even when the React Native app is closed.
        let refresh = Calendar.current.date(byAdding: .minute, value: 30, to: now)!
        completion(Timeline(entries: [entry], policy: .after(refresh)))
    }

    private func savedBirthDate() -> Date? {
        guard
            let value = UserDefaults(suiteName: appGroup)?.string(forKey: "lifeCounter"),
            let data = value.data(using: .utf8),
            let payload = try? JSONDecoder().decode(WidgetPayload.self, from: data)
        else { return nil }
        return ISO8601DateFormatter().date(from: payload.birthDate)
            ?? ISO8601DateFormatter.withFractionalSeconds.date(from: payload.birthDate)
    }
}

private struct WidgetPayload: Decodable {
    let birthDate: String
}

private extension ISO8601DateFormatter {
    static let withFractionalSeconds: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()
}

struct LifeClockWidgetView: View {
    let entry: LifeClockEntry
    @Environment(\.widgetFamily) private var family

    var body: some View {
        if #available(iOS 17.0, *) {
            widgetContent
                .containerBackground(for: .widget) {
                    Color(red: 0.067, green: 0.067, blue: 0.067)
                }
        } else {
            widgetContent
                .background(Color(red: 0.067, green: 0.067, blue: 0.067))
        }
    }

    @ViewBuilder
    private var widgetContent: some View {
            if let birthDate = entry.birthDate {
                lifeSummary(for: birthDate)
            } else {
                emptyState
            }
    }

    @ViewBuilder
    private func lifeSummary(for birthDate: Date) -> some View {
        let details = LifeDetails(birthDate: birthDate, now: entry.date)
        if family == .systemSmall {
            compactLifeSummary(details)
        } else {
            fullLifeSummary(details)
        }
    }

    private func compactLifeSummary(_ details: LifeDetails) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("LIFE CLOCK")
                .font(.system(size: 10, weight: .semibold, design: .rounded))
                .tracking(1.4)
                .foregroundColor(.white.opacity(0.55))

            ageDisplay(details, wholeSize: 38, fractionSize: 20)
            Text("years on Earth")
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.55))

            Spacer(minLength: 6)
            HStack(alignment: .bottom) {
                WidgetMetric(value: details.daysLived, label: "days lived")
                Spacer()
                WidgetMetric(value: details.birthdayCountdown, label: "next birthday", alignment: .trailing)
            }
        }
    }

    private func fullLifeSummary(_ details: LifeDetails) -> some View {
        return VStack(alignment: .leading, spacing: 0) {
            Text("LIFE CLOCK")
                .font(.system(size: 10, weight: .semibold, design: .rounded))
                .tracking(1.4)
                .foregroundColor(.white.opacity(0.55))

            ageDisplay(details, wholeSize: 50, fractionSize: 26)

            Text("years on Earth")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.55))

            Spacer(minLength: 10)
            Divider().background(Color.white.opacity(0.14))
            Spacer(minLength: 9)

            HStack(alignment: .bottom) {
                WidgetMetric(value: details.daysLived, label: "days lived")
                Spacer()
                WidgetMetric(value: details.birthdayCountdown, label: "next birthday", alignment: .trailing)
            }
        }
    }

    private func ageDisplay(_ details: LifeDetails, wholeSize: CGFloat, fractionSize: CGFloat) -> some View {
        HStack(alignment: .lastTextBaseline, spacing: 1) {
            Text(details.wholeYears + ".")
                .font(.system(size: wholeSize, weight: .bold, design: .rounded))
            Text(details.fractionalYears)
                .font(.system(size: fractionSize, weight: .bold, design: .rounded))
                .foregroundColor(.white.opacity(0.68))
        }
        .foregroundColor(.white)
    }

    private var emptyState: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("LIFE CLOCK")
                .font(.system(size: 10, weight: .semibold, design: .rounded))
                .tracking(1.4)
                .foregroundColor(.white.opacity(0.55))
            Text("Add your birthday")
                .font(.system(size: 24, weight: .bold, design: .rounded))
            Text("Open LifeSpan Tracker to begin.")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.6))
        }
        .foregroundColor(.white)
    }
}

private struct WidgetMetric: View {
    let value: String
    let label: String
    var alignment: HorizontalAlignment = .leading

    var body: some View {
        VStack(alignment: alignment, spacing: 1) {
            Text(value)
                .font(.system(size: 17, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            Text(label)
                .font(.system(size: 11, weight: .medium, design: .rounded))
                .foregroundColor(.white.opacity(0.55))
        }
    }
}

private struct LifeDetails {
    let wholeYears: String
    let fractionalYears: String
    let daysLived: String
    let birthdayCountdown: String

    init(birthDate: Date, now: Date) {
        let elapsed = max(0, now.timeIntervalSince(birthDate))
        let age = elapsed / (365.25 * 24 * 60 * 60)
        let parts = String(
            format: "%.4f",
            locale: Locale(identifier: "en_US_POSIX"),
            age,
        ).split(separator: ".", maxSplits: 1)
        wholeYears = String(parts.first ?? "0")
        fractionalYears = parts.count > 1 ? String(parts[1]) : "0000"
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 0
        daysLived = formatter.string(from: NSNumber(value: elapsed / (24 * 60 * 60))) ?? "0"

        let calendar = Calendar.current
        let today = calendar.startOfDay(for: now)
        let birthComponents = calendar.dateComponents([.month, .day], from: birthDate)
        let birthMonth = birthComponents.month ?? 1
        let birthDay = birthComponents.day ?? 1
        let currentYear = calendar.component(.year, from: now)
        func birthday(in year: Int) -> Date {
            let firstOfMonth = calendar.date(from: DateComponents(year: year, month: birthMonth, day: 1)) ?? today
            let daysInMonth = calendar.range(of: .day, in: .month, for: firstOfMonth)?.count ?? birthDay
            return calendar.date(byAdding: .day, value: min(birthDay, daysInMonth) - 1, to: firstOfMonth) ?? firstOfMonth
        }
        var next = birthday(in: currentYear)
        if next < today { next = birthday(in: currentYear + 1) }
        let days = calendar.dateComponents([.day], from: today, to: next).day ?? 0
        birthdayCountdown = days == 0 ? "Today" : "in \(days) day\(days == 1 ? "" : "s")"
    }
}

struct LifeClockWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: widgetKind, provider: LifeClockProvider()) { entry in
            LifeClockWidgetView(entry: entry)
        }
        .configurationDisplayName("Life Clock")
        .description("Your years, days lived, and next birthday at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium])
        .contentMarginsDisabled()
    }
}

@main
struct LifeClockWidgetBundle: WidgetBundle {
    var body: some Widget {
        LifeClockWidget()
    }
}
