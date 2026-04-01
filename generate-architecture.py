#!/usr/bin/env python3
"""Generate a standalone architecture diagram PDF for the TLD Risk Checker."""

import math
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

W, H = letter
MARGIN = 0.5 * inch

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

FONT = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'


def draw_box(c, x, y, w, h, label, sublabel=None, color=ACCENT_BLUE):
    c.setFillColor(DARK_CARD)
    c.setStrokeColor(color)
    c.setLineWidth(1.2)
    c.roundRect(x - w/2, y - h/2, w, h, 6, fill=1, stroke=1)
    c.setFillColor(color)
    c.roundRect(x - w/2 + 1, y + h/2 - 3, w - 2, 3, 1.5, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 10)
    c.drawCentredString(x, y + (4 if sublabel else -3), label)
    if sublabel:
        c.setFillColor(MUTED)
        c.setFont(FONT, 7)
        c.drawCentredString(x, y - 7, sublabel)


def draw_mini_box(c, x, y, w, h, label, sublabel=None):
    c.setFillColor(SECTION_BG)
    c.setStrokeColor(DIVIDER)
    c.setLineWidth(0.6)
    c.roundRect(x - w/2, y - h/2, w, h, 3, fill=1, stroke=1)
    c.setFillColor(LIGHT_TEXT)
    c.setFont(FONT_BOLD, 6.5)
    c.drawCentredString(x, y + (2 if sublabel else -2), label)
    if sublabel:
        c.setFillColor(MUTED)
        c.setFont(FONT, 5.5)
        c.drawCentredString(x, y - 5, sublabel)


def draw_arrow(c, x1, y1, x2, y2, color=MUTED):
    c.setStrokeColor(color)
    c.setLineWidth(1.2)
    c.line(x1, y1, x2, y2)
    angle = math.atan2(y2 - y1, x2 - x1)
    al = 7
    c.line(x2, y2, x2 - al * math.cos(angle - 0.35), y2 - al * math.sin(angle - 0.35))
    c.line(x2, y2, x2 - al * math.cos(angle + 0.35), y2 - al * math.sin(angle + 0.35))


def draw_label(c, x, y, label, color=MUTED):
    c.setFillColor(color)
    c.setFont(FONT, 6.5)
    c.drawCentredString(x, y, label)


