import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

// 型定義
export interface Branch {
  id: string;
  code: string;
  name: string;
  region: string;
}

export interface Site {
  id: string;
  code: string;
  name: string;
  branchId: string;
  constructionType: string;
  startDate: string;
  endDate: string;
  constructionAmount: number | null;
  status: string;
}

export interface WasteRecord {
  siteCode: string;
  yearMonth: string;
  wasteType: string;
  totalWeight: number;
  sortedWeight: number;
  mixedWeight: number;
  recycledWeight: number;
  thermalRecycledWeight: number;
  finalDisposalWeight: number;
}

// CSVファイルのパス
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * 部門マスタを読み込む
 */
export function loadBranches(): Branch[] {
  const csvPath = path.join(DATA_DIR, 'branches.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true }) as Record<string, string>[];

  return records.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    region: row.region,
  }));
}

/**
 * 現場マスタを読み込む
 */
export function loadSites(): Site[] {
  const csvPath = path.join(DATA_DIR, 'sites.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true }) as Record<string, string>[];

  return records.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    branchId: row.branch_id,
    constructionType: row.construction_type,
    startDate: row.start_date,
    endDate: row.end_date,
    constructionAmount: row.construction_amount ? parseFloat(row.construction_amount) : null,
    status: row.status,
  }));
}

/**
 * 廃棄物記録を読み込む
 */
export function loadWasteRecords(): WasteRecord[] {
  const csvPath = path.join(DATA_DIR, 'waste-records.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true }) as Record<string, string>[];

  return records.map((row) => ({
    siteCode: row.site_code,
    yearMonth: row.year_month,
    wasteType: row.waste_type,
    totalWeight: parseFloat(row.total_weight) || 0,
    sortedWeight: parseFloat(row.sorted_weight) || 0,
    mixedWeight: parseFloat(row.mixed_weight) || 0,
    recycledWeight: parseFloat(row.recycled_weight) || 0,
    thermalRecycledWeight: parseFloat(row.thermal_recycled_weight) || 0,
    finalDisposalWeight: parseFloat(row.final_disposal_weight) || 0,
  }));
}

/**
 * 特定の現場コードの廃棄物記録を取得
 */
export function getWasteRecordsBySiteCode(siteCode: string, yearMonth?: string): WasteRecord[] {
  const records = loadWasteRecords();
  return records.filter(r =>
    r.siteCode === siteCode &&
    (yearMonth ? r.yearMonth === yearMonth : true)
  );
}

/**
 * 特定の部門の廃棄物記録を取得
 */
export function getWasteRecordsByBranchId(branchId: string, yearMonth?: string): WasteRecord[] {
  const sites = loadSites();
  const branchSites = sites.filter(s => s.branchId === branchId);
  const siteCodes = branchSites.map(s => s.code);

  const records = loadWasteRecords();
  return records.filter(r =>
    siteCodes.includes(r.siteCode) &&
    (yearMonth ? r.yearMonth === yearMonth : true)
  );
}

/**
 * 現場情報を現場コードで取得
 */
export function getSiteByCode(code: string): Site | undefined {
  const sites = loadSites();
  return sites.find(s => s.code === code);
}

/**
 * 現場情報を現場IDで取得
 */
export function getSiteById(id: string): Site | undefined {
  const sites = loadSites();
  return sites.find(s => s.id === id);
}

/**
 * 部門情報を部門IDで取得
 */
export function getBranchById(id: string): Branch | undefined {
  const branches = loadBranches();
  return branches.find(b => b.id === id);
}

/**
 * 部門情報を部門コードで取得
 */
export function getBranchByCode(code: string): Branch | undefined {
  const branches = loadBranches();
  return branches.find(b => b.code === code);
}

/**
 * 全社の廃棄物記録を取得（全社サイト SITE_COMPANY を使用）
 */
export function getCompanyWasteRecords(yearMonth?: string): WasteRecord[] {
  return getWasteRecordsBySiteCode('SITE_COMPANY', yearMonth);
}

/**
 * 利用可能な年月のリストを取得
 */
export function getAvailableYearMonths(): string[] {
  const records = loadWasteRecords();
  const yearMonths = new Set(records.map(r => r.yearMonth));
  return Array.from(yearMonths).sort();
}
