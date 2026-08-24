export const aiCorrections = [
  {
    "id": "CORR-001",
    "case_id": "NET-0023",
    "title": "Inverted Wildcard Mask in Standard ACL",
    "error_mode": "Inverted Syntax / Hallucinated Wildcard",
    "ai_diagnosis": "Standard ACL 10 requires wildcard mask 255.255.255.255 to match host 192.168.1.50.",
    "ai_fix": "access-list 10 permit 192.168.1.50 255.255.255.255",
    "reviewer_action": "EDITED",
    "human_correction": "In Cisco IOS ACLs, 255.255.255.255 wildcard matches ALL hosts (equivalent to permit any). Host match requires wildcard 0.0.0.0 or host keyword.",
    "corrected_fix": "access-list 10 permit host 192.168.1.50",
    "guardrail": "Deterministic check for 255.255.255.255 wildcard on single host statements."
  },
  {
    "id": "CORR-002",
    "case_id": "NET-0001",
    "title": "VLAN Pruning Misclassified as OSPF Routing Error",
    "error_mode": "Wrong OSI Layer (L2 vs L3)",
    "ai_diagnosis": "Router subinterface GigabitEthernet0/0/1.30 missing OSPF area configuration.",
    "ai_fix": "router ospf 1 \\n network 192.168.30.0 0.0.0.255 area 0",
    "reviewer_action": "REJECTED",
    "human_correction": "Single router-on-a-stick topology does not use OSPF. VLAN 30 is pruned from allowed list on trunk interface Fa0/24 on Switch-1.",
    "corrected_fix": "Switch-1(config-if)# switchport trunk allowed vlan add 30",
    "guardrail": "Verify L2 trunk allowed lists before invoking L3 routing protocol prompts."
  },
  {
    "id": "CORR-003",
    "case_id": "NET-0022",
    "title": "ACL Ingress/Egress Interface Direction Inversion",
    "error_mode": "Wrong Interface Direction",
    "ai_diagnosis": "BLOCK_GUEST ACL does not exist on Router-GW.",
    "ai_fix": "ip access-list extended BLOCK_GUEST \\n deny ip 172.16.99.0 0.0.0.255 10.0.0.0 0.255.255.255",
    "reviewer_action": "EDITED",
    "human_correction": "ACL exists but was applied 'out' on ingress interface Gi0/0/1. Needs to be re-applied 'in'.",
    "corrected_fix": "interface Gi0/0/1 \\n no ip access-group BLOCK_GUEST out \\n ip access-group BLOCK_GUEST in",
    "guardrail": "Compare 'in' vs 'out' against ingress interface role in topology notes."
  },
  {
    "id": "CORR-004",
    "case_id": "NET-0012",
    "title": "DHCP Scope Exhaustion vs Service Restart",
    "error_mode": "Incomplete Fix / Destructive Service Restart",
    "ai_diagnosis": "DHCP server process crashed. Restart service dhcp.",
    "ai_fix": "no service dhcp \\n service dhcp",
    "reviewer_action": "EDITED",
    "human_correction": "Restarting service disconnects active leases without fixing the /28 subnet mask pool limits (100% full).",
    "corrected_fix": "ip dhcp pool GUEST_POOL \\n network 192.168.100.0 255.255.255.0",
    "guardrail": "Warn reviewers when AI recommends global service restarts instead of pool adjustments."
  },
  {
    "id": "CORR-005",
    "case_id": "NET-0029",
    "title": "Wireless Authentication Key Case Sensitivity",
    "error_mode": "Hardware Hallucinated Replacement",
    "ai_diagnosis": "WLC Access Point AP-1 radio hardware fault. Issue hardware RMA.",
    "ai_fix": "RMA AP-1 Replacement",
    "reviewer_action": "REJECTED",
    "human_correction": "Laptop client had password typo 'cisco12345!' (lowercase 'c') vs WLC 'Cisco12345!' (uppercase 'C').",
    "corrected_fix": "Update laptop client password to 'Cisco12345!'.",
    "guardrail": "Prohibit RMA/hardware recommendations without explicit diagnostic hardware log errors."
  }
];
