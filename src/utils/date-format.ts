export class DateFormat extends Date {
  $y: number;
  $M: number;
  $D: number;
  $W: number;
  $H: number;
  $i: number;
  $s: number;
  $ms: number;
  constructor(value: number | string | Date) {
    super(value);
    this.$y = this.getFullYear();
    this.$M = this.getMonth();
    this.$D = this.getDate();
    this.$W = this.getDay();
    this.$H = this.getHours();
    this.$i = this.getMinutes();
    this.$s = this.getSeconds();
    this.$ms = this.getMilliseconds();
  }

  toLongDateFormat(): string {
    return `${this.$D} ${month[this.$M]} ${this.$y}`;
  }

  toShorDateFormat(): string {
    const shortMonth = month.map((i) => i.substring(0, 3));
    return `${this.$D} ${shortMonth[this.$M]} ${this.$y}`;
  }

  toDateFormat(): string {
    return `${this.$y}-${('0' + (this.$M + 1)).slice(-2)}-${(
      '0' + this.$D
    ).slice(-2)}`;
  }

  toTimeFormat(): string {
    return `${('0' + this.$H).slice(-2)}:${('0' + this.$i).slice(-2)} ${(
      '0' + this.$s
    ).slice(-2)}`;
  }

  toLongDateTimeFormat(): string {
    return `${this.toLongDateFormat()} ${this.toTimeFormat()}`;
  }

  toShorDateTimeFormat(): string {
    return `${this.toShorDateFormat()} ${this.toTimeFormat()}`;
  }

  toDateTimeFormat(): string {
    return `${this.toDateFormat()} ${this.toTimeFormat()}`;
  }
}

export const month =
  'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split(
    '_',
  );

export const day = 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_');
