require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Base = require('../models/Base');
const Asset = require('../models/Asset');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User, Base, Asset, Purchase, Transfer, Assignment].map(M => M.deleteMany({})));
  console.log('Cleared existing data');

  // Create bases
  const bases = await Base.insertMany([
    { name: 'Alpha Base', location: 'Northern Sector', code: 'ALPHA' },
    { name: 'Bravo Base', location: 'Eastern Sector', code: 'BRAVO' },
    { name: 'Charlie Base', location: 'Southern Sector', code: 'CHARLIE' }
  ]);
  console.log('Bases created');

  // Create users
  const users = await User.create([
    { name: 'Admin Command', email: 'admin@military.gov', password: 'Admin@123', role: 'admin', assignedBase: null },
    { name: 'Col. James Alpha', email: 'alpha.commander@military.gov', password: 'Alpha@123', role: 'base_commander', assignedBase: bases[0]._id },
    { name: 'Col. Sarah Bravo', email: 'bravo.commander@military.gov', password: 'Bravo@123', role: 'base_commander', assignedBase: bases[1]._id },
    { name: 'Col. Mike Charlie', email: 'charlie.commander@military.gov', password: 'Charlie@123', role: 'base_commander', assignedBase: bases[2]._id },
    { name: 'Lt. David Logistics', email: 'logistics@military.gov', password: 'Logistics@123', role: 'logistics_officer', assignedBase: null }
  ]);
  console.log('Users created');

  // Create assets for each base
  const assetDefs = [
    { name: 'M1 Abrams Tank', equipmentType: 'vehicle', unit: 'units', openingBalance: 10 },
    { name: 'Humvee', equipmentType: 'vehicle', unit: 'units', openingBalance: 20 },
    { name: 'M16 Rifle', equipmentType: 'weapon', unit: 'units', openingBalance: 100 },
    { name: 'M9 Pistol', equipmentType: 'weapon', unit: 'units', openingBalance: 50 },
    { name: '5.56mm Ammo', equipmentType: 'ammunition', unit: 'rounds', openingBalance: 50000 },
    { name: '9mm Ammo', equipmentType: 'ammunition', unit: 'rounds', openingBalance: 20000 },
    { name: 'Night Vision Goggles', equipmentType: 'equipment', unit: 'units', openingBalance: 30 },
    { name: 'Body Armor', equipmentType: 'equipment', unit: 'sets', openingBalance: 80 }
  ];

  let allAssets = [];
  for (const base of bases) {
    for (const def of assetDefs) {
      const asset = await Asset.create({ ...def, base: base._id, currentBalance: def.openingBalance });
      allAssets.push(asset);
    }
  }
  console.log('Assets created');

  const adminUser = users[0];
  const logisticsUser = users[4];
  const alphaCommander = users[1];

  // Create sample purchases
  const alphaAssets = allAssets.filter(a => a.base.toString() === bases[0]._id.toString());
  await Purchase.create([
    { asset: alphaAssets[2]._id, base: bases[0]._id, equipmentType: 'weapon', quantity: 20, unitCost: 1500, totalCost: 30000, supplier: 'DefenseCorp', purchaseDate: new Date(Date.now() - 20 * 86400000), recordedBy: logisticsUser._id },
    { asset: alphaAssets[4]._id, base: bases[0]._id, equipmentType: 'ammunition', quantity: 10000, unitCost: 0.5, totalCost: 5000, supplier: 'AmmoCorp', purchaseDate: new Date(Date.now() - 15 * 86400000), recordedBy: logisticsUser._id },
    { asset: alphaAssets[0]._id, base: bases[0]._id, equipmentType: 'vehicle', quantity: 2, unitCost: 500000, totalCost: 1000000, supplier: 'ArmorTech', purchaseDate: new Date(Date.now() - 10 * 86400000), recordedBy: adminUser._id },
  ]);

  const bravoAssets = allAssets.filter(a => a.base.toString() === bases[1]._id.toString());
  await Purchase.create([
    { asset: bravoAssets[6]._id, base: bases[1]._id, equipmentType: 'equipment', quantity: 15, unitCost: 800, totalCost: 12000, supplier: 'TacGear Inc', purchaseDate: new Date(Date.now() - 12 * 86400000), recordedBy: logisticsUser._id },
    { asset: bravoAssets[1]._id, base: bases[1]._id, equipmentType: 'vehicle', quantity: 5, unitCost: 150000, totalCost: 750000, supplier: 'AutoDefense', purchaseDate: new Date(Date.now() - 8 * 86400000), recordedBy: adminUser._id }
  ]);
  console.log('Purchases created');

  // Update balances for purchased assets
  alphaAssets[2].currentBalance += 20; await alphaAssets[2].save();
  alphaAssets[4].currentBalance += 10000; await alphaAssets[4].save();
  alphaAssets[0].currentBalance += 2; await alphaAssets[0].save();
  bravoAssets[6].currentBalance += 15; await bravoAssets[6].save();
  bravoAssets[1].currentBalance += 5; await bravoAssets[1].save();

  // Create sample transfers (Alpha → Bravo)
  await Transfer.create([
    { asset: alphaAssets[2]._id, fromBase: bases[0]._id, toBase: bases[1]._id, equipmentType: 'weapon', quantity: 10, transferDate: new Date(Date.now() - 7 * 86400000), status: 'completed', authorizedBy: adminUser._id },
    { asset: alphaAssets[4]._id, fromBase: bases[0]._id, toBase: bases[2]._id, equipmentType: 'ammunition', quantity: 5000, transferDate: new Date(Date.now() - 5 * 86400000), status: 'completed', authorizedBy: adminUser._id }
  ]);
  alphaAssets[2].currentBalance -= 10; await alphaAssets[2].save();
  alphaAssets[4].currentBalance -= 5000; await alphaAssets[4].save();
  bravoAssets[2].currentBalance += 10; await bravoAssets[2].save();
  const charlieAssets = allAssets.filter(a => a.base.toString() === bases[2]._id.toString());
  charlieAssets[4].currentBalance += 5000; await charlieAssets[4].save();
  console.log('Transfers created');

  // Create sample assignments
  await Assignment.create([
    { asset: alphaAssets[2]._id, base: bases[0]._id, equipmentType: 'weapon', assignedTo: 'Sgt. John Doe', personnelId: 'P001', quantity: 1, assignmentDate: new Date(Date.now() - 3 * 86400000), status: 'active', assignedBy: alphaCommander._id },
    { asset: alphaAssets[4]._id, base: bases[0]._id, equipmentType: 'ammunition', assignedTo: 'Cpl. Jane Smith', personnelId: 'P002', quantity: 500, expendedQuantity: 200, assignmentDate: new Date(Date.now() - 2 * 86400000), status: 'active', assignedBy: alphaCommander._id },
    { asset: bravoAssets[7]._id, base: bases[1]._id, equipmentType: 'equipment', assignedTo: 'Pvt. Mike Brown', personnelId: 'P003', quantity: 1, assignmentDate: new Date(Date.now() - 4 * 86400000), status: 'active', assignedBy: users[2]._id }
  ]);
  console.log('Assignments created');

  console.log('\n✅ Seed completed! Demo credentials:');
  console.log('-------------------------------------------');
  console.log('Admin:              admin@military.gov        / Admin@123');
  console.log('Alpha Commander:    alpha.commander@military.gov / Alpha@123');
  console.log('Bravo Commander:    bravo.commander@military.gov / Bravo@123');
  console.log('Charlie Commander:  charlie.commander@military.gov / Charlie@123');
  console.log('Logistics Officer:  logistics@military.gov    / Logistics@123');
  console.log('-------------------------------------------');

  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
