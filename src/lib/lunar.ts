import mystilight from 'mystilight-8char'

const { Lunar } = mystilight as any

export interface LunarDateInfo {
  year: number
  month: number
  day: number
  monthCn: string
  dayCn: string
  yearGanZhi: string
  fullString: string
}

export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
): { year: number; month: number; day: number } {
  const lunar = Lunar.fromYmdHms(lunarYear, lunarMonth, lunarDay, hour, minute, second)
  const solar = lunar.getSolar()
  return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() }
}

export function solarToLunar(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
): LunarDateInfo {
  const lunar = Lunar.fromYmdHms(solarYear, solarMonth, solarDay, hour, minute, second)
  const solar = lunar.getSolar()
  const lunarFromSolar = solar.getLunar()
  return {
    year: lunarFromSolar.getYear(),
    month: lunarFromSolar.getMonth(),
    day: lunarFromSolar.getDay(),
    monthCn: lunarFromSolar.getMonthInChinese(),
    dayCn: lunarFromSolar.getDayInChinese(),
    yearGanZhi: lunarFromSolar.getYearInGanZhi(),
    fullString: `${lunarFromSolar.getYearInGanZhi()}年${lunarFromSolar.getMonthInChinese()}月${lunarFromSolar.getDayInChinese()}`,
  }
}
