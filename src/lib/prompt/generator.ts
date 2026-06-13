import type { BaziResult, BaziInput, PromptContext } from '../bazi/types'
import { getNaYin } from '../bazi/calculator'

const HOUR_LABELS = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const MONTH_CN = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']

export type PromptTemplate = 'comprehensive' | 'career' | 'relationship' | 'health' | 'yearly' | 'brief'

const TEMPLATE_INSTRUCTIONS: Record<PromptTemplate, string> = {
  comprehensive: `请从以下维度进行综合分析：
1. 日主旺衰与格局判断
2. 性格特质分析
3. 事业与财运
4. 婚恋与感情
5. 健康提示
6. 当前大运与流年吉凶
7. 未来3-5年运势趋势与具体建议

请尽量结合传统命理理论进行专业、详细的分析，并给出实用建议。`,

  career: `请聚焦事业与财运方面进行深入分析：
1. 命局中财星与官杀的配置
2. 适合的行业方向（结合喜用神五行）
3. 事业发展的高峰期与低谷期
4. 偏财运与正财运的特点
5. 合作/独立创业的适合度
6. 当前大运对事业的影响及建议`,

  relationship: `请聚焦婚恋与人际关系进行深入分析：
1. 命局中的婚恋宫位与星曜
2. 配偶特征与缘分时间
3. 感情中的优势与需注意的问题
4. 桃花运的时间节点
5. 婚姻稳定性分析
6. 当前大运对感情的影响及建议`,

  health: `请聚焦健康养生进行分析：
1. 命局五行偏枯对应的身体弱点
2. 需要注意的器官与疾病倾向
3. 适合的养生方向（饮食/运动/作息）
4. 健康风险较高的大运/流年时段
5. 日常保健建议`,

  yearly: `请聚焦当前流年运势进行详细分析：
1. 今年流年干支与命局的作用关系
2. 事业/财运/感情/健康各维度的流年表现
3. 每季度的运势起伏
4. 需要特别注意的月份
5. 趋吉避凶的具体建议`,

  brief: `请用简洁的语言概括分析：
1. 格局与日主强弱（一句话）
2. 核心性格（三个关键词）
3. 事业方向建议
4. 当前运势一句话总结
5. 最重要的一条建议`,
}

function buildBaseInfo(input: BaziInput, result: BaziResult): string {
  const genderStr = input.gender === 0 ? '男' : '女'
  const calendarStr = input.calendar === 0 ? '阳历' : '阴历'
  const hourLabel = HOUR_LABELS[input.hour] || ''
  const p = result.pillars
  const lunarLine = result.lunarDate
    ? `- 农历：${result.lunarDate.fullString}`
    : ''

  return `你是一位精通子平八字理论的命理分析师，拥有深厚的五行生克制化、十神配置、格局用神知识和丰富的实践经验。请根据以下八字命盘进行专业分析。

## 基本信息
- 性别：${genderStr}
- 出生：${input.year}年${input.month}月${input.day}日 ${hourLabel}时（${calendarStr}）
${lunarLine}
${input.name ? `- 备注：${input.name}` : ''}

## 四柱排盘
| | 年柱 | 月柱 | 日柱 | 时柱 |
|---|---|---|---|---|
| 天干 | ${p.year.gan} | ${p.month.gan} | ${p.day.gan}（日主） | ${p.time.gan} |
| 地支 | ${p.year.zhi} | ${p.month.zhi} | ${p.day.zhi} | ${p.time.zhi} |
| 藏干 | ${p.year.hideGan} | ${p.month.hideGan} | ${p.day.hideGan} | ${p.time.hideGan} |
| 十神(干) | ${p.year.shiShenGan} | ${p.month.shiShenGan} | — | ${p.time.shiShenGan} |
| 十神(支) | ${p.year.shiShenZhi} | ${p.month.shiShenZhi} | ${p.day.shiShenZhi} | ${p.time.shiShenZhi} |
| 纳音 | ${p.year.naYin} | ${p.month.naYin} | ${p.day.naYin} | ${p.time.naYin} |
| 地势 | ${p.year.diShi} | ${p.month.diShi} | ${p.day.diShi} | ${p.time.diShi} |
| 旬空 | ${p.year.xunKong} | ${p.month.xunKong} | ${p.day.xunKong} | ${p.time.xunKong} |`
}

function buildDayMaster(result: BaziResult): string {
  const sq = result.yuanHaiZiping.shenQiang
  const sd = result.yuanHaiZiping.shidu

  return `
## 日主信息
- 日主：${result.dayMaster}（${result.dayMasterWuXing}）
- 身强/身弱：${typeof sq === 'object' ? `${sq.judge}（得分${sq.score}/阈值${sq.threshold}）` : sq}
- 寒暖燥湿：${typeof sd === 'object' ? `${sd.judge}（得分${sd.score}）` : sd}

## 五行力量
| 木 | 火 | 土 | 金 | 水 |
|---|---|---|---|---|
| ${result.wuXingPower['木'] || 0} | ${result.wuXingPower['火'] || 0} | ${result.wuXingPower['土'] || 0} | ${result.wuXingPower['金'] || 0} | ${result.wuXingPower['水'] || 0} |`
}

function buildSpecialPillars(result: BaziResult): string {
  return `
## 特殊宫位
- 胎元：${result.taiYuan}（${result.taiYuanNaYin}）
- 胎息：${result.taiXi}（${result.taiXiNaYin}）
- 命宫：${result.mingGong}（${result.mingGongNaYin}）
- 身宫：${result.shenGong}（${result.shenGongNaYin}）`
}

function buildFortuneStartInfo(result: BaziResult): string {
  const y = result.yunInfo
  if (!y.startSolar) return ''
  const direction = y.forward ? '顺排' : '逆排'
  return `
## 起运信息
- 排盘方式：${direction}
- 起运年龄：${y.startYear}岁${y.startMonth ? ` ${y.startMonth}个月` : ''}${y.startDay ? ` ${y.startDay}天` : ''}
- 起运时间：${y.startSolar}`
}

function buildDaYun(result: BaziResult): string {
  if (!result.dayunArr || result.dayunArr.length === 0) return ''
  let s = '\n## 大运\n| 大运 | 纳音 | 天干十神 | 地支十神 | 起始年 | 年限 |\n|---|---|---|---|---|---|\n'
  for (const dy of result.dayunArr.slice(0, 9)) {
    s += `| ${dy.ganZhi} | ${getNaYin(dy.ganZhi)} | ${dy.ganshen} | ${dy.zhishen} | ${dy.startYear} | ${dy.startYear}-${dy.startYear + 9} |\n`
  }
  return s
}

function buildCurrentFortune(result: BaziResult, ctx?: PromptContext): string {
  const dy = ctx?.selectedDaYun
    ? { ganZhi: Array.isArray(ctx.selectedDaYun.ganZhi) ? ctx.selectedDaYun.ganZhi.join('') : ctx.selectedDaYun.ganZhi, startYear: ctx.selectedDaYun.startYear, endYear: ctx.selectedDaYun.startYear + 9 }
    : result.currentYun?.daYun
      ? { ganZhi: Array.isArray(result.currentYun.daYun.ganZhi) ? result.currentYun.daYun.ganZhi.join('') : result.currentYun.daYun.ganZhi, startYear: result.currentYun.daYun.startYear, endYear: result.currentYun.daYun.endYear }
      : null

  if (!dy) return ''

  let s = `\n## 当前运势\n- 当前大运：${dy.ganZhi}（${getNaYin(dy.ganZhi)}，${dy.startYear}-${dy.endYear}年）\n`

  const ln = ctx?.selectedLiuNian || (result.currentYun?.liuNian ? { year: result.currentYun.liuNian.year, ganZhi: Array.isArray(result.currentYun.liuNian.ganZhi) ? result.currentYun.liuNian.ganZhi.join('') : result.currentYun.liuNian.ganZhi, ganshen: '', zhishen: '' } : null)
  if (ln) {
    const lnGZ = Array.isArray(ln.ganZhi) ? ln.ganZhi.join('') : ln.ganZhi
    s += `- 当前流年：${lnGZ}（${getNaYin(lnGZ)}，${ln.year}年）\n`
  }

  return s
}

