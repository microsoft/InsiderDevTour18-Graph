declare var window: any;
declare var Windows: any;

export async function changeWindowsLockScreenImage(image: string): Promise<boolean> {
    if (!window.Windows || !Windows.System.UserProfile.UserProfilePersonalizationSettings.isSupported()) {
        return false;
    }

    const profileSettings = Windows.System.UserProfile.UserProfilePersonalizationSettings.current;

    try {
        // 1. Get a reference to the original image (from manifest)
        let originalBg = await Windows.Storage.StorageFile.getFileFromApplicationUriAsync(new Windows.Foundation.Uri("ms-appx:///images/" + image));

        // 2. Copy image to LocalState folder
        let newName = guid() + '.jpg';
        await originalBg.copyAsync(Windows.Storage.ApplicationData.current.localFolder, newName, 1); // Replace existing
        let localBg = await Windows.Storage.ApplicationData.current.localFolder.getFileAsync(newName);

        // 3. Set as lockscreen image
        let resultLock = await profileSettings.trySetLockScreenImageAsync(localBg);
        console.log('ProfileSettings.trySetLockScreenImageAsync.result', resultLock);

        let resultBg = await profileSettings.trySetWallpaperImageAsync(localBg);
        console.log('ProfileSettings.trySetWallpaperImageAsync.result', resultBg);

        return resultLock && resultBg;

    } catch (err) {
        console.error('changeWindowsLockScreenImage.error!', err);
    }

    return false;
}

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }