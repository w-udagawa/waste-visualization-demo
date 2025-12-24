/**
 * Sankey Diagram Data Transformation
 * 廃棄物データをSankeyダイアグラム形式に変換
 */

import { marumieColors } from '@/lib/styles/colors';

// Sankey ノードの定義
export interface SankeyNode {
  name: string;
  color?: string;
}

// Sankey リンクの定義
export interface SankeyLink {
  source: number; // ノードのインデックス
  target: number; // ノードのインデックス
  value: number;  // 流量（kg）
}

// Sankey データ構造
export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// 廃棄物フローの集計データ
export interface WasteFlowData {
  wasteType: string;
  totalWeight: number;
  recycledWeight: number;
  thermalRecycledWeight: number;
  finalDisposalWeight: number;
}

/**
 * 廃棄物種類に対応する色を返す
 */
function getWasteColor(wasteType: string): string {
  const typeColorMap: Record<string, string> = {
    'コンクリートガラ': marumieColors.waste.concrete,
    '木くず': marumieColors.waste.wood,
    '金属くず': marumieColors.waste.metal,
    'プラスチック': marumieColors.waste.plastic,
    '紙くず': marumieColors.waste.paper,
    '混合廃棄物': marumieColors.waste.mixed,
    'ガラス': marumieColors.waste.glass,
  };

  return typeColorMap[wasteType] || marumieColors.waste.other;
}

/**
 * 廃棄物データをSankey形式に変換
 *
 * フロー構造:
 * 総廃棄物量
 *   ├→ コンクリートガラ → 再資源化
 *   │                  → 最終処分
 *   ├→ 木くず → 再資源化
 *   │        → 最終処分
 *   ... (他の廃棄物種類も同様)
 *
 * @param wasteFlowData 廃棄物フローデータ配列
 * @returns Sankeyダイアグラム用データ
 */
export function transformToSankeyData(wasteFlowData: WasteFlowData[]): SankeyData {
  // ノードの構築
  const nodes: SankeyNode[] = [
    { name: '総廃棄物量', color: marumieColors.gray[700] }, // Index 0
  ];

  // 廃棄物種類ノードを追加
  wasteFlowData.forEach((data) => {
    nodes.push({
      name: data.wasteType,
      color: getWasteColor(data.wasteType),
    });
  });

  // 処理方法ノードを追加
  const recycleNodeIndex = nodes.length;
  nodes.push({ name: '再資源化', color: marumieColors.success[500] });

  const disposalNodeIndex = nodes.length;
  nodes.push({ name: '最終処分', color: marumieColors.danger[500] });

  // リンクの構築
  const links: SankeyLink[] = [];

  // 総廃棄物量 → 各廃棄物種類
  wasteFlowData.forEach((data, index) => {
    const wasteTypeIndex = index + 1; // +1 because index 0 is total

    // 総廃棄物量から各種類へのリンク
    links.push({
      source: 0,
      target: wasteTypeIndex,
      value: data.totalWeight,
    });

    // 各廃棄物種類 → 再資源化（recycled + thermal）
    const totalRecycled = data.recycledWeight + data.thermalRecycledWeight;
    if (totalRecycled > 0) {
      links.push({
        source: wasteTypeIndex,
        target: recycleNodeIndex,
        value: totalRecycled,
      });
    }

    // 各廃棄物種類 → 最終処分
    if (data.finalDisposalWeight > 0) {
      links.push({
        source: wasteTypeIndex,
        target: disposalNodeIndex,
        value: data.finalDisposalWeight,
      });
    }
  });

  return { nodes, links };
}

/**
 * 重量をトン単位に変換してフォーマット
 */
export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t`;
  }
  return `${kg.toFixed(0)}kg`;
}

/**
 * パーセンテージをフォーマット
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}
