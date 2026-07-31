export type TpSlMode = "partial" | "full";

export type TpSlLeg = {
  trigger: string;
  order: string;
  pnl: string;
  limit: boolean;
};

export type TpSlBundle = {
  id: string;
  quantity: string;
  tp?: TpSlLeg;
  sl?: TpSlLeg;
};

export type RowTpSlState = {
  full?: TpSlBundle;
  partial: TpSlBundle[];
};

export type TpSlSubmitPayload = {
  mode: TpSlMode;
  side: "buy" | "sell";
  /** Partial quantity (position variant) */
  quantity?: string;
  tpTrigger: string;
  tpOrder: string;
  tpPnl: string;
  tpLimit: boolean;
  slTrigger: string;
  slOrder: string;
  slPnl: string;
  slLimit: boolean;
};

export function formatTpSlCell(bundle?: TpSlBundle | null): string | null {
  if (!bundle?.tp && !bundle?.sl) return null;
  const tp = bundle.tp?.trigger?.trim();
  const sl = bundle.sl?.trigger?.trim();
  if (tp && sl) return `${tp} / ${sl}`;
  if (tp) return tp;
  if (sl) return sl;
  return null;
}

export function bundleFromSubmit(
  payload: TpSlSubmitPayload,
  quantity = "0.00206",
  id?: string,
): TpSlBundle {
  const qty = payload.quantity?.trim() || quantity;
  const tp =
    payload.tpTrigger.trim().length > 0
      ? {
          trigger: payload.tpTrigger.trim(),
          order: payload.tpOrder.trim(),
          pnl: payload.tpPnl,
          limit: payload.tpLimit,
        }
      : undefined;
  const sl =
    payload.slTrigger.trim().length > 0
      ? {
          trigger: payload.slTrigger.trim(),
          order: payload.slOrder.trim(),
          pnl: payload.slPnl,
          limit: payload.slLimit,
        }
      : undefined;
  return {
    id: id ?? `tpsl-${Date.now()}`,
    quantity: qty,
    tp,
    sl,
  };
}
