import { DeviceFingerprint } from './deviceFingerprint';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const API_URL = "https://tripwiser-backend-dev.onrender.com/api"

export interface TrackClickData {
  fingerprint: DeviceFingerprint;
  affiliateType: 'elite_gift' | 'influencer_referral';
  influencerId?: string;
  linkId?: string;
}

export interface TrackClickResponse {
  success: boolean;
  message: string;
  data?: {
    clickId: string;
    fingerprint: string;
    expiresAt: Date;
  };
}

/**
 * Tracks a click on an affiliate/referral link
 */
export async function trackAttributionClick(
  data: TrackClickData
): Promise<TrackClickResponse> {
  try {
    const response = await fetch(`${API_URL}/attribution/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        affiliateType: data.affiliateType,
        influencerId: data.influencerId,
        linkId: data.linkId,
        platform: data.fingerprint.platform,
        osVersion: data.fingerprint.osVersion,
        deviceModel: data.fingerprint.deviceModel,
        screenResolution: data.fingerprint.screenResolution,
        timezone: data.fingerprint.timezone,
        language: data.fingerprint.language,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error tracking attribution click:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to track click',
    };
  }
}