def generate():
    c = canvas.Canvas('TLD-Risk-Checker-Architecture.pdf', pagesize=letter)
    c.setTitle('TLD Risk Checker — Architecture Diagram')

    # Background
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Header
    hdr_y = H - 36
    c.setFillColor(DARK_CARD)
    c.rect(0, hdr_y, W, 36, fill=1, stroke=0)
    c.setFillColor(ACCENT_BLUE)
    c.rect(0, hdr_y, W, 2, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 13)
    c.drawString(MARGIN, hdr_y + 12, 'TLD RISK CHECKER')
    c.setFillColor(MUTED)
    c.setFont(FONT, 8)
    c.drawString(MARGIN, hdr_y + 2, 'System Architecture')
    c.setFont(FONT, 7)
    c.drawRightString(W - MARGIN, hdr_y + 13, 'ICANN 2026 New gTLD Round')
    c.drawRightString(W - MARGIN, hdr_y + 3, 'Confidential')

    # ===================================================================
    # Layout constants — everything flows from these Y positions
    # ===================================================================
    cx = W / 2
    bh = 32  # standard box height
    split = 110  # left/right offset from centre
    left_x = cx - split
    right_x = cx + split

    # ROW 1: User Input --------------------------------------------------
    y1 = H - 80
    draw_box(c, cx, y1, 210, bh, 'USER INPUT', 'Up to 5 TLD strings  |  Tag-style input', ACCENT_GREEN)
    draw_arrow(c, cx, y1 - bh/2, cx, y1 - bh/2 - 22, MUTED)
    draw_label(c, cx + 60, y1 - bh/2 - 11, 'normalise + validate')

    # ROW 2: Risk Engine --------------------------------------------------
    eng_top = y1 - bh/2 - 22
    eng_h = 100
    eng_w = 400
    eng_cy = eng_top - eng_h/2

    c.setFillColor(DARK_CARD)
    c.setStrokeColor(ACCENT_BLUE)
    c.setLineWidth(1.2)
    c.roundRect(cx - eng_w/2, eng_cy - eng_h/2, eng_w, eng_h, 8, fill=1, stroke=1)
    c.setFillColor(ACCENT_BLUE)
    c.roundRect(cx - eng_w/2 + 1, eng_cy + eng_h/2 - 3, eng_w - 2, 3, 1.5, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 11)
    c.drawCentredString(cx, eng_cy + eng_h/2 - 16, 'RISK ENGINE')
    c.setFillColor(MUTED)
    c.setFont(FONT, 7)
    c.drawCentredString(cx, eng_cy + eng_h/2 - 26, '11 check modules  |  runs entirely client-side in the browser')

    mw, mh = 84, 20
    mr1 = eng_cy + 4
    mr2 = eng_cy - 22
    for i, (lab, sub) in enumerate([
        ('Reserved / IGO', 'Hard blockers'), ('String Similarity', 'NIST algorithm'),
        ('Geographic', '8,500+ names'), ('DNS Collision', 'NCAP data'),
    ]):
        draw_mini_box(c, cx - 1.5*(mw+8) + i*(mw+8), mr1, mw, mh, lab, sub)
    for i, (lab, sub) in enumerate([
        ('Trademark', 'Brands + LRO'), ('Objection Risk', 'GAC / LPI / LRO'),
        ('Regulated', 'Sector checks'), ('Contention', '2012 data + demand'),
    ]):
        draw_mini_box(c, cx - 1.5*(mw+8) + i*(mw+8), mr2, mw, mh, lab, sub)

    eng_bottom = eng_cy - eng_h/2

    # ROW 3: Dual Scores + Prompt Builder ---------------------------------
    y3 = eng_bottom - 34
    sbw = 175  # sub-box width

    draw_arrow(c, left_x, eng_bottom, left_x, y3 + bh/2, MUTED)
    draw_label(c, left_x - 42, eng_bottom - 12, 'scores + flags')
    draw_box(c, left_x, y3, sbw, bh, 'DUAL SCORES', 'App Risk (0-100)  +  Demand (0-100)', ACCENT_AMBER)

    draw_arrow(c, right_x, eng_bottom, right_x, y3 + bh/2, MUTED)
    draw_label(c, right_x + 42, eng_bottom - 12, 'buildPrompt()')
    draw_box(c, right_x, y3, sbw, bh, 'AI PROMPT BUILDER', 'Context + Comparables + Flags', ACCENT_GREEN)

    # ANNOTATION: Verdict Logic (below Dual Scores) -----------------------
    vl_x = left_x - sbw/2 + 6
    vl_y = y3 - bh/2 - 12
    c.setFillColor(MUTED)
    c.setFont(FONT_BOLD, 6.5)
    c.drawString(vl_x, vl_y, 'VERDICT LOGIC (deterministic):')
    for i, (cond, verdict, col) in enumerate([
        ('Hard blocked', 'DO NOT APPLY', ACCENT_RED),
        ('App risk HIGH', 'HIGH RISK', ACCENT_AMBER),
        ('App risk MED/LOW', 'APPLY WITH STRATEGY', ACCENT_BLUE),
        ('CLEAR + demand', 'APPLY WITH STRATEGY', ACCENT_BLUE),
        ('All CLEAR', 'STRONG APPLY', ACCENT_GREEN),
    ]):
        vy = vl_y - 11 - i * 10
        c.setFillColor(col)
        c.circle(vl_x + 2, vy + 2.5, 2, fill=1, stroke=0)
        c.setFillColor(LIGHT_TEXT)
        c.setFont(FONT, 5.8)
        c.drawString(vl_x + 8, vy, cond)
        c.setFillColor(col)
        c.setFont(FONT_BOLD, 5.8)
        c.drawRightString(vl_x + sbw - 12, vy, verdict)

    # ANNOTATION: Data Injected (below Prompt Builder) --------------------
    di_x = right_x - sbw/2 + 6
    di_y = y3 - bh/2 - 12
    c.setFillColor(MUTED)
    c.setFont(FONT_BOLD, 6.5)
    c.drawString(di_x, di_y, 'DATA INJECTED INTO PROMPT:')
    for i, item in enumerate([
        'Locked verdict (deterministic)',
        'HIGH + MEDIUM flags only',
        '12 semantic classes + buyer profile',
        'Top 5 price comparables (scored)',
        'Similar TLD matches',
        'Demand-level alignment directive',
    ]):
        iy = di_y - 11 - i * 10
        c.setFillColor(ACCENT_GREEN)
        c.circle(di_x + 2, iy + 2.5, 2, fill=1, stroke=0)
        c.setFillColor(LIGHT_TEXT)
        c.setFont(FONT, 5.8)
        c.drawString(di_x + 8, iy, item)

    # ROW 4: Claude API ---------------------------------------------------
    # Position Claude box so it clears the data-injected annotation
    y4 = di_y - 6 * 10 - 30
    draw_arrow(c, right_x, di_y - 6 * 10 - 6, right_x, y4 + bh/2 + 2, MUTED)
    draw_label(c, right_x + 50, di_y - 6 * 10 - 16, 'streaming API call')

    claude_h = bh + 4
    draw_box(c, right_x, y4, sbw, claude_h, 'CLAUDE SONNET 4.6',
             'Locked verdict  |  4 sections  |  1,300 tokens', ACCENT_RED)

    # ANNOTATION: AI Output Sections (below Claude) -----------------------
    ao_x = right_x - sbw/2 + 6
    ao_y = y4 - claude_h/2 - 12
    c.setFillColor(MUTED)
    c.setFont(FONT_BOLD, 6.5)
    c.drawString(ao_x, ao_y, 'AI OUTPUT SECTIONS:')
    for i, (lab, col) in enumerate([
        ('1. RECOMMENDATION', ACCENT_GREEN),
        ('2. COMPETITIVE LANDSCAPE', ACCENT_BLUE),
        ('3. COMPETITIVE STATS', ACCENT_AMBER),
        ('4. OBJECTION SIGNALS', ACCENT_RED),
    ]):
        sy = ao_y - 11 - i * 10
        c.setFillColor(col)
        c.circle(ao_x + 2, sy + 2.5, 2, fill=1, stroke=0)
        c.setFillColor(LIGHT_TEXT)
        c.setFont(FONT, 5.8)
        c.drawString(ao_x + 8, sy, lab)

    # ROW 5: Interactive Report (convergence) -----------------------------
    ao_bottom = ao_y - 4 * 10 - 14
    r5_y = ao_bottom - 18
    rw, rh = 320, 50

    # Left arm: scores -> report
    draw_arrow(c, left_x, vl_y - 5 * 10 - 14, left_x, r5_y, MUTED)
    draw_arrow(c, left_x, r5_y, cx - rw/2, r5_y, MUTED)

    # Right arm: Claude output -> report
    draw_arrow(c, right_x, ao_bottom, right_x, r5_y, MUTED)
    draw_arrow(c, right_x, r5_y, cx + rw/2, r5_y, MUTED)

    # Report box
    c.setFillColor(DARK_CARD)
    c.setStrokeColor(ACCENT_BLUE)
    c.setLineWidth(1.2)
    c.roundRect(cx - rw/2, r5_y - rh/2, rw, rh, 8, fill=1, stroke=1)
    c.setFillColor(ACCENT_BLUE)
    c.roundRect(cx - rw/2 + 1, r5_y + rh/2 - 3, rw - 2, 3, 1.5, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 11)
    c.drawCentredString(cx, r5_y + 10, 'INTERACTIVE REPORT')
    c.setFillColor(MUTED)
    c.setFont(FONT, 7)
    c.drawCentredString(cx, r5_y, 'Multi-string tab selector  |  Expandable risk category cards')

    for i, (lab, col) in enumerate([
        ('Verdict Badge', ACCENT_GREEN), ('Score Panels', ACCENT_AMBER),
        ('AI Analysis', ACCENT_RED), ('Flag Details', ACCENT_BLUE),
    ]):
        rx = cx - 112 + i * 75
        ry = r5_y - 14
        c.setFillColor(SECTION_BG)
        c.setStrokeColor(col)
        c.setLineWidth(0.7)
        c.roundRect(rx - 32, ry - 8, 64, 16, 3, fill=1, stroke=1)
        c.setFillColor(LIGHT_TEXT)
        c.setFont(FONT_BOLD, 6)
        c.drawCentredString(rx, ry - 3, lab)

    # Footer
    c.setFillColor(DIVIDER)
    c.rect(0, 22, W, 0.5, fill=1, stroke=0)
    c.setFillColor(MUTED)
    c.setFont(FONT, 6)
    c.drawString(MARGIN, 10, 'TLD RISK CHECKER  |  Confidential  |  For internal use only  |  Not legal advice')
    c.drawRightString(W - MARGIN, 10, 'Vite + React + TypeScript + Tailwind CSS  |  No backend  |  Client-side only')

    c.save()
    print('Generated: TLD-Risk-Checker-Architecture.pdf')


if __name__ == '__main__':
    generate()
