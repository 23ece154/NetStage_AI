#!/usr/bin/env python3
"""
Unit tests for NetSage AI Deterministic Rule Checker
"""

import unittest
from rule_checker import DeterministicRuleChecker

class TestNetSageRuleChecker(unittest.TestCase):

    def setUp(self):
        self.checker = DeterministicRuleChecker()

    def test_interface_down(self):
        case = {
            "symptom": "Interface down test",
            "show_outputs": "GigabitEthernet0/0/0 is administratively down, line protocol is down"
        }
        findings = self.checker.analyze_case(case)
        rule_ids = [f["rule_id"] for f in findings]
        self.assertIn("RULE-PHYS-01", rule_ids)

    def test_missing_route(self):
        case = {
            "symptom": "No internet access",
            "show_outputs": "Gateway of last resort is not set"
        }
        findings = self.checker.analyze_case(case)
        rule_ids = [f["rule_id"] for f in findings]
        self.assertIn("RULE-L3-01", rule_ids)

    def test_nat_inside_missing(self):
        case = {
            "symptom": "NAT failed",
            "show_outputs": "Inside interfaces:\n  (None)"
        }
        findings = self.checker.analyze_case(case)
        rule_ids = [f["rule_id"] for f in findings]
        self.assertIn("RULE-NAT-01", rule_ids)

    def test_no_service_dhcp(self):
        case = {
            "symptom": "DHCP not working",
            "show_outputs": "no service dhcp"
        }
        findings = self.checker.analyze_case(case)
        rule_ids = [f["rule_id"] for f in findings]
        self.assertIn("RULE-DHCP-01", rule_ids)

    def test_ospf_area_mismatch(self):
        case = {
            "symptom": "OSPF neighbor down",
            "show_outputs": "Router-A Area ID 0.0.0.0\nRouter-B Area ID 0.0.0.1"
        }
        findings = self.checker.analyze_case(case)
        rule_ids = [f["rule_id"] for f in findings]
        self.assertIn("RULE-ROUTING-01", rule_ids)

if __name__ == "__main__":
    unittest.main()
