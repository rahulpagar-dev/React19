type OtpCallback = (data: unknown) => void;

type Msg91Window = Window & {
  initSendOTP?: (configuration: {
    widgetId: string;
    tokenAuth: string;
    exposeMethods: boolean;
    captchaRenderId: string;
    success?: OtpCallback;
    failure?: OtpCallback;
  }) => void;
  sendOtp?: (identifier: string, success?: OtpCallback, failure?: OtpCallback) => void;
  retryOtp?: (channel: string | null, success?: OtpCallback, failure?: OtpCallback, reqId?: string) => void;
  verifyOtp?: (otp: string, success?: OtpCallback, failure?: OtpCallback, reqId?: string) => void;
  isCaptchaVerified?: () => boolean;
};

const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
const widgetId = env.VITE_MSG91_WIDGET_ID;
const tokenAuth = env.VITE_MSG91_TOKEN_AUTH;
let scriptPromise: Promise<void> | undefined;

function getMsg91Window() {
  return window as Msg91Window;
}

function waitForOtpMethod(method: keyof Msg91Window, timeoutMs = 10000) {
  return new Promise<void>((resolve, reject) => {
    const startedAt = Date.now();
    const check = () => {
      const msg91 = getMsg91Window();
      if (msg91[method]) {
        resolve();
        return;
      }
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error(`MSG91 OTP widget did not expose ${method}. Check the widget ID, token, and allowed domain.`));
        return;
      }
      window.setTimeout(check, 100);
    };
    check();
  });
}

export function loadMsg91Widget() {
  if (!widgetId || !tokenAuth) {
    return Promise.reject(new Error("MSG91 is not configured. Add VITE_MSG91_WIDGET_ID and VITE_MSG91_TOKEN_AUTH."));
  }

  if (getMsg91Window().sendOtp) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;
    script.onload = () => {
      const msg91 = getMsg91Window();
      if (!msg91.initSendOTP) {
        reject(new Error("MSG91 OTP widget failed to initialize."));
        return;
      }
      try {
        msg91.initSendOTP({
          widgetId,
          tokenAuth,
          exposeMethods: true,
          captchaRenderId: "msg91-captcha",
          success: () => undefined,
          failure: () => undefined,
        });
        waitForOtpMethod("sendOtp").then(resolve, reject);
      } catch (error) {
        reject(error instanceof Error ? error : new Error("MSG91 OTP widget failed to initialize."));
      }
    };
    script.onerror = () => reject(new Error("Unable to load the MSG91 OTP widget."));
    document.head.appendChild(script);
  });

  scriptPromise = scriptPromise.catch(error => {
    scriptPromise = undefined;
    throw error;
  });

  return scriptPromise;
}

export function normalizePhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function requireMethod<T extends keyof Msg91Window>(method: T) {
  const fn = getMsg91Window()[method];
  if (typeof fn !== "function") throw new Error("MSG91 OTP widget is not ready.");
  return fn as NonNullable<Msg91Window[T]>;
}

export async function sendMsg91Otp(identifier: string) {
  await loadMsg91Widget();
  const isCaptchaVerified = getMsg91Window().isCaptchaVerified;
  if (isCaptchaVerified && !isCaptchaVerified()) {
    throw new Error("Please complete the captcha before requesting an OTP.");
  }
  return new Promise<unknown>((resolve, reject) => {
    requireMethod("sendOtp")(identifier, resolve, reject);
  });
}

export async function retryMsg91Otp(reqId?: string) {
  await loadMsg91Widget();
  await waitForOtpMethod("retryOtp");
  return new Promise<unknown>((resolve, reject) => {
    requireMethod("retryOtp")(null, resolve, reject, reqId);
  });
}

export async function verifyMsg91Otp(otp: string, reqId?: string) {
  await loadMsg91Widget();
  await waitForOtpMethod("verifyOtp");
  return new Promise<unknown>((resolve, reject) => {
    requireMethod("verifyOtp")(otp, resolve, reject, reqId);
  });
}
