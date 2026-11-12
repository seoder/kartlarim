import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

let clearTimer: ReturnType<typeof setTimeout> | null = null;
let lastCopiedText: string | null = null;

export async function copyToClipboard(text: string, options?: { enableHaptic?: boolean }): Promise<void> {
  if (!text) return;

  if (options?.enableHaptic !== false) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics might fail on simulator/unsupported devices
    }
  }

  await Clipboard.setStringAsync(text);
  lastCopiedText = text;

  // Clear previous timer if any
  if (clearTimer) {
    clearTimeout(clearTimer);
  }

  // Auto-clear clipboard after 60 seconds for security
  clearTimer = setTimeout(async () => {
    try {
      const current = await Clipboard.getStringAsync();
      if (current === lastCopiedText) {
        await Clipboard.setStringAsync('');
      }
    } catch {
      // ignore
    } finally {
      clearTimer = null;
      lastCopiedText = null;
    }
  }, 60000);
}

export async function triggerHaptic(type: 'light' | 'success' | 'warning'): Promise<void> {
  try {
    if (type === 'light') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (type === 'success') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (type === 'warning') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  } catch {
    // ignore on unsupported devices
  }
}
