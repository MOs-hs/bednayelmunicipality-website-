# -*- coding: utf-8 -*-
"""
Script to generate a professional, fully Right-To-Left (RTL) PowerPoint presentation in Arabic
for Bednayel Municipality (بلدية بدنايل) including Twilio subscription, hosting, and domains.
"""

import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(output_path):
    prs = Presentation()
    # 16:9 Widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Official Municipal Color Palette
    COLOR_PRIMARY = RGBColor(15, 41, 66)       # Deep Navy #0F2942
    COLOR_SECONDARY = RGBColor(30, 111, 80)    # Cedar Green #1E6F50
    COLOR_ACCENT = RGBColor(212, 160, 23)      # Warm Gold #D4A017
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)   # Soft Light Slate #F8FAFC
    COLOR_WHITE = RGBColor(255, 255, 255)      # White
    COLOR_TEXT_DARK = RGBColor(30, 41, 59)     # Dark Charcoal #1E293B
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # Muted Gray #64748B
    COLOR_CARD_BORDER = RGBColor(226, 232, 240)
    COLOR_CARD_BG = RGBColor(255, 255, 255)
    COLOR_LIGHT_GREEN = RGBColor(236, 253, 245)
    COLOR_LIGHT_BLUE = RGBColor(239, 246, 255)
    COLOR_LIGHT_GOLD = RGBColor(254, 252, 232)
    COLOR_TWILIO_RED = RGBColor(242, 47, 70)    # Twilio Red/Coral

    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def apply_rtl(p, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=11, bold=False, color=None):
        p.alignment = align
        pPr = p._p.get_or_add_pPr()
        pPr.set('rtl', '1')
        p.font.name = font_name
        p.font.size = Pt(size_pt)
        p.font.bold = bold
        if color:
            p.font.color.rgb = color

    def add_header(slide, title_text, category_text="بلدية بدنايل | بوابة التحول الرقمي والحكومة الإلكترونية"):
        # Top accent bar
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = COLOR_ACCENT
        top_bar.line.fill.background()

        # Category / breadcrumb (aligned right)
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.733), Inches(0.35))
        cat_tf = cat_box.text_frame
        cat_tf.word_wrap = True
        p_cat = cat_tf.paragraphs[0]
        p_cat.text = category_text
        apply_rtl(p_cat, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=12, bold=True, color=COLOR_SECONDARY)

        # Slide Main Title (aligned right)
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.733), Inches(0.8))
        title_tf = title_box.text_frame
        title_tf.word_wrap = True
        p_title = title_tf.paragraphs[0]
        p_title.text = title_text
        apply_rtl(p_title, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=24, bold=True, color=COLOR_PRIMARY)

        # Divider line
        div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.02))
        div.fill.solid()
        div.fill.fore_color.rgb = COLOR_CARD_BORDER
        div.line.fill.background()

    def add_footer(slide, current_page, total_pages=11):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.35))
        ftf = footer_box.text_frame
        p = ftf.paragraphs[0]
        p.text = f"المشروع الرقمي الرسمي لبلدية بدنايل — الشريحة {current_page} من {total_pages}"
        apply_rtl(p, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=10, bold=False, color=COLOR_TEXT_MUTED)

    def set_table_rtl(table):
        tblPr = table._tbl.tblPr
        tblPr.set('rtl', '1')
        for row in table.rows:
            for cell in row.cells:
                for p in cell.text_frame.paragraphs:
                    pPr = p._p.get_or_add_pPr()
                    pPr.set('rtl', '1')

    # =========================================================================
    # SLIDE 1: Title Slide (غلاف العرض الرسمي)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_PRIMARY)

    bar1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.2))
    bar1.fill.solid()
    bar1.fill.fore_color.rgb = COLOR_ACCENT
    bar1.line.fill.background()

    hero_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.15), Inches(10.933), Inches(5.35))
    hero_card.fill.solid()
    hero_card.fill.fore_color.rgb = RGBColor(22, 53, 84)
    hero_card.line.color.rgb = COLOR_ACCENT
    hero_card.line.width = Pt(1.5)

    tb_title = slide1.shapes.add_textbox(Inches(1.5), Inches(1.4), Inches(10.333), Inches(3.2))
    tf1 = tb_title.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "الجمهورية اللبنانية — محافظة بعلبك الهرمل"
    apply_rtl(p0, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=16, bold=True, color=COLOR_ACCENT)

    p1 = tf1.add_paragraph()
    p1.text = "بوابة بلدية بدنايل الرقمية المتكاملة"
    apply_rtl(p1, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=35, bold=True, color=COLOR_WHITE)

    p2 = tf1.add_paragraph()
    p2.text = "دراسة شاملة للمنصة، الأثر التنموي، الاستضافة السحابية، اشتراك Twilio للرسائل، والنطاقات الرسمية"
    apply_rtl(p2, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=16, bold=False, color=RGBColor(203, 213, 225))

    tags = ["🏛️ خدمات إلكترونية ومواعيد", "📋 متابعة الشكاوى الميدانية", "📲 خدمة Twilio للتحقق SMS", "🌐 نطاق حكومي .gov.lb وتجاري"]
    pill_w = Inches(2.45)
    pill_gap = Inches(0.18)
    start_x = Inches(1.55)
    for i, tag in enumerate(tags):
        tag_box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, start_x + i * (pill_w + pill_gap), Inches(4.7), pill_w, Inches(0.65))
        tag_box.fill.solid()
        tag_box.fill.fore_color.rgb = RGBColor(30, 68, 105)
        tag_box.line.color.rgb = COLOR_SECONDARY
        tag_tf = tag_box.text_frame
        tag_tf.word_wrap = True
        ptag = tag_tf.paragraphs[0]
        ptag.text = tag
        apply_rtl(ptag, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=11, bold=True, color=COLOR_WHITE)

    cov_footer = slide1.shapes.add_textbox(Inches(1.5), Inches(5.65), Inches(10.333), Inches(0.6))
    cft = cov_footer.text_frame
    cp = cft.paragraphs[0]
    cp.text = "عرض رسمي موجّه لرئيس وأعضاء المجلس البلدي ولأهالي بلدة بدنايل الكرام | 2026"
    apply_rtl(cp, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=12.5, bold=False, color=RGBColor(148, 163, 184))

    # =========================================================================
    # SLIDE 2: Vision & Project Purpose (الرؤية والهدف الاستراتيجي)
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2, COLOR_BG_LIGHT)
    add_header(slide2, "الرؤية والأهداف الاستراتيجية للتحول الرقمي في بدنايل")
    add_footer(slide2, 2)

    pillars = [
        {
            "icon": "🚀",
            "title": "التحول نحو الإدارة الذكية",
            "desc": "الانتقال ببلدية بدنايل من الإدارة الورقية الروتينية إلى بيئة رقمية متطورة ومؤتمتة تعمل على مدار الساعة لخدمة المواطن بأعلى معايير السرعة والكفاءة."
        },
        {
            "icon": "🤝",
            "title": "الشفافية والمساءلة المجتمعية",
            "desc": "تعزيز الثقة المتبادلة بين المجلس البلدي والمواطنين عبر إتاحة تتبع الشكاوى مباشرة، ونشر التعاميم والقرارات الرسمية فور صدورها دون وسيط."
        },
        {
            "icon": "🌍",
            "title": "ربط المغتربين ببلدتهم",
            "desc": "تمكين أبناء بدنايل في دول الاغتراب من متابعة شؤون بلدتهم، ومعاملاتهم العقارية والإدارية، والمشاركة في المشاريع التنموية بضغطة زر أينما كانوا."
        },
        {
            "icon": "⏱️",
            "title": "توفير الجهد والمال والموارد",
            "desc": "إنهاء طوابير الانتظار، تخفيف الضغط اليومي عن موظفي البلدية، وخفض الهدر المالي في استهلاك الأوراق والأحبار وتكاليف الانتقال الشخصي."
        }
    ]

    card_w2 = Inches(2.75)
    card_h2 = Inches(4.75)
    gap2 = Inches(0.24)
    start_x2 = Inches(0.8)

    for i, p in enumerate(pillars):
        x = start_x2 + i * (card_w2 + gap2)
        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.8), card_w2, card_h2)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1)

        top_card = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(1.8), card_w2, Inches(1.2))
        top_card.fill.solid()
        top_card.fill.fore_color.rgb = COLOR_PRIMARY if i % 2 == 0 else COLOR_SECONDARY
        top_card.line.fill.background()

        ctf = top_card.text_frame
        ctf.word_wrap = True
        p_icon = ctf.paragraphs[0]
        p_icon.text = f"{p['icon']}  {p['title']}"
        apply_rtl(p_icon, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=13.5, bold=True, color=COLOR_WHITE)

        body_box = slide2.shapes.add_textbox(x + Inches(0.18), Inches(3.2), card_w2 - Inches(0.36), Inches(3.1))
        btf = body_box.text_frame
        btf.word_wrap = True
        bp = btf.paragraphs[0]
        bp.text = p["desc"]
        apply_rtl(bp, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=12.5, bold=False, color=COLOR_TEXT_DARK)

    # =========================================================================
    # SLIDE 3: Website Architecture & Modules (أقسام ومميزات المنصة)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3, COLOR_BG_LIGHT)
    add_header(slide3, "أقسام المنصة الرقمية ووظائفها الأساسية")
    add_footer(slide3, 3)

    sections = [
        {
            "title": "1. بوابة المواطن والحسابات الشخصية",
            "color": COLOR_PRIMARY,
            "items": [
                "إنشاء حساب بالاسم ورقم الهاتف مع نظام تحقق متطور.",
                "لوحة تحكم خاصة لكل مواطن تظهر طلباته ومواعيده وشكاويه.",
                "استعادة وتعيين كلمة المرور بأمان مع تشفير تام للبيانات."
            ]
        },
        {
            "title": "2. المعاملات والخدمات البلدية",
            "color": COLOR_SECONDARY,
            "items": [
                "حجز المواعيد الرسمية مسبقاً (استفسارات، رخص بناء، معاملات).",
                "طلب المعاملات والإفادات (شهادات سكن، إفادات عقارية وإدارية).",
                "إرفاق المستندات والصور رقمياً لتقليل المراجعات الميدانية."
            ]
        },
        {
            "title": "3. نظام الشكاوى والمتابعة التفاعلي",
            "color": COLOR_SECONDARY,
            "items": [
                "تقديم شكوى فورية وتصنيفها (إنارة، نفايات، طرقات، مياه).",
                "تحديد الموقع وإرفاق صور حية لتوجيه ورش الصيانة مباشرة.",
                "إشعار المواطن بتطور مراحل معالجة الشكوى حتى إتمامها."
            ]
        },
        {
            "title": "4. المركز الإعلامي والدليل المحلي",
            "color": COLOR_PRIMARY,
            "items": [
                "نشر الأخبار الرسمية وقرارات المجلس البلدي والتعاميم الفورية.",
                "دليل شامل لأماكن وخدمات بدنايل (صيدليات، مراكز صحية، مطاعم).",
                "معرض صور توثيقي لمعالم البلدة وتطور إنجاز المشاريع الإنمائية."
            ]
        },
        {
            "title": "5. لوحة الإدارة الشاملة (Admin Portal)",
            "color": COLOR_ACCENT,
            "items": [
                "واجهة متطورة لموظفي البلدية لإدارة ومعالجة المعاملات والمواعيد.",
                "نظام فلترة متقدم للشكاوى وتكليف الفرق الفنية المختصة.",
                "تحديث الأخبار والدليل المحلي ومعارض الصور بسهولة وسرعة."
            ]
        },
        {
            "title": "6. البنية البرمجية المتطورة (Tech Stack)",
            "color": COLOR_PRIMARY,
            "items": [
                "واجهة سريعة وخفيفة مبنية بتقنيات React وTailwind CSS.",
                "خادم خلفي متين بنظام Node.js وقواعد بيانات MySQL.",
                "دعم كامل وتلقائي للغتين العربية والإنجليزية وتوافق 100% مع الهواتف."
            ]
        }
    ]

    col_w3 = Inches(3.75)
    row_h3 = Inches(2.3)
    col_gap3 = Inches(0.24)
    row_gap3 = Inches(0.2)

    for i, sec in enumerate(sections):
        col = i % 3
        row = i // 3
        x = Inches(0.8) + col * (col_w3 + col_gap3)
        y = Inches(1.8) + row * (row_h3 + row_gap3)

        card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, col_w3, row_h3)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1)

        htag = slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, col_w3, Inches(0.48))
        htag.fill.solid()
        htag.fill.fore_color.rgb = sec["color"]
        htag.line.fill.background()
        htf = htag.text_frame
        hp = htf.paragraphs[0]
        hp.text = sec["title"]
        apply_rtl(hp, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=11.5, bold=True, color=COLOR_WHITE)

        tbox = slide3.shapes.add_textbox(x + Inches(0.12), y + Inches(0.55), col_w3 - Inches(0.24), row_h3 - Inches(0.6))
        ttf = tbox.text_frame
        ttf.word_wrap = True
        for j, item in enumerate(sec["items"]):
            p = ttf.paragraphs[0] if j == 0 else ttf.add_paragraph()
            p.text = f"• {item}"
            apply_rtl(p, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=10.5, bold=False, color=COLOR_TEXT_DARK)

    # =========================================================================
    # SLIDE 4: Community & Village Impact (أثر الموقع على قرية بدنايل)
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4, COLOR_BG_LIGHT)
    add_header(slide4, "الأثر الإيجابي والتنموي على مجتمع قرية بدنايل")
    add_footer(slide4, 4)

    audiences = [
        {
            "target": "الأهالي والمقيمون في بدنايل",
            "icon": "🏡",
            "color": COLOR_SECONDARY,
            "points": [
                "إنهاء عناء الانتظار والازدحام أمام مكاتب البلدية وتوفير وقت ثمين للمواطنين.",
                "تقديم الشكاوى فور حدوثها ومتابعة مسار معالجتها بشفافية دون مراجعة شخصية.",
                "معرفة شروط ومستندات المعاملات مسبقاً قبل الذهاب إلى البلدية لتجنب تكرار الزيارات.",
                "خدمة إلكترونية متاحة 24/7 من المنزل عبر الهاتف الذكي بكل سهولة وراحة."
            ]
        },
        {
            "target": "أبناء بدنايل في بلاد الاغتراب",
            "icon": "✈️",
            "color": COLOR_PRIMARY,
            "points": [
                "بناء جسر تواصل دائم وموثوق يربط المغترب بأخبار بلدته ومشروعاتها لحظة بلحظة.",
                "إمكانية متابعة المعاملات العقارية والإدارية والتواصل المباشر مع المجلس البلدي.",
                "المساهمة في دعم المبادرات التنموية والخيرية التي تطرحها البلدية بشفافية تامة.",
                "تعزيز انتماء أبناء المغتربين الشباب بهويتهم وتراث بلدتهم عبر الدليل والمعارض."
            ]
        },
        {
            "target": "المجلس البلدي والإدارة المحلية",
            "icon": "🏛️",
            "color": COLOR_ACCENT,
            "points": [
                "أرشفة إلكترونية متطورة لجميع المعاملات والشكاوى تمنع ضياع أو تلف السجلات الورقية.",
                "سرعة توجيه ورش الطوارئ وحصر الأعطال والمشاكل الأكثر تكراراً في أحياء البلدة.",
                "توفير هائل في النفقات الإدارية والمطبوعات والأوراق وساعات العمل البشري.",
                "ترسيخ مكانة بلدة بدنايل كنموذج بلدي ريادي يقتدى به في المحافظة والوطن."
            ]
        }
    ]

    card_w4 = Inches(3.75)
    for i, aud in enumerate(audiences):
        x = Inches(0.8) + i * (card_w4 + Inches(0.24))
        card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.8), card_w4, Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1)

        banner = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(1.8), card_w4, Inches(0.9))
        banner.fill.solid()
        banner.fill.fore_color.rgb = aud["color"]
        banner.line.fill.background()
        btf = banner.text_frame
        btf.word_wrap = True
        bp = btf.paragraphs[0]
        bp.text = f"{aud['icon']}  {aud['target']}"
        apply_rtl(bp, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=14, bold=True, color=COLOR_WHITE)

        content_box = slide4.shapes.add_textbox(x + Inches(0.18), Inches(2.85), card_w4 - Inches(0.36), Inches(3.6))
        ctf = content_box.text_frame
        ctf.word_wrap = True
        for j, pt in enumerate(aud["points"]):
            p = ctf.paragraphs[0] if j == 0 else ctf.add_paragraph()
            p.text = f"✔ {pt}\n"
            apply_rtl(p, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=11.5, bold=False, color=COLOR_TEXT_DARK)

    # =========================================================================
    # SLIDE 5: Hosting Architecture & Cloud Costs (تكلفة الاستضافة بالتفصيل)
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5, COLOR_BG_LIGHT)
    add_header(slide5, "دراسة تكاليف الاستضافة السحابية والتشغيل بالتفصيل")
    add_footer(slide5, 5)

    info_box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.75), Inches(11.733), Inches(0.85))
    info_box.fill.solid()
    info_box.fill.fore_color.rgb = COLOR_LIGHT_BLUE
    info_box.line.color.rgb = COLOR_PRIMARY
    info_box.line.width = Pt(1)
    itf = info_box.text_frame
    itf.word_wrap = True
    ip = itf.paragraphs[0]
    ip.text = "💡 متطلبات تشغيل النظام: واجهة تفاعلية (React Vite) + خادم خلفي برمجيات (Node.js/Express) + قاعدة بيانات علائقية (MySQL) + مساحة تخزين للصور والمرفقات (Media Storage). النظام مصمم بكفاءة عالية ليعمل بأقل تكلفة ممكنة."
    apply_rtl(ip, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=11, bold=False, color=COLOR_PRIMARY)

    models = [
        {
            "title": "الخيار الأول (الموصى به): خادم سحابي خاص (Cloud VPS)",
            "subtitle": "خادم افتراضي مستقل فائق السرعة والموثوقية (Hetzner / Hostinger VPS)",
            "specs": [
                ("المعالج والذاكرة", "2 vCPU Cores مع 4 GB RAM (كافية لآلاف الزوار يومياً)"),
                ("التخزين والسرعة", "50 GB إلى 80 GB NVMe SSD فائق السرعة"),
                ("حركة البيانات (Traffic)", "غير محدودة / 20 TB شهرياً بسعة شبكة 1 Gbps"),
                ("قاعدة البيانات", "MySQL مدمجة مع نظام عزل أمني وجدار ناري متطور"),
                ("النسخ الاحتياطي", "نسخ احتياطي أسبوعي تلقائي لضمان عدم ضياع أي بيانات")
            ],
            "cost_month": "$7.00 - $10.00 شهرياً",
            "cost_year": "$84 - $120 سنوياً فقط"
        },
        {
            "title": "الخيار الثاني: الاستضافة المدارة / الموزعة (Decoupled Cloud)",
            "subtitle": "فصل الواجهة عن السيرفر (Cloudflare Pages + Railway/Render)",
            "specs": [
                ("الواجهة الأمامية (Frontend)", "Cloudflare Pages أو Vercel (مجاني 100%)"),
                ("الخادم الخلفي (Backend API)", "Node.js Container على Railway أو Render ($5 - $7 / شهر)"),
                ("قاعدة البيانات (Managed DB)", "MySQL Database مساحة 5-10 GB ($5 / شهر)"),
                ("تخزين الصور المرفقة", "Cloudflare R2 Object Storage (مجاني لغاية 10GB)"),
                ("الصيانة والتحديثات", "إدارة تلقائية للسيرفر بدون تدخل يدوي في النظام")
            ],
            "cost_month": "$10.00 - $14.00 شهرياً",
            "cost_year": "$120 - $168 سنوياً"
        }
    ]

    card_w5 = Inches(5.7)
    for i, m in enumerate(models):
        x = Inches(0.8) + i * (card_w5 + Inches(0.33))
        card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.75), card_w5, Inches(4.05))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1)

        mhead = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(2.75), card_w5, Inches(0.85))
        mhead.fill.solid()
        mhead.fill.fore_color.rgb = COLOR_PRIMARY if i == 0 else RGBColor(40, 58, 80)
        mhead.line.fill.background()
        mtf = mhead.text_frame
        mtf.word_wrap = True
        mp = mtf.paragraphs[0]
        mp.text = m["title"]
        apply_rtl(mp, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=12.5, bold=True, color=COLOR_WHITE)

        mp_sub = mtf.add_paragraph()
        mp_sub.text = m["subtitle"]
        apply_rtl(mp_sub, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=9.5, bold=False, color=COLOR_ACCENT)

        specs_box = slide5.shapes.add_textbox(x + Inches(0.15), Inches(3.7), card_w5 - Inches(0.3), Inches(2.1))
        stf = specs_box.text_frame
        stf.word_wrap = True
        for k, (item_k, item_v) in enumerate(m["specs"]):
            p = stf.paragraphs[0] if k == 0 else stf.add_paragraph()
            p.text = f"• {item_k}: {item_v}"
            apply_rtl(p, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=10.5, bold=False, color=COLOR_TEXT_DARK)

        pbox = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.2), Inches(5.9), card_w5 - Inches(0.4), Inches(0.75))
        pbox.fill.solid()
        pbox.fill.fore_color.rgb = COLOR_LIGHT_GREEN if i == 0 else COLOR_LIGHT_BLUE
        pbox.line.color.rgb = COLOR_SECONDARY if i == 0 else COLOR_PRIMARY
        pbox.line.width = Pt(1)
        ptf = pbox.text_frame
        ptf.word_wrap = True
        pp1 = ptf.paragraphs[0]
        pp1.text = f"التكلفة الشهرية: {m['cost_month']}  |  الإجمالي السنوي: {m['cost_year']}"
        apply_rtl(pp1, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=11.5, bold=True, color=COLOR_SECONDARY if i == 0 else COLOR_PRIMARY)

    # =========================================================================
    # SLIDE 6: Twilio Integration & Subscription (خدمة التحقق والرسائل Twilio) - NEW DEDICATED SLIDE
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6, COLOR_BG_LIGHT)
    add_header(slide6, "خدمة واشتراك Twilio للتحقق بالرسائل النصية والواتساب (SMS / WhatsApp OTP)")
    add_footer(slide6, 6)

    # Top summary banner
    tw_top = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.75), Inches(11.733), Inches(0.85))
    tw_top.fill.solid()
    tw_top.fill.fore_color.rgb = RGBColor(255, 241, 242) # soft rose
    tw_top.line.color.rgb = COLOR_TWILIO_RED
    tw_top.line.width = Pt(1)
    tt_f = tw_top.text_frame
    tt_f.word_wrap = True
    tp_top = tt_f.paragraphs[0]
    tp_top.text = "📲 دور خدمة Twilio في المنصة: تفعيل أرقام هواتف المواطنين اللبنانية عبر إرسال رمز تحقق سري من 6 أرقام (OTP)، منع إنشاء الحسابات الوهمية، وإرسال إشعارات فورية بمستجدات الشكاوى والمواعيد البلدية عبر SMS وWhatsApp."
    apply_rtl(tp_top, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=11, bold=False, color=RGBColor(159, 18, 57))

    # Left Column: Features & Mechanism
    left_w_tw = Inches(7.4)
    left_card_tw = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.75), left_w_tw, Inches(4.05))
    left_card_tw.fill.solid()
    left_card_tw.fill.fore_color.rgb = COLOR_CARD_BG
    left_card_tw.line.color.rgb = COLOR_CARD_BORDER
    left_card_tw.line.width = Pt(1)

    thead_tw = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(2.75), left_w_tw, Inches(0.55))
    thead_tw.fill.solid()
    thead_tw.fill.fore_color.rgb = COLOR_PRIMARY
    thead_tw.line.fill.background()
    thtf_tw = thead_tw.text_frame
    thp_tw = thtf_tw.paragraphs[0]
    thp_tw.text = "⚙️ مجالات استخدام Twilio في المنصة البلدية"
    apply_rtl(thp_tw, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=13, bold=True, color=COLOR_WHITE)

    tbox_tw = slide6.shapes.add_textbox(Inches(1.0), Inches(3.4), left_w_tw - Inches(0.4), Inches(3.2))
    ttf_tw = tbox_tw.text_frame
    ttf_tw.word_wrap = True

    tw_points = [
        ("تفعيل الحسابات الجديدة (Account Verification)", "إرسال رمز تحقق مؤقت (OTP) إلى هاتف المواطن عند التسجيل للتأكد من هويته ومطابقة رقمه."),
        ("استعادة كلمات المرور المنسية (Password Reset)", "إرسال رابط آمن أو رمز استرجاع لهاتف المواطن المسجل لمنع اختراق الحسابات الشخصية."),
        ("إشعارات المواعيد الرسمية (Appointment Alerts)", "تأكيد موعد المواطن لدى البلدية وتذكيره قبل الموعد بيوم واحد لتقليل التخلف عن الحضور."),
        ("متابعة مسار الشكاوى (Complaint Updates)", "إشعار المواطن برسالة تفيد ببدء معالجة شكواه ثم إنجازها بنجاح مع صورة الإنجاز."),
        ("دعم قناة الواتساب (Twilio WhatsApp API)", "خيار مفضل وأكثر توفيراً للمواطنين اللبنانيين نظراً لانتشار الواتساب وسرعة وصوله مقارنة بالـ SMS.")
    ]

    for idx, (head_p, desc_p) in enumerate(tw_points):
        p = ttf_tw.paragraphs[0] if idx == 0 else ttf_tw.add_paragraph()
        p.text = f"🔸 {head_p}: {desc_p}"
        apply_rtl(p, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=10.5, bold=False, color=COLOR_TEXT_DARK)

    # Right Column: Pricing & Subscription Breakdown
    right_w_tw = Inches(4.0)
    right_x_tw = Inches(8.5)

    tw_cost_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x_tw, Inches(2.75), right_w_tw, Inches(4.05))
    tw_cost_card.fill.solid()
    tw_cost_card.fill.fore_color.rgb = COLOR_LIGHT_GREEN
    tw_cost_card.line.color.rgb = COLOR_SECONDARY
    tw_cost_card.line.width = Pt(1.5)

    tw_ctf = tw_cost_card.text_frame
    tw_ctf.word_wrap = True

    tw_p1 = tw_ctf.paragraphs[0]
    tw_p1.text = "💰 تفاصيل اشتراك وتكلفة Twilio"
    apply_rtl(tw_p1, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=14, bold=True, color=COLOR_SECONDARY)

    tw_cost_items = [
        "\n• نظام الدفع: رصيد مسبق الدفع (Pay-As-You-Go) دون التزام بعقود إجبارية.",
        "• تكلفة الرسالة النصية (SMS للبنان Alfa/Touch): حوالي $0.065 إلى $0.085 للرسالة الواحدة.",
        "• تكلفة رسائل الواتساب (WhatsApp OTP): حوالي $0.035 إلى $0.05 للرسالة (أوفر بنسبة 40%).",
        "• الاستهلاك التقديري لبلدة بدنايل: 200 إلى 400 رسالة شهرياً لمجمل العمليات.",
        "• التكلفة الشهرية المتوقعة: $15 إلى $25 شهرياً.",
        "• التكلفة السنوية التقديرية: $180 إلى $300 سنوياً (تُشحن حسب حاجة البلدية الفعلية)."
    ]

    for item in tw_cost_items:
        p = tw_ctf.add_paragraph()
        p.text = item
        apply_rtl(p, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=10.5, bold=False, color=COLOR_TEXT_DARK)

    # =========================================================================
    # SLIDE 7: Official Lebanese Domain (.gov.lb)
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7, COLOR_BG_LIGHT)
    add_header(slide7, "النطاق الحكومي الرسمي (.gov.lb) — الآلية، المتطلبات، والتكلفة")
    add_footer(slide7, 7)

    left_w7 = Inches(7.5)
    left_card7 = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), left_w7, Inches(4.9))
    left_card7.fill.solid()
    left_card7.fill.fore_color.rgb = COLOR_CARD_BG
    left_card7.line.color.rgb = COLOR_CARD_BORDER
    left_card7.line.width = Pt(1)

    lhead7 = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), left_w7, Inches(0.6))
    lhead7.fill.solid()
    lhead7.fill.fore_color.rgb = COLOR_SECONDARY
    lhead7.line.fill.background()
    ltf7 = lhead7.text_frame
    lp7 = ltf7.paragraphs[0]
    lp7.text = "🏛️ آلية وخطوات حجز النطاق السيادي (bednayel.gov.lb)"
    apply_rtl(lp7, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=14, bold=True, color=COLOR_WHITE)

    steps_box7 = slide7.shapes.add_textbox(Inches(1.0), Inches(2.5), left_w7 - Inches(0.4), Inches(4.0))
    stf7 = steps_box7.text_frame
    stf7.word_wrap = True

    steps = [
        ("الجهة المشرفة الرسمية", "مكتب وزير الدولة لشؤون التنمية الإدارية (OMSAR) بالتنسيق مع هيئة إدارة النطاق اللبناني (LBDR / OGERO)."),
        ("1. إعداد الكتاب والقرار البلدي", "تجهيز كتاب رسمي موقّع ومختوم من رئيس مجلس بلدية بدنايل، وموجّه إلى OMSAR يطلب حجز وتخصيص النطاق بدقة باسم bednayel.gov.lb."),
        ("2. إرفاق المستندات الثبوتية", "إرفاق مرسوم تأسيس البلدية أو إفادة رسمية صادرة عن وزارة الداخلية والبلديات تُثبت الصفة القانونية للمجلس البلدي ورئيسه."),
        ("3. تعيين جهات الاتصال (Contacts)", "تحديد ممثل إداري (رئيس البلدية أو عضو مجلس) وممثل تقني مسؤول عن الخوادم وعناوين الـ DNS."),
        ("4. ربط خوادم الأسماء (DNS Delegation)", "تزويد الهيئة بعناوين الـ Nameservers الخاصة بخادم الاستضافة لربط الموقع تلقائياً."),
        ("5. التدقيق والموافقة والتفعيل", "تتم مراجعة الطلب خلال فترة تتراوح بين 5 إلى 15 يوم عمل ويتم تفعيل النطاق وإدراجه في سجلات الدولة الرسمية.")
    ]

    for j, (st, desc) in enumerate(steps):
        p = stf7.paragraphs[0] if j == 0 else stf7.add_paragraph()
        p.text = f"🔹 {st}: {desc}"
        apply_rtl(p, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=11, bold=False, color=COLOR_TEXT_DARK)

    right_w7 = Inches(3.9)
    right_x7 = Inches(8.6)

    c_card7 = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x7, Inches(1.8), right_w7, Inches(2.2))
    c_card7.fill.solid()
    c_card7.fill.fore_color.rgb = COLOR_LIGHT_GREEN
    c_card7.line.color.rgb = COLOR_SECONDARY
    c_card7.line.width = Pt(1.5)
    ctf7 = c_card7.text_frame
    ctf7.word_wrap = True
    cp1_7 = ctf7.paragraphs[0]
    cp1_7.text = "💰 التكلفة المالية لنطاق .gov.lb"
    apply_rtl(cp1_7, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=14, bold=True, color=COLOR_SECONDARY)

    cp2_7 = ctf7.add_paragraph()
    cp2_7.text = "\nمجاني 100% (أو برسم إداري رمزي جداً)"
    apply_rtl(cp2_7, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=13, bold=True, color=COLOR_PRIMARY)

    cp3_7 = ctf7.add_paragraph()
    cp3_7.text = "تقدم الدولة اللبنانية نطاقات .gov.lb مجاناً للإدارات العامة والبلديات لدعم التحول الرقمي ومشاريع الحوكمة الإلكترونية."
    apply_rtl(cp3_7, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=10, bold=False, color=COLOR_TEXT_DARK)

    v_card7 = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x7, Inches(4.2), right_w7, Inches(2.5))
    v_card7.fill.solid()
    v_card7.fill.fore_color.rgb = COLOR_LIGHT_GOLD
    v_card7.line.color.rgb = COLOR_ACCENT
    v_card7.line.width = Pt(1.5)
    vtf7 = v_card7.text_frame
    vtf7.word_wrap = True
    vp1_7 = vtf7.paragraphs[0]
    vp1_7.text = "⭐ القيمة الاستراتيجية والسيادية"
    apply_rtl(vp1_7, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=13, bold=True, color=COLOR_PRIMARY)

    vp2_7 = vtf7.add_paragraph()
    vp2_7.text = "\n• الحصانة ضد التزوير: لا يمكن لأي جهة غير البلدية حجز هذا النطاق.\n• ثقة مطلقة للمواطن: يعلم الزائر أنه داخل الموقع الرسمي الحصري للدولة.\n• الحماية القانونية: محمي بالقوانين والمراسيم اللبنانية المنظمة للنطاقات."
    apply_rtl(vp2_7, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=10.5, bold=False, color=COLOR_TEXT_DARK)

    # =========================================================================
    # SLIDE 8: Commercial Domain (.com)
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8, COLOR_BG_LIGHT)
    add_header(slide8, "النطاق التجاري الدولي (.com) — الآلية، الميزات، والتكلفة")
    add_footer(slide8, 8)

    left_w8 = Inches(7.5)
    left_card8 = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), left_w8, Inches(4.9))
    left_card8.fill.solid()
    left_card8.fill.fore_color.rgb = COLOR_CARD_BG
    left_card8.line.color.rgb = COLOR_CARD_BORDER
    left_card8.line.width = Pt(1)

    lhead8 = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), left_w8, Inches(0.6))
    lhead8.fill.solid()
    lhead8.fill.fore_color.rgb = COLOR_PRIMARY
    lhead8.line.fill.background()
    ltf8 = lhead8.text_frame
    lp8 = ltf8.paragraphs[0]
    lp8.text = "🌐 آلية وخطوات حجز نطاق (bednayelmunicipality.com)"
    apply_rtl(lp8, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=14, bold=True, color=COLOR_WHITE)

    steps_box8 = slide8.shapes.add_textbox(Inches(1.0), Inches(2.5), left_w8 - Inches(0.4), Inches(4.0))
    stf8 = steps_box8.text_frame
    stf8.word_wrap = True

    steps_com = [
        ("الخيارات المقترحة للاسم", "bednayelmunicipality.com أو bednayel-municipality.com أو baladiyetbednayel.com"),
        ("1. اختيار مسجل النطاقات العالمي", "المسجلون الموصى بهم: Namecheap أو Cloudflare Registrar أو GoDaddy (مسجلون عالميون معتمدون لدى ICANN)."),
        ("2. الفحص الفوري للتوفر", "البحث الإلكتروني المباشر عن الاسم والتأكد من إتاحته للحجز غير المحجوز."),
        ("3. الدفع والتسجيل الإلكتروني", "تسجيل الحساب باسم بلدية بدنايل، وتعبئة بيانات الاتصال، وإتمام عملية الشراء فوراً بواسطة بطاقة مصرفية (Visa/Mastercard)."),
        ("4. حماية الخصوصية (WHOIS Privacy)", "تفعيل خدمة إخفاء البيانات الشخصية للمسجل مجاناً لمنع استقبال رسائل الترويج المزعجة."),
        ("5. التفعيل الفوري والربط", "يتم تفعيل النطاق خلال دقائق معدودة، وربط سجلات A وCNAME بخادم الاستضافة دون أي معاملات ورقية.")
    ]

    for j, (st, desc) in enumerate(steps_com):
        p = stf8.paragraphs[0] if j == 0 else stf8.add_paragraph()
        p.text = f"🔸 {st}: {desc}"
        apply_rtl(p, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=11, bold=False, color=COLOR_TEXT_DARK)

    right_w8 = Inches(3.9)
    right_x8 = Inches(8.6)

    c_card8 = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x8, Inches(1.8), right_w8, Inches(2.2))
    c_card8.fill.solid()
    c_card8.fill.fore_color.rgb = COLOR_LIGHT_BLUE
    c_card8.line.color.rgb = COLOR_PRIMARY
    c_card8.line.width = Pt(1.5)
    ctf8 = c_card8.text_frame
    ctf8.word_wrap = True
    cp1_8 = ctf8.paragraphs[0]
    cp1_8.text = "💳 تكلفة حجز وتجديد نطاق .com"
    apply_rtl(cp1_8, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=14, bold=True, color=COLOR_PRIMARY)

    cp2_8 = ctf8.add_paragraph()
    cp2_8.text = "\n$10.00 إلى $14.00 سنوياً"
    apply_rtl(cp2_8, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=14, bold=True, color=COLOR_SECONDARY)

    cp3_8 = ctf8.add_paragraph()
    cp3_8.text = "(حوالي 900,000 إلى 1,250,000 ليرة لبنانية سنوياً فقط) شامل حماية الـ WHOIS مجاناً وبدون أي ضرائب إضافية."
    apply_rtl(cp3_8, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=9.5, bold=False, color=COLOR_TEXT_DARK)

    f_card8 = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, right_x8, Inches(4.2), right_w8, Inches(2.5))
    f_card8.fill.solid()
    f_card8.fill.fore_color.rgb = COLOR_LIGHT_GOLD
    f_card8.line.color.rgb = COLOR_ACCENT
    f_card8.line.width = Pt(1.5)
    ftf8 = f_card8.text_frame
    ftf8.word_wrap = True
    fp1_8 = ftf8.paragraphs[0]
    fp1_8.text = "⚡ أهم ميزات وعيوب نطاق .com"
    apply_rtl(fp1_8, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=13, bold=True, color=COLOR_PRIMARY)

    fp2_8 = ftf8.add_paragraph()
    fp2_8.text = "\n(+) سرعة قصوى: يعمل فوراً بعد الدفع خلال 5 دقائق.\n(+) وصول عالمي: سهل التذكر لجميع المقيمين والمغتربين.\n(-) التحدي: يفتقر للصفة السيادية الرسمية الممنوحة حصراً للبلديات من الدولة اللبنانية."
    apply_rtl(fp2_8, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=10, bold=False, color=COLOR_TEXT_DARK)

    # =========================================================================
    # SLIDE 9: Domain Comparison & Golden Recommendation
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9, COLOR_BG_LIGHT)
    add_header(slide9, "مقارنة النطاقات والتوصية الاستراتيجية المعتمدة")
    add_footer(slide9, 9)

    table_shape9 = slide9.shapes.add_table(5, 4, Inches(0.8), Inches(1.8), Inches(11.733), Inches(2.8))
    table9 = table_shape9.table
    set_table_rtl(table9)

    table9.columns[0].width = Inches(2.6)
    table9.columns[1].width = Inches(3.1)
    table9.columns[2].width = Inches(3.0)
    table9.columns[3].width = Inches(3.033)

    headers9 = ["وجه المقارنة", "النطاق الحكومي (.gov.lb)", "النطاق التجاري (.com)", "التقييم البلدي"]
    for col_idx, h_text in enumerate(headers9):
        cell = table9.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_PRIMARY
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        apply_rtl(p, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=12, bold=True, color=COLOR_WHITE)

    row_data9 = [
        ("الصفة والمصداقية الرسمية", "سيادية ورسمية 100% تابعة للدولة", "تجارية عامة متاحة لأي شخص", "الأفضلية المطلقة لـ .gov.lb"),
        ("التكلفة المالية السنوية", "مجاني (أو رسم حكومي رمزي جداً)", "$10 - $14 سنوياً", "كلاهما منخفض جداً واقتصادي"),
        ("الإجراءات وسرعة التفعيل", "تتطلب كتاباً رسمياً (5 - 15 يوماً)", "دفع فوري بالبطاقة (خلال 5 دقائق)", "الأسرع هو .com"),
        ("حماية الاسم من الانتحال", "محمي ومخصص حصراً للمجلس البلدي", "قد يشتريه أي شخص إذا لم تحجزه البلدية", "حجز كلاهما يضمن الأمان التام")
    ]

    for row_idx, r in enumerate(row_data9):
        for col_idx, val in enumerate(r):
            cell = table9.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_WHITE if row_idx % 2 == 0 else RGBColor(241, 245, 249)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            apply_rtl(p, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=11, bold=(col_idx == 0 or col_idx == 3), color=COLOR_SECONDARY if col_idx == 3 else COLOR_TEXT_DARK)

    rec_box9 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.85), Inches(11.733), Inches(1.9))
    rec_box9.fill.solid()
    rec_box9.fill.fore_color.rgb = COLOR_LIGHT_GREEN
    rec_box9.line.color.rgb = COLOR_SECONDARY
    rec_box9.line.width = Pt(1.5)
    rtf9 = rec_box9.text_frame
    rtf9.word_wrap = True

    rp1_9 = rtf9.paragraphs[0]
    rp1_9.text = "🎯 التوصية الفنية والاستراتيجية المعتمدة (The Golden Strategy):"
    apply_rtl(rp1_9, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=13, bold=True, color=COLOR_SECONDARY)

    rp2_9 = rtf9.add_paragraph()
    rp2_9.text = "1. حجز النطاقين معاً: شراء نطاق bednayelmunicipality.com فوراً لضمان عدم استغلاله وحفظ هوية البلدية عالمياً وتفعيله في غضون دقائق.\n2. رفع المعاملة الرسمية بالتوازي لحجز نطاق bednayel.gov.lb عبر وزارة التنمية الإدارية ليكون هو العنوان السيادي الرسمي للبلدية.\n3. الربط الذكي والتحويل التلقائي: جعل النطاق .gov.lb هو الأساسي، وبرمجة النطاق .com ليقوم بإعادة تحويل الزائر تلقائياً (301 Redirect) للنطاق الحكومي، مما يحقق التكامل التام والمصداقية المطلقة بأقل من $15 سنوياً!"
    apply_rtl(rp2_9, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=11, bold=False, color=COLOR_TEXT_DARK)

    # =========================================================================
    # SLIDE 10: Comprehensive Annual Budget (شامل الاستضافة والنطاقات وTwilio)
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10, COLOR_BG_LIGHT)
    add_header(slide10, "الميزانية التشغيلية الشاملة للمنصة (الاستضافة + النطاقات + اشتراك Twilio)")
    add_footer(slide10, 10)

    btable_shape10 = slide10.shapes.add_table(7, 4, Inches(0.8), Inches(1.75), Inches(11.733), Inches(3.5))
    btable10 = btable_shape10.table
    set_table_rtl(btable10)

    btable10.columns[0].width = Inches(3.2)
    btable10.columns[1].width = Inches(4.1)
    btable10.columns[2].width = Inches(2.2)
    btable10.columns[3].width = Inches(2.233)

    bheaders10 = ["البند والخدمة", "المواصفات ومزود الخدمة", "التكلفة الشهرية", "التكلفة السنوية"]
    for col_idx, bh in enumerate(bheaders10):
        cell = btable10.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_PRIMARY
        p = cell.text_frame.paragraphs[0]
        p.text = bh
        apply_rtl(p, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=11.5, bold=True, color=COLOR_WHITE)

    budget_rows10 = [
        ("خادم سحابي VPS (كامل المواصفات)", "2 vCPU / 4GB RAM / 80GB NVMe (Hetzner أو Hostinger)", "$7 - $10", "$84 - $120"),
        ("اشتراك Twilio للرسائل والتحقق (OTP)", "شحن رصيد مسبق الدفع (200-400 رسالة SMS / WhatsApp)", "$15 - $22", "$180 - $260"),
        ("النطاق الحكومي الرسمي (bednayel.gov.lb)", "مكتب وزير الدولة لشؤون التنمية الإدارية (OMSAR)", "مجاني", "$0.00"),
        ("النطاق التجاري (bednayelmunicipality.com)", "مسجل معتمد (Namecheap / Cloudflare) مع حماية الهوية", "—", "$12.00"),
        ("شهادة الأمان والحماية والتسريع (SSL/CDN)", "شبكة Cloudflare العالمية (حماية من الهجمات وتشفير)", "مجاني", "$0.00"),
        ("النسخ الاحتياطي التلقائي (Automated Backups)", "حفظ نسخة احتياطية مشفرة لقاعدة البيانات والملفات أسبوعياً", "$1.50", "$18.00")
    ]

    for row_idx, r in enumerate(budget_rows10):
        for col_idx, val in enumerate(r):
            cell = btable10.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_WHITE if row_idx % 2 == 0 else RGBColor(241, 245, 249)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            apply_rtl(p, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=10.5, bold=(col_idx == 0), color=COLOR_TEXT_DARK)

    total_card10 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.4), Inches(11.733), Inches(1.35))
    total_card10.fill.solid()
    total_card10.fill.fore_color.rgb = COLOR_PRIMARY
    total_card10.line.color.rgb = COLOR_ACCENT
    total_card10.line.width = Pt(1.5)
    ttf10 = total_card10.text_frame
    ttf10.word_wrap = True

    tp1_10 = ttf10.paragraphs[0]
    tp1_10.text = "📊 إجمالي الميزانية السنوية الشاملة لكل المصاريف التشغيلية (استضافة + نطاقات + Twilio):"
    apply_rtl(tp1_10, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=13, bold=True, color=COLOR_ACCENT)

    tp2_10 = ttf10.add_paragraph()
    tp2_10.text = "حوالي 294$ إلى 410$ دولار أمريكي سنوياً فقط لا غير (بما يعادل ~25$ إلى 34$ شهرياً شامل كافة الرسائل)!"
    apply_rtl(tp2_10, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=15.5, bold=True, color=COLOR_WHITE)

    tp3_10 = ttf10.add_paragraph()
    tp3_10.text = "ميزانية اقتصادية جداً ومجدية تمنح بلدية بدنايل منصة ذكية مكتملة الأركان وموثقة أمنياً بهواتف المواطنين."
    apply_rtl(tp3_10, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=10.5, bold=False, color=RGBColor(203, 213, 225))

    # =========================================================================
    # SLIDE 11: Roadmap & Next Steps (خارطة طريق الإطلاق والتشغيل)
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide11, COLOR_BG_LIGHT)
    add_header(slide11, "خارطة طريق الإطلاق والخطوات التنفيذية القادمة")
    add_footer(slide11, 11)

    stages = [
        {
            "num": "المرحلة الأولى",
            "title": "حجز النطاقات وإعداد الخادم",
            "points": [
                "شراء نطاق bednayelmunicipality.com فوراً.",
                "تقديم كتاب طلب نطاق bednayel.gov.lb لدى OMSAR.",
                "حجز الخادم السحابي VPS وتثبيت البيئة البرمجية."
            ]
        },
        {
            "num": "المرحلة الثانية",
            "title": "ربط Twilio والأمان السحابي",
            "points": [
                "فتح حساب Twilio وضبط إرسال رسائل التحقق (OTP).",
                "رفع قاعدة البيانات والشيفرة البرمجية للمنصة.",
                "تفعيل شهادة الأمان SSL وحماية Cloudflare."
            ]
        },
        {
            "num": "المرحلة الثالثة",
            "title": "تدريب الكادر البلدي والتجربة",
            "points": [
                "تدريب موظفي البلدية على لوحة التحكم المركزية.",
                "إدخال البيانات الرسمية المحدثة والدليل المحلي.",
                "اختبار تجريبي شامل لإرسال الشكاوى والمواعيد."
            ]
        },
        {
            "num": "المرحلة الرابعة",
            "title": "الإطلاق الرسمي والتوعية",
            "points": [
                "الإعلان الرسمي لأهالي بدنايل والمغتربين.",
                "نشر أدلة وفيديوهات توضيحية عبر وسائل التواصل.",
                "بدء استقبال واستلام معاملات المواطنين رقمياً."
            ]
        }
    ]

    st_w11 = Inches(2.75)
    st_gap11 = Inches(0.24)
    for i, stg in enumerate(stages):
        x = Inches(0.8) + i * (stg["num_w"] if "num_w" in stg else st_w11 + st_gap11)
        scard = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8) + i * (st_w11 + st_gap11), Inches(1.8), st_w11, Inches(3.65))
        scard.fill.solid()
        scard.fill.fore_color.rgb = COLOR_CARD_BG
        scard.line.color.rgb = COLOR_CARD_BORDER
        scard.line.width = Pt(1)

        shead = slide11.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8) + i * (st_w11 + st_gap11), Inches(1.8), st_w11, Inches(0.85))
        shead.fill.solid()
        shead.fill.fore_color.rgb = COLOR_PRIMARY if i % 2 == 0 else COLOR_SECONDARY
        shead.line.fill.background()
        stf11 = shead.text_frame
        stf11.word_wrap = True
        sp1 = stf11.paragraphs[0]
        sp1.text = stg["num"]
        apply_rtl(sp1, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=11, bold=True, color=COLOR_ACCENT)

        sp2 = stf11.add_paragraph()
        sp2.text = stg["title"]
        apply_rtl(sp2, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=12, bold=True, color=COLOR_WHITE)

        sbox = slide11.shapes.add_textbox(Inches(0.8) + i * (st_w11 + st_gap11) + Inches(0.12), Inches(2.75), st_w11 - Inches(0.24), Inches(2.6))
        stf_box = sbox.text_frame
        stf_box.word_wrap = True
        for k, pt in enumerate(stg["points"]):
            p = stf_box.paragraphs[0] if k == 0 else stf_box.add_paragraph()
            p.text = f"• {pt}\n"
            apply_rtl(p, align=PP_ALIGN.RIGHT, font_name="Arial", size_pt=10.5, bold=False, color=COLOR_TEXT_DARK)

    final_banner11 = slide11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.65), Inches(11.733), Inches(1.15))
    final_banner11.fill.solid()
    final_banner11.fill.fore_color.rgb = COLOR_PRIMARY
    final_banner11.line.color.rgb = COLOR_ACCENT
    final_banner11.line.width = Pt(1.5)
    fbtf11 = final_banner11.text_frame
    fbtf11.word_wrap = True
    fbp1_11 = fbtf11.paragraphs[0]
    fbp1_11.text = "بلدية بدنايل نحو مستقبل رقمي واعد يخدم المجتمع ويرتقي بالبلدة"
    apply_rtl(fbp1_11, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=14, bold=True, color=COLOR_ACCENT)

    fbp2_11 = fbtf11.add_paragraph()
    fbp2_11.text = "شكراً لحسن استماعكم واهتمامكم — مستعدون للرد على كافة الاستفسارات والملاحظات"
    apply_rtl(fbp2_11, align=PP_ALIGN.CENTER, font_name="Arial", size_pt=12, bold=False, color=COLOR_WHITE)

    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    out_file = r"c:\Users\Mo\Desktop\university\my own projects\baladiye-react\Bednayel_Municipality_Presentation_V2.pptx"
    if len(sys.argv) > 1:
        out_file = sys.argv[1]
    create_presentation(out_file)
