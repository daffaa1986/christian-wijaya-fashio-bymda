#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Bidirectional CSS selector verification.

  A. CSS class selectors that match nothing in any page or in script.js
     -> dead CSS
  B. Class names used in the markup that have no CSS rule at all
     -> unstyled markup
  C. id selectors in CSS that do not exist in any page
  D. Structural integrity: brace balance, duplicate tokens,
     stray inline styles
"""
import io, os, re, sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # project root

PAGES = ["index.html", "shop.html", "collections.html", "product.html",
         "cart.html", "checkout.html", "confirmation.html", "wishlist.html",
         "promotion.html", "about.html"]

read = lambda p: io.open(os.path.join(ROOT, p), encoding="utf-8").read()

css = read("style.css")
js = read("script.js")
pages = {p: read(p) for p in PAGES}
markup_all = "\n".join(pages.values())

# Selectors are only real when they are not prose and not payload.
#   - a CSS comment may contain "(e.g. .thing)" or a sample value
#   - a url("data:image/svg+xml,...www.w3.org...") is not a selector
# Scan the stripped source so those cannot masquerade as class selectors.
css_scan = re.sub(r"/\*.*?\*/", " ", css, flags=re.S)
css_scan = re.sub(r"url\(\s*['\"]?[^)]*\)", " ", css_scan, flags=re.I)

fail = 0
def line(m): print("  " + m)

# ---- tokenise a class attribute list, ignoring stray punctuation ------------
def clean_classes(blob):
    out = []
    for tok in blob.split():
        tok = tok.strip("\"'`(),;")
        # a real BEM-ish class name only
        if re.fullmatch(r"[a-zA-Z][a-zA-Z0-9_-]*", tok):
            out.append(tok)
    return out

print("=" * 72)
print("BIDIRECTIONAL SELECTOR VERIFICATION")
print("=" * 72)

# ---------------------------------------------------------------- A
print("\nA. CSS class selectors matching nothing (dead CSS)")
css_classes = sorted(set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css_scan)))
# markup classes: real HTML attributes, plus every class script.js applies.
# The second group matters as much as the first - the toast stack, the drawer
# and every "is-*" state flag exist only at runtime, so scanning class="..."
# alone reports them as dead CSS when nothing is wrong.
markup_classes = set()
for src in pages.values():
    for m in re.finditer(r'<[a-zA-Z][^>]*?\sclass="([^"]+)"', src):
        markup_classes.update(clean_classes(m.group(1)))
for m in re.finditer(r'class=\\?["\']([^"\'<>]+)', js):
    markup_classes.update(clean_classes(m.group(1)))
# class attributes built by concatenation inside script.js, e.g.
#   class="size" + (out ? ' is-out' : '')
# The plain class="..." rule above stops at the closing quote of the literal
# and never sees the conditional fragments, so walk the whole concatenated
# run and clean each fragment separately.
for m in re.finditer(r'class="([^"]*)"', js):
    # The run opens inside a string literal, so splitting on the quote gives
    # literal, code, literal, code... - the even pieces are the class names.
    # Naive findall pairing skips every other literal (" is-out" is lost) and
    # hands back code fragments instead, so take the even slices and then
    # require each to be nothing but class names.
    for frag in m.group(1).split("'")[0::2]:
        frag = frag.strip()
        if frag and re.fullmatch(r"[A-Za-z][\w-]*(?:[ \t]+[A-Za-z][\w-]*)*", frag):
            markup_classes.update(clean_classes(frag))
# className = 'toast' + (tone ? ' toast--' + tone : '')
for m in re.finditer(r"\.className\s*=\s*['\"]([^'\"]+)['\"]", js):
    markup_classes.update(clean_classes(m.group(1)))
# classList.add('is-invalid') / toggle / remove
for m in re.finditer(r"classList\.(?:add|remove|toggle)\(\s*['\"]([^'\"]+)['\"]", js):
    markup_classes.update(clean_classes(m.group(1)))
# classes concatenated at runtime, e.g. "'toast--' + tone"
for m in re.finditer(r"['\"]\s*([a-zA-Z][\w-]*)--['\"]\s*\+", js):
    markup_classes.add(m.group(1) + "--*")

# A "name--*" marker means script.js builds that family at runtime
# (e.g. 'toast--' + tone), so every concrete modifier counts as used.
runtime_families = [c[:-3] for c in markup_classes if c.endswith("--*")]

def is_covered(name):
    return any(name.startswith(f + "--") for f in runtime_families)

dead = [c for c in css_classes
        if c not in markup_classes
        and not is_covered(c)
        and not re.search(r"(?<![\w-])" + re.escape(c) + r"(?![\w-])", markup_all)]
if dead:
    fail += len(dead)
    for c in dead:
        line("DEAD SELECTOR  ." + c)
else:
    line("none - every class selector matches markup or script.js")

# ---------------------------------------------------------------- B
print("\nB. Markup classes with no CSS rule (unstyled markup)")
styled = set(css_classes)
IGNORE = {"is-active", "is-open", "is-visible", "is-shown", "is-locked",
          "is-free", "visually-hidden", "skip-link", "pdp__feedback"}
unstyled = sorted(c for c in markup_classes
                  if c not in styled and c not in IGNORE and not c.endswith("--*"))
if unstyled:
    fail += len(unstyled)
    for c in unstyled:
        line("UNSTYLED CLASS  ." + c)
else:
    line("none - every markup class has a CSS rule (or is a JS state flag)")

# ---------------------------------------------------------------- C
print("\nC. CSS id selectors with no matching id in any page")
# a real id selector is '#' NOT followed by a hex colour body
css_ids = set()
for m in re.finditer(r"#([a-zA-Z][a-zA-Z0-9_-]*)", css_scan):
    tok = m.group(0)
    body = m.group(1)
    if re.fullmatch(r"[0-9a-fA-F]{3}|[0-9a-fA-F]{6}", body):
        continue                      # hex colour, not an id
    if re.search(r"(^|[\s,>+~])" + re.escape(tok) + r"($|[\s,>+~:\[])", css_scan):
        css_ids.add(body)
static_ids = set()
for src in pages.values():
    static_ids.update(re.findall(r'\sid="([^"]+)"', src))
# ids created at runtime, either as markup or via the id property
dynamic_ids = set(re.findall(r'\sid="([^"$<]+)"', js))
dynamic_ids.update(re.findall(r"\.id\s*=\s*'([^']+)'", js))
missing = sorted(i for i in css_ids if i not in static_ids and i not in dynamic_ids)
if missing:
    fail += len(missing)
    for i in missing:
        line("MISSING ID      #" + i)
else:
    line("none - every id selector resolves (%d static, %d runtime)"
         % (len(css_ids & static_ids), len(css_ids & dynamic_ids)))

# ---------------------------------------------------------------- D
print("\nD. Structural integrity")
o, c = css.count("{"), css.count("}")
if o == c:
    line("brace balance      OK  (%d rules)" % o)
else:
    fail += 1
    line("brace balance      MISMATCH  %d open vs %d close" % (o, c))

dup_vars = defaultdict(list)
for m in re.finditer(r"^\s*(--[a-z0-9-]+)\s*:\s*([^;{}]+);", css, re.M):
    dup_vars[m.group(1)].append(m.group(2).strip())
dups = {k: v for k, v in dup_vars.items() if len(v) > 1}
if dups:
    fail += len(dups)
    for k, v in dups.items():
        line("DUPLICATE TOKEN   --%s x%d" % (k, len(v)))
else:
    line("tokens             no duplicates (%d defined)"
         % len(dup_vars))

inline = sum(len(re.findall(r'\sstyle="', s)) for s in pages.values())
if inline:
    fail += inline
    line("inline styles      %d found" % inline)
else:
    line("inline styles      0")

print("\n" + "=" * 72)
print("RESULT: %s" % ("FAIL - %d issue(s)" % fail if fail
                      else "PASS - no dead selectors, no unstyled markup, structure sound"))
print("=" * 72)
sys.exit(1 if fail else 0)