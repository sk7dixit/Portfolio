import json
import re
import os

log_paths = [
    r"C:\Users\Shashwat\.gemini\antigravity\brain\7b38ef1d-94ff-4c47-a2e9-e6baf715a45f\.system_generated\logs\transcript.jsonl",
    r"C:\Users\Shashwat\.gemini\antigravity\brain\97060f31-3e12-425d-8ae8-e772170b0449\.system_generated\logs\transcript.jsonl"
]

def clean_file_content(content):
    lines = content.split('\n')
    cleaned_lines = []
    for line in lines:
        match = re.match(r'^\s*(\d+):\s(.*)$', line)
        if match:
            cleaned_lines.append(match.group(2))
        else:
            if not line.startswith("Showing lines") and not line.startswith("The following code") and not line.startswith("Total Lines") and not line.startswith("Total Bytes") and not line.startswith("File Path") and not line.startswith("Created At:") and not line.startswith("Completed At:") and not line.startswith("The above content shows"):
                cleaned_lines.append(line)
    return '\n'.join(cleaned_lines)

about_versions = []
home_versions = []

for path in log_paths:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    data = json.loads(line)
                    if data.get("type") in ["VIEW_FILE", "CODE_ACTION"]:
                        content = data.get("content", "")
                        
                        if "AboutTab.tsx" in content and "def clean_file_content" not in content and "[diff_block_start]" not in content and "<truncated" not in content:
                            cleaned = clean_file_content(content)
                            if "export default function AboutTab" in cleaned:
                                about_versions.append(cleaned)
                                
                        if "HomeTab.tsx" in content and "def clean_file_content" not in content and "[diff_block_start]" not in content and "<truncated" not in content:
                            cleaned = clean_file_content(content)
                            if "export default function HomeTab" in cleaned:
                                home_versions.append(cleaned)
                except Exception:
                    pass

if about_versions:
    # Sort by length descending, pick the longest complete version
    about_versions.sort(key=len, reverse=True)
    best_about = about_versions[0]
    print(f"Restoring AboutTab.tsx (length: {len(best_about)})")
    with open(r"s:\Portfolio\sd-frontend\src\components\tabs\AboutTab.tsx", "w", encoding="utf-8") as f:
        f.write(best_about.strip() + '\n')

if home_versions:
    home_versions.sort(key=len, reverse=True)
    best_home = home_versions[0]
    print(f"Restoring HomeTab.tsx (length: {len(best_home)})")
    with open(r"s:\Portfolio\sd-frontend\src\components\tabs\HomeTab.tsx", "w", encoding="utf-8") as f:
        f.write(best_home.strip() + '\n')
