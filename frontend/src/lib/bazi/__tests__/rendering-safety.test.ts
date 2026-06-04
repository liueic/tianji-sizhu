import { describe, it, expect } from 'vitest'
import { calculateBazi } from '../calculator'
import type { BaziInput } from '../types'

describe('calculateBazi - rendering safety', () => {
  const inputs: BaziInput[] = [
    { year: 1990, month: 6, day: 15, hour: 3, gender: 0, calendar: 0 },
    { year: 1985, month: 1, day: 1, hour: 0, gender: 1, calendar: 0 },
    { year: 2000, month: 12, day: 31, hour: 11, gender: 0, calendar: 0 },
    { year: 1975, month: 8, day: 22, hour: 6, gender: 1, calendar: 0 },
  ]

  function assertRenderable(value: any, path: string) {
    if (value === null || value === undefined) return
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return
    throw new Error(`${path} is a non-renderable ${typeof value}: ${JSON.stringify(value).slice(0, 80)}`)
  }

  for (const input of inputs) {
    const label = `${input.year}-${input.month}-${input.day}`

    it(`[${label}] pillar fields should be renderable strings`, () => {
      const r = calculateBazi(input)
      const pillars = ['year', 'month', 'day', 'time'] as const
      for (const p of pillars) {
        assertRenderable(r.pillars[p].gan, `pillars.${p}.gan`)
        assertRenderable(r.pillars[p].zhi, `pillars.${p}.zhi`)
        assertRenderable(r.pillars[p].naYin, `pillars.${p}.naYin`)
        assertRenderable(r.pillars[p].hideGan, `pillars.${p}.hideGan`)
        assertRenderable(r.pillars[p].shiShenGan, `pillars.${p}.shiShenGan`)
        assertRenderable(r.pillars[p].shiShenZhi, `pillars.${p}.shiShenZhi`)
        assertRenderable(r.pillars[p].diShi, `pillars.${p}.diShi`)
        assertRenderable(r.pillars[p].wuXing, `pillars.${p}.wuXing`)
      }
    })

    it(`[${label}] hideGanAttr items should have renderable fields`, () => {
      const r = calculateBazi(input)
      for (const p of ['year', 'month', 'day', 'time'] as const) {
        for (const h of r.pillars[p].hideGanAttr) {
          assertRenderable(h.gan, `pillars.${p}.hideGanAttr.gan`)
          assertRenderable(h.qiLevel, `pillars.${p}.hideGanAttr.qiLevel`)
          assertRenderable(h.shiShen, `pillars.${p}.hideGanAttr.shiShen`)
        }
      }
    })

    it(`[${label}] dayMaster and wuXingPower should be renderable`, () => {
      const r = calculateBazi(input)
      assertRenderable(r.dayMaster, 'dayMaster')
      assertRenderable(r.dayMasterWuXing, 'dayMasterWuXing')
      for (const [k, v] of Object.entries(r.wuXingPower)) {
        assertRenderable(v, `wuXingPower.${k}`)
      }
    })

    it(`[${label}] special pillars should be renderable strings`, () => {
      const r = calculateBazi(input)
      assertRenderable(r.taiYuan, 'taiYuan')
      assertRenderable(r.taiYuanNaYin, 'taiYuanNaYin')
      assertRenderable(r.mingGong, 'mingGong')
      assertRenderable(r.mingGongNaYin, 'mingGongNaYin')
    })

    it(`[${label}] shensha arrays should contain only strings`, () => {
      const r = calculateBazi(input)
      for (const item of r.shensha.nian) assertRenderable(item, 'shensha.nian')
      for (const item of r.shensha.yue) assertRenderable(item, 'shensha.yue')
      for (const item of r.shensha.ri) assertRenderable(item, 'shensha.ri')
      for (const item of r.shensha.shi) assertRenderable(item, 'shensha.shi')
    })

    it(`[${label}] dayunArr items should have renderable ganZhi`, () => {
      const r = calculateBazi(input)
      for (const dy of r.dayunArr) {
        assertRenderable(dy.ganZhi, 'dayunArr.ganZhi')
        assertRenderable(dy.ganshen, 'dayunArr.ganshen')
        assertRenderable(dy.zhishen, 'dayunArr.zhishen')
      }
    })

    it(`[${label}] ganRelations items should have renderable desc`, () => {
      const r = calculateBazi(input)
      for (const rel of r.ganRelations) {
        if (typeof rel === 'object' && rel !== null) {
          assertRenderable(rel.desc, 'ganRelations.desc')
        } else {
          assertRenderable(rel, 'ganRelations')
        }
      }
    })

    it(`[${label}] zhiRelations items should have renderable desc`, () => {
      const r = calculateBazi(input)
      for (const rel of r.zhiRelations) {
        if (typeof rel === 'object' && rel !== null) {
          assertRenderable(rel.desc, 'zhiRelations.desc')
        } else {
          assertRenderable(rel, 'zhiRelations')
        }
      }
    })

    it(`[${label}] yuanHaiZiping.shenQiang/shidu judge should be renderable`, () => {
      const r = calculateBazi(input)
      const sq = r.yuanHaiZiping.shenQiang
      if (typeof sq === 'object') {
        assertRenderable(sq.judge, 'shenQiang.judge')
        assertRenderable(sq.score, 'shenQiang.score')
      } else {
        assertRenderable(sq, 'shenQiang')
      }
      const sd = r.yuanHaiZiping.shidu
      if (typeof sd === 'object') {
        assertRenderable(sd.judge, 'shidu.judge')
        assertRenderable(sd.score, 'shidu.score')
      } else {
        assertRenderable(sd, 'shidu')
      }
    })

    it(`[${label}] analysis.XiYongShen items should be safely renderable`, () => {
      const r = calculateBazi(input)
      for (const item of r.analysis.XiYongShen) {
        if (typeof item === 'object') {
          assertRenderable(item?.judge ?? JSON.stringify(item), 'XiYongShen.judge')
        } else {
          assertRenderable(item, 'XiYongShen')
        }
      }
    })
  }
})
