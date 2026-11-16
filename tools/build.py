#!/usr/bin/env python3
"""Собирает index.html и catalog.html из частей в src/.
Запуск: python3 tools/build.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
part = lambda name: (SRC / name).read_text(encoding="utf-8")

PAGES = [
    {
        "out": "index.html", "body": "page-index.html", "page": "home", "path": "",
        "title": "БалТактика — баллистическая защита и тактическое снаряжение",
        "desc": "Российский производитель: бронежилеты, жилеты скрытого ношения, бронепанели и кевларовые стельки. Сертификация EAC. Москва.",
    },
    {
        "out": "catalog.html", "body": "page-catalog.html", "page": "catalog", "path": "catalog.html",
        "title": "Магазин — БалТактика",
        "desc": "Каталог БалТактики: бронежилеты, жилеты скрытого ношения, бронепанели, кевларовые стельки, баллистические ткани.",
    },
]

for p in PAGES:
    head = (part("head.html").replace("{{TITLE}}", p["title"]).replace("{{DESC}}", p["desc"])
            .replace("{{PATH}}", p["path"]).replace("{{PAGE}}", p["page"]))
    html = "\n".join([
        head, part("header.html"), part(p["body"]), part("footer.html"),
        part("overlays.html"), part("sprite.html"),
        '<script src="assets/js/main.js"></script>\n</body>\n</html>\n',
    ])
    (ROOT / p["out"]).write_text(html, encoding="utf-8")
    print("built", p["out"])
