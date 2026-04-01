#!/usr/bin/env python3
"""Generate a 1-page executive briefing PDF for the TLD Risk Checker."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import ParagraphStyle

W, H = letter  # 612 x 792
MARGIN = 0.55 * inch
COL_GAP = 0.3 * inch
USABLE_W = W - 2 * MARGIN
COL_W = (USABLE_W - COL_GAP) / 2

# Colours
NAVY = HexColor('#04101f')
DARK_CARD = HexColor('#0a1e38')
ACCENT_BLUE = HexColor('#0a84ff')
ACCENT_GREEN = HexColor('#32d74b')
ACCENT_AMBER = HexColor('#ff9f0a')
ACCENT_RED = HexColor('#ff453a')
LIGHT_TEXT = HexColor('#d8eeff')
MUTED = HexColor('#7ab8e0')
WHITE = HexColor('#ffffff')
DIVIDER = HexColor('#0e2a4a')
SECTION_BG = HexColor('#071830')

# Styles
FONT = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'

def draw_rounded_rect(c, x, y, w, h, r=6, fill_color=SECTION_BG, border_color=DIVIDER):
    """Draw a rounded rectangle."""
    c.setFillColor(fill_color)
    c.setStrokeColor(border_color)
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, r, fill=1, stroke=1)

def draw_accent_bar(c, x, y, w, color=ACCENT_BLUE):
    """Draw a thin accent bar at the top of a card."""
    c.setFillColor(color)
    c.setStrokeColor(color)
    c.roundRect(x, y - 2, w, 2.5, 1, fill=1, stroke=0)

def draw_section_title(c, x, y, title, color=ACCENT_BLUE):
    """Draw a section title with accent dot."""
    c.setFillColor(color)
    c.circle(x + 3, y + 3.5, 3, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 9)
    c.drawString(x + 12, y, title)
    return y

def draw_body_text(c, x, y, text, max_w, font_size=6.5, leading=9, color=LIGHT_TEXT):
    """Draw wrapped body text using a Paragraph in a Frame."""
    style = ParagraphStyle(
        'body',
        fontName=FONT,
        fontSize=font_size,
        leading=leading,
        textColor=color,
    )
    p = Paragraph(text, style)
    pw, ph = p.wrap(max_w, 500)
    p.drawOn(c, x, y - ph)
    return y - ph

def draw_bullet(c, x, y, text, max_w, font_size=6.5, leading=8.5, color=LIGHT_TEXT, bullet_color=MUTED):
    """Draw a bullet point with wrapped text."""
    c.setFillColor(bullet_color)
    c.circle(x + 2, y + 2, 1.5, fill=1, stroke=0)
    style = ParagraphStyle(
        'bullet',
        fontName=FONT,
        fontSize=font_size,
        leading=leading,
        textColor=color,
    )
    p = Paragraph(text, style)
    pw, ph = p.wrap(max_w - 12, 500)
    p.drawOn(c, x + 10, y - ph + 4)
    return y - ph

def generate():
    c = canvas.Canvas('TLD-Risk-Checker-Briefing.pdf', pagesize=letter)
    c.setTitle('TLD Risk Checker — Technical Briefing')
    c.setAuthor('TLD Risk Checker')

    # === BACKGROUND ===
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # === HEADER BAR ===
    header_y = H - 42
    c.setFillColor(DARK_CARD)
    c.rect(0, header_y, W, 42, fill=1, stroke=0)
    c.setFillColor(ACCENT_BLUE)
    c.rect(0, header_y, W, 2, fill=1, stroke=0)

    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 14)
    c.drawString(MARGIN, header_y + 14, 'TLD RISK CHECKER')
    c.setFillColor(MUTED)
    c.setFont(FONT, 8)
    c.drawString(MARGIN, header_y + 4, 'Technical Architecture Briefing')
    c.setFont(FONT, 7)
    c.drawRightString(W - MARGIN, header_y + 16, 'ICANN 2026 New gTLD Round')
    c.drawRightString(W - MARGIN, header_y + 5, 'Confidential')

    # === CONTENT AREA — two columns ===
    left_x = MARGIN
    right_x = MARGIN + COL_W + COL_GAP
    start_y = header_y - 14

    # =====================================================================
    # LEFT COLUMN
    # =====================================================================
    y = start_y

    # --- SECTION 1: How the Engine Works ---
    card_h = 192
    card_y = y - card_h
    draw_rounded_rect(c, left_x, card_y, COL_W, card_h)
    draw_accent_bar(c, left_x, y, COL_W, ACCENT_BLUE)

    y -= 14
    draw_section_title(c, left_x + 8, y, 'HOW THE ENGINE WORKS')

    y -= 14
    body = (
        'The risk engine runs <b>entirely client-side</b> in the browser. When a user enters up to 5 candidate '
        'TLD strings, the engine runs <b>11 independent check modules</b> against each string simultaneously:'
    )
    y = draw_body_text(c, left_x + 8, y, body, COL_W - 16)

    y -= 6
    checks = [
        ('<b>Reserved/Blocked</b> — IANA root zone, ICANN reservations, format rules',),
        ('<b>IGO/INGO Protected</b> — hard blocker: WHO, NATO, IMF, etc.',),
        ('<b>String Similarity</b> — NIST Levenshtein algorithm (same as ICANN uses)',),
        ('<b>Geographic Names</b> — 8,500+ country name variants in all languages',),
        ('<b>DNS Collision</b> — NCAP Study Two data + indefinitely deferred strings',),
        ('<b>Trademark &amp; Rights</b> — global brands, LRO history from 2012 round',),
        ('<b>Objection Risk</b> — GAC, LPI, Community, LRO assessed separately',),
        ('<b>Regulated Sectors</b> — ICANN highly-regulated TLD list',),
        ('<b>IDN/Script</b> — mixed-script detection, Punycode, variant labels',),
        ('<b>String Contention</b> — 2012 applicant counts, prices, incumbents',),
        ('<b>Application Readiness</b> — CPE risk, GAC precedent, requirements',),
    ]
    for item in checks:
        y = draw_bullet(c, left_x + 10, y, item[0], COL_W - 22, font_size=5.8, leading=7.5)
        y -= 1

    y -= 4
    scoring = (
        'Each module produces a <b>CategoryResult</b> with a 0-100 score, risk level (HIGH/MEDIUM/LOW/CLEAR), '
        'and individual flags. Two independent scores are derived: <font color="#0a84ff"><b>Application Risk</b></font> '
        '(worst-case category + 3pts per additional fired category) and '
        '<font color="#ff9f0a"><b>Competitive Demand</b></font> (contention score alone).'
    )
    y = draw_body_text(c, left_x + 8, y, scoring, COL_W - 16, font_size=6, leading=8)

    # --- SECTION 2: How the Engine Feeds the AI ---
    y -= 14
    card_h = 158
    card_y = y - card_h
    draw_rounded_rect(c, left_x, card_y, COL_W, card_h)
    draw_accent_bar(c, left_x, y, COL_W, ACCENT_GREEN)

    y -= 14
    draw_section_title(c, left_x + 8, y, 'HOW THE ENGINE FEEDS THE AI', ACCENT_GREEN)

    y -= 14
    feed_intro = (
        'The engine output is transformed into a structured prompt via <b>buildPrompt()</b>. '
        'The AI receives a complete data package — not raw flags, but a curated brief:'
    )
    y = draw_body_text(c, left_x + 8, y, feed_intro, COL_W - 16)

    y -= 6
    feed_items = [
        '<b>Scores &amp; levels</b> — Application Risk and Competitive Demand, with numeric scores and levels',
        '<b>Locked verdict</b> — computed deterministically by computeVerdict(); AI must use it exactly as given',
        '<b>Material flags only</b> — only HIGH and MEDIUM flags are sent; LOW/CLEAR are suppressed to reduce noise',
        '<b>Semantic context</b> — classifyString() assigns one of 12 semantic classes (tech_generic, financial_generic, etc.) with buyer profile and regulatory notes',
        '<b>Price comparables</b> — getComparables() selects the 5 most relevant price records from an 80+ record database, scored by semantic match, string length affinity, and mechanism type',
        '<b>Similar TLDs</b> — top visual/phonetic matches with similarity percentages',
        '<b>Alignment directive</b> — explicit instructions tying competitive landscape tone to the engine\'s demand level',
    ]
    for item in feed_items:
        y = draw_bullet(c, left_x + 10, y, item, COL_W - 22, font_size=5.8, leading=7.2)
        y -= 1

    # --- SECTION 3: Auction Reserve Calculation ---
    y -= 14
    card_h = 130
    card_y = y - card_h
    draw_rounded_rect(c, left_x, card_y, COL_W, card_h)
    draw_accent_bar(c, left_x, y, COL_W, ACCENT_AMBER)

    y -= 14
    draw_section_title(c, left_x + 8, y, 'HOW THE AUCTION RESERVE IS CALCULATED', ACCENT_AMBER)

    y -= 14
    auction_text = (
        'Auction reserve estimates combine engine data with AI calibration:'
    )
    y = draw_body_text(c, left_x + 8, y, auction_text, COL_W - 16)
    y -= 5

    auction_steps = [
        '<b>Semantic classification</b> — the string is classified into one of 12 categories (e.g. tech_generic, financial_generic, dictionary_word_premium)',
        '<b>Comparable selection</b> — getComparables() scores all 80+ price records by: exact semantic class match (+100), sibling class match (+25-60), 2026 outlook era bonus (+30), known price (+20), auction mechanism (+15), string length affinity (+20 for matching 3-char), and applicant count',
        '<b>Top 5 anchors</b> — the highest-scoring records are injected into the AI prompt as calibration data, tagged [2012 actual] or [2026 est.]',
        '<b>AI synthesis</b> — Claude uses these anchors plus market knowledge to produce a range estimate (e.g. "$10M-$15M") in the COMPETITIVE STATS section',
        '<b>Engine fallback</b> — contention check flags also carry stat chips with budget estimates derived directly from 2012 prices (50%-100% of historical price)',
    ]
    for item in auction_steps:
        y = draw_bullet(c, left_x + 10, y, item, COL_W - 22, font_size=5.8, leading=7.2)
        y -= 1

    # =====================================================================
    # RIGHT COLUMN
    # =====================================================================
    y = start_y

    # --- SECTION 4: How the AI Has Been Prompted ---
    card_h = 246
    card_y = y - card_h
    draw_rounded_rect(c, right_x, card_y, COL_W, card_h)
    draw_accent_bar(c, right_x, y, COL_W, ACCENT_RED)

    y -= 14
    draw_section_title(c, right_x + 8, y, 'HOW THE AI HAS BEEN PROMPTED', ACCENT_RED)

    y -= 14
    ai_intro = (
        'The AI operates under a detailed <b>system prompt</b> defining persona, communication style, '
        'and strict output format. Key design principles:'
    )
    y = draw_body_text(c, right_x + 8, y, ai_intro, COL_W - 16)

    y -= 6
    # Persona
    c.setFillColor(MUTED)
    c.setFont(FONT_BOLD, 6.5)
    c.drawString(right_x + 10, y, 'PERSONA')
    y -= 10
    persona = (
        'A 25-year ICANN veteran who personally applied in the 2012 round, served as an expert evaluator, '
        'and advised through Initial Evaluation, Extended Evaluation, and IRP proceedings. Addresses the user '
        'directly as a trusted strategic advisor — not a risk auditor.'
    )
    y = draw_body_text(c, right_x + 10, y, persona, COL_W - 22, font_size=6, leading=8)

    y -= 8
    c.setFillColor(MUTED)
    c.setFont(FONT_BOLD, 6.5)
    c.drawString(right_x + 10, y, 'LOCKED VERDICT')
    y -= 10
    verdict_text = (
        'The verdict is <b>never chosen by the AI</b>. It is computed deterministically by computeVerdict() from engine scores '
        'and injected as a <b>REQUIRED VERDICT</b> directive. The AI must use the exact verdict string. '
        'Four possible verdicts: <font color="#32d74b">STRONG APPLY</font>, '
        '<font color="#0a84ff">APPLY WITH STRATEGY</font>, '
        '<font color="#ff9f0a">HIGH RISK - PROCEED WITH CAUTION</font>, '
        '<font color="#ff453a">DO NOT APPLY</font>.'
    )
    y = draw_body_text(c, right_x + 10, y, verdict_text, COL_W - 22, font_size=6, leading=8)

    y -= 8
    c.setFillColor(MUTED)
    c.setFont(FONT_BOLD, 6.5)
    c.drawString(right_x + 10, y, 'STRUCTURED OUTPUT')
    y -= 10
    output_text = (
        'Claude returns exactly <b>4 sections</b>: (1) RECOMMENDATION — verdict + 5-7 sentences covering opportunity, risks, '
        'precedent, and tactical advice; (2) COMPETITIVE LANDSCAPE — applicant estimates, auction budget, positioning; '
        '(3) COMPETITIVE STATS — 3 structured lines parsed into UI stat chips; '
        '(4) OBJECTION SIGNALS — GAC, LPI, Community, LRO each assessed with severity.'
    )
    y = draw_body_text(c, right_x + 10, y, output_text, COL_W - 22, font_size=6, leading=8)

    y -= 8
    c.setFillColor(MUTED)
    c.setFont(FONT_BOLD, 6.5)
    c.drawString(right_x + 10, y, 'GUARDRAILS')
    y -= 10
    guardrails = (
        'Competitive landscape tone is <b>aligned to the engine\'s demand level</b> via explicit directives. '
        'The AI cannot contradict engine scores. Citations (AGB sections, 2012 precedents) are required inline '
        'only where they add weight. The model is Claude Sonnet 4.6 with a 1,300 token cap.'
    )
    y = draw_body_text(c, right_x + 10, y, guardrails, COL_W - 22, font_size=6, leading=8)

    # --- SECTION 5: Architecture Diagram ---
    y -= 14
    card_h = 238
    card_y = y - card_h
    draw_rounded_rect(c, right_x, card_y, COL_W, card_h)
    draw_accent_bar(c, right_x, y, COL_W, ACCENT_BLUE)

    y -= 14
    draw_section_title(c, right_x + 8, y, 'SITE ARCHITECTURE')

    # Draw the architecture diagram
    y -= 18
    cx = right_x + COL_W / 2  # center x
    box_w = 130
    box_h = 22
    small_box_h = 18

    def draw_arch_box(x, y, w, h, label, sublabel=None, color=ACCENT_BLUE):
        draw_rounded_rect(c, x - w/2, y - h/2, w, h, r=4, fill_color=DARK_CARD, border_color=color)
        c.setFillColor(WHITE)
        c.setFont(FONT_BOLD, 7)
        c.drawCentredString(x, y + (3 if sublabel else -2), label)
        if sublabel:
            c.setFillColor(MUTED)
            c.setFont(FONT, 5.5)
            c.drawCentredString(x, y - 5, sublabel)

    def draw_arrow(x1, y1, x2, y2, color=DIVIDER):
        c.setStrokeColor(color)
        c.setLineWidth(1)
        c.line(x1, y1, x2, y2)
        # arrowhead
        import math
        angle = math.atan2(y2 - y1, x2 - x1)
        arrow_len = 5
        c.line(x2, y2, x2 - arrow_len * math.cos(angle - 0.4), y2 - arrow_len * math.sin(angle - 0.4))
        c.line(x2, y2, x2 - arrow_len * math.cos(angle + 0.4), y2 - arrow_len * math.sin(angle + 0.4))

    def draw_label_on_arrow(x, y, label, color=MUTED):
        c.setFillColor(color)
        c.setFont(FONT, 5)
        c.drawCentredString(x, y, label)

    # Row 1: User Input
    r1_y = y
    draw_arch_box(cx, r1_y, box_w, box_h, 'USER INPUT', 'Up to 5 TLD strings', ACCENT_GREEN)

    # Arrow down
    draw_arrow(cx, r1_y - box_h/2, cx, r1_y - box_h/2 - 16, MUTED)
    draw_label_on_arrow(cx + 30, r1_y - box_h/2 - 8, 'normalise + validate')

    # Row 2: Risk Engine
    r2_y = r1_y - box_h - 28
    engine_w = 190
    engine_h = 58
    draw_rounded_rect(c, cx - engine_w/2, r2_y - engine_h/2, engine_w, engine_h, r=4, fill_color=DARK_CARD, border_color=ACCENT_BLUE)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 7.5)
    c.drawCentredString(cx, r2_y + 18, 'RISK ENGINE')
    c.setFillColor(MUTED)
    c.setFont(FONT, 5)
    c.drawCentredString(cx, r2_y + 8, '11 check modules (client-side)')

    # Mini boxes inside engine
    mini_w = 56
    mini_h = 14
    mini_y = r2_y - 8
    col1_x = cx - 62
    col2_x = cx
    col3_x = cx + 62
    mini_items = [
        (col1_x, 'Reserved / IGO'),
        (col2_x, 'Similarity / Geo'),
        (col3_x, 'Trademark / Obj'),
    ]
    for mx, mlabel in mini_items:
        c.setFillColor(SECTION_BG)
        c.setStrokeColor(DIVIDER)
        c.roundRect(mx - mini_w/2, mini_y - mini_h/2, mini_w, mini_h, 3, fill=1, stroke=1)
        c.setFillColor(LIGHT_TEXT)
        c.setFont(FONT, 5)
        c.drawCentredString(mx, mini_y - 2, mlabel)

    # Two arrows from engine — left to scores, right to AI
    r3_y = r2_y - engine_h/2 - 28

    # Left output: Scores
    left_out_x = cx - 55
    draw_arrow(left_out_x, r2_y - engine_h/2, left_out_x, r3_y + box_h/2, MUTED)
    draw_label_on_arrow(left_out_x - 22, r2_y - engine_h/2 - 10, 'scores + flags')
    draw_arch_box(left_out_x, r3_y, 95, box_h, 'DUAL SCORES', 'App Risk + Demand', ACCENT_AMBER)

    # Right output: AI Prompt Builder
    right_out_x = cx + 55
    draw_arrow(right_out_x, r2_y - engine_h/2, right_out_x, r3_y + box_h/2, MUTED)
    draw_label_on_arrow(right_out_x + 25, r2_y - engine_h/2 - 10, 'buildPrompt()')
    draw_arch_box(right_out_x, r3_y, 95, box_h, 'AI PROMPT', 'Context + Comparables', ACCENT_GREEN)

    # Arrow from AI Prompt to Claude API
    r4_y = r3_y - box_h - 24
    draw_arrow(right_out_x, r3_y - box_h/2, right_out_x, r4_y + box_h/2, MUTED)
    draw_label_on_arrow(right_out_x + 22, r3_y - box_h/2 - 10, 'streaming API')
    draw_arch_box(right_out_x, r4_y, 95, box_h, 'CLAUDE SONNET', 'Locked verdict + 4 sections', ACCENT_RED)

    # Arrow from Claude back to center for final render
    # Arrow from scores and AI converge to report
    r5_y = r4_y - box_h - 24
    draw_arrow(left_out_x, r3_y - box_h/2, cx, r5_y + box_h/2, MUTED)
    draw_arrow(right_out_x, r4_y - box_h/2, cx, r5_y + box_h/2, MUTED)
    draw_arch_box(cx, r5_y, box_w + 20, box_h, 'INTERACTIVE REPORT', 'Scores + AI Analysis + Expandable Flags', ACCENT_BLUE)

    # === FOOTER ===
    c.setFillColor(DIVIDER)
    c.rect(0, 18, W, 0.5, fill=1, stroke=0)
    c.setFillColor(MUTED)
    c.setFont(FONT, 5.5)
    c.drawString(MARGIN, 8, 'TLD RISK CHECKER  |  Confidential  |  For internal use only  |  Not legal advice')
    c.drawRightString(W - MARGIN, 8, 'Vite + React + TypeScript + Tailwind CSS  |  No backend  |  Client-side only')

    c.save()
    print('Generated: TLD-Risk-Checker-Briefing.pdf')

if __name__ == '__main__':
    generate()
