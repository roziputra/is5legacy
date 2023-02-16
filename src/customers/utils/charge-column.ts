export class ChargeColumn {
  '02': {
    Add: 'ServiceAdditionalCharge';
    Free: 'FreeAccess';
  };
  '03': {
    Add: 'ServiceAddChargeJakarta';
    Free: 'FreeAccessJakarta';
  };
  '06': {
    Add: 'ServiceAddChargeSurabaya';
    Free: 'FreeAccessSurabaya';
  };
  '09': {
    Add: 'ServiceAddChargeLampung';
    Free: 'FreeAccessLampung';
  };
}

export const CHARGE_TYPE_ADD = 'Add';
export const CHARGE_TYPE_FREE = 'Free';

export type ChargeType = typeof CHARGE_TYPE_ADD | typeof CHARGE_TYPE_FREE;
