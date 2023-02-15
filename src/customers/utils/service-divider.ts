export class ServiceDivider {
  'DU': {
    Bagi: '3600';
    Layanan: 'DP';
  };
}

export const DIVIDER_TYPE_BAGI = 'Bagi';
export const DIVIDER_TYPE_LAYANAN = 'Layanan';
export type DividerType =
  | typeof DIVIDER_TYPE_BAGI
  | typeof DIVIDER_TYPE_LAYANAN;