function buildFullDaYunLiuNian(ctx?: PromptContext): string {
  if (ctx?.allLiuNianData && ctx.allLiuNianData.length > 0) {
    let s = '\n## 大运十年流年总览\n'
    s += '| 流年 | 干支 | 纳音 | 天干十神(生克) | 地支十神 | 大运神煞 | 流年神煞 |\n'
    s += '|---|---|---|---|---|---|---|\n'

    for (const ln of ctx.allLiuNianData) {
      const isSelected = ctx.selectedLiuNian && ln.year === ctx.selectedLiuNian.year
      const marker = isSelected ? ' ★' : ''
      const dySS = ln.daYunShensha.length > 0 ? ln.daYunShensha.join('、') : '—'
      const lnSS = ln.liuNianShensha.length > 0 ? ln.liuNianShensha.join('、') : '—'
      s += `| ${ln.year}年${marker} | ${ln.ganZhi} | ${getNaYin(ln.ganZhi)} | ${ln.ganshen} | ${ln.zhishen} | ${dySS} | ${lnSS} |\n`
    }

    if (ctx.selectedLiuNian) {
      const sel = ctx.allLiuNianData.find(l => l.year === ctx.selectedLiuNian!.year)
      if (sel) {
        s += `\n**★ 重点关注年份**：${sel.year}年 ${sel.ganZhi}（${getNaYin(sel.ganZhi)}），`
        s += `天干${sel.ganshen}（流年天干与日主的生克关系），`
        s += `地支${sel.zhishen}（流年地支与日主的生克关系）`
        if (sel.liuNianShensha.length > 0) {
          s += `，流年神煞：${sel.liuNianShensha.join('、')}`
        }
        s += '\n'
      }
    }

    return s
  }

  // Fallback: just liunian shensha
  if (!ctx?.liunianShensha) return ''
  const lines: string[] = []
  if (ctx.liunianShensha.daYun?.length) lines.push(`大运神煞：${ctx.liunianShensha.daYun.join('、')}`)
  if (ctx.liunianShensha.liuNian?.length) lines.push(`流年神煞：${ctx.liunianShensha.liuNian.join('、')}`)
  if (lines.length === 0) return ''
  return `\n## 流年运势神煞\n${lines.join('\n')}`
}

function buildLiuYue(ctx?: PromptContext): string {
  if (!ctx?.liuYueArr || ctx.liuYueArr.length === 0) return ''

  let s = '\n## 流月详情（12月）\n'
  s += '| 月份 | 干支 | 纳音 | 十神(生克) | 神煞 |\n'
  s += '|---|---|---|---|---|\n'

  for (const my of ctx.liuYueArr) {
    const isSelected = ctx.selectedLiuYueMonth === my.month
    const marker = isSelected ? ' ★' : ''
    const shenshaStr = my.liuYueShensha.length > 0 ? my.liuYueShensha.join('、') : '—'
    s += `| ${MONTH_CN[my.month]}${marker} | ${my.ganZhi} | ${getNaYin(my.ganZhi)} | ${my.shiShen} | ${shenshaStr} |\n`
  }

  if (ctx.selectedLiuYueMonth && ctx.liuYueArr[ctx.selectedLiuYueMonth - 1]) {
    const sel = ctx.liuYueArr[ctx.selectedLiuYueMonth - 1]
    s += `\n**★ 重点月份详解**：${sel.ganZhi}（${getNaYin(sel.ganZhi)}，${MONTH_CN[sel.month]}）\n`
    s += `- 十神关系：${sel.shiShen}（流月天干与日主的生克关系）\n`
    if (sel.liuYueShensha.length > 0) {
      s += `- 神煞：${sel.liuYueShensha.join('、')}\n`
    }
  }

  return s
}

function buildShensha(result: BaziResult, ctx?: PromptContext): string {
  if (!result.shensha) return ''

  const lines: string[] = []
  if (result.shensha.nian?.length) lines.push(`年柱：${result.shensha.nian.join('、')}`)
  if (result.shensha.yue?.length) lines.push(`月柱：${result.shensha.yue.join('、')}`)
  if (result.shensha.ri?.length) lines.push(`日柱：${result.shensha.ri.join('、')}`)
  if (result.shensha.shi?.length) lines.push(`时柱：${result.shensha.shi.join('、')}`)

  if (ctx?.liunianShensha) {
    if (ctx.liunianShensha.daYun?.length) lines.push(`大运：${ctx.liunianShensha.daYun.join('、')}`)
    if (ctx.liunianShensha.liuNian?.length) lines.push(`流年：${ctx.liunianShensha.liuNian.join('、')}`)
  } else if (result.shensha.current) {
    if (result.shensha.current.daYun?.length) lines.push(`大运：${result.shensha.current.daYun.join('、')}`)
    if (result.shensha.current.liuNian?.length) lines.push(`流年：${result.shensha.current.liuNian.join('、')}`)
    if (result.shensha.current.liuYue?.length) lines.push(`流月：${result.shensha.current.liuYue.join('、')}`)
    if (result.shensha.current.liuRi?.length) lines.push(`流日：${result.shensha.current.liuRi.join('、')}`)
  }

  if (lines.length === 0) return ''
  return `\n## 神煞\n${lines.join('\n')}`
}

