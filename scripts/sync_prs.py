"""Pull live state for tracked pull requests and rewrite the README section
between the PR-STATUS markers. Run by .github/workflows/sync-readme.yml.
"""

import json
import os
import re
import urllib.request

README = os.path.join(os.path.dirname(__file__), "..", "README.md")
START = "<!--PR-STATUS:START-->"
END = "<!--PR-STATUS:END-->"

# (owner/repo, number, one-line description)
TRACKED = [
    ("matplotlib/matplotlib", 31844, "Snap near-integer arc windings to a full circle on polar plots"),
    ("plotly/plotly.js", 7837, "Fix `fitbounds` to pick the compact side of the globe across the antimeridian"),
    ("scipy/scipy", 25355, "`stats.linregress` now warns and returns NaN on constant input instead of garbage"),
    ("keras-team/keras", 23093, "Fix `ops.normalize` producing NaN gradients for zero vectors"),
    ("pandas-dev/pandas", 65841, "Fix `Categorical.map()` erroring when categories are mapped to tuples"),
]

TOKEN = os.environ.get("GITHUB_TOKEN")


def fetch(repo, number):
    url = f"https://api.github.com/repos/{repo}/pulls/{number}"
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.load(resp)


def status_label(pr):
    if pr.get("merged_at"):
        return "merged"
    if pr.get("state") == "closed":
        return "closed"
    return "open"


def render():
    lines = []
    for repo, number, desc in TRACKED:
        pr = fetch(repo, number)
        label = status_label(pr)
        lines.append(f"- **[{repo}#{number}]({pr['html_url']})** — *{label}*. {desc}")
    return "\n".join(lines)


def main():
    with open(README, "r", encoding="utf-8") as f:
        content = f.read()

    body = render()
    pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
    replacement = f"{START}\n{body}\n{END}"
    new_content = pattern.sub(replacement, content)

    with open(README, "w", encoding="utf-8") as f:
        f.write(new_content)


if __name__ == "__main__":
    main()
