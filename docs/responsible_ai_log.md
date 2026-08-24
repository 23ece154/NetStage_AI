# NetSage AI - Responsible AI Audit Log

## Executive Summary
In compliance with the **Cisco Responsible AI Principles** and project safety guardrails, NetSage AI enforces a mandatory **Human-in-the-Loop (HITL)** oversight protocol. While large language models (LLMs) accelerate network troubleshooting by parsing lengthy `show` command outputs, AI models can hallucinate Cisco IOS syntax, confuse Layer 2 vs. Layer 3 root causes, or suggest destructive commands.

This log details **5 specific lab cases** where the initial AI diagnosis was flagged, corrected, or rejected by human network engineers during Packet Tracer evaluation.

---

## Logged Correction Cases

### Case 1: Inverted Wildcard Mask in Standard ACL (NET-0023)
- **Symptom:** Host 192.168.1.50 needs dedicated admin access, but configuring the ACL blocks all hosts on the subnet.
- **Initial AI Diagnosis:**
  - *Root Cause:* "The standard ACL requires wildcard mask 255.255.255.255 for host 192.168.1.50."
  - *Proposed CLI Fix:* `access-list 10 permit 192.168.1.50 255.255.255.255`
  - *AI Confidence:* High
- **Human Reviewer Action:** **EDITED & CORRECTED**
- **Human Correction Notes:**
  > AI confused subnet mask syntax with wildcard mask syntax. In Cisco IOS standard ACLs, `255.255.255.255` means match ANY host bit (equivalent to `permit any`). A single host match requires wildcard `0.0.0.0` or `host 192.168.1.50`. Applying the AI's suggested command would open the network to all hosts instead of restricting to 192.168.1.50.
- **Corrected CLI Fix:**
  ```cisco
  Router-1(config)# access-list 10 permit host 192.168.1.50
  ```
- **Safety Lesson / Guardrail Improvement:** Add a regex deterministic check for standard ACL wildcard masks matching `255.255.255.255` on single host statements.

---

### Case 2: Misinterpreting VLAN Pruning as Routing Protocol Failure (NET-0001)
- **Symptom:** PC-1 in VLAN 10 cannot ping Server-1 in VLAN 30. Subinterface pings work fine.
- **Initial AI Diagnosis:**
  - *Root Cause:* "Router subinterface GigabitEthernet0/0/1.30 is missing OSPF area configuration."
  - *Proposed CLI Fix:* `router ospf 1 \n network 192.168.30.0 0.0.0.255 area 0`
  - *AI Confidence:* Medium
- **Human Reviewer Action:** **REJECTED**
- **Human Correction Notes:**
  > The topology is a single Router-on-a-Stick inter-VLAN setup. OSPF is not used or needed here. The actual root cause from `show interfaces trunk` on Switch-1 is that VLAN 30 is absent from the allowed trunk VLAN list (`Fa0/24 allowed 1-10,20`). The AI hallucinated a Layer 3 routing protocol issue when the root cause was Layer 2 trunk pruning.
- **Corrected Diagnosis:**
  ```cisco
  Switch-1(config)# interface FastEthernet0/24
  Switch-1(config-if)# switchport trunk allowed vlan add 30
  ```
- **Safety Lesson / Guardrail Improvement:** Enforce Layer 2 trunk verification before suggesting Layer 3 routing protocol changes in subinterface topologies.

---

### Case 3: Wrong Interface Direction on Inbound ACL (NET-0022)
- **Symptom:** Guest Wi-Fi subnet (172.16.99.0/24) can still access corporate LAN (10.0.0.0/8) despite ACL existing.
- **Initial AI Diagnosis:**
  - *Root Cause:* "ACL BLOCK_GUEST needs to be created on Router-GW."
  - *Proposed CLI Fix:* `ip access-list extended BLOCK_GUEST \n deny ip 172.16.99.0 0.0.0.255 10.0.0.0 0.255.255.255`
  - *AI Confidence:* High
- **Human Reviewer Action:** **EDITED**
- **Human Correction Notes:**
  > The ACL `BLOCK_GUEST` already exists on the router, but it was applied in the outbound direction on GigabitEthernet0/0/1 (`ip access-group BLOCK_GUEST out`). Traffic coming FROM the guest Wi-Fi enters the router on Gi0/0/1, so the ACL must be applied INBOUND (`in`). AI missed the direction mistake in `show running-config interface`.
- **Corrected CLI Fix:**
  ```cisco
  Router-GW(config)# interface GigabitEthernet0/0/1
  Router-GW(config-if)# no ip access-group BLOCK_GUEST out
  Router-GW(config-if)# ip access-group BLOCK_GUEST in
  ```
- **Safety Lesson / Guardrail Improvement:** Prompt engine must compare `in` vs `out` keyword against ingress/egress interface roles in topology notes.

---

### Case 4: Overtightened Subnet Mask Expansion (NET-0012)
- **Symptom:** Wireless guest clients fail to connect during peak hours; DHCP lease errors logged.
- **Initial AI Diagnosis:**
  - *Root Cause:* "DHCP server process crashed. Restart service dhcp."
  - *Proposed CLI Fix:* `no service dhcp \n service dhcp`
  - *AI Confidence:* Low
- **Human Reviewer Action:** **EDITED**
- **Human Correction Notes:**
  > Restarting the DHCP service would temporarily disconnect all existing active leases and does not solve the root cause. `show ip dhcp pool GUEST_POOL` shows utilization is 100% (14 out of 14 leased) because the subnet mask was configured as `/28` (255.255.255.240). The fix is to reconfigure the DHCP pool with a `/24` subnet.
- **Corrected CLI Fix:**
  ```cisco
  Router-WIFI(config)# ip dhcp pool GUEST_POOL
  Router-WIFI(dhcp-config)# network 192.168.100.0 255.255.255.0
  ```
- **Safety Lesson / Guardrail Improvement:** Warn reviewers when AI recommends service restarts (`no service dhcp` / `reload`) instead of config scope adjustments.

---

### Case 5: Case-Sensitivity Sensitivity in WPA2 Key (NET-0029)
- **Symptom:** Laptops fail authentication on WLC SSID 'Cisco-Corp'.
- **Initial AI Diagnosis:**
  - *Root Cause:* "WLC Access Point radio transmitter hardware fault. Replace AP-1."
  - *Proposed Fix:* Hardware RMA replacement.
  - *AI Confidence:* Low
- **Human Reviewer Action:** **REJECTED**
- **Human Correction Notes:**
  > The AI suggested replacing physical hardware for a software pre-shared key typo! Inspecting `show wlan 1` on the WLC reveals PSK is `Cisco12345!` (capital 'C'), whereas the laptop client was configured with `cisco12345!` (lowercase 'c'). Correcting the password on the laptop resolved authentication immediately.
- **Corrected Fix:** Update laptop wireless profile password to match WLC (`Cisco12345!`).
- **Safety Lesson / Guardrail Improvement:** Prohibit hardware failure conclusions unless diagnostic commands (`show inventory`, `show environment`) explicitly confirm physical failure.

---

## Human Review Agreement Metrics
| Review Action | Count | Percentage | Primary Error Mode Caught |
|---------------|-------|------------|---------------------------|
| **Accepted** | 22 | 73.3% | None (Correct AI inference) |
| **Edited** | 5 | 16.7% | Incomplete CLI commands, Wrong Direction, Subnet Mask typo |
| **Rejected** | 3 | 10.0% | Layer 2 vs 3 confusion, Hardware hallucination |
| **Total** | **30** | **100.0%** | **100% Human Oversight Enforced** |
