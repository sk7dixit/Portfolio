import json
import re

transcript_path = r"C:\Users\Shashwat\.gemini\antigravity\brain\97060f31-3e12-425d-8ae8-e772170b0449\.system_generated\logs\transcript.jsonl"

def clean_file_content(content):
    lines = content.split('\n')
    cleaned_lines = []
    for line in lines:
        match = re.match(r'^\s*(\d+):\s(.*)$', line)
        if match:
            cleaned_lines.append(match.group(2))
        else:
            if not line.startswith("Showing lines") and not line.startswith("The following code") and not line.startswith("Total Lines") and not line.startswith("Total Bytes") and not line.startswith("File Path") and not line.startswith("Created At:") and not line.startswith("Completed At:"):
                cleaned_lines.append(line)
    return '\n'.join(cleaned_lines)

about_tab_versions = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get("type") in ["VIEW_FILE", "CODE_ACTION"]:
                content = data.get("content", "")
                if "AboutTab.tsx" in content and "def clean_file_content" not in content and "transcript_path =" not in content and "[diff_block_start]" not in content:
                    cleaned = clean_file_content(content)
                    if "export default function AboutTab" in cleaned:
                        about_tab_versions.append(cleaned)
        except Exception:
            pass

print(f"Found {len(about_tab_versions)} versions of AboutTab.tsx")
if len(about_tab_versions) > 0:
    print("Latest version preview:")
    print(about_tab_versions[-1][:500])
    
    with open(r"s:\Portfolio\sd-frontend\src\components\tabs\AboutTab.tsx", "w", encoding="utf-8") as out_f:
        out_f.write(about_tab_versions[-1].strip() + '\n')
