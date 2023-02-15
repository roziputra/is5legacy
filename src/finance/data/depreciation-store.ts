export const depreciation: DepreciationRecord[] = [
  { branchId: '020', year: '2022', IV: 110955271, PM: 203092067 },
  { branchId: '025', year: '2022', IV: 0, PM: 7108533 },
  { branchId: '020', year: '2023', IV: 116513080, PM: 172723263 },
  { branchId: '025', year: '2023', IV: 0, PM: 18443845 },
  { branchId: '062', year: '2023', IV: 8385199, PM: 20601172 },
];

export type DepreciationRecord = {
  branchId: string;
  year: string;
  IV: number;
  PM: number;
};

export const PERALATAN_INVENTARIS = 'IV';
export const PERALATAN_CUSTOMER = 'PM';
