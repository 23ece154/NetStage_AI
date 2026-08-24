/**
 * Client-side Deterministic Rule Engine for NetSage AI
 * Evaluates Packet Tracer CLI outputs and symptoms against network rule base.
 */
export function runDeterministicRuleChecker(caseData) {
  const findings = [];
  const text = `${caseData.symptom || ''}\n${caseData.topology_note || ''}\n${caseData.show_outputs || ''}`;
  const show = caseData.show_outputs || '';

  // 1. Interface Admin Down
  if (show.toLowerCase().includes("administratively down")) {
    findings.push({
      rule_id: "RULE-PHYS-01",
      severity: "CRITICAL",
      osi_layer: "Layer 1/2",
      category: "Interface Status",
      description: "Physical interface or subinterface is administratively down (missing 'no shutdown').",
      remediation: "Execute 'no shutdown' under interface configuration mode."
    });
  }

  // 2. Subnet Mask Mismatch
  if (text.includes("255.255.255.0") && text.includes("255.255.255.128")) {
    findings.push({
      rule_id: "RULE-IP-02",
      severity: "HIGH",
      osi_layer: "Layer 3",
      category: "IP Subnetting",
      description: "Subnet mask mismatch detected between local hosts on the same logical segment.",
      remediation: "Reconfigure host subnet mask to match local gateway subnet."
    });
  }

  // 3. Default Gateway Mismatch
  const gwMatch = text.match(/Default Gateway:\s*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
  const ipMatch = text.match(/GigabitEthernet0\/0\/0\s+([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
  if (gwMatch && ipMatch && gwMatch[1] !== ipMatch[1]) {
    findings.push({
      rule_id: "RULE-IP-01",
      severity: "HIGH",
      osi_layer: "Layer 3",
      category: "Default Gateway",
      description: `Client default gateway (${gwMatch[1]}) does not match local router IP (${ipMatch[1]}).`,
      remediation: `Update client network properties default gateway to ${ipMatch[1]}.`
    });
  }

  // 4. Duplicate IP / Unexcluded DHCP
  if (text.includes("Duplicate IP address alert") || (show.includes("show ip dhcp binding") && text.includes("Statically configured"))) {
    if (!show.includes("ip dhcp excluded-address")) {
      findings.push({
        rule_id: "RULE-IP-03",
        severity: "HIGH",
        osi_layer: "Layer 3",
        category: "DHCP Conflict",
        description: "Static IP assigned to printer/host without excluding it from DHCP server pool.",
        remediation: "Add 'ip dhcp excluded-address <IP>' on router to prevent pool overlap."
      });
    }
  }

  // 5. VLAN Trunk Allowed Pruning
  if (show.includes("Vlans allowed on trunk") && show.includes("1-10,20") && text.includes("VLAN 30")) {
    findings.push({
      rule_id: "RULE-L2-02",
      severity: "HIGH",
      osi_layer: "Layer 2",
      category: "VLAN Trunking",
      description: "Destination VLAN 30 is pruned/missing from trunk allowed VLAN list on switch.",
      remediation: "Execute 'switchport trunk allowed vlan add 30' on trunk port."
    });
  }

  // 6. Native VLAN Mismatch
  if (text.includes("Native VLAN mismatch") || (show.includes("Native Mode VLAN: 10") && show.includes("Native Mode VLAN: 20"))) {
    findings.push({
      rule_id: "RULE-L2-01",
      severity: "HIGH",
      osi_layer: "Layer 2",
      category: "VLAN Trunking",
      description: "Native VLAN mismatch across inter-switch trunk link.",
      remediation: "Configure identical native VLAN IDs on both switch trunk ports."
    });
  }

  // 7. Gateway of Last Resort Missing
  if (show.includes("Gateway of last resort is not set")) {
    findings.push({
      rule_id: "RULE-L3-01",
      severity: "CRITICAL",
      osi_layer: "Layer 3",
      category: "Routing Table",
      description: "Gateway of last resort is not set; router lacks default static route.",
      remediation: "Add default route: 'ip route 0.0.0.0 0.0.0.0 <next-hop>'."
    });
  }

  // 8. ACL Line Order Error
  if (show.includes("deny ip any any") && show.includes("permit")) {
    const denyIdx = show.indexOf("deny ip any any");
    const permitIdx = show.lastIndexOf("permit");
    if (denyIdx < permitIdx && denyIdx !== -1) {
      findings.push({
        rule_id: "RULE-ACL-01",
        severity: "CRITICAL",
        osi_layer: "Layer 4",
        category: "Access Control List",
        description: "ACL line order error: 'deny ip any any' precedes permit statements.",
        remediation: "Re-sequence ACL so permit rules execute before global deny."
      });
    }
  }

  // 9. ACL Missing HTTPS Permit
  if (show.includes("eq www") && !show.includes("eq 443") && text.includes("HTTPS")) {
    findings.push({
      rule_id: "RULE-ACL-02",
      severity: "HIGH",
      osi_layer: "Layer 4",
      category: "Access Control List",
      description: "ACL permits HTTP (port 80) but lacks permit for HTTPS (port 443).",
      remediation: "Add rule: 'permit tcp <src> <dst> eq 443' to ACL."
    });
  }

  // 10. NAT Inside Interface Missing
  if (show.includes("Inside interfaces:\n  (None)")) {
    findings.push({
      rule_id: "RULE-NAT-01",
      severity: "HIGH",
      osi_layer: "Layer 3",
      category: "NAT Configuration",
      description: "LAN interface is missing 'ip nat inside' designation.",
      remediation: "Enter LAN interface config and run 'ip nat inside'."
    });
  }

  return findings;
}
