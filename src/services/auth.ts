import * as LocalAuthentication from 'expo-local-authentication';

export interface AuthStatus {
  hasHardware: boolean;
  isEnrolled: boolean;
  canAuthenticate: boolean;
}

export async function checkDeviceSecurity(): Promise<AuthStatus> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return {
      hasHardware,
      isEnrolled,
      canAuthenticate: hasHardware && isEnrolled,
    };
  } catch {
    return {
      hasHardware: false,
      isEnrolled: false,
      canAuthenticate: false,
    };
  }
}

export async function authenticateUser(): Promise<{ success: boolean; error?: string }> {
  try {
    const security = await checkDeviceSecurity();

    // If device doesn't have lock/biometrics configured:
    // Specification: "Telefonda ekran kilidi tanımlı değilse uyarı göster, yine de aç."
    if (!security.canAuthenticate) {
      return { success: true, error: 'NO_DEVICE_LOCK' };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Kartlarım',
      fallbackLabel: 'Telefon Şifresini Kullan',
      cancelLabel: 'Vazgeç',
      disableDeviceFallback: false,
    });

    if (result.success) {
      return { success: true };
    }

    return { success: false, error: result.error || 'AUTH_FAILED' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'AUTH_ERROR' };
  }
}
