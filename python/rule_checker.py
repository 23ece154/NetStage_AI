#!/usr/bin/env python3
"""
NetSage AI - Deterministic Rule Checker
Analyzes Cisco CLI show outputs and symptoms to identify common configuration errors
prior to or alongside AI LLM diagnosis.
"""

import sys
import json
import re
from typing import List, Dict, Any

class DeterministicRuleChecker:
    """
    Deterministic rule engine for parsing Packet Tracer / Cisco IOS show command outputs.
    """

    def __init__(self):
        self.rules = [
            self.check_interface_down,
            self.check_subnet_mask_mismatch,
            self.check_gateway_mismatch,
            self.check_duplicate_ip,
            self.check_missing_vlan_or_trunk,
            self.check_missing_routes,
            self.check_acl_misconfiguration,
            self.check_nat_misconfiguration,
            self.check_dhcp_dns_issues,
            self.check_routing_protocol_mismatch,
        ]

    def analyze_case(self, case: Dict[str, Any]) -> List[Dict[str, str]]:
        """
        Runs all deterministic checks on a given lab case dictionary.
        Returns a list of detected rule violation objects.
        """
        findings = []
        show_outputs = case.get("show_outputs", "")
        symptom = case.get("symptom", "")
        topology = case.get("topology_note", "")
        combined_text = f"{symptom}\n{topology}\n{show_outputs}"

        for rule_func in self.rules:
            result = rule_func(combined_text, show_outputs, case)
            if result:
                findings.extend(result if isinstance(result, list) else [result])

        return findings

    def check_interface_down(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        if "administratively down" in show_outputs.lower():
            findings.append({
                "rule_id": "RULE-PHYS-01",
                "severity": "CRITICAL",
                "osi_layer": "Layer 1/2",
                "category": "Interface Status",
                "description": "Physical or subinterface is administratively down.",
                "remediation": "Enter interface configuration mode and execute 'no shutdown'."
            })
        return findings

    def check_subnet_mask_mismatch(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        if "255.255.255.0" in combined_text and "255.255.255.128" in combined_text:
            findings.append({
                "rule_id": "RULE-IP-02",
                "severity": "HIGH",
                "osi_layer": "Layer 3",
                "category": "IP Address / Subnet",
                "description": "Subnet mask mismatch detected across hosts in the same logical subnet.",
                "remediation": "Align host subnet masks to match network design (e.g. 255.255.255.0)."
            })
        return findings

    def check_gateway_mismatch(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        gw_match = re.search(r"Default Gateway:\s*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)", combined_text)
        ip_match = re.search(r"GigabitEthernet0/0/0\s+([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)", combined_text)
        if gw_match and ip_match:
            if gw_match.group(1) != ip_match.group(1):
                findings.append({
                    "rule_id": "RULE-IP-01",
                    "severity": "HIGH",
                    "osi_layer": "Layer 3",
                    "category": "Default Gateway",
                    "description": f"Host Default Gateway ({gw_match.group(1)}) does not match router interface IP ({ip_match.group(1)}).",
                    "remediation": f"Update client network configuration default gateway to {ip_match.group(1)}."
                })
        return findings

    def check_duplicate_ip(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        if "Duplicate IP address alert" in combined_text or ("show ip dhcp binding" in show_outputs and "Statically configured" in combined_text):
            if "ip dhcp excluded-address" not in show_outputs:
                findings.append({
                    "rule_id": "RULE-IP-03",
                    "severity": "HIGH",
                    "osi_layer": "Layer 3",
                    "category": "IP Conflict / DHCP",
                    "description": "Static IP assigned to device without excluding it from DHCP server pool.",
                    "remediation": "Add 'ip dhcp excluded-address <IP>' on router to prevent DHCP pool overlaps."
                })
        return findings

    def check_missing_vlan_or_trunk(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        # Native VLAN Mismatch
        if "Native VLAN mismatch" in combined_text or ("Native Mode VLAN: 10" in show_outputs and "Native Mode VLAN: 20" in show_outputs):
            findings.append({
                "rule_id": "RULE-L2-01",
                "severity": "HIGH",
                "osi_layer": "Layer 2",
                "category": "VLAN & Trunking",
                "description": "Native VLAN mismatch detected on inter-switch trunk link.",
                "remediation": "Configure matching native VLANs on both switch trunk ports ('switchport trunk native vlan <id>')."
            })
        
        # Allowed VLAN List Missing
        if "Vlans allowed on trunk" in show_outputs:
            if "1-10,20" in show_outputs and "VLAN 30" in combined_text:
                findings.append({
                    "rule_id": "RULE-L2-02",
                    "severity": "HIGH",
                    "osi_layer": "Layer 2",
                    "category": "VLAN Pruning",
                    "description": "Destination VLAN is pruned/missing from trunk allowed VLAN list.",
                    "remediation": "Execute 'switchport trunk allowed vlan add <vlan_id>' on trunk interface."
                })
        
        # Dynamic Auto Negotiation Failure
        if "dynamic auto" in show_outputs and show_outputs.count("dynamic auto") >= 2:
            findings.append({
                "rule_id": "RULE-L2-03",
                "severity": "MEDIUM",
                "osi_layer": "Layer 2",
                "category": "DTP Trunking",
                "description": "Dynamic Trunking Protocol (DTP) stuck in access mode because both ends are 'dynamic auto'.",
                "remediation": "Set at least one interface to 'switchport mode dynamic desirable' or 'switchport mode trunk'."
            })
        return findings

    def check_missing_routes(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        if "Gateway of last resort is not set" in show_outputs:
            findings.append({
                "rule_id": "RULE-L3-01",
                "severity": "CRITICAL",
                "osi_layer": "Layer 3",
                "category": "Routing Table",
                "description": "Gateway of last resort is not set; router lacks a default route to external networks.",
                "remediation": "Configure default static route: 'ip route 0.0.0.0 0.0.0.0 <exit-interface|next-hop>'."
            })
        return findings

    def check_acl_misconfiguration(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        if "Extended IP access list" in show_outputs or "Standard IP access list" in show_outputs:
            if "deny ip any any" in show_outputs and "permit" in show_outputs:
                deny_idx = show_outputs.find("deny ip any any")
                permit_idx = show_outputs.rfind("permit")
                if deny_idx < permit_idx and deny_idx != -1:
                    findings.append({
                        "rule_id": "RULE-ACL-01",
                        "severity": "CRITICAL",
                        "osi_layer": "Layer 4",
                        "category": "Access Control List",
                        "description": "ACL line order error: 'deny ip any any' precedes permit statements, rendering them unreachable.",
                        "remediation": "Re-order ACL sequence numbers so permit statements appear above global deny."
                    })
            if "eq www" in show_outputs and "eq 443" not in show_outputs and "HTTPS" in combined_text:
                findings.append({
                    "rule_id": "RULE-ACL-02",
                    "severity": "HIGH",
                    "osi_layer": "Layer 4",
                    "category": "Access Control List",
                    "description": "ACL permits HTTP (port 80) but lacks permit for HTTPS (port 443), triggering implicit deny.",
                    "remediation": "Add rule: 'permit tcp <src> <dst> eq 443' to ACL."
                })
            if "ip access-group" in show_outputs and "out" in show_outputs and "inbound interface" in combined_text.lower():
                findings.append({
                    "rule_id": "RULE-ACL-03",
                    "severity": "HIGH",
                    "osi_layer": "Layer 3/4",
                    "category": "ACL Direction",
                    "description": "ACL applied in wrong interface direction ('out' instead of 'in').",
                    "remediation": "Remove outbound group and re-apply using 'ip access-group <ACL> in'."
                })
        return findings

    def check_nat_misconfiguration(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        if "Inside interfaces:\n  (None)" in show_outputs:
            findings.append({
                "rule_id": "RULE-NAT-01",
                "severity": "HIGH",
                "osi_layer": "Layer 3",
                "category": "NAT Configuration",
                "description": "Missing 'ip nat inside' configuration on LAN interface.",
                "remediation": "Enter LAN interface config and execute 'ip nat inside'."
            })
        return findings

    def check_dhcp_dns_issues(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        if "no service dhcp" in show_outputs:
            findings.append({
                "rule_id": "RULE-DHCP-01",
                "severity": "HIGH",
                "osi_layer": "Layer 7",
                "category": "DHCP Service",
                "description": "DHCP server process is globally disabled on the router.",
                "remediation": "Execute 'service dhcp' in global configuration mode."
            })
        if "Utilization mark" in show_outputs and "100 / 0" in show_outputs:
            findings.append({
                "rule_id": "RULE-DHCP-02",
                "severity": "MEDIUM",
                "osi_layer": "Layer 7",
                "category": "DHCP Pool Exhaustion",
                "description": "DHCP IP pool is 100% full; no available lease slots for new clients.",
                "remediation": "Expand subnet mask range or decrease lease duration."
            })
        return findings

    def check_routing_protocol_mismatch(self, combined_text: str, show_outputs: str, case: Dict) -> List[Dict[str, str]]:
        findings = []
        if "Area ID 0.0.0.0" in show_outputs and "Area ID 0.0.0.1" in show_outputs:
            findings.append({
                "rule_id": "RULE-ROUTING-01",
                "severity": "HIGH",
                "osi_layer": "Layer 3",
                "category": "OSPF Adjacency",
                "description": "OSPF Area ID mismatch between neighboring router interfaces.",
                "remediation": "Configure matching OSPF area numbers on both router interfaces."
            })
        if "router eigrp 100" in show_outputs and "router eigrp 200" in show_outputs:
            findings.append({
                "rule_id": "RULE-ROUTING-02",
                "severity": "HIGH",
                "osi_layer": "Layer 3",
                "category": "EIGRP Adjacency",
                "description": "EIGRP Autonomous System (AS) number mismatch between neighbor routers.",
                "remediation": "Reconfigure EIGRP process to use matching AS number."
            })
        return findings


def run_standalone():
    """Reads dataset/cases.json and runs rule checker on all cases."""
    print("==================================================")
    print("   NetSage AI - Deterministic Rule Checker CLI   ")
    print("==================================================")
    
    import os
    possible_paths = [
        "dataset/cases.json",
        "../dataset/cases.json",
        os.path.join(os.path.dirname(__file__), "..", "dataset", "cases.json")
    ]
    
    cases = None
    for p in possible_paths:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                cases = json.load(f)
            break
            
    if not cases:
        print("Error: Could not locate dataset/cases.json")
        sys.exit(1)

    checker = DeterministicRuleChecker()
    total_cases = len(cases)
    cases_with_hits = 0
    total_hits = 0

    print(f"Loaded {total_cases} lab troubleshooting cases from dataset.\n")

    for case in cases:
        findings = checker.analyze_case(case)
        if findings:
            cases_with_hits += 1
            total_hits += len(findings)
            print(f"[{case['case_id']}] {case['symptom'][:70]}...")
            for f_item in findings:
                print(f"   -> [{f_item['rule_id']}] [{f_item['severity']}] {f_item['description']}")
            print()

    print("--------------------------------------------------")
    print(f"Rule Checker Analysis Complete.")
    print(f"Total Cases Checked: {total_cases}")
    print(f"Cases with Deterministic Rule Matches: {cases_with_hits}")
    print(f"Total Rule Violations Detected: {total_hits}")
    print("==================================================")

if __name__ == "__main__":
    run_standalone()
