"""
Vision Audit — System Image Accuracy Check (Python port)

For each system with a non-null imageUrl, uses GPT-4o vision to ask:
"Does this image actually show [system name]?"

Usage: python3 scripts/vision-audit-images.py
"""

import json, os, sys, time
from urllib.parse import urlparse

# Load .env.local
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, _, val = line.partition('=')
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            os.environ.setdefault(key, val)

DATABASE_URL = os.environ.get('DATABASE_URL', '')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')

if not DATABASE_URL:
    print("FATAL: DATABASE_URL not set", file=sys.stderr)
    sys.exit(1)
if not OPENAI_API_KEY:
    print("FATAL: OPENAI_API_KEY not set", file=sys.stderr)
    sys.exit(1)

# Parse DATABASE_URL for psycopg2 — strip pgbouncer param
db_url = DATABASE_URL
if '?pgbouncer=true' in db_url:
    db_url = db_url.replace('?pgbouncer=true', '')
import psycopg2

import openai
client = openai.OpenAI(api_key=OPENAI_API_KEY)

DELAY_S = 1.2

def audit_image(name, slug, image_url):
    """Ask GPT-4o: does this image show the named system?"""
    try:
        resp = client.chat.completions.create(
            model='gpt-4o',
            max_tokens=150,
            messages=[{
                'role': 'user',
                'content': [
                    {'type': 'image_url', 'image_url': {'url': image_url, 'detail': 'low'}},
                    {'type': 'text', 'text': (
                        f'This image is supposed to show the military/defense system called "{name}" (slug: {slug}).\n\n'
                        f'Does the image actually depict this system — the actual hardware, vehicle, weapon, or equipment itself?\n\n'
                        f'Reply with exactly one of:\n'
                        f'PASS — image clearly shows the correct system\n'
                        f'FAIL — image does not show this system (shows something else, wrong equipment, unrelated)\n'
                        f'UNCERTAIN — hard to tell (image is generic, shows soldiers/scene without the specific system visible)\n\n'
                        f'Then one sentence of reasoning. Format: "PASS|FAIL|UNCERTAIN: <reason>"'
                    )}
                ]
            }]
        )
        text = resp.choices[0].message.content.strip() if resp.choices[0].message.content else ''
        import re
        m = re.match(r'^(PASS|FAIL|UNCERTAIN):\s*(.+)$', text, re.IGNORECASE)
        if m:
            return m.group(1).upper(), m.group(2)
        return 'UNCERTAIN', text[:120]
    except Exception as e:
        return 'ERROR', str(e)[:200]

def main():
    print('=== DroneWire Vision Image Audit (Python) ===\n')

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("""
        SELECT slug, name, image_url
        FROM "System"
        WHERE image_url IS NOT NULL
        ORDER BY name ASC
    """)
    systems = [(r[0], r[1], r[2]) for r in cur.fetchall()]
    cur.close()

    print(f'Systems with images: {len(systems)}\n')

    results = []
    counts = {'PASS': 0, 'FAIL': 0, 'UNCERTAIN': 0, 'ERROR': 0}

    for i, (slug, name, image_url) in enumerate(systems):
        print(f'[{i+1}/{len(systems)}] {name}... ', end='', flush=True)
        verdict, reason = audit_image(name, slug, image_url)
        results.append({'slug': slug, 'name': name, 'imageUrl': image_url, 'verdict': verdict, 'reason': reason})
        counts[verdict] += 1

        emoji = {'PASS': '✅', 'FAIL': '❌', 'UNCERTAIN': '⚠️', 'ERROR': '💥'}[verdict]
        print(f'{emoji} {verdict} — {reason}')

        if i < len(systems) - 1:
            time.sleep(DELAY_S)

    conn.close()

    print('\n=== Summary ===')
    print(f'  ✅ PASS:      {counts["PASS"]}')
    print(f'  ❌ FAIL:      {counts["FAIL"]}')
    print(f'  ⚠️  UNCERTAIN: {counts["UNCERTAIN"]}')
    print(f'  💥 ERROR:     {counts["ERROR"]}')
    print(f'  Total:        {len(systems)}')

    needs_action = [r for r in results if r['verdict'] in ('FAIL', 'UNCERTAIN')]
    if needs_action:
        print('\n--- FAIL / UNCERTAIN LIST (action needed) ---')
        for r in needs_action:
            print(f"  [{r['verdict']}] {r['name']} ({r['slug']})")
            print(f"         {r['reason']}")
            print(f"         {r['imageUrl']}")

    # Write full results
    out_path = '/tmp/vision-audit-results.json'
    with open(out_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f'\nFull results saved to: {out_path}')

if __name__ == '__main__':
    main()
