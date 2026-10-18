/**
 * Data Service — centralizes all CSV/cloud data fetching logic.
 *
 * This module abstracts the cloud storage layer so dashboard components
 * only consume clean, typed data without worrying about fetch mechanics.
 */

import { supabase } from "@/integrations/supabase/client";

const BUCKET = "ml-outputs";

/**
 * Fetch a CSV file from cloud storage with cache-busting.
 * Returns raw text content or throws on failure.
 */
export async function fetchCSVFromStorage(filename: string): Promise<string> {
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  const cacheBuster = `?t=${Date.now()}`;
  const res = await fetch(urlData.publicUrl + cacheBuster);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${filename} (HTTP ${res.status})`);
  }

  return res.text();
}

/**
 * Generic CSV parser — splits text into rows, skipping empty lines.
 * Returns an array of string arrays (columns per row).
 */
export function parseCSVRaw(text: string): string[][] {
  const lines = text.trim().split("\n").filter((line) => line.trim() !== "");
  if (lines.length < 2) return [];

  return lines.slice(1).map((line) => line.split(",").map((col) => col.trim()));
}

/**
 * Generate a CSV string from headers and rows.
 * Used for report downloads.
 */
export function generateCSV(headers: string[], rows: string[][]): string {
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Trigger a browser download for a blob of text content.
 */
export function downloadFile(content: string, filename: string, type = "text/csv"): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
