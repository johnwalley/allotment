let _isMacintosh = false;
let _userAgent: string | undefined = undefined;

interface INavigator {
  userAgent: string;
}

declare const navigator: INavigator;

// Web environment
if (typeof navigator === "object") {
  _userAgent = navigator.userAgent;
  _isMacintosh = _userAgent.indexOf("Macintosh") >= 0;
} else {
  console.error("Unable to resolve platform.");
}

export const isMacintosh = _isMacintosh;