function buildRelations(result: BaziResult): string {
  let s = ''
  if (result.ganRelations && result.ganRelations.length > 0) {
    s += `\n## 天干关系（生克制化）\n${result.ganRelations.map((r: any) => typeof r === 'string' ? r : (r.desc || JSON.stringify(r))).join('、')}\n`
  }
  if (result.zhiRelations && result.zhiRelations.length > 0) {
    s += `\n## 地支关系（刑冲合害）\n${result.zhiRelations.map((r: any) => typeof r === 'string' ? r : (r.desc || JSON.stringify(r))).join('、')}\n`
  }
  return s
}

function buildAnalysis(result: BaziResult): string {
  const parts: string[] = []

  if (result.analysis.XiYongShen?.length) {
    const xiyong = result.analysis.XiYongShen.map((s: any) =>
      typeof s === 'string' ? s : (s?.judge || JSON.stringify(s))
    )
    parts.push(`## 喜用神参考\n${xiyong.join('\n')}`)
  }

  if (result.analysis.SanMingTongHui?.length) {
    const smth = result.analysis.SanMingTongHui.filter((s: string) => s && s.trim())
    if (smth.length > 0) {
      parts.push(`## 三命通会\n${smth.join('\n\n')}`)
    }
  }

  if (result.analysis.rishi?.length) {
    const rs = result.analysis.rishi.filter((s: string) => s && s.trim())
    if (rs.length > 0) {
      parts.push(`## 日时断语\n${rs.join('\n\n')}`)
    }
  }

  return parts.length > 0 ? '\n' + parts.join('\n\n') : ''
}

function buildExtendedAnalysis(result: BaziResult): string {
  const parts: string[] = []

  const sp = result.spouseAppearance
  if (sp) {
    let spStr = `## 配偶信息\n- 配偶外貌评分：${sp.score || '—'}分`
    if (sp.description) spStr += `\n- 总评：${sp.description}`
    if (sp.details?.length) spStr += `\n${sp.details.map((d: string) => '- ' + d).join('\n')}`
    parts.push(spStr)
  }

  const fb = result.familyBackground
  if (fb) {
    let fbStr = `## 家庭背景\n- 家庭评分：${fb.score || '—'}分`
    if (fb.description) fbStr += `\n- 总评：${fb.description}`
    if (fb.details?.length) fbStr += `\n${fb.details.map((d: string) => '- ' + d).join('\n')}`
    parts.push(fbStr)
  }

  const sa = result.selfAppearance
  if (sa) {
    let saStr = `## 个人特质\n- 外貌评分：${sa.appearanceScore || '—'}分`
    if (sa.characteristics?.length) saStr += `\n${sa.characteristics.map((c: string) => '- ' + c).join('\n')}`
    if (sa.description) saStr += `\n- ${sa.description}`
    parts.push(saStr)
  }

  const et = result.educationAndTalent
  if (et) {
    let etStr = `## 学历与天赋\n- 学历评分：${et.educationScore || '—'}分（${et.educationLevel || '—'}）\n- 天赋评分：${et.talentScore || '—'}分（${et.talentLevel || '—'}）`
    if (et.description) etStr += `\n- ${et.description}`
    if (et.details?.length) etStr += `\n${et.details.map((d: string) => '- ' + d).join('\n')}`
    parts.push(etStr)
  }

  return parts.length > 0 ? '\n' + parts.join('\n\n') : ''
}

export function generatePrompt(
  result: BaziResult,
  input: BaziInput,
  template: PromptTemplate = 'comprehensive',
  context?: PromptContext,
): string {
  const sections: string[] = [
    buildBaseInfo(input, result),
    buildDayMaster(result),
    buildSpecialPillars(result),
    buildFortuneStartInfo(result),
    buildDaYun(result),
    buildCurrentFortune(result, context),
    buildFullDaYunLiuNian(context),
    buildLiuYue(context),
    buildAnalysis(result),
    buildRelations(result),
    buildShensha(result, context),
    buildExtendedAnalysis(result),
  ]

  const body = sections.filter(s => s.trim() !== '').join('\n')

  return `${body}

---
## 分析要求
${TEMPLATE_INSTRUCTIONS[template]}
`
}

export function getTemplateList(): { key: PromptTemplate; label: string }[] {
  return [
    { key: 'comprehensive', label: '综合分析' },
    { key: 'career', label: '事业财运' },
    { key: 'relationship', label: '婚恋感情' },
    { key: 'health', label: '健康养生' },
    { key: 'yearly', label: '流年运势' },
    { key: 'brief', label: '精简概要' },
  ]
}
