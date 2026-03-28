/**
 * Squarified treemap layout algorithm.
 * Ported from Karpathy's original implementation.
 */

export interface TreemapItem {
  value: number;
  [key: string]: unknown;
}

export interface TreemapRect extends TreemapItem {
  rx: number;
  ry: number;
  rw: number;
  rh: number;
}

function worstAspect(
  row: TreemapItem[],
  rowSum: number,
  side: number,
  totalArea: number,
  availableExtent: number
): number {
  const rowExtent = availableExtent * (rowSum / totalArea);
  if (rowExtent === 0) return Infinity;
  let worst = 0;
  for (const item of row) {
    const itemLen = side * (item.value / rowSum);
    if (itemLen === 0) continue;
    const aspect = Math.max(rowExtent / itemLen, itemLen / rowExtent);
    if (aspect > worst) worst = aspect;
  }
  return worst;
}

export function squarify<T extends TreemapItem>(
  items: T[],
  x: number,
  y: number,
  w: number,
  h: number
): (T & { rx: number; ry: number; rw: number; rh: number })[] {
  type R = T & { rx: number; ry: number; rw: number; rh: number };
  if (items.length === 0) return [];
  if (items.length === 1)
    return [{ ...items[0], rx: x, ry: y, rw: w, rh: h }];
  const total = items.reduce((s, d) => s + d.value, 0);
  if (total === 0) return [];

  const results: R[] = [];
  let remaining = [...items],
    cx = x,
    cy = y,
    cw = w,
    ch = h;

  while (remaining.length > 0) {
    const remTotal = remaining.reduce((s, d) => s + d.value, 0);
    const vertical = cw >= ch;
    const side = vertical ? ch : cw;
    let row: TreemapItem[] = [remaining[0]],
      rowSum = remaining[0].value;

    for (let i = 1; i < remaining.length; i++) {
      const candidate = [...row, remaining[i]];
      const candidateSum = rowSum + remaining[i].value;
      if (
        worstAspect(
          candidate,
          candidateSum,
          side,
          remTotal,
          vertical ? cw : ch
        ) <
        worstAspect(row, rowSum, side, remTotal, vertical ? cw : ch)
      ) {
        row = candidate;
        rowSum = candidateSum;
      } else break;
    }

    const rowFraction = rowSum / remTotal;
    const rowThickness = vertical
      ? cw * rowFraction
      : ch * rowFraction;
    let offset = 0;

    for (const item of row) {
      const itemFraction = item.value / rowSum;
      const itemLength = side * itemFraction;
      if (vertical) {
        results.push({
          ...(item as T),
          rx: cx,
          ry: cy + offset,
          rw: rowThickness,
          rh: itemLength,
        });
      } else {
        results.push({
          ...(item as T),
          rx: cx + offset,
          ry: cy,
          rw: itemLength,
          rh: rowThickness,
        });
      }
      offset += itemLength;
    }

    if (vertical) {
      cx += rowThickness;
      cw -= rowThickness;
    } else {
      cy += rowThickness;
      ch -= rowThickness;
    }
    remaining = remaining.slice(row.length);
  }

  return results;
}
