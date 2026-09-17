/**
 * Re-exporting from memoriesData for clean separation and backwards compatibility.
 * Edit your memories directly in src/data/memoriesData.ts!
 */
import { memoriesData } from "./memoriesData"
import type { FlowerMemory, BouquetConfig } from "./memoriesData"

export type { FlowerMemory, BouquetConfig }
export { memoriesData }

// Alias bouquetContent pointing to memoriesData
export const bouquetContent = memoriesData
