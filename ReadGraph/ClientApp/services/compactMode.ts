declare var window: any;
declare var Windows: any;

export function switchToDefaultMode() {
    if (!window.Windows) return;
    Windows.UI.ViewManagement.ApplicationView.getForCurrentView()
        .tryEnterViewModeAsync(Windows.UI.ViewManagement.ApplicationViewMode.default)
}

export function switchToCompactMode() {
    if (!window.Windows) return;
    Windows.UI.ViewManagement.ApplicationView.getForCurrentView()
        .tryEnterViewModeAsync(Windows.UI.ViewManagement.ApplicationViewMode.compactOverlay);
}