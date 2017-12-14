import * as os from 'os';

export class Constants {
  // public static readonly PATH_SEPARATOR = '/';
  public static readonly UP_REFERENCE = '..';
  public static readonly PLATFORM_DARWIN = 'darwin';
  public static readonly PLATFORM_WIN32 = 'win32';

  public static PATH_SEPARATOR(): string {
    if (os.platform() === this.PLATFORM_WIN32) {
      return '\\';
    } else {
      return '/';
    }
  }
}

export class Platform {
  public static isWin32(): boolean {
    return os.platform() === Constants.PLATFORM_WIN32;
  }
  
  public static isDarwin(): boolean {
    return os.platform() === Constants.PLATFORM_DARWIN;
  }
}