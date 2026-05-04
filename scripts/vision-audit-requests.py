"""
Vision Audit — GPT-4o via requests (zero native deps)
Reads /tmp/dronewire-systems-for-audit.json, outputs /tmp/vision-audit-results.json
"""

import json, os, re, sys, time

# --- Load .env.local ---
env_path = os.path.expanduser('~/projects/drone_wire/app/.env.local')
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, _, val = line.partition('=')
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            os.environ.setdefault(key, val)

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
API_URL = 'https://api.openai.com/v1/chat/completions'
DELAY_S = 1.2

def audit_image(name, slug, image_url):
    """Call GPT-4o vision API via raw requests."""
    payload = {
        'model': 'gpt-4o',
        'max_tokens': 150,
        'messages': [{
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
    }
    try:
        import requests
        resp = requests.post(
            API_URL,
            headers={'Authorization': f'Bearer {OPENAI_API_KEY}', 'Content-Type': 'application/json'},
            json=payload,
            timeout=45
        )
        resp.raise_for_status()
        data = resp.json()
        text = data['choices'][0]['message']['content'].strip()
        m = re.match(r'^(PASS|FAIL|UNCERTAIN):\s*(.+)$', text, re.IGNORECASE)
        if m:
            return m.group(1).upper(), m.group(2)
        return 'UNCERTAIN', text[:120]
    except Exception as e:
        return 'ERROR', str(e)[:200]

def main():
    print('=== DroneWire Vision Image Audit (requests) ===\n')

    # Load systems from dump
    with open('/tmp/dronewire-systems-for-audit.json') as f:
        systems = json.load(f)

    print(f'Systems with images: {len(systems)}\n')

    results = []
    counts = {'PASS': 0, 'FAIL': 0, 'UNCERTAIN': 0, 'ERROR': 0}

    for i, s in enumerate(systems):
        slug, name, image_url = s['slug'], s['name'], s['imageUrl']
        print(f'[{i+1}/{len(systems)}] {name}... ', end='', flush=True)
        verdict, reason = audit_image(name, slug, image_url)
        results.append({'slug': slug, 'name': name, 'imageUrl': image_url, 'verdict': verdict, 'reason': reason})
        counts[verdict] += 1

        emoji = {'PASS': '✅', 'FAIL': '❌', 'UNCERTAIN': '⚠️', 'ERROR': '💥'}[verdict]
        print(f'{emoji} {verdict} — {reason}')

        if i < len(systems) - 1:
            time.sleep(DELAY_S)

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

    # Write results
    out_path = '/tmp/vision-audit-results.json'
    with open(out_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f'\nFull results saved to: {out_path}')

    # Exit code reflects if there's work to do
    if counts['FAIL'] > 0 or counts['ERROR'] > 0:
        print(f'\n⚠️  {counts["FAIL"]} FAIL + {counts["ERROR"]} ERROR — action required')
        sys.exit(1)
    elif counts['UNCERTAIN'] > 0:
        print(f'\nℹ️  {counts["UNCERTAIN"]} uncertain — manual review suggested')
        sys.exit(0)
    else:
        print('\n🎉 All images passed!')
        sys.exit(0)

if __name__ == '__main__':
    main()
