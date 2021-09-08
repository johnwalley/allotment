let _isMacintosh = false;
let _userAgent: string | undefined = undefined;

interface INavigator {
  userAgent: string;
}

declare const navigator: INavigator;

if (typeof navigator === "object") {
  _userAgent = navigator.userAgent;
  _isMacintosh = _userAgent.indexOf("Macintosh") >= 0;
}

export const isMacintosh = _isMacintosh;
