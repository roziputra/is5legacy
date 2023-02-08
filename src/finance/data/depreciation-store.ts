export const depreciation: DepreciationRecord[] = [
  { branchId: '020', year: '2022', IV: 110955271, PM: 203092067 },
  { branchId: '020', year: '2023', IV: 116513080, PM: 172723263 },
  { branchId: '025', year: '2023', IV: 4960046, PM: 13483799 },
  { branchId: '062', year: '2023', IV: 8385199, PM: 20601172 },
];

export type DepreciationRecord = {
  branchId: string;
  year: string;
  IV: number;
  PM: number;
};
