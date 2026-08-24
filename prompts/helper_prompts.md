# NetSage AI - Helper Prompt Library

## Prompt 1: Rule Checker Validation Prompt
**Purpose**: Instructs the LLM to validate the output of the deterministic Python rule checker against raw CLI outputs to catch subtle syntax edge cases.

```markdown
You are a Cisco CLI Rule Validator.
Below is the raw show command output and the findings from our deterministic Python rule checker.

Raw CLI Output:
{{SHOW_OUTPUTS}}

Deterministic Checker Findings:
{{RULE_CHECKER_FINDINGS}}

Tasks:
1. Confirm if the rule checker hit is valid based on raw CLI evidence.
2. Flag any false positives or false negatives.
3. Output JSON with: {"rule_valid": true|false, "rule_id": string, "notes": string}
```

---

## Prompt 2: Fix Remediation & CLI Verification Prompt
**Purpose**: Formats exact Cisco CLI configuration commands for copy-paste execution into Packet Tracer terminal.

```markdown
You are a Cisco IOS Configuration Remediation Expert.
Given the approved diagnosis and human reviewer notes, generate the exact sequence of Cisco IOS commands to apply in Packet Tracer.

Inputs:
Root Cause: {{ROOT_CAUSE}}
Human Reviewer Notes: {{HUMAN_NOTES}}
Device Target: {{DEVICE_NAME}}

Instructions:
- Include global configuration commands (`configure terminal`).
- Specify exact interface sub-modes (`interface GigabitEthernet0/0/1`, `router ospf 1`).
- Include verification command at the end (`show ip route`, `show access-lists`, `show vlan brief`).

Output Format:
```cisco
{{DEVICE_NAME}}# configure terminal
...
{{DEVICE_NAME}}# copy running-config startup-config
```
```

---

## Prompt 3: Responsible AI Audit Classifier
**Purpose**: Categorizes human review corrections to log AI hallucination modes.

```markdown
Analyze the difference between the AI Initial Diagnosis and the Human Corrected Diagnosis.

AI Diagnosis:
{{AI_DIAGNOSIS}}

Human Corrected Diagnosis:
{{HUMAN_DIAGNOSIS}}

Classify the AI error mode into one of the following:
- HALLUCINATED_COMMAND (AI suggested a non-existent command or syntax)
- WRONG_OSI_LAYER (AI confused Layer 2 trunking with Layer 3 routing)
- INCOMPLETE_FIX (AI fixed one component but missed secondary requirement)
- INVERTED_SYNTAX (AI inverted wildcard mask or IP range)
- MISSED_RULE_CHECK (AI ignored obvious rule checker warning)

Output JSON:
{
  "error_category": string,
  "severity": "High | Medium | Low",
  "root_cause_explanation": string,
  "prevention_recommendation": string
}
```
