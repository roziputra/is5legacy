import { QueryRunner, Repository } from 'typeorm';
import { GeneralJournal } from '../entities/general-journal.entity';
import { GeneralJournalBatchNo } from '../entities/general-journal-batch-no.entity';

export class GeneralJournalRepository extends Repository<GeneralJournal> {
  async addDepreciationToGeneralJournal(
    transaction: QueryRunner,
    depreciation: number,
    branchId: string,
    period: any,
  ) {
    const batch = new GeneralJournalBatchNo();

    batch.JournalAI = JOURNAL_AI_DEFAULT;
    batch.Sumber = JOURNAL_SUMBER;
    batch.SumberId = '';
    batch.Source = JOURNAL_SOURCE;

    const { NoBatch } = await transaction.manager.save(batch);

    const depreciationJournal = new GeneralJournal();

    depreciationJournal.NoBatch = NoBatch;
    depreciationJournal.AI = JOURNAL_AI_DEFAULT;
    depreciationJournal.KodeCabang = branchId;
    depreciationJournal.TglTransaksi = period.toDate;
    depreciationJournal.NoPerkiraan = this.getPerkiraan(
      AKUMULASI_PENYUSUTAN_AKUN,
      branchId,
    );
    depreciationJournal.Keterangan = this.getPerkiraanText(
      PENYUSUTAN_TEXT,
      period.fromDate,
    );
    depreciationJournal.Debet = 0;
    depreciationJournal.Kredit = depreciation;
    depreciationJournal.Sumber = batch.Sumber;
    depreciationJournal.SumberId = batch.SumberId;
    depreciationJournal.Tipe = '';
    depreciationJournal.TglHistory = period.toDate;
    depreciationJournal.FlagAcctApproval = JOURNAL_APPROVED;
    await transaction.manager.save(depreciationJournal);

    const expenseJournal = new GeneralJournal();

    expenseJournal.NoBatch = NoBatch;
    expenseJournal.AI = JOURNAL_AI_DEFAULT;
    expenseJournal.KodeCabang = branchId;
    expenseJournal.TglTransaksi = period.toDate;
    expenseJournal.NoPerkiraan = this.getPerkiraan(
      BIAYA_PENYUSUTAN_AKUN,
      branchId,
    );
    expenseJournal.Keterangan = this.getPerkiraanText(
      PENYUSUTAN_TEXT,
      period.fromDate,
    );
    expenseJournal.Debet = depreciation;
    expenseJournal.Kredit = 0;
    expenseJournal.Sumber = batch.Sumber;
    expenseJournal.SumberId = batch.SumberId;
    expenseJournal.Tipe = '';
    expenseJournal.TglHistory = period.toDate;
    expenseJournal.FlagAcctApproval = JOURNAL_APPROVED;
    await transaction.manager.save(expenseJournal);
  }

  getPerkiraan(kode: string, branchId: string): string {
    return `${kode}.${DEFAULT_DIVISION}.${branchId}.${DEFAULT_DEPARTEMENT}`;
  }

  getPerkiraanText(txt: string, date: string): string {
    const d = new Date(date);
    const month = d.toLocaleString('default', { month: 'long' });
    return `${txt} ${month} ${d.getFullYear()}`;
  }
}

export const JOURNAL_AI_DEFAULT = 0;
export const JOURNAL_SUMBER = 'IS5Legacy';
export const JOURNAL_SOURCE = 'AutoDepreciation';

export const DEPRECIATION_PERSENTAGE = 50;
export const MAX_YEAR = 4;

export const PENYUSUTAN_TEXT = 'By.penyusutan peralatan/perlengkapan';
export const BIAYA_PENYUSUTAN_AKUN = '505.000';
export const AKUMULASI_PENYUSUTAN_AKUN = '154.300';

export const JOURNAL_APPROVED = 1;

export const DEFAULT_DIVISION = '01';
export const DEFAULT_DEPARTEMENT = '01';
