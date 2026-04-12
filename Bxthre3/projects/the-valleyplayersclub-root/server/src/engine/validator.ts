/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { GameManifestSchema } from './types';

export class ManifestValidator {
  static validate(manifest: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!manifest.name) errors.push('Missing game name');
    if (!manifest.reels || !Array.isArray(manifest.reels)) errors.push('Invalid reels configuration');
    if (manifest.reels && manifest.reels.length < 3) errors.push('At least 3 reels required');
    
    if (typeof manifest.rows !== 'number' || manifest.rows < 1) errors.push('Invalid rows count');
    
    if (!['slots-lines', 'slots-scatter', 'simple-choice'].includes(manifest.evaluatorType)) {
      errors.push(`Invalid evaluator type: ${manifest.evaluatorType}`);
    }

    // Check symbols in reels exist in manifest theme description (conceptual check)
    // In actual implementation, we'd check against a master symbol list
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
