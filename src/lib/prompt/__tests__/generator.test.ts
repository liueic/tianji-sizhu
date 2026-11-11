import { describe, it, expect } from 'vitest'
import { generatePrompt, getTemplateList } from '../generator'
import { calculateBazi } from '../../bazi/calculator'
import type { BaziInput, BaziResult } from '../../bazi/types'

/** Deep-clone a result so tests can mutate data shapes without touching the fixture. */
function cloneResult(result: BaziResult): BaziResult {
  return JSON.parse(JSON.stringify(result)) as BaziResult
}

describe('generatePrompt', () => {
  const input: BaziInput = {
    name: '测试用户',
    year: 1990,
    month: 6,
    day: 15,
    hour: 3,
    gender: 0,
    calendar: 0,
  }

  const result = calculateBazi(input)

  it('should generate a non-empty prompt string', () => {
    const prompt = generatePrompt(result, input)
    expect(prompt.length).toBeGreaterThan(200)
  })

  it('should include basic info in prompt', () => {
    const prompt = generatePrompt(result, input)
    expect(prompt).toContain('男')
    expect(prompt).toContain('1990')
    expect(prompt).toContain('测试用户')
  })

  it('should include four pillars table', () => {
    const prompt = generatePrompt(result, input)
    expect(prompt).toContain('年柱')
    expect(prompt).toContain('月柱')
    expect(prompt).toContain('日柱')
    expect(prompt).toContain('时柱')
    expect(prompt).toContain(result.dayGan)
  })

  it('should include 自坐 row in the four pillars table', () => {
    const prompt = generatePrompt(result, input)
    expect(prompt).toContain('| 自坐 |')
    if (result.pillars.day.ziZuo) {
      expect(prompt).toContain(result.pillars.day.ziZuo)
    }
  })

  it('should render a dash for missing 自坐 values', () => {
    const cloned = cloneResult(result)
    delete cloned.pillars.year.ziZuo
    delete cloned.pillars.month.ziZuo
    delete cloned.pillars.day.ziZuo
    delete cloned.pillars.time.ziZuo

    const prompt = generatePrompt(cloned, input)
    expect(prompt).toContain('| 自坐 | — | — | — | — |')
  })

  it('should include day master strength details', () => {
    const prompt = generatePrompt(result, input)
    expect(prompt).toContain('## 日主信息')
    expect(prompt).toContain('身强/身弱')

    const sq = result.yuanHaiZiping.shenQiang as any
    if (sq?.breakdown?.ganScores) {
      expect(prompt).toContain('得力天干：')
      expect(prompt).toContain('比劫助身：')
    }
  })

  it('should include cold/warm dryness with its normal range', () => {
    const prompt = generatePrompt(result, input)
    expect(prompt).toContain('寒暖燥湿：')
    expect(prompt).toMatch(/寒暖燥湿：.+正常范围/)
  })

  it('should include yin-yang balance when present', () => {
    const yy = (result.yuanHaiZiping as any).yinyang
    if (yy && typeof yy === 'object') {
      const prompt = generatePrompt(result, input)
      expect(prompt).toContain('阴阳平衡：')
      expect(prompt).toContain(`${yy.judge}（得分${yy.score}`)
    }
  })

  it('should include five elements power', () => {
    const prompt = generatePrompt(result, input)
    expect(prompt).toContain('木')
    expect(prompt).toContain('火')
    expect(prompt).toContain('五行力量')
  })

  it('should include current fortune details for daYun and liuNian', () => {
    const prompt = generatePrompt(result, input)
    expect(prompt).toContain('## 当前运势')
    expect(prompt).toContain('当前大运：')

    const dy = result.currentYun?.daYun
    if (dy?.shiShen) expect(prompt).toContain('大运天干十神：')
    if (dy?.zhiHideGanShiShen?.length) expect(prompt).toContain('大运地支藏干：')
    if (dy?.ziZuo) expect(prompt).toContain('大运自坐：')
    if (dy?.xingYunZhi) expect(prompt).toContain('大运行运支：')

    const ln = result.currentYun?.liuNian
    if (ln?.shiShen) expect(prompt).toContain('流年天干十神：')
    if (ln?.zhiHideGanShiShen?.length) expect(prompt).toContain('流年地支藏干：')
    if (ln?.ziZuo) expect(prompt).toContain('流年自坐：')
    if (ln?.xingYunZhi) expect(prompt).toContain('流年行运支：')
  })

  it('should include current liuYue and liuRi details', () => {
    const prompt = generatePrompt(result, input)

    const ly = result.currentYun?.liuYue
    if (ly) {
      expect(prompt).toContain('当前流月：')
      if (ly.zhiHideGanShiShen?.length) expect(prompt).toContain('流月地支藏干：')
    }

    const lr = result.currentYun?.liuRi
    if (lr && !lr.error) {
      expect(prompt).toContain('当前流日：')
      if (lr.zhiHideGanShiShen?.length) expect(prompt).toContain('流日地支藏干：')
    }
  })

  it('should skip liuRi detail when the calculation errored', () => {
    const cloned = cloneResult(result)
    cloned.currentYun.liuRi = { error: 'calculation failed' }

    const prompt = generatePrompt(cloned, input)
    expect(prompt).not.toContain('当前流日')
  })

  it('should include the YuanHaiZiping detail section', () => {
    const prompt = generatePrompt(result, input)
    expect(prompt).toContain('## 渊海子平详解')
    expect(prompt).toContain('### 月令分析')
    expect(prompt).toContain('### 太岁分析')
    if (result.yuanHaiZiping.yueLing?.tips?.length) {
      expect(prompt).toContain('### 月令提示')
    }
    if (result.yuanHaiZiping.yueLing?.yongShenSupport) {
      expect(prompt).toContain('### 用神得力情况')
      // `matched` is internal data, not a support judgment line
      expect(prompt).not.toContain('matched：')
    }
    if (result.yuanHaiZiping.taiSui?.taiSui) {
      expect(prompt).toContain('与日主关系：')
      expect(prompt).toContain('风险等级：')
    }
  })

  it('should place the YuanHaiZiping detail section before extended analysis', () => {
    const prompt = generatePrompt(result, input)
    const yhzIndex = prompt.indexOf('## 渊海子平详解')
    expect(yhzIndex).toBeGreaterThan(prompt.indexOf('## 神煞'))
    if (result.spouseAppearance) {
      expect(yhzIndex).toBeLessThan(prompt.indexOf('## 配偶信息'))
    }
  })

  it('should omit the YuanHaiZiping detail section when no data is available', () => {
    const cloned = cloneResult(result)
    cloned.yuanHaiZiping = {
      yueLing: undefined,
      taiSui: undefined,
      shenQiang: cloned.yuanHaiZiping.shenQiang,
      shidu: cloned.yuanHaiZiping.shidu,
    }

    const prompt = generatePrompt(cloned, input)
    expect(prompt).not.toContain('渊海子平详解')
    expect(prompt).not.toContain('阴阳平衡')
  })

  it('should fall back to simple liunian shensha when allLiuNianData is absent', () => {
    const prompt = generatePrompt(result, input, 'comprehensive', {
      liunianShensha: { daYun: ['天乙贵人'], liuNian: ['驿马'] },
    })
    expect(prompt).toContain('## 流年运势神煞')
    expect(prompt).toContain('大运神煞：天乙贵人')
    expect(prompt).toContain('流年神煞：驿马')
    expect(prompt).not.toContain('## 大运十年流年总览')
  })

  it('should include analysis instructions', () => {
    const prompt = generatePrompt(result, input, 'comprehensive')
    expect(prompt).toContain('日主旺衰')
    expect(prompt).toContain('事业')
  })

  it('should generate different prompts for different templates', () => {
    const comprehensive = generatePrompt(result, input, 'comprehensive')
    const career = generatePrompt(result, input, 'career')
    const brief = generatePrompt(result, input, 'brief')

    expect(career).toContain('事业')
    expect(career).toContain('财运')
    expect(brief).toContain('简洁')
    expect(comprehensive).not.toEqual(career)
  })

  it('should include shensha if present', () => {
    const prompt = generatePrompt(result, input)
    if (result.shensha?.nian?.length || result.shensha?.yue?.length) {
      expect(prompt).toContain('神煞')
    }
  })

  it('should include lunar date in prompt', () => {
    const prompt = generatePrompt(result, input)
    if (result.lunarDate) {
      expect(prompt).toContain('农历')
      expect(prompt).toContain(result.lunarDate.fullString)
    }
  })

  it('should include lunar date for lunar input', () => {
    const lunarInput: BaziInput = {
      year: 1990, month: 5, day: 15, hour: 3, gender: 0, calendar: 1,
    }
    const lunarResult = calculateBazi(lunarInput)
    const prompt = generatePrompt(lunarResult, lunarInput)
    expect(prompt).toContain('阴历')
    expect(prompt).toContain('农历')
    expect(lunarResult.lunarDate).not.toBeNull()
    expect(prompt).toContain(lunarResult.lunarDate!.fullString)
  })
})

describe('getTemplateList', () => {
  it('should return 6 templates', () => {
    const list = getTemplateList()
    expect(list.length).toBe(6)
  })

  it('should have key and label for each template', () => {
    const list = getTemplateList()
    for (const item of list) {
      expect(item.key).toBeTruthy()
      expect(item.label).toBeTruthy()
    }
  })
})
