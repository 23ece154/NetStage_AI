# Cisco Packet Tracer (.pkt) Lab Configurations & Setup Guide

This folder contains the complete Cisco IOS device configurations, topology blueprints, and step-by-step guides for loading the **30 NetSage AI troubleshooting lab scenarios** directly into Cisco Packet Tracer.

---

## 🛠️ How to Create & Load Labs in Cisco Packet Tracer

Because Cisco `.pkt` files are binary project files saved from Cisco Packet Tracer software (v8.0+), follow these simple steps to build or run any broken lab case in Packet Tracer:

### Method A: Paste IOS Device Configurations into Packet Tracer (Fastest)

1. Launch **Cisco Packet Tracer**.
2. Drag and drop the target devices onto the grid (e.g. 1x **2960 Switch**, 1x **4331 Router**, 2x **PCs**).
3. Cable the devices as specified in the **Topology Note** (e.g. Router `Gi0/0/1` to Switch `Fa0/24`, PC-1 to Switch `Fa0/1`).
4. Click on the device (Router/Switch) -> Go to **CLI** tab.
5. Copy the contents of the matching `.cfg` file from `pkt_labs/configs/` and paste into the CLI terminal!

---

## 📂 Included Lab Configuration Files (`pkt_labs/configs/`)

| Case ID | Topic / Fault | Config File | Target Devices |
|---------|---------------|-------------|----------------|
| **NET-001** | VLAN 30 Missing on Trunk | `NET-001_VLAN_Trunk_Missing.cfg` | Switch-1, Router-1 |
| **NET-002** | Access Port in Blackhole VLAN 99 | `NET-002_Blackhole_VLAN.cfg` | Switch-2 |
| **NET-003** | Native VLAN Mismatch | `NET-003_Native_VLAN_Mismatch.cfg` | Switch-A, Switch-B |
| **NET-007** | Default Gateway Mismatch | `NET-007_Gateway_Mismatch.cfg` | Router-HQ, PC-5 |
| **NET-009** | Physical Interface Admin Down | `NET-009_Interface_Shutdown.cfg` | Router-1 |
| **NET-015** | Missing Default Static Route | `NET-015_Missing_Default_Route.cfg` | Branch-R1 |
| **NET-016** | OSPF Area ID Mismatch | `NET-016_OSPF_Area_Mismatch.cfg` | Router-A, Router-B |
| **NET-021** | ACL Incomplete Permit (HTTPS Block) | `NET-021_ACL_HTTPS_Block.cfg` | Router-FW |
| **NET-024** | ACL Line Order Error (`deny ip any any`) | `NET-024_ACL_Line_Order_Error.cfg` | Router-1 |
| **NET-026** | NAT Inside Interface Missing | `NET-026_NAT_Inside_Missing.cfg` | Router-NAT |

---

## 🎯 Example Packet Tracer Topology Setup (NET-001)

### Devices & Connections
- **Switch-1** (Cisco 2960)
  - `FastEthernet0/1` -> PC-1 (Access VLAN 10)
  - `FastEthernet0/24` -> Router-1 `GigabitEthernet0/0/1` (Trunk Link)
- **Router-1** (Cisco 4331)
  - `GigabitEthernet0/0/1.10` (Subinterface for VLAN 10: `192.168.10.1/24`)
  - `GigabitEthernet0/0/1.30` (Subinterface for VLAN 30: `192.168.30.1/24`)

### Load Broken Config on Switch-1
```cisco
enable
configure terminal
vlan 10
 name Sales
vlan 20
 name Mgmt
vlan 30
 name Server
exit
interface FastEthernet0/1
 switchport mode access
 switchport access vlan 10
exit
interface FastEthernet0/24
 switchport mode trunk
 switchport trunk allowed vlan 1-10,20
exit
end
```
*(Notice VLAN 30 is missing from `allowed vlan` list on `Fa0/24`).*
